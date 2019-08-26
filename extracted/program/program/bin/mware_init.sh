if [ ! -f "/program/bin/iwareserver" ]; then
	UV_BOARD_NAME=$(cat /proc/driver/boardname)
	cd /
	mkdir -p /var/lib/
	mkdir -p /var/run/
	mkdir -p /etc/iscsi
	mkdir -p /tmp/bin
	mkdir -p /tmp/custom
	ln -sf /program/bin/update_move /tmp/bin/update
	chmod a+x /tmp/bin/update  
	cp -rf /usr/sbin/nandwrite_move /tmp/bin/nandwrite
	chmod a+x /tmp/bin/nandwrite 
	cp -rf /usr/sbin/flashwrite_move /tmp/bin/flashwrite
	chmod a+x /tmp/bin/flashwrite 
	mkdir -p /tmp/update
	mkdir -p /config/flashlog     
	ln -fs /config/flashlog /var/
	ln -fs /tmp/ /var/log
	ulimit -c unlimited
	echo 1 > /proc/sys/vm/overcommit_memory
	echo "1" > /proc/sys/kernel/core_uses_pid 
	echo "/tmp/core-%e-%p-%t" > /proc/sys/kernel/core_pattern
	echo 3 4 1 3 > /proc/sys/kernel/printk
	#目前OSD结构体过大，且需要从MW通过消息队列发往IW,所以增大消息队列大小。
	echo 12288 > /proc/sys/kernel/msgmax
	if [ -f "/program/www/ActiveX/Setup_NB.exe" ]; then
	   ln -sf /program/www/ActiveX/Setup_NB.exe /tmp/Setup.exe
	fi
	if [ ! -f /program/www/ActiveX/Setup.exe ]; then
		ln -sf /tmp/Setup.exe /program/www/ActiveX/Setup.exe
	fi
	if [ ! -f /config/ca.cer ]; then
		cp /program/bin/ca.cer /config/ca.cer -f
	fi
	if [ -f /config/ca.cer ]; then
		mkdir -p /tmp/sslvpn
		chmod a+x /config/ca.cer
		ln -sf /config/ca.cer /tmp/sslvpn/ca.cer
	fi
	cp /program/bin/reboot.sh /tmp/bin/reboot.sh
	chmod a+x /tmp/bin/reboot.sh
	echo export LD_LIBRARY_PATH=/program/lib >> /etc/profile
	echo PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/bin/X11:/usr/local/bin:/usr/local/sbin:/program/bin:/tmp/bin >> /etc/profile
	source /etc/profile  1>/dev/null 2>&1
	PATH=/program/bin:$PATH
	comm_init
	cp -f /program/bin/localtime /etc/
	cp /config/localtime /etc/localtime -f  1>/dev/null 2>&1
	cp /config/TZ /etc/TZ -rf  1>/dev/null 2>&1
	cp /program/bin/mwarecmd.sh /tmp/bin/mwarecmd.sh -f
	chmod a+x /tmp/bin/mwarecmd.sh
	/tmp/bin/mwarecmd.sh unpacklog
	cp /var/flashlog/update.log /var/log/updatei.log 1>/dev/null 2>&1
	sleep 2
	cp -f /program/www/images/no_logo.png /tmp/logo.png 
	cd /program/www/images/
	rm -rf logo.png
	ln -sf /tmp/logo.png logo.png
	cfgtool
	if [ -f /config/calibration ];then
		echo "state: [1]"  > /tmp/stateofmware
	else
		rm /config/flashlog/dmesg.log
		date >> /config/flashlog/dmesg.log
		dmesg | tail -n 300 >> /config/flashlog/dmesg.log
		export LD_LIBRARY_PATH=/program/lib:$LD_LIBRARY_PATH
		ifconfig lo up
		mwareserver &
		sleep 2
		#数字机芯不需要启动maintain
		if [ -f "/program/bin/maintain" ];then 
			maintain &
		fi
		#配置文件无Mware/Demo/Daemon/Enable节点或该节点值不为0时，启动daemon
		if [ "0" != "$(sed -n '/<Demo>/,/<\/Demo>/p' /config/config_a.xml |sed -n '/<Daemon>/,/<\/Daemon>/p' | grep '<Enable>'|sed 's/\(.*\)<Enable>\(.*\)<\/Enable>\(.*\)/\2/')" ];then
			daemon /program/www/daemon.cfg &		
		fi
		if [ ! -f /config/ssl_cert.pem ]; then
			cp /program/www/ssl_cert.pem /config/ssl_cert.pem -f
		fi
		echo 0 > /proc/sys/net/ipv4/tcp_timestamps
	fi
	sh /program/bin/autotestlog.sh &
