package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"tsp-web/internal/args"
	userconf "tsp-web/internal/user-conf"
)

func LabelController(args args.TspWebArgs) {
	http.HandleFunc("/api/v1/label", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method == "GET" {
			GetLabels(args, w, r)
		} else if r.Method == "POST" {
			PostLabel(args, w, r)
		} else if r.Method == "PUT" {
			PutLabel(args, w, r)
		} else if r.Method == "DELETE" {
			DeleteLabel(args, w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
}

func GetLabels(args args.TspWebArgs, w http.ResponseWriter, r *http.Request) {
	labels, err := userconf.GetLabels(args)
	res, err := json.Marshal(labels)
	if err != nil {
		fmt.Printf("Error creating label: %s\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(res)
}

func PostLabel(args args.TspWebArgs, w http.ResponseWriter, r *http.Request) {
	var newLabel userconf.Label
	err := json.NewDecoder(r.Body).Decode(&newLabel)

	conf, err := userconf.AddLabel(args, newLabel)
	res, err := json.Marshal(conf.Labels)

	if err != nil {
		fmt.Printf("Error creating label: %s\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(res)
}

func PutLabel(args args.TspWebArgs, w http.ResponseWriter, r *http.Request) {
	var newLabel userconf.Label
	err := json.NewDecoder(r.Body).Decode(&newLabel)

	conf, err := userconf.UpdateLabel(args, newLabel)
	res, err := json.Marshal(conf.Labels)

	if err != nil {
		fmt.Printf("Error updating label: %s\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(res)
}

func DeleteLabel(args args.TspWebArgs, w http.ResponseWriter, r *http.Request) {
	var newLabel userconf.Label
	err := json.NewDecoder(r.Body).Decode(&newLabel)

	conf, err := userconf.RemoveLabel(args, newLabel)
	res, err := json.Marshal(conf.Labels)

	if err != nil {
		fmt.Printf("Error removing label: %s\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(res)
}
