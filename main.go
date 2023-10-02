package main

import (
	"embed"
	"errors"
	"flag"
	"fmt"
	"net/http"
	"os"
	"tsp-web/api"
	"tsp-web/internal/args"
	userconf "tsp-web/internal/user-conf"
)

//go:embed web/*
var static embed.FS

func getenv(key string, def string) string {
	val, ok := os.LookupEnv(key)
	if !ok {
		val = def
	}
	return val
}

const maxPort uint64 = 65535

func parseArgs() (args.TspWebArgs, error) {
	TsBin := flag.String("ts-bin", getenv("TSP_WEB_TS_BIN", "tsp"), "The binary for tsp")
	portArg := flag.Uint64("port", 3000, "The port for tsp-web")

	flag.Parse()

	if *portArg > maxPort {
		return args.TspWebArgs{}, fmt.Errorf("invalid value \"%d\" for flag -port: parse error", *portArg)
	}

	Port := uint16(*portArg)

	return args.TspWebArgs{TsBin: *TsBin, Port: Port}, nil
}

func main() {
	api.Static = static

	args, err := parseArgs()

	if err != nil {
		fmt.Printf("%s\n", err)
		flag.Usage()
		os.Exit(1)
	}

	userconf.Load(args)
	go userconf.StartWatcher(args)
	err = api.Run(args)

	if errors.Is(err, http.ErrServerClosed) {
		fmt.Printf("server closed\n")
	} else if err != nil {
		fmt.Printf("error starting server: %s\n", err)
		os.Exit(1)
	}
	os.Exit(0)
}
