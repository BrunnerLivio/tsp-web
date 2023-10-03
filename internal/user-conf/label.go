package userconf

import "tsp-web/internal/args"

func AddLabel(args args.TspWebArgs, label Label) (UserConf, error) {
	conf := GetUserConf(args)
	conf.Labels = append(conf.Labels, label)
	return writeUserConf(args, conf)
}

func RemoveLabel(args args.TspWebArgs, label Label) (UserConf, error) {
	conf := GetUserConf(args)
	for i, l := range conf.Labels {
		if l.Name == label.Name {
			conf.Labels = append(conf.Labels[:i], conf.Labels[i+1:]...)
			return writeUserConf(args, conf)
		}
	}

	return UserConf{}, nil
}

func UpdateLabel(args args.TspWebArgs, label Label) (UserConf, error) {
	conf := GetUserConf(args)

	for i, l := range conf.Labels {
		if l.Name == label.Name {
			conf.Labels[i] = label
			return writeUserConf(args, conf)
		}
	}

	return UserConf{}, nil
}

func GetLabels(args args.TspWebArgs) ([]Label, error) {
	conf := GetUserConf(args)
	return conf.Labels, nil
}
