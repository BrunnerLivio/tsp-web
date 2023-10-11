package main

import (
	"embed"
	"errors"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"tsp-web/api"
	"tsp-web/internal/args"
	userconf "tsp-web/internal/user-conf"

	utils "tsp-web/internal"

	log "github.com/sirupsen/logrus"
)

//go:embed web/*
var static embed.FS

//go:embed .VERSION
var version string

const maxPort uint64 = 65535

func parseArgs() (args.TspWebArgs, error) {
	envPort, _ := strconv.ParseUint(utils.Getenv("TSP_WEB_PORT", "3000"), 10, 16)
	TsBin := flag.String("ts-bin", utils.Getenv("TSP_WEB_TS_BIN", "tsp"), "The binary for tsp")
	portArg := flag.Uint64("port", envPort, "The port for tsp-web")
	logLevel := flag.String("log-level", utils.Getenv("TSP_WEB_LOG_LEVEL", "info"), "The log level for tsp-web")
	noColor := flag.Bool("no-color", false, "Disable colorized output")
	host := flag.String("host", utils.Getenv("TSP_WEB_HOSTNAME", "localhost"), "The host for tsp-web")
	version := flag.Bool("version", false, "Print the version and exit")

	flag.Parse()

	if *portArg > maxPort {
		log.Errorf("invalid value \"%d\" for flag -port: value out of range", *portArg)
		flag.Usage()
		os.Exit(1)
	}

	Port := uint16(*portArg)

	return args.TspWebArgs{
		TsBin:    *TsBin,
		Port:     Port,
		LogLevel: *logLevel,
		NoColor:  *noColor,
		Host:     *host,
		Version:  *version,
	}, nil
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

func ensureTsBinExists(tsBin string) {
	cmd := exec.Command(tsBin)
	err := cmd.Run()
	if err != nil {
		log.Fatalf(`Error running tsp binary: %s

Troubleshooting:
1. Did you install tsp?

# Debian/Ubuntu
$ sudo apt install task-spooler

# Mac
$ brew install task-spooler

2. Did you set the correct path to tsp with the --ts-bin flag or TSP_WEB_TS_BIN env variable?

# Mac
$ tsp-web --ts-bin ts

`, err)
	}
}

func main() {
	api.Static = static

	args, err := parseArgs()

	if args.Version {
		fmt.Println(version)
		os.Exit(0)
	}

	setLogLevel(args.LogLevel)
	log.SetFormatter(&log.TextFormatter{
		FullTimestamp: true,
		DisableColors: args.NoColor,
	})

	ensureTsBinExists(args.TsBin)

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
