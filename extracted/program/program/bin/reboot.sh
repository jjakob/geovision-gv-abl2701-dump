echo "System will reboot normally by software now"
#-----------新增------
cd /var/log
echo '****************************dmesg****************************' >sysinfo.log
dmesg | tail -n 500 >>sysinfo.log
echo '*****************************ps*****************************' >>sysinfo.log
ps >>sysinfo.log
echo '**************************ifconfig**************************' >>sysinfo.log
ifconfig >>sysinfo.log
echo '**********************cat /proc/meminfo**********************' >>sysinfo.log
cat /proc/meminfo  >>sysinfo.log

killall -9 daemon 1>/dev/null 2>&1
#----------63信号为自定义信号，用于收集机芯信息,仅用于A5球或A5机芯--------------
killall -63 mwareserver 1>/dev/null 2>&1 
killall -9 thttpd 1>/dev/null 2>&1
sleep 3
killall -9 mwareserver   1>/dev/null 2>&1
killall -9 iwareserver   1>/dev/null 2>&1
killall -2 avserver      1>/dev/null 2>&1
killall -9 syslogd       1>/dev/null 2>&1
cd /
rm -f /tmp/ThreadInfo\[*\].log
/tmp/bin/mwarecmd.sh packlog
sleep 5
killall -9 watchdog  1>/dev/null 2>&1


reboot -f

