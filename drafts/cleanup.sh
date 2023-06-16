#!/bin/bash

shopt -s extglob
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR 2>&1 >/dev/null
rm -rv !("README.md"|"cleanup.sh")
cd - 2>&1 >/dev/null