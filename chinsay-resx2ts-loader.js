"use strict";
const loaderUtils = require("loader-utils");
//var addTypeScriptFile = require('add-typescript-file-to-project');
var fs = require('fs');
var mkpath = require('mkpath');
var search = require('recursive-search');
var xml2js = require('xml2js');

function loader(contents) {
  //const callback = this.async();
  const options = loaderUtils.getOptions(this);
  if (options.typeScriptResourcesNamespace === undefined || options.typeScriptResourcesNamespace === '') {
      throw new Error("Missing typeScriptResourcesNamespace option");
  }
  if (options.virtualResxFolder === undefined || options.virtualResxFolder === '') {
      throw new Error("Missing virtualResxFolder option");
  }
  if (options.virtualTypeScriptFolder === undefined || options.virtualTypeScriptFolder === '') {
      throw new Error("Missing virtualTypeScriptFolder option");
  }
  if (options.virtualJsonFolder === undefined || options.virtualJsonFolder === '') {
      throw new Error("Missing virtualJsonFolder option");
  }
  options.typeScriptResourcesNamespace, options.virtualResxFolder, options.virtualTypeScriptFolder
  executeLoader(contents, options);
  return "";
}

function executeLoader(contents, options) {
  executeResxToTs(options.typeScriptResourcesNamespace, options.virtualResxFolder, options.virtualTypeScriptFolder);
  executeResxToJson(options.virtualResxFolder, options.virtualJsonFolder, "");
}

function executeResxToTs(typeScriptResourcesNamespace, virtualResxFolder, virtualTypeScriptFolder) {
    var files = getFilesFromFolder(virtualResxFolder);
    if (files !== undefined && files !== null) {
        for (var i = 0, length_1 = files.length; i < length_1; i++) {
            var resxFilename = files[i];
            convertResxToTypeScriptModel(resxFilename, typeScriptResourcesNamespace, virtualTypeScriptFolder);
        }
    }
}

function executeResxToJson(virtualResxFolder, virtualJsonFolder, fileNameLanguage) {
    var files = getFilesFromFolder(virtualResxFolder);
    if (files !== undefined && files !== null) {
        for (var i = 0, length_2 = files.length; i < length_2; i++) {
            var resxFilename = files[i];
            convertResxToJson(resxFilename, virtualJsonFolder, fileNameLanguage);
        }
    }
}

