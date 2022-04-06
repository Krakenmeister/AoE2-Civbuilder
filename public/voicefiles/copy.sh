#!/bin/bash

prefixes=("b" "ff" "g" "te" "j" "c" "l" "f" "a" "t" "v" "m" "ga" "s" "z" "my" "hu" "k" "it" "id" "in" "ma" "sla" "po" "et" "ml" "rb" "kh" "mly" "bu" "vn" "bg" "ta" "cu" "li")
male=("vmb" "vmfo" "vmh" "vml" "vmm" "vmm1" "vms1" "vmmm1" "vmma1" "vma" "vmr" "vmfi" "vmfa")
female=("vfm1" "vfs1" "vfa" "vfb" "vffa" "vffi" "vffo" "vfh" "vfl" "vfm" "vfr")

for i in "${prefixes[@]}"
do
	for j in "${female[@]}"
	do
		if [ ! -f "${i}${j}.wem" ]
		then
			cp "${i}vfs1.wem" "${i}${j}.wem"
		fi
	done
done
