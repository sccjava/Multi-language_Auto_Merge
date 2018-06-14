#!/bin/bash -l

# This script is used to merge new added translation strings to exist Android/iOS project
# 1. Convert excel to strings.xml(Android) or Localizable.strings(iOS)
# 2. Call merge script to merge strings to exist Android/iOS project

platform=$1
excelFileFullPath=$2
dstStringDirectory=$3
projectHome=$(dirname "$0")
stringOutPath=$projectHome/out

if [ -z "$platform" ]; then
    echo "Usage:  ./multi_language_audo_merge.sh android|ios excelFileFullPath dstStringDirectory"
    exit 1
fi

rm -rf $stringOutPath
mkdir -p $stringOutPath

python $projectHome/python/LocalizableBack.py -f "$excelFileFullPath" -t $stringOutPath

echo "platform is $platform"
if [ $platform == "android" ]; then
	echo "merging android strings....from $stringOutPath/$platform to $dstStringDirectory"
	node $projectHome/android_merge_strings.js $stringOutPath/$platform $dstStringDirectory
fi

if [ $platform == "iOS" ]; then
	echo "merging iOS strings....from $stringOutPath/$platform to $dstStringDirectory"
	node $projectHome/iOS_merge_strings.js $stringOutPath/$platform $dstStringDirectory
fi