# TSP Web repository was migrated to internal bitbucket. To get access please contact with Roche DevTools Support

Displays a overview of the task spooler server of your machine in real time.

![TSP Web Preview](http://i.imgur.com/5TL7OeP.jpg)


## Installation

### Production

1. Install NodeJS
1. Run `sudo npm install -g tsp-web`
1. To start the server and set to startup `tsp-web start --startup`

### Development

1. Install NodeJS `sudo apt update && sudo apt install -y nodejs nodejs-legacy npm`
1. Run `npm install && npm start`
1. Open your browser on `http://localhost:3000`

### Debian package

In order to create a Debian package you have to:

1. Install package dependencies `sudo apt update && sudo apt install -y build-essential fakeroot devscripts`
1. In the root directory of this project call `debuild -uc -us`
1. Install your Debian package `sudo dpkg -i ../tsp-web*.deb`
1. add your user to the tsp group `sudo usermod -aG tsp $USER`
1. Log out and log back in. This ensures your user is running with the correct permissions.

## Try it out with docker

Use the Docker file to create your image and play around with tsp-web

1. Install Docker, following the instructions https://docs.docker.com/engine/installation/
1. Build your docker image: `docker build -t $USER/tsp-web .`
1. Create a container from this image: `docker run --name my-tsp-web -d $USER/tsp-web:latest`
1. Execute some tsp commands in your container: `docker exec -d my-tsp-web /bin/bash -c "tsp -L OK ls && tsp -L NOK foobar && tsp -L WAIT sleep 30"`
1. have a look at the web interface: `firefox "$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' my-tsp-web):3000"`

Oneliner: `docker rm -f my-tsp-web && docker build -t $USER/tsp-web . && docker run --name my-tsp-web -d $USER/tsp-web:latest && docker exec -d my-tsp-web /bin/bash -c "tsp -L OK ls && tsp -L NOK foobar && tsp -L WAIT sleep 30" && firefox "$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' my-tsp-web):3000"`

