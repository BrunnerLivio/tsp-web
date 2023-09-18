package userconf

import "tsp-web/internal/args"

func GetCommands(args args.TspWebArgs) []Command {
	conf := GetUserConf(args)
	return conf.Commands
}
