"use strict";

var expect = require('chai').expect;
var tsp = require('../src/core/tsp');
var spawn = require('child_process').spawn;


describe('TSPReader', function () {

    describe('Get notified', function () {

        it('should send a notification, when a task is created', function (done) {
            spawn(process.env.TSP_WEB_BIN || 'tsp', ['-K']);
            spawn(process.env.TSP_WEB_BIN || 'tsp', ['-L', 'test', 'ls']);
            // wait until ls is finished
            setTimeout(function () {
                var tspReader = tsp.reader()
                    .subscribe(function (data) {
                        expect(data.length).to.equal(1);
                        expect(data[0].ID).to.equal('0');
                        expect(data[0].Command).to.equal('ls');
                        expect(data[0].State).to.equal('finished');
                        expect(data[0].ELevel).to.equal('0');
                        tspReader.stop();
                        done();
                    })
                    .watch();
            }, 5);

        });

    });

});
