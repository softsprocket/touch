package hosts

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"plugin"
	"regexp"
	"time"
)

type Duration struct {
	time.Duration
}

func (d Duration) MarshalJSON() ([]byte, error) {
	return json.Marshal(d.String())
}

func (d *Duration) UnmarshalJSON(b []byte) error {
	var v interface{}
	if err := json.Unmarshal(b, &v); err != nil {
		return err
	}
	switch value := v.(type) {
	case float64:
		d.Duration = time.Duration(value)
		return nil
	case string:
		var err error
		d.Duration, err = time.ParseDuration(value)
		if err != nil {
			return err
		}
		return nil
	default:
		return errors.New("invalid duration")
	}
}

type Message struct {
	Elapsed Duration `json:"elapsed"`
}
type Handler interface {
	Handle(w http.ResponseWriter, req *http.Request)
}

type ApiAction struct {
	Match,
	Plugin string
}

type Host struct {
	Host       string
	BaseDir    string
	Replace    map[string]string
	ApiActions []ApiAction
}

//var loadedPlugins [string]func

func (h Host) Handler(w http.ResponseWriter, req *http.Request) {
	log.Printf("Host Handler:  %s\n", req.URL.String())

	ismatch, err := regexp.MatchString("^/api/.*", req.URL.String())

	if err == nil && ismatch {
		log.Printf("Matched api: %s\n", req.URL.String())

		for _, a := range h.ApiActions {
			log.Printf("Testing %s for match", a.Match)

			if ismatch, err := regexp.MatchString(req.URL.String(), a.Match); err == nil && ismatch {

				log.Printf("Matched %s %s", a.Match, a.Plugin)

				plug, err := plugin.Open(a.Plugin)
				if err != nil {
					fmt.Println(err)
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				symHandler, err := plug.Lookup("Handler")
				if err != nil {
					fmt.Println(err)
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				var handler Handler
				handler, ok := symHandler.(Handler)
				if !ok {
					fmt.Println("unexpected type from module symbol")
					http.Error(w, "unexpected type", http.StatusInternalServerError)
					return
				}

				handler.Handle(w, req)

				break
			}
		}
	} else if err != nil {
		log.Printf("regexp error: %s\n", err)
	} else {
		h.index(w, req)
	}
}

func (h Host) index(w http.ResponseWriter, req *http.Request) {
	log.Printf("%s", req.URL.String())

	path := h.BaseDir + req.URL.Path

	for k, v := range h.Replace {
		re, err := regexp.Compile(k)
		if err == nil {
			path = re.ReplaceAllString(path, v)
		}
	}

	log.Printf("%s", path)

	st, err := os.Stat(path)

	if err == nil && st.IsDir() {
		path += "index.html"
		st, err = os.Stat(path)
	}

	log.Printf("%s", path)

	if err != nil {
		log.Printf("404: %s %v", req.URL.String(), err)
		http.NotFound(w, req)
		return
	}

	http.ServeFile(w, req, path)
}
