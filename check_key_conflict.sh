#!/bin/bash -l
# Check excel key whether conflict with exist Android project

excelFileFullPath=$1
dstStringDirectory=$2
projectHome=$(dirname "$0")
stringOutPath=$projectHome/out

if [ -z "$dstStringDirectory" ]; then
    echo "Usage:  ./check_key_conflict.sh excelFileFullPath dstStringDirectory"
    exit 1
fi

rm -rf $stringOutPath
mkdir -p $stringOutPath

python $projectHome/python/LocalizableBack.py -f "$excelFileFullPath" -t $stringOutPath

node $projectHome/check_key_conflict.js $stringOutPath/android $dstStringDirectory

