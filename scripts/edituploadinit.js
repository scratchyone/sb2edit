var myCodeMirror
var zips

function readSingleFile(e) {
    var file = document.getElementById("file-input").files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        var zip = new JSZip();
        //console.log(contents)
        zip.loadAsync(contents).then(function(zip) {
            console.log("Unzipped!")
                // you now have every files contained in the loaded zip
            zip.file("project.json").async("string").catch(function(reason) {
                console.log(reason)
                    // rejection
            }).then(function(text) {
                textt = JSON.parse(text)
                myCodeMirror = CodeMirror(codemirroreditor, {
                    value: JSON.stringify(textt,null, 2),
                    mode: {
                        name: "javascript",
                        json: true
                    },
                });
                myCodeMirror.setSize("100%", "100%")
            })
        });


    };
    reader.readAsBinaryString(file);
}
window.onload = function() {

}

function startDownload() {
    var file = document.getElementById("file-input").files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        var zip = new JSZip();
        //console.log(contents)
        zip.loadAsync(contents).then(function(zip) {
            console.log("Unzipped!")
            zip.file("project.json", myCodeMirror.getValue());
            zip.generateAsync({
                    type: "blob"
                })
                .then(function(content) {
                    // see FileSaver.js
                    download(content, sb2name);
                });
        });
    }
    var sb2name = file.name;
    reader.readAsBinaryString(file);
}
