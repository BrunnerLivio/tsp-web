package api

import (
	"embed"
	"fmt"
	"net/http"
	"strings"
	util "tsp-web/internal"
	"tsp-web/internal/args"
	taskspooler "tsp-web/internal/task-spooler"

	"github.com/gorilla/mux"
	"github.com/olahol/melody"
	log "github.com/sirupsen/logrus"
)

var allowOriginFunc = func(r *http.Request) bool {
	return true
}

var Static embed.FS

func Run(args args.TspWebArgs) error {
	router := mux.NewRouter()

	// Websocket
	m := melody.New()
	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		m.HandleRequest(w, r)
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		message := string(msg)
		messageSplit := strings.Split(message, ":")
		command := messageSplit[0]
		value := messageSplit[1]

		switch command {
		case "start-filestream":
			go taskspooler.StartWatcher(value, s, m)
		}
	})

	// API
	api := router.PathPrefix("/api/v1").Subrouter()

	api.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			next.ServeHTTP(w, r)
		})
	})

	ConfigController(args, api.PathPrefix("/config").Subrouter())
	TaskSpoolerController(args, api.PathPrefix("/task-spooler").Subrouter())

	// SPA
	spa := util.SpaHandler{StaticFS: Static, StaticPath: "web", IndexPath: "index.html"}
	router.PathPrefix("/").Handler(spa)

	http.Handle("/", router)
	log.Info("Running server on http://0.0.0.0:", args.Port)

	return http.ListenAndServe(fmt.Sprintf("%s:%d", args.Host, args.Port), nil)
}
