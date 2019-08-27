package persistence

import (
	"strconv"
	"touch/models"
)

// PgSite models the SitPersistence interface
type PgSite struct {
	pgSQL *PgSQL
}

// NewPgSite instantiates a PgSite object
func NewPgSite(pgsql *PgSQL) *PgSite {
	p := new(PgSite)
	p.pgSQL = pgsql
	return p
}

// Create inserts a Site record into the db
func (pg *PgSite) Create(s *models.Site) (int64, error) {
	if err := pg.pgSQL.db.Ping(); err != nil {
		return 0, err
	}

	insertStmt := "insert into Site (Domain, MemberID, Role) values (?, ?, ?)"

	result, _ := pg.pgSQL.db.Exec(insertStmt, s.Domain, s.MemberID, s.Role)

	return result.LastInsertId()
}

// Read selects the Site row keyed by memberID, domain and returns a Site, error tuple
func (pg *PgSite) Read(memberID int64, domain string) (*models.Site, error) {
	if err := pg.pgSQL.db.Ping(); err != nil {
		return nil, err
	}

	selectStmt := "select Domain, MemberID, Role from Site where MemberID = ? and Domain = ?"
	row := pg.pgSQL.db.QueryRow(selectStmt, memberID, domain)

	s := new(models.Site)
	err := row.Scan(s)

	return s, err
}

// Update upates the row of the Site table represented by the Site object
func (pg *PgSite) Update(s *models.Site) error {
	if err := pg.pgSQL.db.Ping(); err != nil {
		return err
	}

	updateStmt := "update Site set Domain = ?, MemberID = ?, Site = ? where MemberID = ? and Site = ?"
	_, err := pg.pgSQL.db.Exec(updateStmt, s.Domain, s.MemberID, s.Role)

	return err
}

// Delete removes the Site row from the database
func (pg *PgSite) Delete(memberID int64, domain string) error {
	if err := pg.pgSQL.db.Ping(); err != nil {
		return err
	}

	deleteStmt := "delete from Site where MemberID = ? and Domain = ?"
	_, err := pg.pgSQL.db.Exec(deleteStmt, memberID, domain)

	return err
}

// ForEach runs the query and calls forEach on each returned row
func (pg *PgSite) ForEach(site *models.Site, forEach models.ForEachSiteFunction) error {
	if err := pg.pgSQL.db.Ping(); err != nil {
		return err
	}

	query := "select MemberID, Domain, Role from Site"
	where := " where "

	var arguments []string

	if site.MemberID != 0 {
		query += where
		query += "MemberID = ?"
		where = " and "
		arguments = append(arguments, strconv.FormatInt(site.MemberID, 10))
	}

	if site.Domain != "" {
		query += where
		query += "Domain = ?"
		where = " and "
		arguments = append(arguments, site.Domain)
	}

	if site.Role != "" {
		query += where
		query += "Role = ?"
		where = " and "
		arguments = append(arguments, site.Role)
	}

	rows, err := pg.pgSQL.db.Query(query, arguments)

	if err != nil {
		return err
	}

	for rows.Next() {
		s := new(models.Site)
		rows.Scan(s)

		forEach(s)
	}

	return nil
}
