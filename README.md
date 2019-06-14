# grunt-babel-multi-files

> Grunt plugin to enable the transpilation of multiple javascript files using babel into a single destiny file or multiple destiny files.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-babel-multi-files --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-babel-multi-files');
```

## The "babel_multi_files" task

### Overview
In your project's Gruntfile, add a section named `babel_multi_files` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  babel_multi_files: {
    options: {
      // Task-specific options go here.
      // this are merged with target-specific options
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

See the Babel [options](https://babeljs.io/docs/en/options), except for: `filename`, `filenameRelative`, `sourceFileName` which are handled for you.

### Usage Examples

```js
grunt.initConfig({
  babel: {
    options: {
      sourceMap: true,
      presets: ['@babel/preset-env']
    },
    dev: {
      files: {
        'dev/app.js': [
          'src/app.js',
          'src/**/*.js'
        ]
      }
    },
    dist: {
      files: {
        'dist/app.js': 'src/app.js'
      }
    }
  }
});

grunt.loadNpmTasks('grunt-babel-multi-files');

grunt.registerTask('default', ['babel']);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2019-06-14   v0.1.1   Documentation updates.
 * 2019-06-14   v0.1.0   Initial release. 
