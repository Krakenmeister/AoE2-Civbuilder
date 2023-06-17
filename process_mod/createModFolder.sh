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
cd $2-data

cat > ./info.json << EOF
{"Author":"Krakenmeister","Description":"Created at www.krakenmeister.com/civdrafter. Replaces existing civilizations with entirely overhauled ones, created randomly or through a multiplayer drafting process","Title":"Custom Civilizations Mod [ID]=$2"}
EOF

cp "$3/public/img/thumbnail.jpg" ./

mkdir resources
cd resources
mkdir _common
cd _common
if [[ $4 -eq 1 ]]
then
    mkdir wpfg
    cd wpfg
    mkdir resources
    cd resources
    mkdir civ_techtree
    mkdir civ_emblems
    mkdir uniticons
    cd ..
    cd ..
fi
mkdir dat
cd dat
cp "$3/public/vanillaFiles/empires2_x2_p1.dat" ./

cd ..
cd ..
cd ..
cd ..

if [[ $4 -eq 0 ]]
then
    exit
fi

cd $2-ui

cat > ./info.json << EOF
{"Author":"Krakenmeister","Description":"Text and images mod to accompany data mod of the same ID","Title":"Custom Civilizations UI [ID]=$2"}
EOF

cp "$3/public/img/thumbnail.jpg" ./

mkdir resources
cd resources
mkdir _common
cd _common
mkdir ai
mkdir drs
cd drs
mkdir sounds
cd ..
mkdir wpfg
cd wpfg
mkdir resources
cd resources
mkdir civ_emblems
cd civ_emblems
cp -r "$3/public/img/civ_emblems/." ./
cd ..
mkdir uniticons
mkdir civ_techtree
cd ..
cd ..
cd ..
mkdir br
cd br
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir de
cd de
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir es
cd es
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir fr
cd fr
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir hi
cd hi
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir it
cd it
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir jp
cd jp
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir ko
cd ko
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir ms
cd ms
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir mx
cd mx
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir ru
cd ru
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir tr
cd tr
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir tw
cd tw
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir vi
cd vi
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir zh
cd zh
mkdir strings
cd strings
mkdir key-value
cd ..
cd ..
mkdir en
cd en
mkdir strings
cd strings
mkdir key-value
cd key-value
touch key-value-modded-strings-utf8.txt
cd ..
cd ..
cd ..
cd ..
mkdir widgetui
cd widgetui
mkdir textures
cd textures
mkdir ingame
cd ingame
mkdir icons
cd icons
mkdir civ_techtree_buttons
cd ..
cd ..
mkdir menu
cd menu
mkdir civs
cd ..
cd ..
cd ..
cd ..
cd ..
