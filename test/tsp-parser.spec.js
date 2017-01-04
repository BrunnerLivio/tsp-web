"use strict";

var expect = require('chai').expect;
var TSPParser = require('../src/core/tsp/tsp-parser');

describe('TSPParser', function() {
    it('should parse multiple lines', function() {
        var input = 'ID   State      Output               E-Level  Times(r/u/s)   Command [run=0/1]\n' +
            '1    finished   /tmp/ts-out.jtUKaV   0        0.00/0.00/0.00 ls\n' +
            '2    finished   /tmp/ts-out.ENnFPg   0        0.00/0.00/0.00 cat workspace/molior/setup.py'

        var output = TSPParser.parse(input);
        var firstLine = output[0],
            secondLine = output[1];
        expect(output.length).to.equal(2);

        expect(firstLine.ID).to.equal('1');
        expect(firstLine.State).to.equal('finished');
        expect(firstLine.Output).to.equal('/tmp/ts-out.jtUKaV');
        expect(firstLine.ELevel).to.equal('0');
        expect(firstLine.Times).to.equal('0.00/0.00/0.00');
        expect(firstLine.Command).to.equal('ls');

        expect(secondLine.ID).to.equal('2');
        expect(secondLine.State).to.equal('finished');
        expect(secondLine.Output).to.equal('/tmp/ts-out.ENnFPg');
        expect(secondLine.ELevel).to.equal('0');
        expect(secondLine.Times).to.equal('0.00/0.00/0.00');
        expect(secondLine.Command).to.equal('cat workspace/molior/setup.py');
    });

    it('should parse labels', function() {
        var input = 'ID   State      Output               E-Level  Times(r/u/s)   Command [run=0/1]\n' +
            '3    finished   /tmp/ts-out.BcgAQI   0        120.00/0.00/0.00 [List]sleep 120';

        var output = TSPParser.parse(input);
        expect(output.length).to.equal(1);
        var firstLine = output[0];

        expect(firstLine.Label).to.equal('List');
        expect(firstLine.Command).to.equal('sleep 120');
    });

    it('should parse queued & running tasks', function () {
		var input = 'ID   State      Output               E-Level  Times(r/u/s)   Command [run=1/1]\n' +
			'2    running    /tmp/ts-out.j67lCz                           [sleep]sleep 100\n' +
			'3    queued     (file)                                       ls';
		var output = TSPParser.parse(input);
		expect(output.length).to.equal(2);
		var firstLine = output[0];
		var secondLine = output[1];
		expect(firstLine.ID).to.equal('2');
		expect(firstLine.State).to.equal('running');
		expect(firstLine.Output).to.equal('/tmp/ts-out.j67lCz');
		expect(firstLine.ELevel).to.equal('');
		expect(firstLine.Times).to.equal('');
		expect(firstLine.Command).to.equal('sleep 100');
		expect(firstLine.Label).to.equal('sleep');

		expect(secondLine.ID).to.equal('3');
		expect(secondLine.State).to.equal('queued');
		expect(secondLine.Output).to.equal('(file)');
		expect(secondLine.ELevel).to.equal('');
		expect(secondLine.Times).to.equal('');
		expect(secondLine.Command).to.equal('ls');
		expect(secondLine.Label).to.equal('ls');
	});
});