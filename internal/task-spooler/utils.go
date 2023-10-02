package taskspooler

import (
	"regexp"
	"strconv"
	"strings"
)

func parseListOutput(output string) []Task {
	lines := strings.Split(output, "\n")

	// Remove all empty lines
	for i := 0; i < len(lines); i++ {
		if lines[i] == "" {
			lines = append(lines[:i], lines[i+1:]...)
		}
	}

	tasks := make([]Task, len(lines)-1)
	for i := 1; i < len(lines); i++ {
		tasks[i-1] = parseTask(lines[i])
	}

	return tasks
}

func parseTask(line string) Task {
	line = strings.TrimSpace(line)
	fields := strings.Fields(line)

	task := Task{
		ID:     fields[0],
		State:  fields[1],
		Output: fields[2],
	}
	if fields[1] == "running" || fields[1] == "queued" {
		task.Command = strings.Join(fields[3:], " ")
	} else {
		task.ELevel = fields[3]
		task.Times = fields[4]
		task.Command = strings.Join(fields[5:], " ")
	}

	label, command := parseLabelCommand(task.Command)
	task.LabelName = label
	task.Command = command

	return task
}

func parseLabelCommand(line string) (string, string) {
	labelRegex := regexp.MustCompile(`^\[(.*)\]`)
	labelMatch := labelRegex.FindStringSubmatch(line)
	if len(labelMatch) > 0 {
		label := labelMatch[1]
		command := strings.TrimSpace(strings.TrimPrefix(line, labelMatch[0]))
		return label, command
	} else {
		return "", line
	}
}

func parseDetailOutput(output string) TaskDetail {
	lines := strings.Split(output, "\n")

	// Split each line into key and value
	// The key is separated by a the first colon
	// The value is the rest of the line

	detail := TaskDetail{}
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		split := strings.SplitN(line, ":", 2)
		key := strings.TrimSpace(split[0])
		value := strings.TrimSpace(split[1])

		switch key {
		case "Exit status":
			detail.ExitStatus = value
		case "Command":
			detail.Command = value
		case "Slots required":
			detail.SlotsRequired, _ = strconv.ParseUint(value, 10, 64)
		case "Enqueue time":
			detail.EnqueueTime = value
		case "Start time":
			detail.StartTime = value
		case "End time":
			detail.EndTime = value
		case "Time run":
			detail.TimeRun = value
		}
	}

	return detail
}
