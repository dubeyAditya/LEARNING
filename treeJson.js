var fs = require("fs");
var _ = require("underscore");
var pathModule = require("path");
function makeTree(directoryPath, parentName, nodeName, nodeChildren, exclude, allowedExtensions) {
    var excluded_nodes = exclude ? exclude : [];
    var allowed_extensions = allowedExtensions ? allowedExtensions : [];
    var path = directoryPath ? directoryPath : "";
    if (!path)
        throw new Error("Invalid file Name or got undefined");
    else {
        var pathArray = directoryPath.split("/");
        var parentSplitIndex = pathArray.lastIndexOf("/");
        var parent_name = parentName ? [] : pathArray.splice(parentSplitIndex+1, 1)[0];
        var node_name = nodeName ? nodeName : "parent_node";
        var node_children = nodeChildren ? nodeChildren : "child_nodes";
        function createNode(nodeName) {
            var nodeObject = {};
            nodeObject[node_name] = nodeName;
            nodeObject.type = "folder";
            nodeObject[node_children] = [];
            return nodeObject;
        }
        function generateTree(path, currentObject, previousObject) {
            var stats = fs.statSync(path);
            if (stats.isDirectory()) {
                var files = fs.readdirSync(path);
                for (var index = 0; index < files.length; index++) {
                    if (!_.includes(excluded_nodes, files[index])) {
                        var newNode = createNode(files[index]);
                        currentObject[node_children].push(newNode);
                        generateTree(path + "/" + files[index], newNode, currentObject);
                    }
                }
            }
            else if (stats.isFile()) {
                if (_.includes(allowed_extensions, pathModule.extname(currentObject[node_name]))) {
                    delete currentObject[node_children];
                    currentObject.type = "file";
                }
                else
                {
                    var indexOFexludedFile =  previousObject[node_children].indexOf(currentObject);
                    previousObject[node_children].splice(indexOFexludedFile,1);
                }
            }
            return currentObject;
        }
        return JSON.stringify(generateTree(path, createNode(parent_name), null), 4);
    }
};

module.exports = makeTree;



