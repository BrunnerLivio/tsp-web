package userconf

import (
	"log"
	"os"
	"path/filepath"
	utils "tsp-web/internal"
	"tsp-web/internal/args"

	"gopkg.in/yaml.v3"
)

const defaultConfLocation = ".config/tsp-web/config.yml"
const initialConf = `# To disable command execution, comment out the "command" block
commands:
  - name: "Sleep"
    args: ["-L", "sleep", "sleep", "30"]

labels:
  - name: sleep
    bgColor: '#0C2880'
    fgColor: 'black'
    icon: 💤
`

type Label struct {
	Name    string `yaml:"name"`
	BgColor string `yaml:"bgColor"`
	FgColor string `yaml:"fgColor"`
	Icon    string `yaml:"icon"`
}

type Command struct {
	Name string   `yaml:"name"`
	Args []string `yaml:"args"`
}

type UserConf struct {
	Labels   []Label   `yaml:"labels"`
	Commands []Command `yaml:"commands"`
}

var cachedConf UserConf = UserConf{}

func StartWatcher(args args.TspWebArgs) {
	log.Default().Println("Starting user conf watcher")
	utils.FileWatcher(func() {
		log.Default().Println("Reloading user conf")
		Load(args)
	}, getConfPath(args))
}

func GetUserConf(args args.TspWebArgs) UserConf {
	return cachedConf
}

func Load(args args.TspWebArgs) {
	conf, err := load(args)
	if err != nil {
		log.Println(err)
	} else {
		cachedConf = conf
	}
}

func load(args args.TspWebArgs) (UserConf, error) {
	conf := UserConf{}
	confPath := getConfPath(args)
	ensureConfExists(confPath)

	f, err := os.Open(confPath)
	if err != nil {
		log.Println(err)
		return UserConf{}, err
	}

	decoder := yaml.NewDecoder(f)
	err = decoder.Decode(&conf)

	defer f.Close()

	if err != nil {
		log.Println(err)
		return UserConf{}, err
	}

	return conf, nil
}

func writeUserConf(args args.TspWebArgs, conf UserConf) (UserConf, error) {
	confPath := getConfPath(args)
	ensureConfExists(confPath)

	f, err := os.OpenFile(confPath, os.O_WRONLY, 0644)
	if err != nil {
		log.Println(err)
		return UserConf{}, err
	}

	defer f.Close()

	encoder := yaml.NewEncoder(f)
	err = encoder.Encode(conf)

	if err != nil {
		log.Println(err)
		return UserConf{}, err
	}

	return conf, nil
}

func getConfPath(args args.TspWebArgs) string {
	home, err := os.UserHomeDir()
	if err != nil {
		log.Println(err)
		return ""
	}

	return filepath.Join(home, defaultConfLocation)
}

func ensureConfExists(confPath string) error {
	_, err := os.Stat(confPath)
	if os.IsNotExist(err) {
		err = os.MkdirAll(filepath.Dir(confPath), 0755)
		if err != nil {
			log.Println(err)
			return err
		}

		f, err := os.Create(confPath)
		if err != nil {
			log.Println(err)
			return err
		}

		defer f.Close()

		_, err = f.WriteString(initialConf)
		if err != nil {
			log.Println(err)
			return err
		}
	}
	return nil
}
