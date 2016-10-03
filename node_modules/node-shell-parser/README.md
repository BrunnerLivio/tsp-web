# From shell output to json

Converts the usual, space separated, table from a
shell command into a list of json object where the
keys are the columns' names and the values the
different data for each row.

## Install

You can install this library through [NPM](https://www.npmjs.org/package/node-shell-parser):

```bash
npm install node-shell-parser
```

## Definition:

```javascript
  shellParser(shellOutput, options);
```

* `shellOutput`: the string resulting from running your command
* `options.separator`: which character separates your tabled data, default is one space
* `options.skipLines`: how many lines to skip before meeting the columns definition header

## Usage

Execute a process, get its output and then simply
feed it to the parser:

``` javascript

var shellParser = require('node-shell-parser');
var child = require('child_process');

var process = child.spawn('ps');
var shellOutput = '';

process.stdout.on('data', function (chunk) {
  shellOutput += chunk;
});

process.stdout.on('end', function () {
  console.log(shellParser(shellOutput))
});
```

Black magic in action:

```
~/projects/namshi/node-shell-parser (master ✘)✭ ᐅ node test.js
[ { PID: '729', TTY: 'pts/1    00:0', TIME: '0:00', CMD: 'zsh' },
  { PID: '057', TTY: 'pts/1    00:0', TIME: '0:00', CMD: 'node' },
  { PID: '059', TTY: 'pts/1    00:0', TIME: '0:00', CMD: 'ps' } ]

```
