#!~/bin/bash
cd ../_locales
mkdir zh_CN
mkdir zh_TW
mkdir zh_HK
mv -f ./zh_Hans/* ./zh_CN
mv -f ./zh_Hant/* ./zh_TW
mv -f ./zh_Hant_HK/* ./zh_HK
rm -rf zh_Hans
rm -rf zh_Hant
rm -rf zh_Hant_HK
exit
