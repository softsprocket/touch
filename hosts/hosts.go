package hosts

import (
	"log"
	"net/http"
	"os"
)

type Host struct {
	BaseDir string
}

func (h Host) Handler(w http.ResponseWriter, req *http.Request) {
	log.Printf("Host Handler:  %s\n", req.URL.String())

	h.index(w, req)
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
