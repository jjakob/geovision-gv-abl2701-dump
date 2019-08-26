#!/bin/sh
# Program:
#       This program gathers log in autotest or ess process.
# History:
# 2012-12-11  00496  First release
# 2015-11-24  02361  For all devices

#start|stop
if [ $1 == "start" ]; then
	echo "gatherlog.sh start" 1>/dev/null 2>&1
elif [ $1 == "stop" ]; then
  echo "gatherlog.sh stop" 1>/dev/null 2>&1
  kill -9 $(ps | grep 'gatherlog.sh' | grep -v 'grep' | awk '{print $1}')
  exit 0
else
  #echo $"Usage: $0 {start|stop}"  
  exit 0
fi

SRC_LOG_PATH=/var/log/
DES_LOG_PATH=/config/log/

DES_LOG0_PATH=drv/
DES_LOG1_PATH=mware/
DES_LOG2_PATH=iware/
DES_LOG3_PATH=message/


GATHER_LOG0=drvlogset.tgz
GATHER_LOG1=mwarelogset.tgz
GATHER_LOG2=iwarelogset.tgz
GATHER_LOG3=messagelogset.tgz

LOG0=MW_DRV01.log
LOG1=MW_MWARE01.log
LOG2=MW_IWARE01.log
LOG3=messages

LOGALL=*.log
TARALL=*.tgz
MESSAGE=*messages

#num of log each tar
LOGFILENUM=20
#max num of tar
TARFILENUM=32

#limit the size of log 
LIMITLOGSIZE=300
#limit the size of tar
LIMITTARSIZE=500 

#make DES_LOG_PATH
mkdir ${DES_LOG_PATH} -p
mkdir ${DES_LOG_PATH}${DES_LOG0_PATH} -p
mkdir ${DES_LOG_PATH}${DES_LOG1_PATH} -p
mkdir ${DES_LOG_PATH}${DES_LOG2_PATH} -p
mkdir ${DES_LOG_PATH}${DES_LOG3_PATH} -p

#forever check   
for sitenu in $(seq 1 99999)

do

#echo gatherlog.sh runing ${sitenu} minutes

INCFLAG=FALSE

DATE=$(date +%Y-%m-%d-%H-%M-%S)

#check MW_DRV01.log exist;mv
if [ -e "${SRC_LOG_PATH}${LOG0}" ]; then
      cd ${DES_LOG_PATH}${DES_LOG0_PATH}
      SIZEOFDRVER=`df /config|grep /config|awk -F "[ ]+" '{print int($4)}'`
	  
      if [ ${LIMITLOGSIZE} -ge ${SIZEOFDRVER} ]; then
          LINENUM=`ls -rlc|sed -n "1p"|awk -F "[ ]+" '{print($1=="total")?int(2):int(1)}'`
	      OLDDRVLOGFILE=`ls -rlc|sed -n "${LINENUM}p"|awk -F "[ ]+" '{print $9}'`
          rm ${OLDDRVLOGFILE}
      fi
	  mv ${SRC_LOG_PATH}${LOG0} ${DES_LOG_PATH}${DES_LOG0_PATH}${DATE}_${LOG0} 1>/dev/null 2>&1
    
    #check need tar num of logall >= LOGFILENUM
		NumOfLog0=$(ls -al ${DES_LOG_PATH}${DES_LOG0_PATH}${LOGALL} | wc -l)
	
		if [ ${NumOfLog0} -ge ${LOGFILENUM} ]; then
		   SIZEOFDRVER=`df /config|grep /config|awk -F "[ ]+" '{print int($4)}'`
		   if [ ${LIMITTARSIZE} -ge ${SIZEOFDRVER} ]; then
		       LINENUM=`ls -rlc|sed -n "1p"|awk -F "[ ]+" '{print($1=="total")?int(2):int(1)}'`
	           OLDMESTARFILE=`ls -rlc|sed -n "${LINENUM}p"|awk -F "[ ]+" '{print $9}'`
		       rm ${OLDMESTARFILE}
		   fi
		   tar czf ${DES_LOG_PATH}${DES_LOG0_PATH}${DATE}_${GATHER_LOG0} ${LOGALL}
		   rm ${LOGALL}
		   INCFLAG=TRUE
		fi