function getFilesFromFolder(virtualResxFolder) {
    var files = search.recursiveSearchSync(/.resx$/, virtualResxFolder);
    if (files !== undefined && files !== null) {
        var filesAsString = JSON.stringify(files).replace('[', "").replace(']', "");
        var splittedFiles = filesAsString.split(',');
        var cleanedFiles = splittedFiles.map(function (fileName) { return fileName.trim().replace(/"/g, "").replace(/\\\\/g, "\\"); });
        return cleanedFiles;
    }
}

function convertResxToTypeScriptModel(resxFilename, typeScriptResourcesNamespace, virtualTypeScriptFolder) {
    fs.readFile(resxFilename, function (err, data) {
        var parser = new xml2js.Parser();
        parser.parseString(data, function (err, result) {
            if (result !== undefined) {
                convertXmlToTypeScriptModelFile(result, resxFilename, typeScriptResourcesNamespace, virtualTypeScriptFolder);
            }
        });
    });
}

function convertResxToJson(resxFilename, virtualJsonFolder, fileNameLanguage) {
    fs.readFile(resxFilename, function (err, data) {
        var parser = new xml2js.Parser();
        parser.parseString(data, function (err, result) {
            if (result !== undefined) {
                convertXmlToJsonFile(result, resxFilename, virtualJsonFolder, fileNameLanguage);
            }
        });
    });
}
function convertXmlToDictionary(xmlObject) {
    var dictionary = {};
    if (xmlObject.root.data !== undefined) {
        for (var i = 0, nrOfResourcesInFile = xmlObject.root.data.length; i < nrOfResourcesInFile; i++) {
            var key = xmlObject.root.data[i].$.name; // 
            var value = xmlObject.root.data[i].value.toString();
            parseToDictionaryItem(key, value, dictionary);
        }
    }
    return dictionary;
}
function parseToDictionaryItem(key, value, dictionary) {
    if (!dictionary) {
        dictionary = {};
    }
    if (!key.length) {
        return;
    }
    var nestedKeyIndex = key.indexOf("_");
    if (nestedKeyIndex >= 0) {
        var firstKey = key.substring(0, nestedKeyIndex);
        var restKey = key.substring(nestedKeyIndex + 1);
        if (!dictionary.hasOwnProperty(firstKey)) {
            dictionary[firstKey] = {};
        }
        parseToDictionaryItem(restKey, value, dictionary[firstKey]);
    }
    else {
        dictionary[key] = value;
    }
}

function convertDictionaryToTsMapping(dictionary, nest) {
    var nestedTabs = "";
    for (var i = 0; i < nest; i++) {
        nestedTabs += "\t";
    }
    var childNestedTabs = nestedTabs + "\t";
    var result = "{\n";
    var keys = Object.keys(dictionary);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = dictionary[key];
        if (typeof value == "string") {
            result += childNestedTabs + key + ": string";
        }
        else if (typeof value == "object") {
            result += childNestedTabs + key + ": " + convertDictionaryToTsMapping(value, nest + 1);
        }
        result += ";\n";
    }
    result += nestedTabs + "}";
    return result;
}

function convertXmlToTypeScriptModelFile(xmlObject, resxFilename, typeScriptResourcesNamespace, virtualTypeScriptFolder) {
    var projectRoot = "";
    var relativeResxFilename = resxFilename.replace(projectRoot, "").replace(/\\/g, "/");
    var className = resxFilename.substr(resxFilename.lastIndexOf("\\") + 1).replace('.resx', '').replace(".", "_").replace('-', '');
    var content = '';
    content = content + '\texport interface ' + className + ' ';
    var dictionary = convertXmlToDictionary(xmlObject);
    content = content + convertDictionaryToTsMapping(dictionary, 1);
    // Write model if resources found
    if (Object.keys(dictionary).length > 0) {
        var relativeTsFilename = relativeResxFilename.replace('.resx', '.d.ts');
        var tsFileName = resxFilename.replace('.resx', '.d.ts');
        if (virtualTypeScriptFolder === undefined || virtualTypeScriptFolder === '') {
            // Write the file aside of the the resx file.
            const done = (err) =>  {
              //addTypeScriptFile.execute(tsFileName);
            }
            fs.writeFile(tsFileName, content, done);
        }
        else {
            // Write the file to the given output folder.
            var tsFileNameWithoutPath = tsFileName.substr(tsFileName.lastIndexOf('\\') + 1);
            var outputFileName = (projectRoot + virtualTypeScriptFolder + '\\' + tsFileNameWithoutPath).split('/').join('\\');
            var relativeOutputFileName = virtualTypeScriptFolder + '/' + tsFileNameWithoutPath;
            mkpath.sync(projectRoot + virtualTypeScriptFolder, '0700');
            const done = (err) =>  {
              //addTypeScriptFile.execute(relativeOutputFileName);
            }
            fs.writeFile(outputFileName, content, done);
        }
    }
}
function convertXmlToJsonFile(xmlObject, resxFilename, virtualJsonFolder, fileNameLanguage) {
  var projectRoot = "";
    var relativeResxFilename = resxFilename.replace(projectRoot, "").replace(/\\/g, "/");
    var dictionary = convertXmlToDictionary(xmlObject);
    var content = JSON.stringify(dictionary);
    // Write model if resources found
    if (Object.keys(dictionary).length > 0) {
        var relativeJsonFilename = relativeResxFilename.replace('.resx', '.json');
        var jsonFileName = resxFilename.replace('.resx', '.json');
        if (virtualJsonFolder === undefined || virtualJsonFolder === '') {
            // Write the file aside of the the resx file.
            const done = (err) =>  {
            }
            fs.writeFile(jsonFileName, content, done);
        }
        else {
            // Write the file to the given output folder.
            var jsonFileNameWithoutPath = jsonFileName.substr(jsonFileName.lastIndexOf('\\') + 1);
            if (fileNameLanguage) {
                var fileNameWithoutExtension = jsonFileNameWithoutPath.substring(0, jsonFileNameWithoutPath.indexOf(".json"));
                jsonFileNameWithoutPath = fileNameWithoutExtension + "." + fileNameLanguage + ".json";
            }
            var outputFileName = (virtualJsonFolder + '\\' + jsonFileNameWithoutPath).split('/').join('\\');
            var relativeOutputFileName = virtualJsonFolder + '/' + jsonFileNameWithoutPath;
            const done = (err) =>  {
              mkpath.sync(virtualJsonFolder, '0700');
            }
            fs.writeFile(outputFileName, content, done);
        }
    }
}
function decapitalizeFirstLetter(input) {
    return input.charAt(0).toLowerCase() + input.slice(1);
}
//# sourceMappingURL=index.js.map

module.exports = loader;