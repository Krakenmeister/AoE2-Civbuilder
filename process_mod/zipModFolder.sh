#!/bin/bash

#arg1 = draft id
#arg2 = make ui mod

if [[ $4 -eq 0 ]]
then
    rm -f ./modding/requested_mods/$1.zip
    cd ./modding/requested_mods/$1/$1-data
    zip -r ../$1-data.zip resources -qq
    cd ..
    mv ./$1-data/thumbnail.jpg ./thumbnail.jpg
    zip ../$1.zip $1-data.zip thumbnail.jpg -qq
    cd ..
    rm -r $1
    cd ..
    cd ..
else
    rm -f ./modding/requested_mods/$1.zip
    cd ./modding/requested_mods/$1/$1-data
    zip -r ../$1-data.zip resources -qq
    cd ..
    cd $1-ui
    zip -r ../$1-ui.zip resources widgetui -qq
    cd ..
    mv ./$1-ui/thumbnail.jpg ./thumbnail.jpg
    zip ../$1.zip $1-data.zip $1-ui.zip thumbnail.jpg -qq
    cd ..
    rm -r $1
    cd ..
    cd ..
fi


