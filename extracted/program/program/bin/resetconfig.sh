#! /bin/sh
ResetConfig()
{
	# config path
	CONFA=/config/config_a.xml
	DEFAULT=/config/default_cfg.xml
	OLDCOVER=/config/3dcover
	COVER=/config/3DCover
	OLDPRESET=/config/PresetPosition
	PRESET=/config/PtzPresetPosition
	ROLLINGOSD=/config/marquee.txt
	PNGLOGOOSD=/config/logo.png
	BMPLOGOOSD=/config/logo.bmp

	# reserve IP config
	SL=`grep \<Network\> $CONFA -n | awk -F ':' '{print $1}'`
	EL=`grep \<\/Network\> $CONFA -n | awk -F ':' '{print $1}'`
	# 在<Network>节点中找到<Net0>子节点
	SLx=`sed -n $SL,${EL}p $CONFA | grep \<Net0\> -n  | awk -F ':' '{print $1}'`
	SLx=`expr $SLx + $SL - 1`
	ELx=`sed -n $SL,${EL}p $CONFA | grep \<\/Net0\> -n  | awk -F ':' '{print $1}'`
	ELx=`expr $ELx + $SL - 1`
	IPAcquireMode=`sed -n $SLx,$ELx's/<IPAcquireMode>\(.*\)<\/IPAcquireMode>/\1/p' $CONFA|sed s/[[:space:]]//g`
	IPAddr=`sed -n $SLx,$ELx's/<IPAddr>\(.*\)<\/IPAddr>/\1/p' $CONFA|sed s/[[:space:]]//g`
	NetMask=`sed -n $SLx,$ELx's/<NetMask>\(.*\)<\/NetMask>/\1/p' $CONFA|sed s/[[:space:]]//g`
	GateWay=`sed -n $SLx,$ELx's/<GateWay>\(.*\)<\/GateWay>/\1/p' $CONFA|sed s/[[:space:]]//g`
	MTU=`sed -n $SLx,$ELx's/<MTU>\(.*\)<\/MTU>/\1/p' $CONFA|sed s/[[:space:]]//g`

	echo reserve IP config,Mode:$IPAcquireMode,IpAddr:$IPAddr,NetMask:$NetMask,GateWay:$GateWay,MTU:$MTU,SL:$SL,EL:$EL,SLx:$SLx,ELx:$ELx

	# reserve pppoe config
	SL=`grep \<PPPOE\> $CONFA -n | awk -F ':' '{print $1}'`
	EL=`grep \<\/PPPOE\> $CONFA -n | awk -F ':' '{print $1}'`
	PPPOEUserName=`sed -n $SL,$EL's/<PPPOEUserName>\(.*\)<\/PPPOEUserName>/\1/p' $CONFA|sed s/[[:space:]]//g`
	PPPOEPassword=`sed -n $SL,$EL's/<PPPOEPassword>\(.*\)<\/PPPOEPassword>/\1/p' $CONFA|sed s/[[:space:]]//g`

	echo reserve pppoe config,PPPOEUserName:$PPPOEUserName

	# reset config
	cp $DEFAULT $CONFA

	# change IP config
	if [ -z "$IPAcquireMode" -o -z "$IPAddr" -o -z "$NetMask" -o -z "$GateWay" -o -z "$MTU" ]; then
		echo there is empty IP param! Mode:$IPAcquireMode,IpAddr:$IPAddr,NetMask:$NetMask,GateWay:$GateWay,MTU:$MTU. IP config will not be saved!
	else
		SL=`grep \<Network\> $CONFA -n | awk -F ':' '{print $1}'`
		EL=`grep \<\/Network\> $CONFA -n | awk -F ':' '{print $1}'`
		sed -i $SL,$EL's/<IPAcquireMode>.*</<IPAcquireMode>'"$IPAcquireMode"'</g' $CONFA
		sed -i $SL,$EL's/<IPAddr>.*</<IPAddr>'"$IPAddr"'</g' $CONFA
		sed -i $SL,$EL's/<NetMask>.*</<NetMask>'"$NetMask"'</g' $CONFA
		sed -i $SL,$EL's/<GateWay>.*</<GateWay>'"$GateWay"'</g' $CONFA
		sed -i $SL,$EL's/<MTU>.*</<MTU>'"$MTU"'</g' $CONFA
	fi

	# change pppoe config
	if [ -z "$PPPOEUserName" -o -z "$PPPOEPassword" ]; then
		echo there is empty pppoe param! UserName:$PPPOEUserName,Password:$PPPOEPassword. pppoe config will not be saved!
	else
		SL=`grep \<PPPOE\> $CONFA -n | awk -F ':' '{print $1}'`
		EL=`grep \<\/PPPOE\> $CONFA -n | awk -F ':' '{print $1}'`
		sed -i $SL,$EL's/<PPPOEUserName>.*</<PPPOEUserName>'"$PPPOEUserName"'</g' $CONFA
		sed -i $SL,$EL's/<PPPOEPassword>.*</<PPPOEPassword>'"$PPPOEPassword"'</g' $CONFA
	fi

	rm $OLDCOVER $COVER $OLDPRESET $PRESET $ROLLINGOSD $PNGLOGOOSD $BMPLOGOOSD -rf

	cfgtool
	# reboot
	echo Reset config done,need reboot!
	reboot
}

RmConfigDir()
{
	rm /config/* -rf
	
	# reboot
	echo Resume factory, need reboot!
	reboot
}

if [ 0 = $# ]; then
	ResetConfig
elif [ "-c" = $1 -a 1 = $# ]; then
	RmConfigDir
else 
	echo the param error!!! Param Only Support -c
	echo -c means resume factory
fi

