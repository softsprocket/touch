package main

import (
	"fmt"
	"net/http"
	"os"
)

func redirect(w http.ResponseWriter, req *http.Request) {
	// remove/add not default ports from req.Host
	target := "https://" + req.Host + req.URL.Path
	if len(req.URL.RawQuery) > 0 {
		target += "?" + req.URL.RawQuery
	}
	log.Printf("redirect to: %s", target)
	http.Redirect(w, req, target,
		// see @andreiavrammsd comment: often 307 > 301
		http.StatusTemporaryRedirect)
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hi there!")
}

func main() {
	cert := os.Args[1]
	key := os.Args[2]

	http.HandleFunc("/", handler)
	// Start the HTTPS server in a goroutine
	go http.ListenAndServeTLS(":https", cert, key, nil)
	// Start the HTTP server and redirect all incoming connections to HTTPS
	http.ListenAndServe(":http", http.HandlerFunc(redirect))
}
