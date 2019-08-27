package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
	"touch/hosts"
	"touch/persistence"
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

type SessionConfig struct {
	inactiveTimeout time.Duration
	absoluteTimeout time.Duration
}

type TouchConfig struct {
	session SessionConfig
}

func ReadTouchConfig() *TouchConfig {
	b, err := ioutil.ReadFile("conf/touch.json")
	if err != nil {
		log.Printf("Error loading touch config file: %s\n", err)
		return nil
	}

	log.Printf("%s\n", b)

	config := new(TouchConfig)

	err = json.Unmarshal(b, config)
	if err != nil {
		log.Printf("Error parsing touch config file: %s", err)
		return nil
	}

	return config
}

func main() {

	touchConfig := ReadTouchConfig()

	b, err := ioutil.ReadFile("conf/hosts.json")
	if err != nil {
		log.Printf("Error loading hosts config file: %s\n", err)
		return
	}

	log.Printf("%s\n", b)

	var hostConfig []hosts.Host
	err = json.Unmarshal(b, &hostConfig)
	if err != nil {
		log.Printf("Error parsing host config file: %s", err)
		return
	}

	pgsql, err := persistence.NewPgSQL("database=touch user=touch_dbuser password=verified_touch_user_001 host=192.168.0.107")
	if err != nil {
		log.Printf("Error connecting to postgres: %s", err)
		return
	}

	pgsession := persistence.NewPgSession(pgsql)
	session.NewManager(pgsession, touchConfig.session.inactiveTimeout, touchConfig.session.absoluteTimeout)

	for i := 0; i < len(hostConfig); i++ {
		h := hostConfig[i]
		log.Printf("%s @ %s\n%s", h.Host, h.BaseDir, h.Replace)

		hostMap[h.Host] = hosts.Host{
			BaseDir:    h.BaseDir,
			Replace:    map[string]string{},
			ApiActions: h.ApiActions,
		}

		for k, v := range h.Replace {
			hostMap[h.Host].Replace[k] = v
		}
	}

	go http.ListenAndServe(":80", http.HandlerFunc(redirect))

	log.Fatal(http.ListenAndServeTLS(":443", os.Args[1], os.Args[2], http.HandlerFunc(manifold)))
}