fi

#check MW_MWARE01.log exist;mv
if [ -e "${SRC_LOG_PATH}${LOG1}" ]; then
	  cd ${DES_LOG_PATH}${DES_LOG1_PATH}
	  SIZEOFMWARE=`df /config|grep /config|awk -F "[ ]+" '{print int($4)}'`
	  
	  if [ ${LIMITLOGSIZE} -ge ${SIZEOFMWARE} ]; then
		  LINENUM=`ls -rlc|sed -n "1p"|awk -F "[ ]+" '{print($1=="total")?int(2):int(1)}'`
	      OLDMWLOGFILE=`ls -rlc|sed -n "${LINENUM}p"|awk -F "[ ]+" '{print $9}'`
		  rm ${OLDMWLOGFILE}
      fi
      mv ${SRC_LOG_PATH}${LOG1} ${DES_LOG_PATH}${DES_LOG1_PATH}${DATE}_${LOG1} 1>/dev/null 2>&1
    
    #check need tar num of logall >= LOGFILENUM
		NumOfLOG1=$(ls -al ${DES_LOG_PATH}${DES_LOG1_PATH}${LOGALL} | wc -l)
		
		if [ ${NumOfLOG1} -ge ${LOGFILENUM} ]; then
		   SIZEOFMWARE=`df /config|grep /config|awk -F "[ ]+" '{print int($4)}'`
		   
		   if [ ${LIMITTARSIZE} -ge ${SIZEOFMWARE} ]; then
		       LINENUM=`ls -rlc|sed -n "1p"|awk -F "[ ]+" '{print($1=="total")?int(2):int(1)}'`
	           OLDMWTARFILE=`ls -rlc|sed -n "${LINENUM}p"|awk -F "[ ]+" '{print $9}'`
		       rm ${OLDMWTARFILE}
		   fi
		   tar czf ${DES_LOG_PATH}${DES_LOG1_PATH}${DATE}_${GATHER_LOG1} ${LOGALL}
		   rm ${LOGALL}
		   INCFLAG=TRUE
		fi
fi

#check MW_IWARE01.log exist;mv
if [ -e "${SRC_LOG_PATH}${LOG2}" ]; then
	  cd ${DES_LOG_PATH}${DES_LOG2_PATH}
	  SIZEOFIWARE=`df /config|grep /config|awk -F "[ ]+" '{print int($4)}'`
	  
      if [ ${LIMITLOGSIZE} -ge ${SIZEOFIWARE} ]; then
	      LINENUM=`ls -rlc|sed -n "1p"|awk -F "[ ]+" '{print($1=="total")?int(2):int(1)}'`
	      OLDIWLOGFILE=`ls -rlc|sed -n "${LINENUM}p"|awk -F "[ ]+" '{print $9}'`
          rm ${OLDIWLOGFILE}
      fi
      mv ${SRC_LOG_PATH}${LOG2} ${DES_LOG_PATH}${DES_LOG2_PATH}${DATE}_${LOG2} 1>/dev/null 2>&1
    
    #check need tar num of logall >= LOGFILENUM
		NumOfLOG2=$(ls -al ${DES_LOG_PATH}${DES_LOG2_PATH}${LOGALL} | wc -l)
		
        if [ ${NumOfLOG2} -ge ${LOGFILENUM} ]; then
           SIZEOFIWARE=`df /config|grep /config|awk -F "[ ]+" '{print int($4)}'`
           if [ ${LIMITTARSIZE} -ge ${SIZEOFIWARE} ]; then
               LINENUM=`ls -rlc|sed -n "1p"|awk -F "[ ]+" '{print($1=="total")?int(2):int(1)}'`
	           OLDIWTARFILE=`ls -rlc|sed -n "${LINENUM}p"|awk -F "[ ]+" '{print $9}'`
               rm ${OLDIWTARFILE}
           fi
           tar czf ${DES_LOG_PATH}${DES_LOG2_PATH}${DATE}_${GATHER_LOG2} ${LOGALL}
           rm ${LOGALL}
           INCFLAG=TRUE
		fi
