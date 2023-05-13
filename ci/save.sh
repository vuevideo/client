#!/bin/bash

docker image prune -f

if test -f images.txt; then
    rm images.txt
fi

docker image list --format "{{ .Repository }}:{{ .Tag }}" >> images.txt


IMAGES_TO_BACKUP=`grep "$(cat ignore.txt)" -wv ./images.txt`
IMAGES_TO_BACKUP=`echo $IMAGES_TO_BACKUP | sed ':a;N;$!ba;s/\n/ /g'`

echo $IMAGES_TO_BACKUP

docker save $IMAGES_TO_BACKUP | gzip > ~/.images.tar.gz