#!/bin/bash

modfolder=$1
voiceFolder=$2
shift
shift

count=0
for i in "$@"
do
	echo $i
	cp -a "$voiceFolder/$i/." "$modfolder"
# 	for FILE in /var/www/krakenmeister.com/civbuilder/public/voicefiles/${prefixes[count]}v*.wem
# 	do
# #		echo $FILE
# 		dest=${FILE#"/var/www/krakenmeister.com/civbuilder/public/voicefiles/"}
# 		src=${FILE#"/var/www/krakenmeister.com/civbuilder/public/voicefiles/"}
# 		src="/var/www/krakenmeister.com/civbuilder/public/voicefiles/${prefixes[i]}${src#${prefixes[count]}}"
# 		if [ -f "$src" ]; then
# #			echo "$src"
# #			echo "${modfolder}/${dest}"
# #			echo "--------"
# 			cp "$src" "${modfolder}/${dest}"
# 		else
# 			src="${src//[23456]/1}"
# 			if [ -f "$src" ]; then
# #				echo "$src"
# #				echo "${modfolder}/${dest}"
# #				echo "----------"
# 				cp "$src" "${modfolder}/${dest}"
# 			fi
# 		fi
# 	done
# 	count=$((count+1))
done
