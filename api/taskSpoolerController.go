package api

import (
	"encoding/json"
	"net/http"
	"os/exec"
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
		GetList(args, w, r)
	}).Methods("GET")

	r.HandleFunc("/clear", func(w http.ResponseWriter, r *http.Request) {
		PostClear(args, w, r)
	}).Methods("POST")

	r.HandleFunc("/exec", func(w http.ResponseWriter, r *http.Request) {
		PostExec(args, w, r)
	}).Methods("POST")
}

func GetList(args args.TspWebArgs, w http.ResponseWriter, r *http.Request) {
	labels, _ := userconf.GetLabels(args)

	currentTasks, err := taskspooler.List(args)

	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
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
			currentTasks[i].Detail, err = taskspooler.Detail(args, task.ID)
			if err != nil {
				log.Error(err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
		}
	}

	cachedTasks = currentTasks

	res, err := json.Marshal(currentTasks)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(res)
}

func PostClear(args args.TspWebArgs, w http.ResponseWriter, r *http.Request) {
	err := taskspooler.ClearFinishedTasks(args)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func PostExec(args args.TspWebArgs, w http.ResponseWriter, r *http.Request) {
	var command ExecArg
	err := json.NewDecoder(r.Body).Decode(&command)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	allCommands := userconf.GetCommands(args)

	var foundCommand *userconf.Command
	for _, c := range allCommands {
		if c.Name == command.Name {
			foundCommand = &c
			break
		}
	}

	if foundCommand == nil {
		log.Error("Command not found: ", command.Name)
		w.WriteHeader(http.StatusNotFound)
		return
	}

	log.Info("Executing command from user request with args: ", args.TsBin, foundCommand.Args)
	cmd := exec.Command(args.TsBin, foundCommand.Args...)
	out, err := cmd.Output()
	if err != nil {
		log.Error("Error executing command: ", err)
		w.WriteHeader(http.StatusInternalServerError)
	}

	var res ExecRes
	res.ID = int(out[0])

	resJson, _ := json.Marshal(res)
	w.Write(resJson)
}
