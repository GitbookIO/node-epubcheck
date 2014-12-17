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
		epubcheck: "epubcheck",
		replacePathBy: ""
	});

	filepath = path.resolve(process.cwd(), filepath);

	var command = options.epubcheck+" "+filepath+" -q";
	exec(command, function (error, stdout, stderr) {
		var output = stderr.toString();
		var lines = stderr.split("\n");
		var err = null;

		lines = _.chain(lines)
		.map(function(line) {
			var parts = line.split(":");
			if (!_.contains(LOG_TYPES, parts[0])) return null;

			var type = parts[0].toLowerCase();
			var content = parts.slice(1).join(":");

			// Replace path in logs to make it cleaner
			if (options.replacePathBy !== null) {
				content = content.replace(new RegExp(filepath, 'g'), options.replacePathBy);
			}

			// Send first error
			if (type == "error" && !err) {
				err = new Error("EPUB Validation failed: "+content);
			}

			return {
				'type': type,
				'content': content
			};
		})
		.compact()
		.value();

		// Handle error from the epubcheck event if no error in logs
		if (error && !err) err = error;

		callback(err, {
			messages: lines
		});
	});
};
