// This script is used to merge new added translation strings to exist strings.xml in Android project

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
    fs.readdir(srcDir, function(err, items) {
        if(err)throw err;
        for (var i=0; i<items.length; i++) {
            var path = srcDir +"/" + items[i];
            if(fs.lstatSync(path).isDirectory() && path.indexOf('values-') > 0 ){
                var params = new Object();
                params.srcFile = dstDir + "/" + items[i] + "/strings.xml";
                params.mergeFile = path + "/strings.xml";
                params.newSrcFileContext = '';
                params.endFileTag = '';
                readSrcFile(params);
            }else{
                console.log("Skipped " + path);
            }
        }
    });
}


function readSrcFile(params) {
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

function readMergeFile(params) {
    const rl = readline.createInterface({
        input: fs.createReadStream(params.mergeFile),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        if(line){
            if((line.trim().indexOf('<string') == 0)){
                params.newSrcFileContext += line.trim() + "\n";
            }
        }
    });

    rl.on('close', () =>{
        params.newSrcFileContext += params.endFileTag;
        fs.writeFile(params.srcFile, params.newSrcFileContext, function(err){
            if(err) throw err;
            console.log("merge file success, new file is " + params.srcFile);
        });
    });
}

