var _ = require('lodash');
var path = require('path');
var exec = require('child_process').exec;

var LOG_TYPES = [
	"ERROR", "WARNING"
];


module.exports = function(filepath, options, callback) {
	if (!callback) {
		callback = options;
		options = {};
	}

	options = _.defaults(options || {}, {
		epubcheck: "epubcheck"
	});

	filepath = path.resolve(process.cwd(), filepath);

	var command = options.epubcheck+" "+filepath+" -q";
	exec(command, function (error, stdout, stderr) {
		var output = stderr.toString();
		var lines = stderr.split("\n");
		error = null;

		lines = _.chain(lines)
		.map(function(line) {
			var parts = line.split(":");
			if (!_.contains(LOG_TYPES, parts[0])) return null;

			var type = parts[0].toLowerCase();
			var content = parts.slice(1).join(":");

			if (type == "error") {
				error = new Error(content);
			}

			return {
				'type': type,
				'content': content
			};
		})
		.compact()
		.value();

		callback(error, {
			messages: lines
		});
	});
};
