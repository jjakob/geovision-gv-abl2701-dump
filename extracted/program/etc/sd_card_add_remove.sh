#!/bin/sh

if [ -z $ACTION ];then
   ACTION=add
fi

if [ $ACTION = "remove" ];then
   sync

   umount /mnt/sdcard
   rm /mnt/sdcard -rf

else   
   MNT=$(/bin/mount | grep "mmcblk0")

   if [ -e /dev/mmcblk0 -a "$MNT" = "" ];then
       mkdir -p /mnt/sdcard
       /bin/mount -tvfat /dev/mmcblk0p1 /mnt/sdcard
       if [ $? -ne 0 ];then      
           /bin/mount -tvfat /dev/mmcblk0 /mnt/sdcard
       fi
   fi

fi
