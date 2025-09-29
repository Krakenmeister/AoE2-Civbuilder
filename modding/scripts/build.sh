#! /bin/bash

# run this script from the modding directory: ./scripts/build.sh
# It will build the entire project for production

set -e
mkdir -p build
cmake -S . -B build -DSTATIC_COMPILE=TRUE
cmake --build build
