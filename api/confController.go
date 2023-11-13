package api

import (
	"encoding/json"
	"net/http"
	"tsp-web/internal/args"
	userconf "tsp-web/internal/user-conf"

	"github.com/gorilla/mux"
)

func ConfigController(args args.TspWebArgs, r *mux.Router) {
	r.HandleFunc("", func(w http.ResponseWriter, r *http.Request) {
		conf := userconf.GetUserConf(args)
		res, err := json.Marshal(conf)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.Write(res)

	}).Methods("GET")
}