fi

#check message exist;mv
if [ -e "${SRC_LOG_PATH}${LOG3}" ]; then
	  cd ${DES_LOG_PATH}${DES_LOG3_PATH}
	  SIZEOFMES=`df /config|grep /config|awk -F "[ ]+" '{print int($4)}'`
	  
	  if [ ${LIMITLOGSIZE} -ge ${SIZEOFMES} ]; then
		  LINENUM=`ls -rlc|sed -n "1p"|awk -F "[ ]+" '{print($1=="total")?int(2):int(1)}'`
	      OLDMESLOGFILE=`ls -rlc|sed -n "${LINENUM}p"|awk -F "[ ]+" '{print $9}'`
		  rm ${OLDMESLOGFILE}
      fi
      mv ${SRC_LOG_PATH}${LOG3} ${DES_LOG_PATH}${DES_LOG3_PATH}${DATE}_${LOG3} 
 
        #check need tar num of logall >= LOGFILENUM
        NumOfLOG3=$(ls -al ${DES_LOG_PATH}${DES_LOG3_PATH}${MESSAGE} | wc -l)

        if [ ${NumOfLOG3} -ge ${LOGFILENUM} ]; then
           SIZEOFMES=`df /config|grep /config|awk -F "[ ]+" '{print int($4)}'`
           if [ ${LIMITTARSIZE} -ge ${SIZEOFMES} ]; then
               LINENUM=`ls -rlc|sed -n "1p"|awk -F "[ ]+" '{print($1=="total")?int(2):int(1)}'`
	           OLDMESTARFILE=`ls -rlc|sed -n "${LINENUM}p"|awk -F "[ ]+" '{print $9}'`
               rm ${OLDMESTARFILE}
            fi
           tar czf ${DES_LOG_PATH}${DES_LOG3_PATH}${DATE}_${GATHER_LOG3} ${MESSAGE}
           rm ${MESSAGE}
           INCFLAG=TRUE
		fi
fi

#check filesize overflow /config
if [ ${INCFLAG} == "TRUE" ]; then
	  cd ${DES_LOG_PATH}${DES_LOG0_PATH}
		NumOfTar0=$(ls -al ${DES_LOG_PATH}${DES_LOG0_PATH}${TARALL} | wc -l) 1>/dev/null 2>&1
		cd ${DES_LOG_PATH}${DES_LOG1_PATH}
		NumOfTar1=$(ls -al ${DES_LOG_PATH}${DES_LOG1_PATH}${TARALL} | wc -l) 1>/dev/null 2>&1
		cd ${DES_LOG_PATH}${DES_LOG2_PATH}
		NumOfTar2=$(ls -al ${DES_LOG_PATH}${DES_LOG2_PATH}${TARALL} | wc -l) 1>/dev/null 2>&1
		cd ${DES_LOG_PATH}${DES_LOG3_PATH}
		NumOfTar3=$(ls -al ${DES_LOG_PATH}${DES_LOG3_PATH}${TARALL} | wc -l) 1>/dev/null 2>&1
		
		NumOfTars=$(($NumOfTar0+$NumOfTar1+$NumOfTar2+$NumOfTar3))
		
#		echo ${NumOfTars}
		if [ ${NumOfTars} -ge ${TARFILENUM} ]; then
			  exit 0
		fi
fi

#scan interval (:sec)
sleep 60

done                                     