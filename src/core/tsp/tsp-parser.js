"use strict";

/**
 * @module tspParser
 * @description
 * Module for parsing tsp data.
 * 
 * @returns {Object} A collection of public possible methods
 */
function tspParser() {
	/**
	 * @name removeA
	 * @description
	 * Polyfill for removing the given elements from the given array
	 */
	function removeA(arr) {
		var what, a = arguments,
			L = a.length,
			ax;
		while (L > 1 && arr.length) {
			what = a[--L];
			while ((ax = arr.indexOf(what)) !== -1) {
				arr.splice(ax, 1);
			}
		}
		return arr;
	}

	/**
	 * @name parse
	 * @description
	 * Parses the given tsp table input and returns it as
	 * object array
	 * @param {String} input The output of the tsp Command
	 * @returns {Object[]} The parsed table
	 */
	function parse(input) {
		var lines = input.split('\n');
		lines = removeA(lines, '');
		var valueObjs = [];
		for (var i = 1; i < lines.length; i++) {
			// Get each value
			var values = lines[i].split(' ');
			// Remove every ' ' from array -> Clean up
			values = removeA(values, '');
			// The new object
			var valueObj = {};
			if (values[1] === 'running' ||
				values[1] === 'queued') {
				valueObj = {
					ID: values[0],
					State: values[1],
					Output: values[2],
					ELevel: '',
					Times: '',
					Command: values.slice(3, values.length).join(' ')
				};
			} else {
				valueObj = {
					ID: values[0],
					State: values[1],
					Output: values[2],
					ELevel: values[3],
					Times: values[4],
					// Joins the elements with higher index than 5 together
					Command: values.slice(5, values.length).join(' ')
				};
			}

			// Parse the label
			if (valueObj.Command.indexOf('[') !== -1) {
				var split = valueObj.Command.split(/\[(.*)\]/g);
				valueObj.Label = split[1];
				valueObj.Command = split[2];
			} else {
				valueObj.Label = valueObj.Command;
			}

			valueObjs.push(valueObj);
		}
		return valueObjs;
	}

	return {
		parse: parse
	};
}

module.exports = tspParser();
