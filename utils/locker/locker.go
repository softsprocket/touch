package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"touch/vault"
)

func main() {
	if len(os.Args) != 4 {
		fmt.Printf("usage: %s <filename> <key> <vault_dir>\n", os.Args[0])
		os.Exit(-1)
	}

	vault := vault.Vault{
		Path: os.Args[3],
	}

	data, _ := ioutil.ReadFile(os.Args[1])

	vault.EncryptToFile(filepath.Base(os.Args[1]), data, os.Args[2])
}
