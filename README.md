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
    babel_multi_files: {
        compact_format_single_file: {
            options: {
                sourceMaps: false,
                presets: [
                    ["@babel/preset-env", {
                        targets: "ie 11, > 5%"
                    }]
                ]
            },
            src: ["test/fixtures/file_a.js"],
            dest: "temp/compact_format_single_file.js"
        },
        files_object_format: {
            options: {
                sourceMaps: true,
                presets: [
                    ["@babel/preset-env", {
                        targets: "last 1 Electron version"
                    }]
                ]
            },
            files: {
                "temp/files_object_format_a.js": [
                    "test/fixtures/*_first.js",
                    "test/fixtures/*.js"
                ],
                "temp/files_object_format_b.js": [
                    "test/fixtures/nested/*_first.js",
                    "test/fixtures/nested/*.js"
                ]
            }
        },
        files_array_format: {
            files: [{
                src: ["test/fixtures/*_first.js", "test/fixtures/*.js"],
                dest: "temp/files_array_format_a.js"
            }, {
                src: ["test/fixtures/nested/*.js", "!test/fixtures/nested/*_a.js"],
                dest: "temp/files_array_format_b.js"
            }]
        },
        dynamic_mappings: {
            files: [{
                expand: true,
                cwd: "test/fixtures/",
                src: ["**/*.js", "!nested/*_a.js"],
                dest: "temp/dynamic_mappings/",
                ext: ".compiled.js",
                extDot: "first"
            }]
        },
        using_cache_AKA_incremental_build: {
            /**
             * Enabling the cache allows to transpile only the files that changed instead of all files every time
             * this makes the transpile process run faster.
             * Warning: Current implementation is meant to handle a single destination per target
             */
            options: {
                taskOptions: {
                    cache: true,
                    cacheName: "myCacheName",     // Required when "cache" is enabled
                    cacheDirectory: ".cache-dir", // Optional
                    cacheUsingCheckSum: true      // Optional (See: https://github.com/royriojas/file-entry-cache#createcachename-directory-usechecksum)
                }
            },
            src: ["test/fixtures/*_first.js", "test/fixtures/*.js"],
            dest: "temp/files_array_format_a.js"
      }
    }
});

grunt.loadNpmTasks('grunt-babel-multi-files');

grunt.registerTask('default', ['babel_multi_files']);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2019-06-14   v0.2.0   Introducing file caching.
 * 2019-06-14   v0.1.2   More documentation updates.
 * 2019-06-14   v0.1.1   Documentation updates.
 * 2019-06-14   v0.1.0   Initial release. 
