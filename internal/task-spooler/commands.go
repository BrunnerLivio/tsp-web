package taskspooler

import (
	"log"
	"os/exec"
	"tsp-web/internal/args"
	userconf "tsp-web/internal/user-conf"
)

type Task struct {
	ID        string
	State     string
	Output    string
	ELevel    string
	Times     string
	Command   string
	Label     *userconf.Label
	LabelName string

	Detail TaskDetail
}

type TaskDetail struct {
	ExitStatus    string
	Command       string
	SlotsRequired uint64
	EnqueueTime   string
	StartTime     string
	EndTime       string
	TimeRun       string
}

func List(args args.TspWebArgs) []Task {
	cmd := exec.Command(args.TsBin)
	out, err := cmd.Output()
	if err != nil {
		log.Fatal(err)
	}
	return parseListOutput(string(out))
}

func Detail(args args.TspWebArgs, id string) TaskDetail {
	cmd := exec.Command(args.TsBin, "-i", id)
	out, err := cmd.Output()
	if err != nil {
		log.Fatal(err)
	}
	return parseDetailOutput(string(out))
}

func ClearFinishedTasks(args args.TspWebArgs) {
	cmd := exec.Command(args.TsBin, "-C")
	err := cmd.Run()
	if err != nil {
		log.Fatal(err)
	}
}
