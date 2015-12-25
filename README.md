# [gulp-nunjucks-with-env](https://github.com/avcs06/gulp-nunjucks-with-env)
> Use [Nunjucks](http://jlongster.github.io/nunjucks/) Environment Class to get more control

*Issues with the output should be reported on the Nunjucks [issue tracker](https://github.com/jlongster/nunjucks/issues).*


## Install

Install with [npm](https://npmjs.org/package/gulp-nunjucks-with-env)

```
npm install --save-dev gulp-nunjucks-with-env
```


## Example : Using Environment Class

```js
var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-with-env');

var environment = nunjucksRender.nunjucks.configure(['src/templates/']);
environment.addFilter('stringify', function(obj) {
    return JSON.stringify(obj);
});
nunjucksRender = nunjucksRender.bind(nunjucksRender,environment);

gulp.task('default', function () {
	return gulp.src('src/templates/*.html')
		.pipe(nunjucksRender())
		.pipe(gulp.dest('dist'));
});
```

Check [Nunjucks API](https://mozilla.github.io/nunjucks/api.html#environment) for more information on Environment Class

*Note: To keep Nunjucks render from eating up all your ram, make sure to specify your watch path. ```nunjucksRender.nunjucks.configure(['src/path/to/templates/']);``` This will also allow you to define your paths relatively.*


## Example : Using with gulp data

```js
var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var data = require('gulp-data');

function getDataForFile(file){
    return {
        example: 'data loaded for ' + file.relative
    };
}

gulp.task('default', function () {
	nunjucksRender.nunjucks.configure(['src/templates/']);
	return gulp.src('src/templates/*.html')
	  .pipe(data(getDataForFile))
		.pipe(nunjucksRender())
		.pipe(gulp.dest('dist'));
});
```

## Example : Using with pass by reference globals

```js
var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-with-env');

var environment = nunjucksRender.nunjucks.configure(['src/templates/']);
environment.addFilter('stringify', function(obj) {
    return JSON.stringify(obj);
});
var files = {widgetFiles : []};
templateEngine = templateEngine.bind(templateEngine,environment,{},files);

gulp.task('task', function () {
	return gulp.src('src/templates/*.html')
		.pipe(nunjucksRender())
		.pipe(gulp.dest('dist'));
});

gulp.task('newtask',['task'],function() {
  return gulp.src(files.widgetFiles)
		.pipe(/*Some Task*/)
});
```

## API

### nunjucksRender(environment, context, passByReferenceGlobals)

<b>environment (optional) `Environment Class` : </b>
  [`Environment Class`](https://mozilla.github.io/nunjucks/api.html#environment)

<b>context (optional) `Object` : </b>
  Same context as [`nunjucks.render()`](http://jlongster.github.io/nunjucks/api.html#render)
  *Note : You will have to pass empty object {}, if you want to use passByReferenceGlobals*

<b>passByReferenceGlobals (optional) `Object` : </b>
  Parameters from this object will be added to context through pass by reference rather than pass by value

<b>Example : </b>
```
nunjucksRender(environment,{css_path: 'http://company.com/css/'});
```
or
```
nunjucksRender({css_path: 'http://company.com/css/'});
```

For the following template
```
<link rel="stylesheet" href="{{ css_path }}test.css" />
```

Would render
```
<link rel="stylesheet" href="http://company.com/css/test.css" />
```

## License

MIT © [AvcS](http://www.avcs-tips.com)

## Shout-outs

[Sindre Sorhus](http://sindresorhus.com/) who wrote the original [gulp-nunjucks](https://www.npmjs.org/package/gulp-nunjucks) for precompiling Nunjucks templates. 

[Carlos G. Limardo](http://limardo.org) updated this to render instead of precompile in [gulp-nunjucks-render](https://www.npmjs.org/package/gulp-nunjucks-render)

I updated this to facilitate using of Environment Class for more control
