package persistence

import (
	"database/sql"
	"time"
	"touch/session"

	// github.com/lib/pq is imported to initalize the postgres driver
	_ "github.com/lib/pq"
)

// PgSession models the session.Persistence interface
type PgSession struct {
	pgSQL *PgSQL
}

// NewPgSession instantiates a PgSession object
func NewPgSession(pgsql *PgSQL) *PgSession {
	p := new(PgSession)
	p.pgSQL = pgsql
	return p
}

// Create inserts a Session record into the db
func (pg *PgSession) Create(s *session.Session) error {
	if err := pg.pgSQL.db.Ping(); err != nil {
		return err
	}

	insertStmt := "insert into Session (ID, Created, Updated, Store) values (?, ?, ?, ?)"

	_, err := pg.pgSQL.db.Exec(insertStmt, s.ID, s.Created, s.Updated, s.Store)

	return err
}

// Read selects the Session row keyed by ID and returns a Session, error tuple
func (pg *PgSession) Read(ID string) (*session.Session, error) {
	if err := pg.pgSQL.db.Ping(); err != nil {
		return nil, err
	}

	selectStmt := "select ID, Created, Updated, Store from Session where ID = ?"
	row := pg.pgSQL.db.QueryRow(selectStmt, ID)

	s := new(session.Session)
	err := row.Scan(s)

	return s, err
}

// Update upates the row of the Session table represented byt the Session object
func (pg *PgSession) Update(s *session.Session) error {
	if err := pg.pgSQL.db.Ping(); err != nil {
		return err
	}

	updateStmt := "update Session set Updated = ?, Store = ? where ID = ?"
	_, err := pg.pgSQL.db.Exec(updateStmt, s.Updated, s.Store, s.ID)

	return err
}

// Delete removes the Session row from the database
func (pg *PgSession) Delete(ID string) error {
	if err := pg.pgSQL.db.Ping(); err != nil {
		return err
	}

	deleteStmt := "delete from Session where ID = ?"
	_, err := pg.pgSQL.db.Exec(deleteStmt, ID)

	return err
}

// ForEach runs the query and calls forEach on each returned row
func (pg *PgSession) ForEach(persistenceClause session.PersistenceClause, forEach session.ForEachFunction) error {

	if err := pg.pgSQL.db.Ping(); err != nil {
		return err
	}

	var rows *sql.Rows
	var err error
	if !time.Time.IsZero(persistenceClause.CreatedBefore) {
		query := "select ID, Created, Updated, Store from Session where (Updated < ? or Created < ?) and Site = ? "
		rows, err = pg.pgSQL.db.Query(query, persistenceClause.UpdatedBefore, persistenceClause.CreatedBefore)
	} else {
		query := "select ID, Created, Updated, Store from Session where Updated < ? and Site = ?"
		rows, err = pg.pgSQL.db.Query(query, persistenceClause.UpdatedBefore)
	}

	if err != nil {
		return err
	}

	for rows.Next() {
		s := new(session.Session)
		rows.Scan(s)

		forEach(s)
	}

	return nil
}
