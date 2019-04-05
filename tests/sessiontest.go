package main

import (
	"fmt"
	"time"
	"touch/session"
)

func main() {

	mgr := session.NewSessionManager()

	s := mgr.NewSession(time.Minute, time.Minute*60*24)

	fmt.Printf("%s\n", s.Cookie())
	fmt.Printf("session is expired? %t\n", s.IsExpired())
	id, err := session.IdFromCookie(s.Cookie())
	if err != nil {
		fmt.Printf("id from cookie error: %s\n", err)
	} else {

		fmt.Printf("id from cookie: %s\n", id)

		s2, err2 := mgr.GetSession(id)

		if err2 != nil {
			fmt.Printf("get session error: %s\n", err2)
		} else {
			fmt.Printf("retrieved cookie: %s\n", s2.Cookie())
			fmt.Printf("session is expired? %t\n", s2.IsExpired())
		}

	}

	timer := time.NewTimer(time.Second * 150)

	<-timer.C

	fmt.Printf("session is expired? %t\n", s.IsExpired())
	fmt.Println("Closing mgr")
	mgr.Close()

	fmt.Println("done")
}
