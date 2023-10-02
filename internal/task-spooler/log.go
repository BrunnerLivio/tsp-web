package taskspooler

import (
	"log"
	"os"
	utils "tsp-web/internal"

	"github.com/olahol/melody"
)

func StartWatcher(path string, s *melody.Session, m *melody.Melody) {
	log.Default().Println("Starting task log watcher")

	log, _ := os.ReadFile(path)
	s.Write(log)

	utils.FileWatcher(func() {
		log, err := os.ReadFile(path)
		if err != nil {
		} else {
			m.Broadcast(log)
		}
	}, path)
}
