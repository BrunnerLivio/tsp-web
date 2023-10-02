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

	log "github.com/sirupsen/logrus"
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
	logLevel := flag.String("log-level", getenv("TSP_WEB_LOG_LEVEL", "info"), "The log level for tsp-web")
	noColor := flag.Bool("no-color", false, "Disable colorized output")

	flag.Parse()

	if *portArg > maxPort {
		return args.TspWebArgs{}, fmt.Errorf("invalid value \"%d\" for flag -port: parse error", *portArg)
	}

	Port := uint16(*portArg)

	return args.TspWebArgs{TsBin: *TsBin, Port: Port, LogLevel: *logLevel, NoColor: *noColor}, nil
}

func setLogLevel(logLevel string) {
	switch logLevel {
	case "debug":
		log.SetLevel(log.DebugLevel)
	case "info":
		log.SetLevel(log.InfoLevel)
	case "warn":
		log.SetLevel(log.WarnLevel)
	default:
		log.SetLevel(log.InfoLevel)
	}
}

func main() {
	api.Static = static

	args, err := parseArgs()
	setLogLevel(args.LogLevel)
	log.SetFormatter(&log.TextFormatter{
		FullTimestamp: true,
		DisableColors: args.NoColor,
	})

	if err != nil {
		log.Error(err)
		flag.Usage()
		os.Exit(1)
	}

	userconf.Load(args)
	go userconf.StartWatcher(args)
	err = api.Run(args)

	if errors.Is(err, http.ErrServerClosed) {
		log.Info("server closed")
	} else if err != nil {
		log.Fatal("error starting server: ", err)
	}
	os.Exit(0)
}
