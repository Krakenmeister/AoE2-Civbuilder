#!/bin/bash

prefixes=("b" "ff" "g" "te" "j" "c" "l" "f" "a" "t" "v" "m" "ga" "s" "z" "my" "hu" "k" "it" "id" "in" "ma" "sla" "po" "et" "ml" "rb" "kh" "mly" "bu" "vn" "bg" "ta" "cu" "li" "brg" "si" "pl" "bo")

modfolder=$1
shift

count=0
for i in "$@"
do
	for FILE in /var/www/krakenmeister.com/civbuilder/public/voicefiles/${prefixes[count]}v*.wem
	do
		echo $FILE
		dest=${FILE#"/var/www/krakenmeister.com/civbuilder/public/voicefiles/"}
		src=${FILE#"/var/www/krakenmeister.com/civbuilder/public/voicefiles/"}
		src="/var/www/krakenmeister.com/civbuilder/public/voicefiles/${prefixes[i]}${src#${prefixes[count]}}"
		if [ -f "$src" ]; then
#			echo "$src"
#			echo "${modfolder}/${dest}"
#			echo "--------"
			cp "$src" "${modfolder}/${dest}"
		else
			src="${src//[23456]/1}"
			if [ -f "$src" ]; then
#				echo "$src"
#				echo "${modfolder}/${dest}"
#				echo "----------"
				cp "$src" "${modfolder}/${dest}"
			fi
		fi
	done
	count=$((count+1))
done
