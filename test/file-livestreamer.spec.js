"use strict";

var expect = require('chai').expect;
var FileLivestreamer = require('../src/core/file-livestreamer/file-liverstreamer');
var fs = require('fs');

describe('File Livestreamer', function () {

    describe('Read File', function () {

        it('should push the file content when a change occurs', function (done) {
            var fileName = '/tmp/tesfile',
                counter = 0;
            fs.writeFileSync(fileName, '');
            setTimeout(function () {
                FileLivestreamer(fileName)
                    .subscribe(function (content) {
                        if (counter === 0) {
                            expect(content).to.equal('');
                        } else if (counter === 1) {
                            expect(content).to.equal('asdf');
                            done();
                        }
                        counter++;

                    })
                    .watch();
            }, 10);

            setTimeout(function () {
                fs.writeFileSync(fileName, 'asdf');
            }, 20);
        });
        it('should not push filecontent when called stop method has been called', function (done) {
            var fileName = '/tmp/tesfile',
                counter = 0;
            fs.writeFileSync(fileName, '');
            setTimeout(function () {
                var fileLivestreamer = FileLivestreamer(fileName)
                    .subscribe(function (content) {
                        counter++;
                    })
                    .watch();
                setTimeout(function () {
                    fs.writeFileSync(fileName, 'asdf');
                    setTimeout(function () {
                        fileLivestreamer.stop();
                        fs.writeFileSync(fileName, 'asdf');
                        setTimeout(function () {
                            expect(counter).to.equal(2);
                            done();
                        }, 30);
                    });
                }, 30);
            }, 30);


        });

    });

});