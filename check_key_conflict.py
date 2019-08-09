#!/usr/bin/python3

import sys
import os
import xml.etree.ElementTree as ET


def checkKeyConflict(srcXml, dstXml):
    srcXmlTree = ET.parse(srcXml)
    dstXmlTree = ET.parse(dstXml)

    srcKeySet = set()
    dstKeySet = set()
    conflictCnt = 0

    root = srcXmlTree.getroot()
    for child in root:
        if child.tag == 'string' and 'name' in child.attrib:
            key = child.attrib['name']
            if key in srcKeySet:
                print("Error: Src XML has duplicated key ", key)
                conflictCnt += 1
            else:
                srcKeySet.add(key)

    root = dstXmlTree.getroot()
    for child in root:
        if child.tag == 'string' and 'name' in child.attrib:
            key = child.attrib['name']
            if key in dstKeySet:
                print("Error: Dst XML has duplicated key ", key)
                conflictCnt += 1
            else:
                dstKeySet.add(key)

    for key in srcKeySet:
        if key in dstKeySet:
            print("Error: Key conflict, " + key)
            conflictCnt += 1

    if conflictCnt > 0:
        print('Error: you have ' + str(conflictCnt) + ' conflict(s) to be resolved!')
    else:
        print('Great, you have no conflict, please go ahead to merge it into your Androd project!')


def main():
    if len(sys.argv) <= 2:
        print("Usage: python3 " + os.path.basename(__file__) + " excelFileFullPath   your/android/project/src/main/res/")
        exit(-1)

    excelFileFullPath = sys.argv[1]
    dstAndroidDir = sys.argv[2]
    if not os.path.exists(excelFileFullPath) or not os.path.exists(dstAndroidDir):
        print(' excel file or android directory not exist')
        exit(-1)

    outPath = 'out'
    os.system('rm -rf ' + outPath)

    # generate locallization xml file by excel
    os.system('python ./python/LocalizableBack.py -f ' + excelFileFullPath + ' -t ' + outPath)

    srcXml = outPath + '/android/values/strings.xml'
    dstXml = dstAndroidDir + '/values/strings.xml'
    if not os.path.exists(srcXml) or not os.path.exists(dstXml):
        print('please check these files', srcXml, dstXml)
        exit(-1)

    checkKeyConflict(srcXml, dstXml)


if __name__ == '__main__':
    main()
