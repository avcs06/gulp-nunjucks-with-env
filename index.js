'use strict';
var extend = require('extend');
var gutil = require('gulp-util');
var through = require('through2');
var nunjucks = require('nunjucks');
nunjucks.configure({ watch: false });

module.exports = function (env,options) {
    if(env && !env instanceof nunjucks.Environment) {
        options = env;
        env = null;
    }

    options = options || {};

    // ext = output file extension. Check if output file extension is mentioned or not
    if (!options.ext) options.ext = '.html'; // Apply default output extension

    var compile = env||nunjucks;
    /*
     * file = file
     * cb   = callback function
     */
    return through.obj(function (file, enc, cb) {

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        var data = extend(true,{},file.data||{},options);

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-nunjucks', 'Streaming not supported'));
            return cb();
        }

        var _this = this;
        try {
            compile.renderString(file.contents.toString(), data, function (err, result) {
                if (err) {
                  _this.emit('error', new gutil.PluginError('gulp-nunjucks', err));
                  return cb();
                }
                file.contents = new Buffer(result);
                // output file with the mentioned/default extension
                file.path = gutil.replaceExtension(file.path, options.ext);
                _this.push(file);
                cb();
            });
        } catch (err) {
            _this.emit('error', new gutil.PluginError('gulp-nunjucks', err));
            cb();
        }
    });
};

module.exports.nunjucks = nunjucks;
