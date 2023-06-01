
enable_testing()

find_package(Check REQUIRED)

include_directories(${CHECK_INCLUDE_DIRS})

set(LIBS ${LIBS} ${CHECK_LIBRARIES})

include_directories(. ..)
add_executable(check_pcrio check_pcrio.c ../pcrio.c)
target_link_libraries(check_pcrio ${LIBS})

add_test(check_pcrio ${CMAKE_CURRENT_BINARY_DIR}/check_pcrio)

message(STATUS ${CMAKE_CURRENT_BINARY_DIR}/check_pcrio)
