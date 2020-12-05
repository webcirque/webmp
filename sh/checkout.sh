#!~/usr/bin/bash
# Pack all locales
bash packLocales.sh
bash getLocales.sh
# Pack compressed files
cd ..
tree -iFf | grep -i ".bz2" | grep -v "LICENSE" > ./conf/decompress.txt
cd sh
exit
