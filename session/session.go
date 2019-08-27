package session

import (
	"encoding/base64"
	"errors"
	"math/rand"
	"strings"
	"time"
)

// Session models a user web session
type Session struct {
	ID      string
	Created time.Time
	Updated time.Time
	Store   map[string]interface{}
}

// 33-125
func randomString() string {
	bytes := make([]byte, 128)
	for i := 0; i < 128; i++ {
		bytes[i] = byte(rand.Intn(92) + 33)
	}
	return string(bytes)
}

// New initializes a Session and returns a pointer
func New() *Session {
	rand.Seed(int64(time.Now().Unix()))

	s := new(Session)
	s.ID = randomString()
	s.Created = time.Now()
	s.Updated = time.Now()
	s.Store = make(map[string]interface{})

	return s
}

// Cookie creates a cookie based on this Sessions ID
func (s *Session) Cookie() string {
	return s.Created.Format("20060102150405") + ":" + base64.URLEncoding.EncodeToString([]byte(s.ID))
}

// CookieIsMatch compares a cookie to this cookie
func (s *Session) CookieIsMatch(cookie string) bool {
	return cookie == s.Cookie()
}

// IDFromCookie extracts the ID portion of a cookie
func IDFromCookie(cookie string) (string, error) {
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