else
	cd /mnt/nand
	./init.sh

	mkdir -p /tmp/bin   
	cp -rf /program/bin/update_move /tmp/bin/update
	chmod a+x /tmp/bin/update 

	echo kill -9 `pidof watchdog` "&" > /tmp/bin/killwatchdog.sh
	echo killall -9 watchdog "&" >> /tmp/bin/killwatchdog.sh
	chmod 777 /tmp/bin/killwatchdog.sh

	cd /
	mkdir /config/flashlog
	ln -s /config/flashlog /var/

	rm -rf /update 1>/dev/null 2>&1
	mkdir /tmp/update 1>/dev/null 2>&1
	ln -sf /tmp/update/ /update 1>/dev/null 2>&1

	ulimit -c unlimited
	echo 1 > /proc/sys/vm/overcommit_memory
	echo "1" > /proc/sys/kernel/core_uses_pid 
	echo "/tmp/mmcblk0p1/core-%e-%p-%t" > /proc/sys/kernel/core_pattern
	echo 3 4 1 3 > /proc/sys/kernel/printk
	echo 4096    262142   655360 > /proc/sys/net/ipv4/tcp_wmem
	echo 4096    262142   655360 > /proc/sys/net/ipv4/tcp_rmem
	echo 12288 > /proc/sys/kernel/msgmax
	echo "262142"> /proc/sys/net/core/wmem_default
	echo 0x200000 > /proc/sys/net/core/wmem_max
	mkdir www
	rm -rf /program/www/css/*
	rm -rf /program/www/images/*
	cd /program/www/
	tar zxf /program/www/default.tgz
	ln -sf /program/www/* /www/
	if [ -f "/program/www/ActiveX/Setup_NB.exe" ]; then
	   ln -sf /program/www/ActiveX/Setup_NB.exe /tmp/Setup.exe 
	   fi
	ln -sf /tmp/Setup.exe /program/www/ActiveX/Setup.exe
	cp -f /program/www/images/no_logo.png /tmp/logo.png 
	rm /www/default.tgz
	rm /www/static1.tgz
	rm /www/static2.tgz
	rm /www/cgi-bin
	mkdir -p /www/cgi-bin
	ln -sf /program/www/cgi-bin/main.cgi /www/cgi-bin/
	ln -sf /program/www/cgi-bin/upload.cgi /www/cgi-bin/
	cp /program/www/cgi-bin/updatestatus.cgi /www/cgi-bin/
	cp /program/www/cgi-bin/update.cgi /www/cgi-bin/
	rm /www/index.htm
	rm /www/thttpd_config
	cp /program/www/index.htm /www/
	cp /program/www/thttpd_config /www/
	rm /www/images
	mkdir -p /www/images
	cp /program/www/images/* /www/images/
	cd /www/images/
	ln -sf /tmp/logo.png logo.png
	rm  -rf /www/js
	mkdir -p /www/js
	ln -sf /program/www/js/* /www/js/
	mkdir -p /tmp/custom
	ln -sf /tmp/custom /www/js/
	cd -
	cp /program/bin/reboot.sh /tmp/bin/reboot.sh
	chmod a+x /tmp/bin/reboot.sh
	source /etc/profile  1>/dev/null 2>&1

	PATH=$PATH:/program/bin/:/tmp/bin/
	export LD_LIBRARY_PATH=/program/lib
	export PATH

	echo 'export LD_LIBRARY_PATH=/program/lib' >> /etc/profile
	echo 'export PATH=$PATH:/program/bin/:/tmp/bin/' >> /etc/profile
	if [ -e /program/lib/SIMSUN.TTC ]; then
			echo "There is /program/lib/SIMSUN.TTC"
	else
			cd /program/lib/
			ln -s /mnt/nand/fonts/SIMSUN.TTC SIMSUN.TTC
	fi
	comm_init

	if [ ! -f "/program/bin/mongoose" ]; then
		cd /program/bin                             
		ln -s mongoose mongoose_https                           
		cd - 
	fi
	
	chmod a+x /program/bin/nllink.sh
	/bin/sh /program/bin/nllink.sh
	mkdir -p /imoscfg
	cp /program/server /imoscfg -rf
	cp /config/localtime /etc/localtime -df  1>/dev/null 2>&1
	cp /config/TZ /etc/TZ -rf  1>/dev/null 2>&1
	cp /program/bin/mwarecmd.sh /tmp/bin/mwarecmd.sh -f
	chmod a+x /tmp/bin/mwarecmd.sh
	/tmp/bin/mwarecmd.sh unpacklog
	cp /var/flashlog/update.log /var/log/update.log 1>/dev/null 2>&1
	#rm /config/update.sh
	syslogd
	avserver &
	sleep 2
	#rm & after cfgtool, makesure mwareserver can get xml file of VVD73663
	cfgtool                                                                                                                    
	insmod /lib/modules/2.6.37/extra/kmultisend.ko
	rm /config/flashlog/dmesg.log
	date >> /config/flashlog/dmesg.log
	dmesg | tail -n 300 >> /config/flashlog/dmesg.log
	iwareserver &
	sleep 2
	mwareserver &
	sleep 2
	maintain &
	#配置文件无Mware/Demo/Daemon/Enable节点或该节点值不为0时，启动daemon
	if [ "0" != "$(sed -n '/<Demo>/,/<\/Demo>/p' /config/config_a.xml |sed -n '/<Daemon>/,/<\/Daemon>/p' | grep '<Enable>'|sed 's/\(.*\)<Enable>\(.*\)<\/Enable>\(.*\)/\2/')" ];then
		daemon /program/www/daemon.cfg &
	fi
	if [ ! -f /config/ssl_cert.pem ]; then
	cp /program/www/ssl_cert.pem /config/ssl_cert.pem -f
	fi
	echo 0 > /proc/sys/net/ipv4/tcp_timestamps
	sh /program/bin/autotestlog.sh &              

fi
