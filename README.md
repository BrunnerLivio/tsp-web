# TSP Web

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

