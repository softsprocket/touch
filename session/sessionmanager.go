package session

import (
	"time"
)

const (
	// SessionCookie defines name provied to the browser session
	SessionCookie = "TouchSession"
)

// PersistenceClause provides conditions for the return values of
// the Peristence interfaces Next iterator
type PersistenceClause struct {
	CreatedBefore time.Time
	UpdatedBefore time.Time
}

// ForEachFunction callback in Persistence model
type ForEachFunction func(*Session) error

// Persistence interface for persisting sessions
type Persistence interface {
	// Create must return an error if the Session already exists
	Create(*Session) error
	// Read must return an error if a Session doesn't exist
	Read(ID string) (*Session, error)
	// Update must return an error if the Session doesn't exist
	Update(*Session) error
	// Delete a session based on it's ID
	Delete(string) error
	// Next must call the function parameter
	// once for each entry matching the query in the first param (string)
	ForEach(PersistenceClause, ForEachFunction) error
}

// Manager persists sessions
// persistence - a type that fufills the interface Persistence for managing sessions
type Manager struct {
	persistence     Persistence
	inactiveTimeout time.Duration
	absoluteTimeout time.Duration
	inactiveCheck   *time.Timer
}

// NewManager returns a pointer to a session manager
// Persistence interface provides operations to read, write, delete and iterate over
// sessions. The time.Duration values are used to delete sessions that hae been inactive or
// in existence for their respective values. A zero value is interpreted as no timeout
func NewManager(persistence Persistence, inactiveTimeout time.Duration, absoluteTimeout time.Duration) *Manager {
	sm := new(Manager)
	sm.persistence = persistence
	sm.inactiveTimeout = inactiveTimeout
	sm.absoluteTimeout = absoluteTimeout
	go sm.inactiveTimer()

	return sm
}

func (m *Manager) deleteSession(s *Session) error {
	return m.persistence.Delete(s.ID)
}

func (m *Manager) inactiveTimer() {
	for {
		t := time.NewTimer(m.inactiveTimeout)
		<-t.C

		n := time.Now()
		m.persistence.ForEach(PersistenceClause{
			CreatedBefore: n.Add(-m.absoluteTimeout),
			UpdatedBefore: n.Add(-m.inactiveTimeout),
		}, m.deleteSession)
	}
}

// NewSession adds a Session to the persistence level
// returns an error if the session can't be added
func (m *Manager) NewSession() error {
	s := New()
	return m.persistence.Create(s)
}

// GetSession returns a Session from the persistence level or an error
// if the Session doesn't exist
func (m *Manager) GetSession(id string) (*Session, error) {
	return m.persistence.Read(id)
}
