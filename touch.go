package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"touch/hosts"
	"touch/session"
)

var hostMap = map[string]hosts.Host{}

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
	log.Printf("Handle %s\n", host)
	hostMap[host].Handler(w, req)
}

func main() {

	b, err := ioutil.ReadFile("conf/hosts.json")
	if err != nil {
		log.Printf("Error loading hosts config file: %s\n", err)
		return
	}

	log.Printf("%s\n", b)

	var hostConfig []hosts.Host
	err = json.Unmarshal(b, &hostConfig)
	if err != nil {
		log.Printf("Error loading config file: %s", err)
		return
	}

	for i := 0; i < len(hostConfig); i++ {
		h := hostConfig[i]
		log.Printf("%s @ %s\n%s", h.Host, h.BaseDir, h.Replace)

		hostMap[h.Host] = hosts.Host{
			BaseDir:        h.BaseDir,
			SessionManager: session.NewSessionManager(),
			Replace:        map[string]string{},
			ApiActions:     h.ApiActions,
		}

		for k, v := range h.Replace {
			hostMap[h.Host].Replace[k] = v
		}
	}

	go http.ListenAndServe(":80", http.HandlerFunc(redirect))

	log.Fatal(http.ListenAndServeTLS(":443", os.Args[1], os.Args[2], http.HandlerFunc(manifold)))
}
