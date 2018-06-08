var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));
projectId = qs["url"]
projectId = projectId.replace("://scratch.mit.edu/projects/", "").replace("https", "").replace("http", "");
projectId = parseInt(projectId);
if (isNaN(projectId)) {
    var myCodeMirror = CodeMirror(document.body, {
        value: "ERROR: INVALID URL",
        mode: "javascript"
    });
}
var myCodeMirror
window.onload = function() {
    fetch("https://cdn.projects.scratch.mit.edu/internalapi/project/" + projectId + "/get/")
        .then(function(response) {
            response.text().then(function(text) {
                myCodeMirror = CodeMirror(codemirroreditor, {
                    value: JSON.stringify(JSON.parse(text),null, 2),
                    mode: {
                        name: "javascript",
                        json: true
                    },
                });
                myCodeMirror.setSize("100%", "100%")
            });
        })
}
