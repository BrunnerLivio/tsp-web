package api

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"regexp"
	"strings"
	"tsp-web/internal/args"
	taskspooler "tsp-web/internal/task-spooler"
	userconf "tsp-web/internal/user-conf"

	"github.com/olahol/melody"
	log "github.com/sirupsen/logrus"
)

var allowOriginFunc = func(r *http.Request) bool {
	return true
}

var Static embed.FS

func Run(args args.TspWebArgs) error {
	// Static
	web, _ := fs.Sub(Static, "web")
	fs := http.FileServer(http.FS(web))

	fileMatcher := regexp.MustCompile(`\.[a-zA-Z]*$`)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if !fileMatcher.MatchString(r.URL.Path) {
			var index, _ = Static.ReadFile("web/index.html")
			w.Write(index)
		} else {
			fs.ServeHTTP(w, r)
		}
	})

	// Websocket
	m := melody.New()
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
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
	TaskSpoolerController(args)
	LabelController(args)

	commands := userconf.GetUserConf(args).Commands
	if commands != nil && len(commands) > 0 {
		CommandController(args)
	}

	log.Info("Running server on http://0.0.0.0:", args.Port)

	return http.ListenAndServe(fmt.Sprintf("%s:%d", args.Host, args.Port), nil)
}
