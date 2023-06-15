#!/bin/bash

modfolder=$1
voiceFolder=$2
shift
shift

count=0
for i in "$@"
do
	cp -a "$voiceFolder/$i/." "$modfolder"
done
