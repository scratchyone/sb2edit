//Script by MegaApuTurkUltra, modified by scratchyone
/*
The MIT License (MIT)

Copyright (c) 2016 MegaApuTurkUltra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
var projectId = qs["url"];
projectId = projectId.replace("://scratch.mit.edu/projects/", "").replace("https", "").replace("http", "");
projectId = parseInt(projectId);
if (isNaN(projectId)) {
    alert("INVALID ID")
}


var maxWidth = 0;
var jszip = null;
var project = null;
var id = null;
var soundId = 0;
var costumeId = 0;
var soundsToDownload = [];
var costumesToDownload = [];
var totalAssets = 0;
var completeAssets = 0;

function startDownload(projectId) {
    logMessage("Downloading project: " + projectId);
    soundId = 0;
    costumeId = 0;
    totalAssets = 0;
    completeAssets = 0;
    soundsToDownload = [];
    costumesToDownload = [];
    id = projectId;
    setProgress(0);
    jszip = new JSZip();
    jszip.comment = "Created with MegaApuTurkUltra's Project Downloader";
    $.get("https://cdn.projects.scratch.mit.edu/internalapi/project/" + projectId + "/get/", function(dataa) {
        data = JSON.parse(myCodeMirror.getValue());
        setProgress(10);
        logMessage("Loaded JSON");
        project = data;
        processSoundsAndCostumes(project);
        if (project.hasOwnProperty("children")) {
            for (child in project.children) {
                processSoundsAndCostumes(project.children[child]);
            }
        }
        logMessage("Found " + totalAssets + " assets");
        jszip.file("project.json", JSON.stringify(project, null, "\t"));
        downloadCostume();
    }).fail(perror);
}

function downloadCostume() {
    if (costumesToDownload.length > 0) {
        var current = costumesToDownload.pop();
        logMessage("Loading asset " + current.costumeName + " (" + completeAssets + "/" + totalAssets + ")");
        JSZipUtils.getBinaryContent(
            "https://cdn.assets.scratch.mit.edu/internalapi/asset/" + current.baseLayerMD5 + "/get/",
            function(err, data) {
                if (err) {
                    error();
                    return;
                }
                var ext = current.baseLayerMD5.match(/\.[a-zA-Z0-9]+/)[0];
                jszip.file(current.baseLayerID + ext, data, {
                    binary: true
                });
                completeAssets++;
                setProgress(10 + 89 * (completeAssets / totalAssets));
                downloadCostume();
            });
    } else {
        downloadSound();
    }
}

function downloadSound() {
    if (soundsToDownload.length > 0) {
        var current = soundsToDownload.pop();
        logMessage("Loading asset " + current.soundName + " (" + completeAssets + "/" + totalAssets + ")");
        JSZipUtils.getBinaryContent(
            "https://cdn.assets.scratch.mit.edu/internalapi/asset/" + current.md5 + "/get/",
            function(err, data) {
                if (err) {
                    error();
                    return;
                }
                var ext = current.md5.match(/\.[a-zA-Z0-9]+/)[0];
                jszip.file(current.soundID + ext, data, {
                    binary: true
                });
                completeAssets++;
                setProgress(10 + 89 * (completeAssets / totalAssets));
                downloadSound();
            });
    } else {
        logMessage("Loading project title...");
        $.get("https://scratch.mit.edu/api/v1/project/" + id + "/?format=json", function(data) {
            logMessage("Generating ZIP...");
            var content = jszip.generate({
                type: "blob"
            });
            logMessage("Saving...");
            try {
                saveAs(content, data.title + ".sb2");
            } catch (e) {
                saveAs(content, "project.sb2");
            }
            logMessage("Complete");
            psuccess();
        }).fail(function() {
            logMessage("Failed to load project title");
            logMessage("Generating ZIP...");
            var content = jszip.generate({
                type: "blob"
            });
            logMessage("Saving...");
            saveAs(content, "project.sb2");
            logMessage("Complete");
            psuccess();
        });
    }
}

function processSoundsAndCostumes(node) {
    if (node.hasOwnProperty("costumes")) {
        for (var i = 0; i < node.costumes.length; i++) {
            var current = node.costumes[i];
            current.baseLayerID = costumeId;
            costumeId++;
            totalAssets++;
            costumesToDownload.push(current);
        }
    }
    if (node.hasOwnProperty("sounds")) {
        for (var i = 0; i < node.sounds.length; i++) {
            var current = node.sounds[i];
            current.soundID = soundId;
            soundId++;
            totalAssets++;
            soundsToDownload.push(current);
        }
    }
}

function perror() {

}

function psuccess() {

}

function setProgress(perc) {

}

function reset() {

}

function logMessage(msg) {}
