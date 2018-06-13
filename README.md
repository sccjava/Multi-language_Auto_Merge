Forks from https://github.com/CatchZeng/Localizable.strings2Excel

This script is used to merge new added translation strings to exist Android/iOS project
 1. Convert excel to strings.xml(Android) or Localizable.strings(iOS)
 2. Call merge script to merge strings to exist Android/iOS project


Usage:
1. Check excel(going to translate) strings whether already translated on your exist project by executing below script(Only support on Android).  
   ./check_key_conflict.sh xxx/xxx.xlsx xxx/app/src/main/res

2. If detected excel(going to translate) has strings conflict, remove duplicated strings from excel.
   If you confirm need to translate again, remove exist key on your project manually.

3. Confirm your translated excel column filled with correct country code, Android's country code can refer to https://github.com/championswimmer/android-locales

4. After solve all of conflicts, execute below script to merge strings to project automatically.  
   ./multi_language_audo_merge.sh android xxx/xxx.xlsx xxx/app/src/main/res