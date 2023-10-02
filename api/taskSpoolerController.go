package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"tsp-web/internal/args"
	taskspooler "tsp-web/internal/task-spooler"
	userconf "tsp-web/internal/user-conf"
)

var cachedTasks []taskspooler.Task

type ExecArg struct {
	Name string
}

type ExecRes struct {
	ID int
}

func TaskSpoolerController(args args.TspWebArgs) {
	http.HandleFunc("/api/v1/task-spooler/list", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		if r.Method == "GET" {
			GetList(args, w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/task-spooler/clear", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		if r.Method == "POST" {
			PostClear(args, w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/task-spooler/exec", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		if r.Method == "POST" {
			PostExec(args, w, r)
		}
	})
}

func GetList(args args.TspWebArgs, w http.ResponseWriter, r *http.Request) {
	labels, _ := userconf.GetLabels(args)

	currentTasks := taskspooler.List(args)

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
			currentTasks[i].Detail = taskspooler.Detail(args, task.ID)
		}
	}

	cachedTasks = currentTasks

	res, err := json.Marshal(currentTasks)
	if err != nil {
		fmt.Printf("error marshalling tasks: %s\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(res)
}

func PostClear(args args.TspWebArgs, w http.ResponseWriter, r *http.Request) {
	taskspooler.ClearFinishedTasks(args)
}

func PostExec(args args.TspWebArgs, w http.ResponseWriter, r *http.Request) {
	var command ExecArg
	err := json.NewDecoder(r.Body).Decode(&command)
	if err != nil {
		fmt.Printf("Error decoding command: %s\n", err)
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
		fmt.Printf("Command not found: %s\n", command.Name)
		w.WriteHeader(http.StatusNotFound)
		return
	}

	fmt.Println("Executing command from user request with args: ", args.TsBin, foundCommand.Args)
	cmd := exec.Command(args.TsBin, foundCommand.Args...)
	out, err := cmd.Output()
	if err != nil {
		fmt.Printf("Error executing command: %s\n", err)
		w.WriteHeader(http.StatusInternalServerError)
	}

	var res ExecRes
	res.ID = int(out[0])

	resJson, _ := json.Marshal(res)
	w.Write(resJson)
}
