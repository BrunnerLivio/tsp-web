package taskspooler

import (
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

func List(args args.TspWebArgs) ([]Task, error) {
	cmd := exec.Command(args.TsBin)
	out, err := cmd.Output()
	return parseListOutput(string(out)), err
}

func Detail(args args.TspWebArgs, id string) (TaskDetail, error) {
	cmd := exec.Command(args.TsBin, "-i", id)
	out, err := cmd.Output()
	return parseDetailOutput(string(out)), err
}

func ClearFinishedTasks(args args.TspWebArgs) error {
	cmd := exec.Command(args.TsBin, "-C")
	err := cmd.Run()
	return err
}
