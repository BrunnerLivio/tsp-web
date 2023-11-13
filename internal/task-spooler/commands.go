package taskspooler

import (
	"os"
	"os/exec"
	"tsp-web/internal/args"
	userconf "tsp-web/internal/user-conf"

	log "github.com/sirupsen/logrus"
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

func List(args args.TspWebArgs, envVars map[string]string) ([]Task, error) {
	out, err := Execute(envVars, args.TsBin)
	return parseListOutput(string(out)), err
}

func Detail(args args.TspWebArgs, id string, envVars map[string]string) (TaskDetail, error) {
	out, err := Execute(envVars, args.TsBin, "-i", id)
	return parseDetailOutput(string(out)), err
}

func ClearFinishedTasks(args args.TspWebArgs, envVars map[string]string) error {
	_, err := Execute(envVars, args.TsBin, "-C")
	return err
}

func Kill(args args.TspWebArgs, id string, envVars map[string]string) error {
	_, err := Execute(envVars, args.TsBin, "-k", id)
	return err
}

func cmdEnv(cmd *exec.Cmd, envVars map[string]string) {
	cmd.Env = os.Environ()
	for k, v := range envVars {
		cmd.Env = append(cmd.Env, k+"="+v)
	}
}

func Execute(envVars map[string]string, args ...string) ([]byte, error) {
	cmd := exec.Command(args[0], args[1:]...)
	log.Debug(cmd.Args)
	cmdEnv(cmd, envVars)
	return cmd.Output()
}
