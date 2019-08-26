#!/bin/sh
# Program:
#       This program starts gatherlog.sh while autotest on.
# History:
# 2012-12-11  00496  First release

AUTO_TEST_FLIE=/config/autotest.cfg

#check AUTO_TEST_FLIE exist
if [ -e "${AUTO_TEST_FLIE}" ]; then
	 sh /program/bin/gatherlog.sh start &
else
	 sh /program/bin/gatherlog.sh stop &
fi



