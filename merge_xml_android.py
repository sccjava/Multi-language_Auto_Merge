#!/usr/bin/python3

import sys
import os

'''https://developer.android.com/guide/topics/resources/string-resource#FormattingAndStyling
  aa %@ b ->  aa %1$s b
  aa'b  --->  aa\'b
  aa"b  --->  aa\"b
'''


def escape(str):
    startIndex = str.index('>')
    endIndex = str.index('<', startIndex)
    content = str[startIndex + 1: endIndex]
    cnt = str.count('%@')
    for i in range(cnt):
        content = content.replace('%@', '%' + i + '$s', 1)
    content = content.replace('\'', '\\\'')
    content = content.replace('"', '\\"');
    content = content.replace('\\\\\\\\', '\\');
    newStr = str[0: startIndex + 1] + content + str[endIndex: len(str)];
    return newStr


def merge(srcFile, dstFile):
    file = open(srcFile, 'r')

    lines = ''
    while True:
        line = file.readline()  # this line has 3 spaces
        if not line:
            break
        if line.find('<string') >= 0:
            line = escape(line.strip()) + '\n'
            lines += '    ' + line  # add 4 spaces
    file.close()

    if lines != '':
        # remove </resources>
        os.system('awk "!/<\/resources>/" ' + dstFile + ' > tmp && mv tmp ' + dstFile)
        # append strings to new file
        os.system(' echo \'' + lines + '</resources>\' >> ' + dstFile)
        print('Merge success ' + srcFile)


def checkDir(srcDir, dstDir):
    for dir in os.listdir(srcDir):
        if dir == 'values' or dir.index('values') == -1:  # skip english
            continue
        srcFile = srcDir + '/' + dir + '/strings.xml'
        dstFile = dstDir + '/' + dir + '/strings.xml'
        if not os.path.exists(srcFile) or not os.path.exists(dstFile):
            print('Error: file not exist, ', srcFile, dstFile)
            continue
        merge(srcFile, dstFile)


def main():
    if len(sys.argv) <= 1:
        print("Usage: python3 " + os.path.basename(__file__) + "  your/android/project/xxx/src/main/res/")
        exit(-1)

    dstAndroidDir = sys.argv[1]
    if not os.path.exists(dstAndroidDir):
        print('android directory not exist')
        exit(-1)

    outPath = 'out'
    if not os.path.exists(outPath):
        print('Please run check_key_conflict.py to check conflicts first')
        exit(-1)

    srcDir = outPath + '/android/'
    checkDir(srcDir, dstAndroidDir)


if __name__ == '__main__':
    main()
