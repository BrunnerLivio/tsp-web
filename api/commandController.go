package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"tsp-web/internal/args"
	userconf "tsp-web/internal/user-conf"
)

func CommandController(args args.TspWebArgs) {
	http.HandleFunc("/api/v1/command", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method == "GET" {
			GetCommands(args, w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
}

func GetCommands(args args.TspWebArgs, w http.ResponseWriter, r *http.Request) {
	commands := userconf.GetCommands(args)
	res, err := json.Marshal(commands)

	if err != nil {
		fmt.Printf("Error could not get commands: %s\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(res)
}
