# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.22

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /home/kraken/development/civbuilder/modding

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /home/kraken/development/civbuilder/modding/build

# Include any dependencies generated for this target.
include CMakeFiles/create-data-mod.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include CMakeFiles/create-data-mod.dir/compiler_depend.make

# Include the progress variables for this target.
include CMakeFiles/create-data-mod.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/create-data-mod.dir/flags.make

CMakeFiles/create-data-mod.dir/create-data-mod.cpp.o: CMakeFiles/create-data-mod.dir/flags.make
CMakeFiles/create-data-mod.dir/create-data-mod.cpp.o: ../create-data-mod.cpp
CMakeFiles/create-data-mod.dir/create-data-mod.cpp.o: CMakeFiles/create-data-mod.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/kraken/development/civbuilder/modding/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/create-data-mod.dir/create-data-mod.cpp.o"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/create-data-mod.dir/create-data-mod.cpp.o -MF CMakeFiles/create-data-mod.dir/create-data-mod.cpp.o.d -o CMakeFiles/create-data-mod.dir/create-data-mod.cpp.o -c /home/kraken/development/civbuilder/modding/create-data-mod.cpp

CMakeFiles/create-data-mod.dir/create-data-mod.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/create-data-mod.dir/create-data-mod.cpp.i"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/kraken/development/civbuilder/modding/create-data-mod.cpp > CMakeFiles/create-data-mod.dir/create-data-mod.cpp.i

CMakeFiles/create-data-mod.dir/create-data-mod.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/create-data-mod.dir/create-data-mod.cpp.s"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/kraken/development/civbuilder/modding/create-data-mod.cpp -o CMakeFiles/create-data-mod.dir/create-data-mod.cpp.s

CMakeFiles/create-data-mod.dir/civbuilder.cpp.o: CMakeFiles/create-data-mod.dir/flags.make
CMakeFiles/create-data-mod.dir/civbuilder.cpp.o: ../civbuilder.cpp
CMakeFiles/create-data-mod.dir/civbuilder.cpp.o: CMakeFiles/create-data-mod.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/kraken/development/civbuilder/modding/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object CMakeFiles/create-data-mod.dir/civbuilder.cpp.o"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/create-data-mod.dir/civbuilder.cpp.o -MF CMakeFiles/create-data-mod.dir/civbuilder.cpp.o.d -o CMakeFiles/create-data-mod.dir/civbuilder.cpp.o -c /home/kraken/development/civbuilder/modding/civbuilder.cpp

CMakeFiles/create-data-mod.dir/civbuilder.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/create-data-mod.dir/civbuilder.cpp.i"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/kraken/development/civbuilder/modding/civbuilder.cpp > CMakeFiles/create-data-mod.dir/civbuilder.cpp.i

CMakeFiles/create-data-mod.dir/civbuilder.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/create-data-mod.dir/civbuilder.cpp.s"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/kraken/development/civbuilder/modding/civbuilder.cpp -o CMakeFiles/create-data-mod.dir/civbuilder.cpp.s

# Object files for target create-data-mod
create__data__mod_OBJECTS = \
"CMakeFiles/create-data-mod.dir/create-data-mod.cpp.o" \
"CMakeFiles/create-data-mod.dir/civbuilder.cpp.o"

# External object files for target create-data-mod
create__data__mod_EXTERNAL_OBJECTS =

create-data-mod: CMakeFiles/create-data-mod.dir/create-data-mod.cpp.o
create-data-mod: CMakeFiles/create-data-mod.dir/civbuilder.cpp.o
create-data-mod: CMakeFiles/create-data-mod.dir/build.make
create-data-mod: genieutils/libgenieutils.a
create-data-mod: /usr/lib/x86_64-linux-gnu/libboost_iostreams.a
create-data-mod: /usr/lib/x86_64-linux-gnu/libz.so
create-data-mod: /usr/lib/x86_64-linux-gnu/libc.so
create-data-mod: CMakeFiles/create-data-mod.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/home/kraken/development/civbuilder/modding/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Linking CXX executable create-data-mod"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/create-data-mod.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/create-data-mod.dir/build: create-data-mod
.PHONY : CMakeFiles/create-data-mod.dir/build

CMakeFiles/create-data-mod.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/create-data-mod.dir/cmake_clean.cmake
.PHONY : CMakeFiles/create-data-mod.dir/clean

CMakeFiles/create-data-mod.dir/depend:
	cd /home/kraken/development/civbuilder/modding/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/kraken/development/civbuilder/modding /home/kraken/development/civbuilder/modding /home/kraken/development/civbuilder/modding/build /home/kraken/development/civbuilder/modding/build /home/kraken/development/civbuilder/modding/build/CMakeFiles/create-data-mod.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/create-data-mod.dir/depend

