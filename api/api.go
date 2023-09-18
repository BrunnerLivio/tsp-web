package api

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"tsp-web/internal/args"
	taskspooler "tsp-web/internal/task-spooler"
	userconf "tsp-web/internal/user-conf"

	"github.com/olahol/melody"
)

var allowOriginFunc = func(r *http.Request) bool {
	return true
}

func Run(args args.TspWebArgs) error {
	// Static
	fs := http.FileServer(http.Dir("web"))

	fileMatcher := regexp.MustCompile(`\.[a-zA-Z]*$`)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if !fileMatcher.MatchString(r.URL.Path) {
			http.ServeFile(w, r, "web/index.html")
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
		fmt.Printf("got message: %s\n", msg)
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

	fmt.Printf("Running server on http://localhost:%d\n", args.Port)

	return http.ListenAndServe(fmt.Sprintf("localhost:%d", args.Port), nil)
}
