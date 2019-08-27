package persistence

import (
	"fmt"
	"strconv"
	"touch/models"

	"golang.org/x/crypto/bcrypt"
)

// PgMember models the models.Persistence interface
type PgMember struct {
	PgSQL *PgSQL
}

// Count returns row count
func (pg *PgMember) Count() (int64, error) {

	if err := pg.PgSQL.db.Ping(); err != nil {
		return 0, err
	}

	return pg.PgSQL.Count("Member")
}

func hashAndSalt(pwd []byte) (string, error) {

	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		return "", err
	}

	return string(hash), nil
}

// ComparePasswords takes the password from the db and compares it to a user supplied password
func ComparePasswords(hashedPwd string, plainPwd []byte) (bool, error) {

	byteHash := []byte(hashedPwd)

	err := bcrypt.CompareHashAndPassword(byteHash, plainPwd)
	if err != nil {
		return false, err
	}

	return true, nil

}

// Create inserts a Member record into the db
func (pg *PgMember) Create(m *models.Member) (int64, error) {
	if err := pg.PgSQL.db.Ping(); err != nil {
		return 0, err
	}

	pw, err := hashAndSalt([]byte(m.Password))
	if err != nil {
		return 0, err
	}

	insertStmt := "insert into Member (FirstName, LastName, Email, Password) values ($1, $2, $3, $4) returning ID"
	stmt, err := pg.PgSQL.db.Prepare(insertStmt)
	if err != nil {
		return 0, err
	}

	var id int64
	err = stmt.QueryRow(m.FirstName, m.LastName, m.Email, pw).Scan(&id)
	if err != nil {
		return 0, err
	}

	fmt.Println("Returning result")

	return id, nil
}

// Read selects the Member row keyed by ID and returns a Member, error tuple
func (pg *PgMember) Read(ID int64) (*models.Member, error) {
	if err := pg.PgSQL.db.Ping(); err != nil {
		return nil, err
	}

	selectStmt := "select ID, FirstName, LastName, Email, Password from Member where ID = $1"
	row := pg.PgSQL.db.QueryRow(selectStmt, ID)

	m := new(models.Member)
	err := row.Scan(&m.ID, &m.FirstName, &m.LastName, &m.Email, &m.Password)

	return m, err
}

func queryBuilder(member models.Member, arguments *[]string, query *string) {
	where := " where "

	if member.FirstName != "" {
		*arguments = append(*arguments, member.FirstName)
		*query += where
		*query += "FirstName = $"
		*query += strconv.FormatInt(int64(len(*arguments)), 10)
		where = " and "
	}

	if member.LastName != "" {
		*arguments = append(*arguments, member.LastName)
		*query += where
		*query += "LastName = $"
		*query += strconv.FormatInt(int64(len(*arguments)), 10)
		where = " and "
	}

	if member.Email != "" {
		*arguments = append(*arguments, member.Email)
		*query += where
		*query += "Email = $"
		*query += strconv.FormatInt(int64(len(*arguments)), 10)
		where = " and "
	}

	if member.Password != "" {
		*arguments = append(*arguments, member.Password)
		*query += where
		*query += "Password = $"
		*query += strconv.FormatInt(int64(len(*arguments)), 10)
		where = " and "
	}

}

// Update upates the row of the Member table represented by the Member object
func (pg *PgMember) Update(m *models.Member) error {
	if err := pg.PgSQL.db.Ping(); err != nil {
		return err
	}

	if m.Password != "" {
		pw, err := hashAndSalt([]byte(m.Password))
		if err != nil {
			return err
		}

		m.Password = pw
	}

	updateStmt := "update Member set "
	var arguments []string

	queryBuilder(*m, &arguments, &updateStmt)
	updateStmt += " where ID = $"
	updateStmt += strconv.FormatInt(int64(len(arguments)+1), 10)

	_, err := pg.PgSQL.db.Exec(updateStmt, m.FirstName, m.LastName, m.Email, m.Password, m.ID)

	return err
}

// Delete removes the Member row from the database
func (pg *PgMember) Delete(ID int64) error {
	if err := pg.PgSQL.db.Ping(); err != nil {
		return err
	}

	deleteStmt := "delete from Member where ID = $1"
	_, err := pg.PgSQL.db.Exec(deleteStmt, ID)

	return err
}

// ForEach runs the query and calls forEach on each returned row
func (pg *PgMember) ForEach(member *models.Member, forEach models.ForEachMemberFunction) error {
	if err := pg.PgSQL.db.Ping(); err != nil {
		return err
	}

	if member.Password != "" {
		pw, err := hashAndSalt([]byte(member.Password))
		if err != nil {
			return err
		}

		member.Password = pw
	}

	query := "select ID, FirstName, LastName, Email, Password from Member"

	var arguments []string

	queryBuilder(*member, &arguments, &query)

	rows, err := pg.PgSQL.db.Query(query, arguments)

	if err != nil {
		return err
	}

	for rows.Next() {
		s := new(models.Member)
		rows.Scan(s)

		forEach(s)
	}

	return nil
}
