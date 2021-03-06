#!/usr/bin/env node

var fs = require('fs'),
 program = require('commander'),
 cheerio = require('cheerio'),
 rest = require('restler'), 
 HTMLFILE_DEFAULT = "index.html", 
 CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if (!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort(),
     out = {};
    
    for (var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var checkHtmlUrl = function( url, checks, onComplete ) {
    rest.get(url).on('complete', function(result) {
	if (result instanceof Error ) {
	    console.log("Error retrieving %s.", url);
	    process.exit(1);
	} else {
	    onComplete( checkHtml(result, checks));
	}
    });
};

var clone = function(fn) {
    return fn.bind({});
};


if (require.main == module) {
    program
      .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
      .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
      .option('-u, --url <url)', 'URL to check')
      .parse(process.argv);
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
