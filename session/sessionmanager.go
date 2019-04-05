package session

import (
	"errors"
	"fmt"
	"time"
)

type SessionManager struct {
	sessions map[string]*session

	in  chan message
	out chan message
}

type message struct {
	command string
	id      string
	session *session
	err     error
}

func NewSessionManager() *SessionManager {
	sm := new(SessionManager)
	sm.sessions = make(map[string]*session)
	sm.in = make(chan message)
	sm.out = make(chan message)

	go sm.manageSessions()

	return sm
}

func (sm *SessionManager) Close() {
	sm.clearSessions()
	msg := message{
		command: "close",
	}
	sm.in <- msg
}

func (sm *SessionManager) Clear() {
	msg := message{
		command: "clear",
	}

	sm.in <- msg
}

func (sm *SessionManager) NewSession(timeout time.Duration, absoluteTimeout time.Duration) *session {
	s := NewSession(timeout, absoluteTimeout)

	msg := message{
		command: "put",
		session: s,
		id:      s.Id,
	}

	sm.in <- msg
	return s
}

func (sm *SessionManager) GetSession(id string) (*session, error) {
	msg := message{
		command: "get",
		id:      id,
	}

	sm.in <- msg
	msg = <-sm.out
	return msg.session, msg.err
}

func (sm *SessionManager) removeSession(id string) {
	if s, ok := sm.sessions[id]; ok {
		delete(sm.sessions, id)
		s.Close()
	}
}

func (sm *SessionManager) clearSessions() {
	for _, val := range sm.sessions {
		sm.removeSession(val.Id)
	}
}

func (sm *SessionManager) manageSessions() {
	for {
		fmt.Println("Top of loop")

		msg := <-sm.in
		fmt.Println("Received cmd")
		switch msg.command {
		case "put":
			fmt.Println("Received put")
			sm.sessions[msg.id] = msg.session
		case "get":
			fmt.Println("Received get")
			s, ok := sm.sessions[msg.id]
			if !ok {
				msg.err = errors.New("Not Found")
				msg.session = nil
			} else if s.IsExpired() {
				msg.session = nil
				msg.err = errors.New("Expired")
				msg.session = nil
			} else {
				msg.session = s
				msg.err = nil
			}

			fmt.Println("Returning msg")
			sm.out <- msg

		case "remove":
			fmt.Println("Received remove")
			sm.removeSession(msg.id)
		case "close":
			close(sm.out)
			close(sm.in)
		}
	}
}
