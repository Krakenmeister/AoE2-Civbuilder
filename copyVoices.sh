#!/bin/bash

prefixes=("b" "ff" "g" "te" "j" "c" "l" "f" "a" "t" "v" "m" "ga" "s" "z" "my" "hu" "k" "it" "id" "in" "ma" "sla" "po" "et" "ml" "rb" "kh" "mly" "bu" "vn" "bg" "ta" "cu" "li" "brg" "si" "pl" "bo")

modfolder=$1
shift

count=0
for i in "$@"
do
	for FILE in /var/www/krakenmeister.com/civbuilder/public/voicefiles/${prefixes[count]}v*.wem
	do
#		echo $FILE
		dest=${FILE#"/var/www/krakenmeister.com/civbuilder/public/voicefiles/"}
		dest="/var/www/krakenmeister.com/civbuilder/public/voicefiles/${prefixes[i]}${dest#${prefixes[count]}}"
#		echo $dest
		if [ -f "$dest" ]; then
			newdest=${FILE#"/var/www/krakenmeister.com/civbuilder/public/voicefiles/"}
#			echo "$dest"
#			echo "${modfolder}/${newdest}"
#			echo "--------"
			cp "$dest" "${modfolder}/${newdest}"
		else
			newdest=${FILE#"/var/www/krakenmeister.com/civbuilder/public/voicefiles/"}
			dest="${dest//[234]/1}"
			if [ -f "$dest" ]; then
#				echo "$dest"
#				echo "${modfolder}/${newdest}"
#				echo "----------"
				cp "$dest" "${modfolder}/${newdest}"
			fi
		fi
	done
	count=$((count+1))
done
