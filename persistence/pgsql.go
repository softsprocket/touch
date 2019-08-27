package persistence

import (
	"bytes"
	"database/sql"
	"fmt"
	"reflect"

	// github.com/lib/pq is imported to initalize the postgres driver
	_ "github.com/lib/pq"
)

// PgSQL is a wrapper around a postgres sql.DB
type PgSQL struct {
	db *sql.DB
}

// NewPgSQL opens a connection to a postgres database using the connection string
func NewPgSQL(connectionString string) (*PgSQL, error) {
	db, err := sql.Open("postgres", connectionString)

	pg := new(PgSQL)
	pg.db = db

	return pg, err
}

// Count returns row count
func (pg *PgSQL) Count(tableName string) (int64, error) {

	query := "select count(*) from " + tableName

	row := pg.db.QueryRow(query)
	var n int64
	err := row.Scan(&n)

	return n, err
}

// WhereClause accepts a struct in the form of name = value
// where name is a table column name and value is the value
// desired in the where clause
// the return value is in the form " where col1 = val1 and col2 = val2"
func WhereClause(s interface{}) string {
	e := reflect.TypeOf(s)
	var b bytes.Buffer
	sep := " where "
	for i := 0; i < e.NumField(); i++ {
		nam := e.Field(i).Name
		typ := e.Field(i).Type
		val := reflect.ValueOf(s).Field(i)

		if typ.Kind() == reflect.Int32 || typ.Kind() == reflect.Int64 || typ.Kind() == reflect.Float32 || typ.Kind() == reflect.Float64 {
			b.WriteString(fmt.Sprintf("%v %v=%v", sep, nam, val))
		} else {
			b.WriteString(fmt.Sprintf("%v %v='%v'", sep, nam, val))
		}
		sep = " and "
	}

	return string(b.Bytes())
}

/*
select t.table_schema, t.table_name
	from information_schema.tables t
	left join information_schema.table_constraints tc
		on tc.table_schema = t.table_schema and tc.table_name = t.table_name
	where t.table_schema not in ('pg_catalog', 'information_schema');
*/
