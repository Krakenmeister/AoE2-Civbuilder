#!/bin/bash

shopt -s extglob
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR 2>&1 >/dev/null
find . -not -name "README.md" -and -not -name "cleanup.sh" -and -not -name "nuke.sh" -not -newermt '-2 hours' -delete
cd - 2>&1 >/dev/null
echo "Cleaned up files!"
