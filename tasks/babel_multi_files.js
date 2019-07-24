/*
 * grunt-babel-multi-files
 * https://github.com/josephma93/grunt-babel-multi-files
 *
 * Copyright (c) 2019 Joseph Montero
 * Licensed under the MIT license.
 */

// To debug in powershell: node --inspect-brk $env:APPDATA"\npm\node_modules\grunt-cli\bin\grunt"

"use strict";

const BABEL_CORE_MODULE_NAME = "@babel/core";
const IS_WINDOWS = process.platform === "win32";
const PACKAGE = require("../package.json");

const chalk = require("chalk");
const path = require("path");
const { SourceNode, SourceMapConsumer } = require("source-map");
const stripAnsi = require("strip-ansi");
const _ = require("lodash");
const fileEntryCache = require("file-entry-cache");
const assert = require("assert");

let babel;
try {
  babel = require(BABEL_CORE_MODULE_NAME);
} catch (err) {
  if (err.code === "MODULE_NOT_FOUND") {
    err.message += `\n${PACKAGE.name} requires the package ${BABEL_CORE_MODULE_NAME} version `;
    err.message += `${PACKAGE.peerDependencies[BABEL_CORE_MODULE_NAME]}`;
  }
  throw err;
}

function unixifyPath(filePath) {
  if (IS_WINDOWS) {
    return filePath.replace(/\\/g, "/");
  } else {
    return filePath;
  }
}

function reflect(promise) {
  return promise.then(
    value => {
      return { wasFulfilled: true, value };
    },
    reason => {
      return { wasFulfilled: false, reason };
    }
  );
}

