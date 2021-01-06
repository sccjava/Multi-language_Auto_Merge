Forks from https://github.com/CatchZeng/Localizable.strings2Excel

This script is used to merge new added translation strings to exist Android/iOS project
 1. Convert excel to strings.xml(Android) or Localizable.strings(iOS)
 2. Call merge script to merge strings to exist Android/iOS project


Preconditions:
1. cd xlrd-1.0.0 && python setup.py install
2. cd pyexcelerator-0.6.4.1 && python setup.py install

Usage:
0. If you only just need to genereate xml files from excel:
   python ./python/LocalizableBack.py -f xx.xlsx -t out_path

1. Check excel(going to translate) strings whether already translated on your exist project by executing below script(Only support on Android).  
   python3   check_key_conflict.py   xx/xx.xlsx   your/android/project/xx/app/src/main/res

2. If detected excel(going to translate) has strings conflict, remove duplicated strings from excel.
   If you confirm need to translate again, remove exist key on your project manually.

3. Confirm your translated excel column filled with correct country code, Android's country code can refer to https://github.com/championswimmer/android-locales

4. After solving all of conflicts, execute below script to merge strings to project automatically.  
   Android:  python3 merge_xml_android.py  your/android/project/xxx/app/src/main/res
   iOS:      ./merge_xml_iOS.sh excelFileFullPath dstStringDirectory