#!/bin/bash

for FILE in *1*
do
	i=2
	while [ $i -ne 7 ]
	do
		dest="${FILE//1/${i}}"
		if [ ! -f "${dest}" ]
		then
			cp "${FILE}" "${dest}"
		fi
		i=$((i+1))
	done
done
