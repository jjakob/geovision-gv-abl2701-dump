cd /tmp
if [ $1 = "packlog" ]; then
    mkdir -p log/mwaretgzs/
    mkdir -p log/mwaretmp/
    cd /var/log
    for i in `ls | grep -E 'messages|\.log|\.error|\.baklog\.tgz'` ; do
        cp -af $i /tmp/log/mwaretmp/ 1>/dev/null 2>&1
        cd /tmp/log
        tar zcf mwaretgzs/$i\.tgz mwaretmp/$i 1>/dev/null 2>&1
        rm -f /tmp/log/mwaretmp/*
        cd /var/log
    done
    cd /tmp/log
    rm -rf mwaretmp/ 1>/dev/null 2>&1
    tar zcf log.tgz mwaretgzs/*.tgz 1>/dev/null 2>&1
    mv log.tgz /var/flashlog/ 1>/dev/null 2>&1
    rm -rf mwaretgzs/ 1>/dev/null 2>&1
elif [ $1 = "unpacklog" ]; then
    mkdir -p /tmp/log
    tar zxf /var/flashlog/log.tgz -C /tmp/log 1>/dev/null 2>&1
    mkdir -p log/mwaretgzs/
    cd /tmp/log
    for i in `ls mwaretgzs | grep '\.tgz'` ; do
        tar zxf mwaretgzs/$i -C /tmp/log 1>/dev/null 2>&1
        cp -af mwaretmp/* /var/log/ 1>/dev/null 2>&1
        rm -f mwaretmp/* 1>/dev/null 2>&1
    done
    rm -rf mwaretgzs/ 1>/dev/null 2>&1
    rm -rf mwaretmp/ 1>/dev/null 2>&1
fi
