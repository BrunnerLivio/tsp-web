package api

import (
	"encoding/json"
	"net/http"
	"tsp-web/internal/args"
	userconf "tsp-web/internal/user-conf"

	log "github.com/sirupsen/logrus"
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
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(res)
}