module.exports = function(grunt) {
  function makeTransformationChain({
    taskConfig,
    sourcePaths,
    destinationFilePath
  }) {
    const { taskOptions } = taskConfig;

    let cache,
      reconcileCache = _.noop;

    if (taskOptions.cache) {
      assert.notEqual(
        !!taskOptions.cacheName,
        false,
        `"options.cacheName" is required when "options.cache" is enabled`
      );
      cache = fileEntryCache.create(
        taskOptions.cacheName,
        taskOptions.cacheDirectory,
        taskOptions.cacheUsingCheckSum
      );
      // Persists cache to disk after all files have been processed
      reconcileCache = _.after(sourcePaths.length, () => cache.reconcile());
    }

    return new _(sourcePaths)
      .chain()
      .filter(function warnAndRemoveInvalidSourceFiles(sourceFilePath) {
        const fileExists = grunt.file.exists(sourceFilePath);

        if (!fileExists) {
          grunt.log.warn(
            `Source file "${chalk.cyan(sourceFilePath)}" not found.`
          );
        }

        return fileExists;
      })
      .map(unixifyPath)
      .map(function createTransformationInfoObj(sourceFilePath) {
        return {
          sourceFilePath,
          transformPromise: null,
          transformResult: {
            code: null,
            map: null
          }
        };
      })
      .each(function logFileDetected(transformationInfoObj) {
        grunt.verbose.writeln(
          `Transforming "${chalk.cyan(
            transformationInfoObj.sourceFilePath
          )}"...`
        );
      })
      .map(function transformFile(transformationInfoObj) {
        const { sourceFilePath } = transformationInfoObj,
          babelOptions = Object.assign({}, taskConfig, {
            // Adjust path for babel
            sourceFileName: unixifyPath(
              path.relative(path.dirname(destinationFilePath), sourceFilePath)
            )
          }),
          transpileWithBabel = () =>
            babel.transformFileAsync(sourceFilePath, babelOptions);

        // Don't send task options to babel
        delete babelOptions.taskOptions;

        let transformPromise;

        if (cache) {
          const fileDescriptor = cache.getFileDescriptor(sourceFilePath);

          if (fileDescriptor.changed) {
            transformPromise = transpileWithBabel().then(
              function storeTransformResultInCache(transformResult) {
                return (fileDescriptor.meta.data = transformResult);
              }
            );
          } else {
            transformPromise = Promise.resolve(fileDescriptor.meta.data);
          }
        } else {
          transformPromise = transpileWithBabel();
        }

        transformationInfoObj.transformPromise = transformPromise;

        return transformationInfoObj;
      })
      .each(function moveTransformResultToInfoObj(transformationInfoObj) {
        transformationInfoObj.transformPromise = transformationInfoObj.transformPromise.then(
          function moveResult(transformResult) {
            transformationInfoObj.transformResult = transformResult;
            return transformResult;
          }
        );
      })
      .each(function logResultOfTransformation(transformationInfoObj) {
        transformationInfoObj.transformPromise = transformationInfoObj.transformPromise.then(
          transformed => {
            grunt.verbose.ok(
              `File "${chalk.cyan(
                transformationInfoObj.sourceFilePath
              )}" transformed.`
            );
            reconcileCache();
            return transformed;
          },
          err => {
            grunt.log.error(
              `Transformation of file "${chalk.cyan(
                transformationInfoObj.sourceFilePath
              )}" failed.`
            );
            grunt.log.errorlns(stripAnsi(err.message));
            reconcileCache();
            return Promise.reject(err);
          }
        );
      });
  }

  function buildTransformInfo(transformResults) {
    const withMap = [];
    const withoutMap = [];

    transformResults.forEach(transformResult =>
      (transformResult.map ? withMap : withoutMap).push(transformResult)
    );

    return Promise.resolve({
      withMapCount: withMap.length,
      allFilesHaveMap: withMap.length === transformResults.length,
      withoutMapCount: withoutMap.length,
      allFilesDoNotHaveMap: withoutMap.length === transformResults.length,
      transformResults,
      transformResultCount: transformResults.length
    });
  }

  function validateMapPresence(transformInfo) {
    const {
      allFilesHaveMap,
      allFilesDoNotHaveMap,
      withMapCount,
      withoutMapCount,
      transformResultCount
    } = transformInfo;

    const allFilesAreEqual = allFilesHaveMap || allFilesDoNotHaveMap;

    if (!allFilesAreEqual) {
      grunt.log.errorlns(
        `Not all files are the same, "${withMapCount}" have source map and "${withoutMapCount}" don't have.
  All ${transformResultCount} files need to either have or don't source maps configured.`
      );
    }

    // All files need to have source map or none of them
    return allFilesAreEqual
      ? Promise.resolve(transformInfo)
      : Promise.reject(transformInfo);
  }

  async function concatenateFilesWithSourceMap(transformResults) {
    const concatenated = new SourceNode();

    for (let i = 0; i < transformResults.length; i++) {
      const transformResult = transformResults[i];

      if (i > 0) {
        // Put each item in a separate line
        concatenated.add(grunt.util.linefeed);
      }

      const sourceMapJSON = await new SourceMapConsumer(transformResult.map);
      concatenated.add(
        SourceNode.fromStringWithSourceMap(transformResult.code, sourceMapJSON)
      );
    }

    return concatenated;
  }

  async function writeDestinationFileWithMap(
    destinationFilePath,
    transformResults
  ) {
    const destinationFileName = path.basename(destinationFilePath);

    let concatenated = await concatenateFilesWithSourceMap(transformResults);
    concatenated.add(
      `${grunt.util.linefeed}//# sourceMappingURL=${destinationFileName}.map`
    );
    concatenated = concatenated.toStringWithSourceMap({
      file: destinationFileName
    });
    grunt.file.write(destinationFilePath, concatenated.code);
    let sourceMapJSON = JSON.parse(concatenated.map.toString());
    // Reorder source map properties to make it readable
    sourceMapJSON = {
      version: sourceMapJSON.version,
      file: sourceMapJSON.file,
      sourceRoot: sourceMapJSON.sourceRoot,
      sources: sourceMapJSON.sources,
      names: sourceMapJSON.names,
      sourcesContent: sourceMapJSON.sourcesContent,
      mappings: sourceMapJSON.mappings
    };
    grunt.file.write(
      `${destinationFilePath}.map`,
      JSON.stringify(sourceMapJSON, null, 4)
    );
  }

  function writeDestinationFile(destinationFilePath, transformResults) {
    const code = transformResults
      .map(_.property("code"))
      .join(grunt.util.linefeed);
    grunt.file.write(destinationFilePath, code);
    return Promise.resolve();
  }

  const TASK_NAME = "babel_multi_files";
  const TASK_DESCRIPTION =
    "Grunt plugin to enable the transpilation of multiple javascript files using babel into a single " +
    "destiny file or multiple destiny files.";

  function executeBabelMultiFiles() {
    // Force task into async mode and grab a handle to the 'done' function.
    const done = this.async();

    const taskOptions = grunt.config.get("babel_multi_files").options || {};
    const targetOptions = _.merge({}, this.options());

    const taskConfig = _.merge(
      _.cloneDeep(taskOptions),
      {
        taskOptions: {
          cache: false
        }
      },
      targetOptions
    );
    delete taskConfig.filename;
    delete taskConfig.filenameRelative;
    taskConfig.caller = Object.assign(
      {
        name: TASK_NAME
      },
      taskConfig.caller
    );

    if (taskConfig.taskOptions.cache) {
      assert.equal(
        this.files.length,
        1,
        `The use of cache is restricted to a single output file per target configuration`
      );
    }

    // Iterate over all specified file groups.
    const filePromises = this.files.map(filePair => {
      const destinationFilePath = unixifyPath(filePair.dest);

      //#region chain
      const sourcePathsTransformationChain = makeTransformationChain({
        taskData: this.data,
        taskConfig,
        sourcePaths: filePair.src,
        destinationFilePath
      });
      //#endregion

      // Execute method chain
      const transformationInfoObjects = sourcePathsTransformationChain.value();
      if (transformationInfoObjects.length === 0) {
        grunt.log.warn(
          `Destination "${chalk.cyan(
            destinationFilePath
          )}" not written because src files were empty.`
        );
        return Promise.resolve({ destinationFilePath });
      }

      const transformationPromises = transformationInfoObjects.map(
        transformationInfoObj => transformationInfoObj.transformPromise
      );
      return Promise.all(transformationPromises)
        .then(buildTransformInfo)
        .then(validateMapPresence)
        .then(function allSourceFilesHaveBeenTransformed(transformInfo) {
          const writeDestFile = transformInfo.allFilesHaveMap
            ? writeDestinationFileWithMap
            : writeDestinationFile;
          return writeDestFile(
            destinationFilePath,
            transformInfo.transformResults
          ).then(() => Object.assign(transformInfo, { destinationFilePath }));
        })
        .then(
          result => {
            grunt.log.ok(`File "${chalk.cyan(destinationFilePath)}" created.`);
            return result;
          },
          err => {
            grunt.log.error(
              `File "${chalk.cyan(
                destinationFilePath
              )}" was ${chalk.white.bgRed.bold("not")} created.`
            );
            return Promise.reject(err);
          }
        );
    });

    const reflectedPromises = filePromises.map(reflect);
    Promise.all(reflectedPromises).then(destinationWriteResults => {
      const {
        filesCreatedCount,
        filesNotCreatedCount
      } = destinationWriteResults.reduce(
        (accumulated, reflectedPromise) => {
          accumulated[
            reflectedPromise.wasFulfilled
              ? "filesCreatedCount"
              : "filesNotCreatedCount"
          ] += 1;
          return accumulated;
        },
        {
          filesCreatedCount: 0,
          filesNotCreatedCount: 0
        }
      );

      if (filesCreatedCount) {
        grunt.log.ok(
          `${filesCreatedCount} ${grunt.util.pluralize(
            filesCreatedCount,
            "file/files"
          )} created.`
        );
      }
      if (filesNotCreatedCount) {
        grunt.log.ok(
          `${filesNotCreatedCount} ${grunt.util.pluralize(
            filesNotCreatedCount,
            "file/files"
          )} ${grunt.util.pluralize(
            filesNotCreatedCount,
            "was/were"
          )} ${chalk.white.bgRed.bold("not")} created.`
        );
      }
      done();
    });
  }

  grunt.registerMultiTask(TASK_NAME, TASK_DESCRIPTION, executeBabelMultiFiles);
};
