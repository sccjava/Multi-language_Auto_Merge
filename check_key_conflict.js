// Check excel key whether conflict with exist Android project

const fs = require('fs');
const readline = require('readline');

if (process.argv.length < 4) {
    console.log("Usage: node " + __filename + " newTranslationStringDirectory existAndroidStringDirectory");
    process.exit(-1);
}

let newTranslationStringDirectory = process.argv[2];
let existAndroidStringDirectory = process.argv[3];

console.log("newTranslationStringDirectory is " + newTranslationStringDirectory);
console.log("existAndroidStringDirectory is " + existAndroidStringDirectory);

mergeFile(newTranslationStringDirectory, existAndroidStringDirectory);


function mergeFile(srcDir, dstDir){
    var params = new Object();
    params.mergeFile = srcDir + "/values/strings.xml";

    fs.readdir(dstDir, function(err, items) {
        if(err)throw err;
        for (var i=0; i<items.length; i++) {
            var path = dstDir +"/" + items[i];
            if(fs.lstatSync(path).isDirectory() && path.indexOf('values-') > 0 ){
                params.srcFile = path + "/strings.xml";
                params.newSrcFileContext = '';
                params.endFileTag = '';
                params.keyConflictCnt = 0;
                readSrcFile(params);
                break;
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
            if(line.trim().indexOf('</resources>') != 0){
                params.newSrcFileContext += line + "\n";
            }else{
                params.endFileTag = line + "\n";
            }
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
        params.keyConflictCnt ++;
        return true;
    }
    return false;
}

function readMergeFile(params) {
    const rl = readline.createInterface({
        input: fs.createReadStream(params.mergeFile),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        if(line){
            if((line.trim().indexOf('<string') == 0)){
                if(!isExist(params, line)){
                    params.newSrcFileContext += line.trim() + "\n";
                }
            }
        }
    });

    rl.on('close', () =>{
        if(params.keyConflictCnt > 0){
            console.log("please resole above key conflict first, total conflicts is " + params.keyConflictCnt);
            process.exit(1);
        }
    });
}

