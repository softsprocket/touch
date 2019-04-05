package hosts

import (
	"log"
	"net/http"
	"os"
	"regexp"
	"touch/session"
)

type Host struct {
	BaseDir        string
	SessionManager *session.SessionManager
}

func (h Host) Handler(w http.ResponseWriter, req *http.Request) {
	log.Printf("Host Handler:  %s\n", req.URL.String())

	ismatch, err := regexp.MatchString("^/api/.*", req.URL.String())

	if err == nil && ismatch {
		log.Printf("Matched api: %s\n", req.URL.String())
	} else if err != nil {
		log.Printf("regexp error: %s\n", err)
	} else {
		h.index(w, req)
	}
}

func (h Host) index(w http.ResponseWriter, req *http.Request) {
	log.Printf("%s", req.URL.String())

	path := h.BaseDir + req.URL.Path

	st, err := os.Stat(path)

	if err == nil && st.IsDir() {
		path += "index.html"
		st, err = os.Stat(path)
	}

	if err != nil {
		log.Printf("404: %s %v", req.URL.String(), err)
		http.NotFound(w, req)
		return
	}

	http.ServeFile(w, req, path)
}
