package main

import (
	"log"
	"net/http"
	"os"
	"strings"
	"touch/hosts"
)

var hostMap = map[string]hosts.Host{
	"softsprocket.com":  hosts.Host{BaseDir: "./wwwroot/softsprocket.com/"},
	"softsprocket.info": hosts.Host{BaseDir: "./wwwroot/softsprocket.info/"},
	"gregmartin.name":   hosts.Host{BaseDir: "./wwwroot/gregmartin.name/"},
	"gmartin.name":      hosts.Host{BaseDir: "./wwwroot/gmartin.name/"},
	"localhost":         hosts.Host{BaseDir: "./wwwroot/"},
}

func redirect(w http.ResponseWriter, req *http.Request) {
	target := "https://" + req.Host + req.URL.Path
	if len(req.URL.RawQuery) > 0 {
		target += "?" + req.URL.RawQuery
	}
	log.Printf("redirect to: %s", target)
	http.Redirect(w, req, target, http.StatusTemporaryRedirect)
}

func manifold(w http.ResponseWriter, req *http.Request) {
	host := strings.Replace(strings.ToLower(req.Host), "www.", "", 1)
	hostMap[host].Handler(w, req)
}

func main() {

	go http.ListenAndServe(":80", http.HandlerFunc(redirect))

	log.Fatal(http.ListenAndServeTLS(":443", os.Args[1], os.Args[2], http.HandlerFunc(manifold)))
}
