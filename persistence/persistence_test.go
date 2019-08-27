package persistence_test

import (
	"fmt"
	"locker/vault"
	"testing"
	"touch/models"
	"touch/persistence"
)

type DbConnection struct {
	PgSQL *persistence.PgSQL
	Err   error
}

var conn DbConnection

func setup(t *testing.T) {
	fmt.Println("Running setup")
	if conn.PgSQL == nil {
		vault := vault.Vault{
			Path: "../safe",
		}

		connectionStr := vault.DecryptFromFile("pgsql.v", "softsprocket")

		fmt.Println("Loaded connection string")

		conn.PgSQL, conn.Err = persistence.NewPgSQL(string(connectionStr))
		if conn.Err != nil {
			t.Fatalf("PgSQL error during setup: %s\n", conn.Err)
		}
	}
}

func memberToString(member models.Member) string {
	return fmt.Sprintf("%d, %s, %s, %s", member.ID, member.FirstName, member.LastName, member.Email)
}

func TestPgMember(t *testing.T) {
	setup(t)

	member := models.Member{
		FirstName: "First",
		LastName:  "Last",
		Password:  "password",
		Email:     "member@member.com",
	}

	pgMember := persistence.PgMember{
		PgSQL: conn.PgSQL,
	}

	id, err := pgMember.Create(&member)

	if err != nil {
		t.Fatalf("PgMember Create error: %s\n", err)
	}

	member.ID = id

	storedMember, err := pgMember.Read(member.ID)
	if err != nil {
		t.Errorf("PgMember.Read failed with error: %s\n", err)
	} else {
		if member.ID != storedMember.ID ||
			member.FirstName != storedMember.FirstName ||
			member.LastName != storedMember.LastName ||
			member.Email != storedMember.Email {
			t.Errorf("PgMember.Read: Wanted %s - Got %s\n", memberToString(member), memberToString(*storedMember))
		}
	}

	success, err := persistence.ComparePasswords(storedMember.Password, []byte(member.Password))

	if err != nil {
		t.Errorf("persistence.ComparePasswords failed with error: %s\n", err)
	} else {
		if !success {
			t.Error("persistence.ComparePasswords: Wanted true - Got false\n")
		}
	}

	updateMemberFirstName := "NewName"

	updateMember := models.Member{
		ID:        member.ID,
		FirstName: updateMemberFirstName,
	}

	err = pgMember.Update(&updateMember)
	if err != nil {
		t.Errorf("PgMember.Update failed: Wanted nil - Got %s\n", err)
	}

	member.FirstName = updateMemberFirstName

	storedMember, err = pgMember.Read(member.ID)
	if err != nil {
		t.Errorf("PgMember.Read failed with error: %s\n", err)
	} else {
		if member.ID != storedMember.ID ||
			member.FirstName != storedMember.FirstName ||
			member.LastName != storedMember.LastName ||
			member.Email != storedMember.Email {
			t.Errorf("PgMember.Read after Update: Wanted %s - Got %s\n", memberToString(member), memberToString(*storedMember))
		}
	}

	success, err = persistence.ComparePasswords(storedMember.Password, []byte(member.Password))

	if err != nil {
		t.Errorf("persistence.ComparePasswords after update failed with error: %s\n", err)
	} else {
		if !success {
			t.Error("persistence.ComparePasswords after update: Wanted true - Got false\n")
		}
	}

	err = pgMember.Delete(id)
	if err != nil {
		t.Errorf("PgMember.Delete failed: Wanted nil - Got %s\n", err)
	}
}
