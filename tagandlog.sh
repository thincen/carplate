#!/bin/bash

OUTPUT="./public/changelog.md"
NEWTAG=$1
TAG=$(git tag --sort=-taggerdate|head -n1)
echo $TAG
if [ -n ${NEWTAG} ];then
	git tag ${NEWTAG}
fi

echo "## "${NEWTAG}" ($(git log -1 --date=short --format=%ad))" >> ${OUTPUT}
echo "">>${OUTPUT}

# 到上一个tag的所有log
LOGSCOMMAND="git log ${TAG}.. --format=%s "
if [ -n ${TAG} ];then
	LOGSCOMMAND="git log --format=%s "
fi
FEATURES=$(${LOGSCOMMAND} | grep -E "^feat.*: ") 
if [ ${#FEATURES} -gt 0 ];then
	echo "### Features" >> ${OUTPUT}
	echo "">>${OUTPUT}
	${LOGSCOMMAND} | grep -E "^feat.*: " | sed -E 's/^feat.*: /- /gmi' >> ${OUTPUT}
	echo "">>${OUTPUT}
fi

FIX=$(${LOGSCOMMAND} | grep -E "^fix.*: ")
if [ -n "${FIX}" ];then
	echo "### Fixed" >>${OUTPUT}
	echo "">>${OUTPUT}
	${LOGSCOMMAND} | grep -E "^fix.*: " | sed -E 's/^fix.*: /- /gmi' >>${OUTPUT}
	echo "">>${OUTPUT}
fi

git add ${OUTPUT}
git commit --amend -m "$(${LOGSCOMMAND} |head -n1)"
