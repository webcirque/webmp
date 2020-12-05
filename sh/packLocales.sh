#!~/usr/bin/bash
cd ../_locales
mkdir zh
mkdir zh_TW
mkdir zh_HK
mkdir zh_SG
mv -f ./zh_Hans/* ./zh
mv -f ./zh_Hant/* ./zh_TW
mv -f ./zh_Hant_HK/* ./zh_HK
mv -f ./zh_Hans_SG/* ./zh_SG
rm -rf zh_Hans
rm -rf zh_Hant
rm -rf zh_Hant_HK
rm -rf zh_Hans_SG
exit
