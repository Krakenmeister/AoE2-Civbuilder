#!/bin/bash

#arg1 = mod folder path
#arg2 = mod folder name
#arg3 = app directory
#arg4 = create ui mod

cd $1
mkdir $2
cd $2
mkdir $2-data
if [[ $4 -eq 1 ]]
then
    mkdir $2-ui
fi

# data folder -------------------------
cd $2-data

cat > ./info.json << EOF
{"Author":"Krakenmeister","Description":"Created at www.krakenmeister.com/civdrafter. Replaces existing civilizations with entirely overhauled ones, created randomly or through a multiplayer drafting process","Title":"Custom Civilizations Mod [ID]=$2"}
EOF

cp "$3/public/img/thumbnail.jpg" ./

mkdir -p ./resources/_common
if [[ $4 -eq 1 ]]
then
    mkdir -p ./resources/_common/wpfg/resources/civ_emblems
    mkdir -p ./resources/_common/wpfg/resources/uniticons
    mkdir -p ./resources/_common/wpfg/resources/civ_techtree

fi
mkdir -p ./resources/_common/dat
cp "$3/public/vanillaFiles/empires2_x2_p1.dat" ./dat


if [[ $4 -eq 0 ]]
then
    exit
fi

cd ..

# UI folder -------------------------
cd $2-ui

cat > ./info.json << EOF
{"Author":"Krakenmeister","Description":"Text and images mod to accompany data mod of the same ID","Title":"Custom Civilizations UI [ID]=$2"}
EOF

cp "$3/public/img/thumbnail.jpg" ./

mkdir -p ./resources/_common
mkdir -p ./resources/_common/ai
mkdir -p ./resources/_common/drs/sounds
mkdir -p ./resources/_common/wpfg/resources/civ_emblems
mkdir -p ./resources/_common/wpfg/resources/uniticons
mkdir -p ./resources/_common/wpfg/resources/civ_techtree

cp -r "$3/public/img/civ_emblems/." ./resources/_common/wpfg/resources/civ_emblems


mkdir -p ./resources/br/strings/key-value
mkdir -p ./resources/de/strings/key-value
mkdir -p ./resources/es/strings/key-value
mkdir -p ./resources/fr/strings/key-value
mkdir -p ./resources/hi/strings/key-value
mkdir -p ./resources/it/strings/key-value
mkdir -p ./resources/jp/strings/key-value
mkdir -p ./resources/ko/strings/key-value
mkdir -p ./resources/ms/strings/key-value
mkdir -p ./resources/mx/strings/key-value
mkdir -p ./resources/tr/strings/key-value
mkdir -p ./resources/tw/strings/key-value
mkdir -p ./resources/vi/strings/key-value
mkdir -p ./resources/zh/strings/key-value
mkdir -p ./resources/en/strings/key-value
touch ./resources/en/strings/key-value/key-value-modded-strings-utf8.txt

mkdir -p ./widgetui/textures/ingame/icons/civ_techtree_buttons
mkdir -p ./widgetui/textures/menu/civs
