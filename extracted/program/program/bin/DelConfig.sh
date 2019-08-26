# Delete /config and shutdown eth0
killall -9 daemon 1>/dev/null 2>&1
killall -9 thttpd 1>/dev/null 2>&1
sleep 3
killall -9 iwareserver   1>/dev/null 2>&1
killall -9 mwareserver   1>/dev/null 2>&1
rm -fr /config
rm -fr /tmp/mmcblk0p1/
rm -fr /mnt/nand/log/
ifconfig eth0 down
