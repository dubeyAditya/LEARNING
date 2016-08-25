var fs = require("fs");
function makeTree(path, parent_name, node_name, node_children) {
    function createNode(nodeName) {
        var nodeObject = {};
        nodeObject[node_name] = nodeName;
        nodeObject.type = "folder";
        nodeObject[node_children] = [];
        return nodeObject;
    }
    function generateTree(path, currentObject) {
        var stats = fs.statSync(path);
        if (stats.isDirectory()) {
            var files = fs.readdirSync(path);
            for (var index = 0; index < files.length; index++) {
                var newNode = createNode(files[index])
                currentObject[node_children].push(newNode);
                generateTree(path + "/" + files[index], newNode);
            }
        }
        else if (stats.isFile()) {
            delete currentObject[node_children];
            currentObject.type = "file";
        }
        return currentObject;
    }
    return JSON.stringify(generateTree(path, createNode(parent_name)),4);
};

module.exports = makeTree;



