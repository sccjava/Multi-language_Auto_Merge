// This script is used to merge new added translation strings to exist strings.xml in Android project

const fs = require('fs');
const readline = require('readline');

if (process.argv.length < 4) {
    console.log("Usage: node " + __filename + " newTranslationStringDirectory existiOSStringDirectory");
    process.exit(-1);
}

let newTranslationStringDirectory = process.argv[2];
let existiOSStringDirectory = process.argv[3];

console.log("newTranslationStringDirectory is " + newTranslationStringDirectory);
console.log("existiOSStringDirectory is " + existiOSStringDirectory);

mergeFile(newTranslationStringDirectory, existiOSStringDirectory);


function mergeFile(srcDir, dstDir){
    fs.readdir(srcDir, function(err, items) {
        if(err)throw err;
        for (var i=0; i<items.length; i++) {
            var path = srcDir +"/" + items[i];
            if(fs.lstatSync(path).isDirectory() && path.indexOf('.lproj') > 0 ){
                var params = new Object();
                params.srcFile = dstDir + "/" + items[i] + "/Localizable.strings";
                params.mergeFile = path + "/Localizable.strings";
                params.newSrcFileContext = '';
                params.keyConflict = false;
                readSrcFile(params);
            }else{
                console.log("Skipped " + path);
            }
        }
    });
}


function readSrcFile(params) {
    console.log(params);
    const rl = readline.createInterface({
        input: fs.createReadStream(params.srcFile),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        if(line){
            params.newSrcFileContext += line + "\n";
        }else{
            params.newSrcFileContext += "\n";
        }
    });

    rl.on('close', () =>{
        readMergeFile(params);
    });
}

function isExist(params, line){
    var start = line.indexOf('"');
    var end = line.indexOf('"', start + 1);
    var key = line.substring(start + 1, end);
    if(params.newSrcFileContext.indexOf(key) > 0){
        console.log("Exist key " + key + ", in " + params.srcFile);
        params.keyConflict = true;
        return true;
    }
    return false;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}


function escape(str){
	var start1 = str.indexOf('"');
    var start2 = str.indexOf('"', start1 + 1);
    var startIndex = str.indexOf('"', start2 + 1);;
    var endIndex = str.indexOf('";', startIndex);
    var content = str.substring(startIndex + 1, endIndex);
    content = content.replaceAll('"', '\\"');
	content = content.replaceAll('\\\\\\\\', '\\');
    var newStr = str.substring(0, startIndex + 1) + content + str.substring(endIndex, str.length);
    return newStr;
}

function readMergeFile(params) {
    const rl = readline.createInterface({
        input: fs.createReadStream(params.mergeFile),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        if(line){
            if((line.trim().indexOf('"') == 0)){
                if(!isExist(params, line)){
                    params.newSrcFileContext += escape(line.trim()) + "\n";
                }
            }
        }
    });

    rl.on('close', () =>{
        if(params.keyConflict){
            console.log("please resole above key conflict first");
            process.exit(1);
        }else{
            fs.writeFile(params.srcFile, params.newSrcFileContext, function(err){
                if(err) throw err;
                console.log("merge file success, new file is " + params.srcFile);
            });
        }
    });
}

