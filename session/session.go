package session

import (
	"encoding/base64"
	"errors"
	"fmt"
	"math/rand"
	"strings"
	"sync"
	"time"
)

type Status int

const (
	Ok Status = iota
	Expire
	Expired
)

type session struct {
	Id              string
	Created         time.Time
	Updated         time.Time
	Store           map[string]interface{}
	status          Status
	expireMutex     sync.Mutex
	timeout         time.Duration
	absoluteTimeout time.Duration
	in              chan string
	out             chan Status
}

// 33-125
func randomString() string {
	bytes := make([]byte, 128)
	for i := 0; i < 128; i++ {
		bytes[i] = byte(rand.Intn(92) + 33)
	}
	return string(bytes)
}

func NewSession(timeout time.Duration, absoluteTimeout time.Duration) *session {
	rand.Seed(int64(time.Now().Unix()))

	s := new(session)
	s.Id = randomString()
	s.Created = time.Now()
	s.Updated = time.Now()
	s.status = Ok
	s.Store = make(map[string]interface{})
	s.in = make(chan string)
	s.out = make(chan Status)
	s.timeout = timeout
	s.absoluteTimeout = absoluteTimeout

	if s.absoluteTimeout != 0 {
		go s.absoluteTimer()
	}

	if s.timeout != 0 {
		go s.timer()
	}

	go s.watch()

	return s
}

func (s *session) timer() {
	for {
		t := time.NewTimer(s.timeout)
		<-t.C

		fmt.Println("timer went")

		s.in <- "status"
		status, ok := <-s.out
		if !ok {
			return
		}

		fmt.Printf("expire: %t, exipired: %t, ok: %t\n", status == Expire, status == Expired, status == Ok)

		if status != Expired {
			if status == Expire {
				s.in <- "expired"
			} else {
				s.in <- "expire"
			}
		} else {
			return
		}

	}
}

func (s *session) absoluteTimer() {
	t := time.NewTimer(s.absoluteTimeout)
	<-t.C

	s.in <- "expired"
}

func (s *session) Refresh() {
	s.in <- "refresh"
}

func (s *session) IsExpired() bool {
	s.in <- "status"
	status, ok := <-s.out

	if !ok {
		return true
	}

	return status == Expired
}

func (s *session) Cookie() string {
	return s.Updated.Format("20060102150405") + ":" + base64.URLEncoding.EncodeToString([]byte(s.Id))
}

func (s *session) CookieIsMatch(cookie string) bool {
	return cookie == s.Cookie()
}

func IdFromCookie(cookie string) (string, error) {
	strs := strings.Split(cookie, ":")

	var id string
	if len(strs) != 2 {
		return id, errors.New("Cookie not valid")
	}

	idBytes, err := base64.URLEncoding.DecodeString(strs[1])
	if err == nil {
		id = string(idBytes)
	}

	return id, err
}

func (s *session) Close() {
	s.in <- "close"
}

func (s *session) watch() {
	for {
		msg := <-s.in

		fmt.Printf("msg received %s\n", msg)

		switch msg {
		case "refresh":
			s.status = Ok
			s.Updated = time.Now()
		case "expire":
			s.status = Expire
		case "expired":
			s.status = Expired
		case "status":
			s.out <- s.status
		case "close":
			close(s.out)
			close(s.in)
			return
		}

	}
}
