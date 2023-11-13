package api

import (
	"encoding/json"
	"errors"
	"net/http"
	"tsp-web/internal/args"
	taskspooler "tsp-web/internal/task-spooler"
	userconf "tsp-web/internal/user-conf"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

var cachedTasks []taskspooler.Task

type ExecArg struct {
	Name string
}

type ExecRes struct {
	ID int
}

func TaskSpoolerController(args args.TspWebArgs, r *mux.Router) {
	r.HandleFunc("/list", func(w http.ResponseWriter, r *http.Request) {
		res, err := GetList(args, getEnv(r), w, r)

		if err != nil {
			log.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.Write(res)
	}).Methods("GET")

	r.HandleFunc("/clear", func(w http.ResponseWriter, r *http.Request) {
		err := taskspooler.ClearFinishedTasks(args, getEnv(r))
		if err != nil {
			log.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}).Methods("POST")

	r.HandleFunc("/exec", func(w http.ResponseWriter, r *http.Request) {
		res, err := PostExec(args, w, r, getEnv(r))
		if err != nil {
			log.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Write(res)
	}).Methods("POST")

	r.HandleFunc("/kill/{id}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]
		err := taskspooler.Kill(args, id, getEnv(r))
		if err != nil {
			log.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}).Methods("POST")
}

func GetList(args args.TspWebArgs, env map[string]string, w http.ResponseWriter, r *http.Request) (res []byte, err error) {
	labels := userconf.GetUserConf(args).Labels
	currentTasks, err := taskspooler.List(args, env)

	if err != nil {
		return nil, err
	}

	for i, task := range currentTasks {
		for _, label := range labels {
			if task.LabelName == label.Name {
				currentTasks[i].Label = &label
				break
			}
		}
	}

	for i, task := range currentTasks {
		hasFoundCachedDetail := false
		for _, cachedTask := range cachedTasks {
			if task.ID == cachedTask.ID && task.State == cachedTask.State {
				currentTasks[i].Detail = cachedTask.Detail
				hasFoundCachedDetail = true
				break
			}
		}

		if !hasFoundCachedDetail {
			currentTasks[i].Detail, err = taskspooler.Detail(args, task.ID, env)
			if err != nil {
				return nil, err
			}
		}
	}

	cachedTasks = currentTasks

	return json.Marshal(currentTasks)
}

func PostExec(args args.TspWebArgs, w http.ResponseWriter, r *http.Request, env map[string]string) (res []byte, erro error) {
	var command ExecArg
	err := json.NewDecoder(r.Body).Decode(&command)
	if err != nil {
		return nil, err
	}

	allCommands := userconf.GetUserConf(args).Commands

	var foundCommand *userconf.Command
	for _, c := range allCommands {
		if c.Name == command.Name {
			foundCommand = &c
			break
		}
	}

	if foundCommand == nil {
		return nil, errors.New("Command not found")
	}

	log.Info("Executing command from user request with args: ", args.TsBin, foundCommand.Args)
	arguments := append([]string{args.TsBin}, foundCommand.Args...)
	out, err := taskspooler.Execute(env, arguments...)

	var result ExecRes
	result.ID = int(out[0])
	resJson, _ := json.Marshal(result)
	return resJson, nil
}

func getEnv(r *http.Request) map[string]string {
	socket := r.URL.Query().Get("socket")

	env := map[string]string{}

	if socket != "default" && socket != "" {
		env["TS_SOCKET"] = socket
	}

	return env
}
