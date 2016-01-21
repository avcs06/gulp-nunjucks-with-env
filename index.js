'use strict';
var extend = require('extend');
var gutil = require('gulp-util');
var through = require('through2');
var nunjucks = require('nunjucks');
var genv = nunjucks.configure({ watch: false });

module.exports = function nunjucksRender(env,options,globals) {
    if(typeof env == 'object' && !(env instanceof nunjucks.Environment)) {
        if(options) return nunjucksRender.bind(nunjucksRender,undefined,env,options)();
        else return nunjucksRender.bind(nunjucksRender,undefined,env)();
    }

    options = options || {};

    // ext = output file extension. Check if output file extension is mentioned or not
    if (!options.ext) options.ext = '.html'; // Apply default output extension

    var compile = env||genv;
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

        if(globals) {
            Object.keys(globals).forEach(function(key) {
                data[key] = globals[key];
            });
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-nunjucks', 'Streaming not supported'));
            return cb();
        }

        var _this = this;
        try {
            compile.renderString(file.contents.toString(), data, {path:file.path}, function (err, result) {
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