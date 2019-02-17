package main

import (
	"log"
	"net/http"
	"os"
)

func redirect(w http.ResponseWriter, req *http.Request) {
	target := "https://" + req.Host + req.URL.Path
	if len(req.URL.RawQuery) > 0 {
		target += "?" + req.URL.RawQuery
	}
	log.Printf("redirect to: %s", target)
	http.Redirect(w, req, target,
		// see @andreiavrammsd comment: often 307 > 301
		http.StatusTemporaryRedirect)
}

func index(w http.ResponseWriter, req *http.Request) {
	if req.URL.Path != "/" && req.URL.Path != "/index.html" {
		log.Printf("404: %s", req.URL.String())
		http.NotFound(w, req)
		return
	}
	http.ServeFile(w, req, "wwwroot/index.html")
}

func main() {
	// redirect every http request to https
	// serve index (and anything else) as https
	mux := http.NewServeMux()
	mux.HandleFunc("/", index)

	go http.ListenAndServe(":80", http.HandlerFunc(redirect))

	log.Fatal(http.ListenAndServeTLS(":443", os.Args[1], os.Args[2], mux))
}
