package userconf

import (
	"os"
	"path/filepath"
	utils "tsp-web/internal"
	"tsp-web/internal/args"

	log "github.com/sirupsen/logrus"
	"gopkg.in/yaml.v3"
)

const defaultConfLocation = "tsp-web/config.yml"
const initialConf = `# To disable command execution, comment out the "command" block
commands:
  - name: "Sleep"
    args: ["-L", "sleep", "sleep", "30"]

labels:
  - name: sleep
    bgColor: '#0C2880'
    fgColor: 'black'
    icon: 💤

# To use a custom sockets, uncomment the "sockets" block
#sockets:
#  - name: "Default"
#  - name: "Other"
#    path: "/tmp/other.sock"
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

type Socket struct {
	Name string `yaml:"name"`
	Path string `yaml:"path"`
}

type UserConf struct {
	Labels   []Label   `yaml:"labels"`
	Commands []Command `yaml:"commands"`
	Sockets  []Socket  `yaml:"sockets"`
}

var cachedConf UserConf = UserConf{}

func StartWatcher(args args.TspWebArgs) {
	log.Debug("Starting user conf watcher")
	utils.FileWatcher(func() {
		log.Info("User conf changed, reloading...")
		Load(args)
	}, getConfPath(args))
}

func GetUserConf(args args.TspWebArgs) UserConf {
	return cachedConf
}

func Load(args args.TspWebArgs) {
	cachedConf = load(args)
}

func load(args args.TspWebArgs) UserConf {
	conf := UserConf{}
	confPath := getConfPath(args)
	ensureConfExists(confPath)

	f, err := os.Open(confPath)
	if err != nil {
		log.Error(confPath, ": ", err)
		return UserConf{}
	}

	decoder := yaml.NewDecoder(f)
	err = decoder.Decode(&conf)

	defer f.Close()

	if err != nil {
		log.Error(confPath, ": ", err)
		return UserConf{}
	}

	return conf
}

func writeUserConf(args args.TspWebArgs, conf UserConf) (UserConf, error) {
	confPath := getConfPath(args)
	ensureConfExists(confPath)

	f, err := os.OpenFile(confPath, os.O_WRONLY, 0644)
	if err != nil {
		return UserConf{}, err
	}

	defer f.Close()

	encoder := yaml.NewEncoder(f)
	err = encoder.Encode(conf)

	if err != nil {
		return UserConf{}, err
	}

	return conf, nil
}

func getConfPath(args args.TspWebArgs) string {
	homedir, _ := os.UserHomeDir()
	configDir := utils.Getenv("XDG_CONFIG_HOME", filepath.Join(homedir, ".config"))
	return filepath.Join(configDir, defaultConfLocation)
}

func ensureConfExists(confPath string) error {
	_, err := os.Stat(confPath)
	if os.IsNotExist(err) {
		err = os.MkdirAll(filepath.Dir(confPath), 0755)
		f, err := os.Create(confPath)
		_, err = f.WriteString(initialConf)

		if err != nil {
			log.Error(err)
			return err
		}
	}
	return nil
}
