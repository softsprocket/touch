package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"touch/vault"
)

type MailConfig struct {
	Identity,
	Username,
	Password,
	Host,
	Port,
	Recipient string
}

type message struct {
	Name,
	Email,
	Message string
}

var mailConfig MailConfig
var configLoaded = false

func loadConfig() bool {
	if !configLoaded {
		vault := vault.Vault{
			Path: "./safe",
		}

		b := vault.DecryptFromFile("contact.v", "softsprocket")

		err := json.Unmarshal(b, &mailConfig)
		if err != nil {
			log.Printf("Error loading mail config file: %s", err)
			return false
		}

		configLoaded = true
	}

	return configLoaded
}

type handler string

func mailmsg(recipient string, m message) []byte {
	tmpl := "From: %s\r\nTo: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=\"UTF-8\"\r\nSubject: Message from %s\r\n\r\n%s\n-%s\n%s\r\n"
	log.Print("Tmpl", tmpl)
	return []byte(fmt.Sprintf(tmpl, m.Email, recipient, m.Name, m.Message, m.Name, m.Email))
}

func (h handler) Handle(w http.ResponseWriter, req *http.Request) {
	if loadConfig() {
		log.Printf("Contact - Decoding body")

		var m message
		if err := json.NewDecoder(req.Body).Decode(&m); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}

		auth := smtp.PlainAuth(mailConfig.Identity, mailConfig.Username, mailConfig.Password, mailConfig.Host)
		url := mailConfig.Host + ":" + mailConfig.Port

		log.Printf("URL %s\n", url)

		recs := []string{mailConfig.Recipient}

		log.Printf("%s\n", mailConfig.Recipient)

		msg := mailmsg(mailConfig.Recipient, m)

		log.Printf("Contact - sending \n%s", msg)

		if err := smtp.SendMail(url, auth, m.Email, recs, msg); err != nil {
			http.Error(w, err.Error(), 500)
			log.Print(err)
		}

		w.Write([]byte("OK"))
		log.Printf("Contact - sent \n%s", m.Email)
	}
}

// exported as symbol named "Handler"
var Handler handler
