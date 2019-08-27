package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"touch/models"
	"touch/persistence"
	"touch/vault"

	"golang.org/x/crypto/ssh/terminal"
)

func readSites(path string) []string {
	var sites []string

	f, err := os.Open(path)

	if err != nil {
		panic(err)
	}

	scanner := bufio.NewScanner(f)

	for scanner.Scan() {
		s := scanner.Text()
		sites = append(sites, s)
	}

	return sites
}

func readString(in *bufio.Reader) string {
	str, _ := in.ReadString('\n')
	return string(str[:len(str)-1])
}

func main() {
	if len(os.Args) != 2 {
		fmt.Printf("usage: %s <path/to/sitesfile>\n", filepath.Base(os.Args[0]))
		return
	}

	vault := vault.Vault{
		Path: "./safe",
	}

	connectionStr := vault.DecryptFromFile("pgsql.v", "softsprocket")

	sites := readSites(os.Args[1])

	in := bufio.NewReader(os.Stdin)

	fmt.Print("First Name: ")
	firstname := readString(in)

	fmt.Print("Last Name: ")
	lastname := readString(in)

	fmt.Print("Email: ")
	email := readString(in)

	fmt.Print("Password: ")
	password, _ := terminal.ReadPassword(int(os.Stdin.Fd()))
	fmt.Println()

	fmt.Print("Repeat Password: ")
	testpassword, _ := terminal.ReadPassword(int(os.Stdin.Fd()))
	fmt.Println()

	for string(testpassword) != string(password) {
		fmt.Println("Passwords don't match")

		fmt.Print("Password: ")
		password, _ = terminal.ReadPassword(int(os.Stdin.Fd()))
		fmt.Println()

		fmt.Print("Repeat Password: ")
		testpassword, _ = terminal.ReadPassword(int(os.Stdin.Fd()))
		fmt.Println()
	}

	fmt.Printf("\n\nFirst Name: %s\nLast Name: %s\nEmail:%s\n\nProceed (Y|n)?", firstname, lastname, email)
	c, _ := in.ReadByte()

	if c == '\n' || c == 'y' || c == 'Y' {
		fmt.Print("\nSelect from sites lists by comma seperated list (i.e. 1,3,4)\n\n")

		if c != '\n' {
			in.ReadByte()
		}

		for i, v := range sites {
			fmt.Printf("%d %s\n", i+1, v)
		}

		selection := readString(in)

		splits := strings.Split(selection, ",")

		var chosenSites []string
		for _, v := range splits {
			i, _ := strconv.Atoi(v)
			i = i - 1
			fmt.Printf("%s ", sites[i])
			chosenSites = append(chosenSites, sites[i])
		}

		fmt.Println()
		fmt.Print("Write to database (y|n)?")

		c, _ = in.ReadByte()

		if c == '\n' || c == 'y' || c == 'Y' {
			member := models.Member{
				FirstName: firstname,
				LastName:  lastname,
				Email:     email,
				Password:  string(password),
			}

			pg, err := persistence.NewPgSQL(string(connectionStr))

			if err != nil {
				fmt.Printf("Error opening pgsql connection %s", err)
			}

			pgmember := persistence.PgMember{PgSQL: pg}

			id, err := pgmember.Create(&member)

			if err != nil {
				fmt.Printf("PgMember create error: %s", err)
			} else {
				fmt.Printf("Member id %d", id)
			}

			fmt.Println("Done.")
		}
	}

}
