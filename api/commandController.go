package api

import (
	"encoding/json"
	"net/http"
	"tsp-web/internal/args"
	userconf "tsp-web/internal/user-conf"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

func CommandController(args args.TspWebArgs, r *mux.Router) {
	commands := userconf.GetUserConf(args).Commands
	if commands == nil || len(commands) == 0 {
		return
	}

	r.HandleFunc("", func(w http.ResponseWriter, r *http.Request) {
		GetCommands(args, w, r)
	}).Methods("GET")
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
