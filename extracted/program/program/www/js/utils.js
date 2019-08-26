
/**
 * 获取Top窗口
 * 
 * @return Window
 */
function GetTopWindow()
{
    var topWindow = window;

    try
    {
        while((topWindow.frameElement) && ("banner" != topWindow.frameElement.name))
        {
            topWindow = topWindow.parent;
        }
    }
    catch(e)
    {}

    return topWindow.parent;
}

var top = GetTopWindow();

/*******************************************************************************
 * MD5 加密算法 （该部分代码之后会被删除，暂时放这不再做特别的维护）
 *
 ******************************************************************************/
var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode */

/*
 * These are the functions you'll usually want to call They take string
 * arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }

/* Backwards compatibility - same as hex_md5() */
function calcMD5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for(var i = 0; i < x.length; i += 16)
    {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;

        a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
        d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i+ 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
        d = md5_ff(d, a, b, c, x[i+ 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i+ 8], 7 , 1770035416);
        d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i+12], 7 , 1804603682);
        d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i+15], 22, 1236535329);

        a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
        d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
        c = md5_gg(c, d, a, b, x[i+11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
        d = md5_gg(d, a, b, c, x[i+10], 9 , 38016083);
        c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i+ 9], 5 , 568446438);
        d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
        c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i+ 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
        d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
        c = md5_gg(c, d, a, b, x[i+ 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

        a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
        d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i+11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
        d = md5_hh(d, a, b, c, x[i+ 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i+13], 4 , 681279174);
        d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i+ 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
        d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i+15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

        a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
        d = md5_ii(d, a, b, c, x[i+ 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i+12], 6 , 1700485571);
        d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i+ 8], 6 , 1873313359);
        d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i+13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
        d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i+ 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
    var bkey = str2binl(key);
    if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally to
 * work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
    return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words If chrsz is ASCII,
 * characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < str.length * chrsz; i += chrsz)
    {
        bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
    }
    return bin;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i++)
    {
        str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((i%4)*8 )) & 0xF);
    }
    return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i += 3)
    {
        var triplet = (((binarray[i >> 2] >> 8 * ( i %4)) & 0xFF) << 16)
            | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
            | ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
        for(var j = 0; j < 4; j++)
        {
            if(i * 8 + j * 6 > binarray.length * 32)
            {
                str += b64pad;
            }
            else
            {
                str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
            }
        }
    }
    return str;
}

/**
 * 解码
 *
 * @param Str
 *            需要解码的字符串
 * @return string
 */
var base64encodechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64decodechars = [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, 
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, 
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];

/**
 * base64编码
 * @param {Object} str
 */
function base64encode(str){
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64encodechars.charAt(c1 >> 2);
            out += base64encodechars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64encodechars.charAt(c1 >> 2);
            out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64encodechars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64encodechars.charAt(c1 >> 2);
        out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64encodechars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64encodechars.charAt(c3 & 0x3F);
        }
    return out;
}

function base64decode(str) { 
    var c1, c2, c3, c4; 
    var i, len, out; 

    len = str.length; 
    i = 0; 
    out = ""; 
    while (i < len) { 

        do { 
            c1 = base64decodechars[str.charCodeAt(i++) & 0xff]; 
        } while (i < len && c1 == -1); 
        if (c1 == -1) 
            break; 

        do { 
            c2 = base64decodechars[str.charCodeAt(i++) & 0xff]; 
        } while (i < len && c2 == -1); 
        if (c2 == -1) 
            break; 

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4)); 

        do { 
            c3 = str.charCodeAt(i++) & 0xff; 
            if (c3 == 61) 
                return out; 
            c3 = base64decodechars[c3]; 
        } while (i < len && c3 == -1); 
        if (c3 == -1) 
            break; 

        out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2)); 

        do { 
            c4 = str.charCodeAt(i++) & 0xff; 
            if (c4 == 61) 
                return out; 
            c4 = base64decodechars[c4]; 
        } while (i < len && c4 == -1); 
        if (c4 == -1) 
            break; 
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4); 
    } 
    return out; 
} 
/*******************************************************************************
 * IP地址，端口相关的方法
 * 
 ******************************************************************************/


/**
 * IP地址合法性验证，格式正确，也可为空或全0
 * 
 * @param ipStr
 *            ip地址
 * @return boolean
 */
function checkIPAddrOrEmpty(ipStr)
{
    if (0 == ipStr.length)
    {
        return true;
    }

    return isIPAddress(ipStr);
}

/**
 * IP地址合法性验证，首段地址范围在[1-223]，也可为空或全0
 * 
 * @param ipStr
 *            ip地址
 * @return boolean
 */
function checkIP1To223OrEmpty(ipStr)
{
    if ((0 == ipStr.length) || ("0.0.0.0" == ipStr))
    {
        return true;
    }

    return checkIP1To223(ipStr);
}

/**
 * IP地址合法性验证，首段地址范围在[1-127),(127,223]
 * 
 * @param ipStr
 *            ip地址
 * @return boolean
 */
function checkIP1To223(ipStr)
{
    if (!isIPAddress(ipStr)) // 基本验证
    {
    return false;
    }

    var ipArray = ipStr.split(".");
    var ip1 = ipArray[0];
    if (1 > ip1 || 223 < ip1) // 第一段范围
    {
        return false;
    }
    return 127 != ip1;


}

/**
 * 组播地址合法性验证，范围在[224.0.1.0 ~ 239.255.255.255]
 * 
 * @param ipStr
 *            ip地址
 * @return boolean
 */
function checkIP224To239(ipStr)
{
    if (!isIPAddress(ipStr)) // 基本验证
    {
        return false;
    }

    var ipArray = ipStr.split(".");
    var ip1 = ipArray[0];
    if (224 > ip1 || 239 < ip1) // 第一段范围
    {
        return false;
    }
    return !((224 == ipArray[0]) && (0 == ipArray[1]) && (1 > ipArray[2]));


}

/**
 * IP地址合法性验证，格式符合0.0.0.0，且每一段均在[0-255]
 * 
 * @param ipStr
 *            ip地址
 * @return boolean
 */
function isIPAddress(ipStr)
{
    if (0 == ipStr.length)
        return false;

    var reVal = /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9](\d)?|1\d{2}|2[0-4]\d|25[0-5])){3}$/;

    return reVal.test(ipStr);
}

/**
 * IPv6地址合法性验证
 *
 * @param strInfo
 *            ipv6地址
 * @return boolean
 */
function isIPv6Address(strInfo)
{
    return /:/.test(strInfo) && strInfo.match(/:/g).length<8 && /::/.test(strInfo)?(strInfo.match(/::/g).length==1 && /^::$|^(::)?([\da-f]{1,4}(:|::))*[\da-f]{1,4}(:|::)?$/i.test(strInfo)):/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(strInfo);
}
/**
 * 十进制转二进制（统一成8位）（主要用于将十进制IP每段值转成二进制）
 * 
 * @param num
 *            范围(0~255)
 * @return string 8位二进制值(如2->00000010)
 */
function format10To2(num)
{
    return (num + 256).toString(2).substring(1);
}

/**
 * 简单的IP地址验证(IP地址分4段，每段由1-3位的数字组成)
 * 
 * @param ipa
 * @param ips
 * @return
 */
function decomIP2(ipa,ips)
{
    var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (re.test(ips))
    {
        var d =  ips.split(".");
        for (i = 0; i <4; i++)
        {
            ipa[i].value=d[i];
            ipa[i].setAttribute("defaultValue",d[i]);
        }
        return true;
    }
    return false;
}

/*******************************************************************************
 * 常规验证方法
 * 
 ******************************************************************************/

/**
 * 用户名验证
 * 
 * @param v
 * @param m
 * @return
 */
function validUserNameCheck(v,m)
{
    var t = /[^0-9A-Za-z_\-\+\.]{1,}/;
    if (t.test(v.value))
    {
        if (m != 0)
        {
            alert(m);
        }
        v.focus();
        v.select();
        v.value = v.getAttribute("defaultValue");
        return false;
    }
    return true ;
}

/**
 * 是否为数字
 * 
 * @param v
 * @param m
 * @return
 */
function validNumCheck(v,m)
{
    var t = /^-?\d+$/;
    if (!t.test(v.value))
    {
        if (m != 0)
        {
            alert(m);
        }
        v.value=v.getAttribute("defaultValue");
        return 0;
    }
    return 1 ;
}

/**
 * 设备ID合法性检查设备ID合法性检查
 * 
 * @param f
 * @return
 */
function checkServerID(v)
{
    var t = /[^0-9A-Za-z_\-]{1,}/;
    return !t.test(v);

}

/**
 * 用户名合法性检查
 * 
 * @param f
 * @return
 */
function checkUserName(v)
{
    var t = /[^0-9A-Za-z_\-\+\.]{1,}/;
    return !t.test(v);

}

/**
 * 密码合法性检查
 * 
 * @param f
 * @return
 */
function checkPassword(v)
{
    var t = /[^0-9A-Za-z_-]{1,}/;
    return !t.test(v);

}

/**
 * 判断是否为数字
 * 
 * @param v
 * @return
 */
function validNum(v)
{
    var t = /[^0-9]{1,}/;
    return !t.test(v);

}

/**
 * 判断f.value是否是minNum到maxNum之间的正整数，如果不是则将f.getAttribute("defaultValue")赋值给f.value
 * 
 * @param f
 * @param minNum
 * @param maxNum
 * @param msg
 * @param isFloatNumber
 * @return
 */
function validNumber(f, minNum, maxNum, msg, isFloatNumber)
{
    if (!isFloatNumber) {
        if(0 == (validNumCheck(f, msg))){
            f.value = f.getAttribute("defaultValue");
            return false;
        }
        f.value = parseInt(f.value,10);// 归一化输入框数字为十进制整数
    }
    if((f.value > maxNum) ||(f.value < minNum))
    {
       if (msg != "")
       {
           alert(msg);
       }
        f.value = f.getAttribute("defaultValue");
        return false;
    }
    return true;
}

/**
 * 判断名称类型的字符串是否为空 （注：jQuery中非空判断会先把第一个空格去掉再判断，因此这里重写）
 * 
 * @param value
 *            字符串
 * @return
 */
function validStrNoNull(value)
{
    return 0 != value.length;

}

/**
 * 判断名称类型的字符串合法性 包含中文（unicode5.0标准中CJK统一汉字字符区（0x4E00-0x9FA5）的20902个汉字）、
 * （半角字符）大小写字母、数字、下划线、中划线、点号、加号、空格
 * 
 * @param value
 *            字符串
 * @return
 */
function validNameContent(value)
{
    var reg = /[\\/:*?'"<>|%&]+/;
    return !reg.test(value);
}

/**
 * 验证数字范围
 * 
 * @param obj
 *            验证对象
 * @param min
 *            最小值
 * @param max
 *            最大值
 * @param isFloatNumber
 *            是否浮点数
 * @return
 */
function validPic_Num(obj,min,max,isFloatNumber)
{
    if ("" == obj.value)
    {
        alert($.lang.tip["tipValueCanotNull"]);
        obj.value = obj.getAttribute("defaultValue");
        return false;
    }

    var tip = isFloatNumber ? $.lang.tip["tipNumFloatScopeErr"] : $.lang.tip["tipNumScopeErr"];
    return validNumber(obj, min, max, tip.replace("%s", min + "~" + max), isFloatNumber);

}

function validEmailAdress(email) {
    var  reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; 
    return reg.test(email);
}
/*******************************************************************************
 * 绘图相关
 *
 * 1、图像参数Map数据结构如下：
 *    key： 图形类型
 *    value： 图形参数数组，其下标为图形的序号（num）
 *
 *    DrawObjMap = {
 *        drawType1: [
 *          {
 *              属性1： v1,
 *              属性2： v2
 *              ...
 *          },
 *          {
 *              属性1： v1,
 *              属性2： v2
 *              ...
 *          },
 *          ...
 *        ],
 *        drawType2: [
 *          {
 *              属性1： v1,
 *              属性2： v2
 *              ...
 *          },
 *          {
 *              属性1： v1,
 *              属性2： v2
 *              ...
 *          },
 *          ...
 *        ],
 *        ...
 *    }
 *
 * 2、属性map的key必须是如下字段：
 *      FontSize                  文字大小
 *      Text                      文字内容
 *      PointX                    顶点X坐标
 *      PointY                    顶点Y坐标
 *      LineColor                 线颜色
 *      LineWidth                 线宽
 *      Direction                 方向
 *      Left                      左坐标
 *      Top                       上坐标
 *      Right                     右坐标
 *      Bottom                    下坐标
 *      Fill                      是否填充
 *      FillColor                 填充颜色
 *      LineColorIn               内侧线框颜色
 *      LineColorOut              外侧线框颜色
 *      LeftIn                    内侧线框左坐标
 *      TopIn                     内侧线框上坐标
 *      RightIn                   内侧线框右坐标
 *      BottomIn                  内侧线框下坐标
 *      LeftOut                   外侧线框左坐标
 *      TopOut                    外侧线框上坐标
 *      RightOut                  外侧线框右坐标
 *      BottomOut                 外侧线框下坐标
 *
 * 3、同种类型的图图形最多只能画20个
 * 4、图形种类请见ComScript.js中的DrawType定义
 * 5、直线的坐标传递 起点(PointX0, PointY0)和终点(PointX1, PointY1)
 * 6、矩形的坐标传递 上下左右
 * 7、多边形的坐标传递每个顶点的 X，Y坐标 (PointX0, PointY0)~(PointXn, PointYn)
 * 8、同心矩形的坐标传递 内侧线框的上下左右和外侧线框的上下左右
 * 9、颜色为0x00BBGGRR，传值，不要传字符串
 * 
 ******************************************************************************/
var DrawCount = 0; // 画图次数

/**
 * 颜色转换
 * 
 * @param color
 *            16进制的颜色字符串，如“FFCC99”
 * @return
 */
function getDrawObjColor(color) {
    var str = "",
        n;

    str += color.substring(4);
    str += color.substring(2,4);
    str += color.substring(0,2);

    return parseInt(("0x00"+str), 16);
}

/**
 * 设置图形样式
 * 
 * @param type
 *            图形类型
 * @param num
 *            图形序号
 * @param map
 *            图形参数map
 * @return
 */
function setDrawObj(type, num, map,wndId){
    var recode = 0,
        pcParam = "",
        paramMap,
        n;

    paramMap = map[type][num];
    for (n in paramMap) {
        pcParam += n + "=" + paramMap[n] +"&";
    }
    pcParam = pcParam.substring(0, pcParam.length-1);

    if ("undefined" ==  typeof wndId) {
        wndId = 0;
    }

    if (top.banner.isOldPlugin && !top.banner.isMac) {
        recode = top.sdk_viewer.ViewerAxSetDrawObj(type, num, pcParam);
    } else if (top.sdk_viewer.isInstalled) {
        recode = top.sdk_viewer.execFunctionReturnAll("NetSDKAddDrawObj", wndId, Number(type), Number(num), paramMap);
        recode = recode.code;
    }



    return (0 == recode);
}

/**
 * 选择图形
 * 
 * @param type
 *            图形类型
 * @param num
 *            图形序号
 * @return
 */
function selectDrawObj(type, num,wndId, flag){
    if ("undefined" == typeof wndId) {
        wndId = 0;
    }

    if ("undefined" == typeof flag) {
        flag = 1;
    }
    
    if (top.banner.isOldPlugin && !top.banner.isMac) {
        top.sdk_viewer.ViewerAxSelDrawObj(type, num);
    } else if(top.sdk_viewer.isInstalled) {
        top.sdk_viewer.execFunctionReturnAll("NetSDKModifyDrawObj",wndId,Number(type),Number(num),{"SelObj":Number(flag)});
    }

    

}

/**
 * 显示/隐藏图形
 * 
 * @param type
 *            图形类型
 * @param num
 *            图形序号
 * @param isShow
 *            是否显示
 * @return
 */
function showHiddenArea(type, num, isShow,wndId)
{
    if (("undefined" != typeof top.IsHiddenDrawObj) && top.IsHiddenDrawObj) {
        isShow = 0;
    }
    if ("undefined" == typeof wndId) {
        wndId = 0;
    }

    if (top.banner.isOldPlugin && !top.banner.isMac) {
        top.sdk_viewer.ViewerAxShowDrawObj(type, num, isShow);
    } else if (top.sdk_viewer.isInstalled) {
        top.sdk_viewer.execFunctionReturnAll("NetSDKModifyDrawObj", wndId, Number(type), Number(num), {"ShowObj": isShow});
    }


}

/**
 * 删除,并不真正删除对象；控件将坐标参数设置为0
 *
 * @param type
 *            图形类型
 * @param num
 *            图形序号
 * @return
 */
function delDrawObj(type, num){
    top.sdk_viewer.execFunctionReturnAll("NetSDKDelDrawObj",0,Number(type), Number(num));
}

/**
 * 修改画图对象
 *
 * @param type
 *            图形类型
 * @param num
 *            图形序号
 * @return
 */
function ModifyDrawObj(type, num,map) {
    var paramMap, recode;

    paramMap = map[type][num];
    recode = top.sdk_viewer.execFunctionReturnAll("NetSDKModifyDrawObj", 0, Number(type),Number(num), paramMap);

    return (0 == recode.code);
}

/**
 * 显示/隐藏所有图形
 * 
 * @param map
 *            图形参数map
 * @param isShow
 *            是否显示
 * @return
 */
function showHiddenAllDrawObj(map, isShow,wndId){
    var i,
        len,
        type,
        list;

    for(type in map) {
        list = map[type];

        for (i = 0, len = list.length; i < len; i++) {
            showHiddenArea(type, i, isShow,wndId);
        }
    }
}

/**
 * 设置map中的所有图形，包括类型，样式，大小，此时图形全部为隐藏
 * 
 * @param map
 *            图形参数map
 * @return
 */
function setAllDrawObjs(map,wndId){
    var pcParam,
        i,
        len,
        type,
        list;

    for(type in map) {
        list = map[type];

        for (i = 0, len = list.length; i < len; i++) {
            if(!setDrawObj(type, i, map,wndId)){
                return false;
            }
        }
    }
    return true;
}

/**
 * 初始化框体（失败则再画，最多3次） 注：调用该方法前先blockUI屏蔽界面
 * 
 * @return
 */
function initDrawObj(map, sucessCallback,wndId){
    if (setAllDrawObjs(map,wndId)) {
        $.unblockUI();
        if (sucessCallback && (sucessCallback instanceof Function)) {
            sucessCallback();
        }
        return;
    }
    var $msg = $("#msg");
    if (DrawCount < 3) {
        if(1 == DrawCount)
        {
            $msg.text($.lang.tip["tipLoading"]);
            $("div[class='blockUI blockOverlay']").css({filter: "Alpha(Opacity=30)", opacity: 0.3});
        }
        setTimeout(function(){initDrawObj(map, sucessCallback,wndId);}, 1000*(DrawCount+1));
        DrawCount++;
    } else {
        $msg.text($.lang.tip["tipLoadFaild"]);
        $msg.css("color", "red");
        DrawCount = 0;
        setTimeout(function(){$.unblockUI();}, 1000);
    }
}

/*
 * flag:启用画图功能的标志位(1:开启，1：关闭)
 **/
function EnableDrawFun(streamType, flag) {

    if (top.banner.isOldPlugin && !top.banner.isMac) {
        top.sdk_viewer.ViewerAxEnableDrawObj(streamType, flag);
    } else if (top.sdk_viewer.isInstalled) {
        top.sdk_viewer.execFunctionReturnAll("NetSDKEnableDraw", streamType, flag, flag, 1, 0, 30);//参数1：通道号；参数2：画图使能；参数3：鼠标使能；参数4：是否干预；参数5：画图方式 0：IPC，1：NVR;参数6：最大可绘制个数（默认30，主要NVR有用到该参数）
    }

}

/*******************************************************************************
 * 常用功能方法
 * 
 ******************************************************************************/
var dataMap = {};// 存放界面数据

/**
 * 解析并保存底层返回的参数。
 * 
 * @return
 */
function addCfg(window)
{
    var href = window.location.search;
    href = href.substring(1);
    if("" == href)return;
    var argumentArr = href.split("&");
    for(var i=0,len=argumentArr.length;i<len;i++)
    {
        var argument = argumentArr[i].split("=");
        dataMap[argument[0]] = argument[1];
    }
}

/**
 * 根据name获得value
 * 
 * @param n
 * @return
 */
function getCfg(n)
{
    return dataMap[n];
}

/**
 * 更新dataMap的值
 * 
 * @param n
 * @param v
 * @return
 */
function setCfg(n,v)
{
    dataMap[n] = v;
}

/**
 * 解析出url里键为strname的值
 * 
 * @param strname
 * @return
 */
function getparastr(strname, url)
{
    var hrefstr,pos,parastr,para,tempstr;
    if ("undefined" == typeof(url)) {
        hrefstr = window.location.href;
    } else {
        hrefstr = url;
    }
    pos = hrefstr.indexOf("?");
    parastr = hrefstr.substring(pos+1);
    para = parastr.split("&");
    tempstr="";
    for(i=0;i<para.length;i++)
    {
        tempstr = para[i];
        pos = tempstr.indexOf("=");
        if(tempstr.substring(0,pos) == strname)
        {
            return tempstr.substring(pos+1);
        }
    }
    return null;
}

/**
 * 屏蔽ESC键
 * 
 * @return
 */
function shieldEsc(){
    var event = getEvent();
    if(KEY_CODE.keyESC == event.keyCode)
    {
        event.keyCode = 0;
        event.returnValue = false;
    }
}

/**
 * 灰显掉各输入、选择项 灰显按钮
 * 
 * @return
 */
function disableAll()
{
    $("select").attr("disabled","disabled");
    $("input").attr("disabled","disabled");
    $("button").attr("disabled","disabled");
    $("img").attr("disabled","disabled");
    //移除span的onclick事件
    var $span = $("span");
    $span.unbind("click");
    $span.removeAttr("onclick");
}

/**
 * 恢复各输入、选择项 恢复按钮
 * 
 * @return
 */
function enableAll() 
{
    $("select").attr("disabled","");
    $("input").attr("disabled","");
    $("button").attr("disabled","");
    $("img").attr("disabled","");
}

/**
 * 給string添加方法
 *
 * @return
 */
String.prototype.trim  =  function()
{
    return  this.replace(/(^\s*)|(\s*$)/g,  "");
};
String.prototype.ltrim  =  function()
{
    return  this.replace(/(^\s*)/g,  "");
};
String.prototype.rtrim  =  function()
{
    return  this.replace(/(\s*$)/g,  "");
};

/**
 * url解码
 * 
 * @param value
 * @return
 */
function decodeUrlChar(value)
{
    if(value!=null)
    {
        value = value.replace(/\%00/g, "");// 空字串
        value = value.replace(/\%26/g, "&");
        value = value.replace(/\%3D/g, "=");
        value = value.replace(/\%23/g, "#");
        value = value.replace(/\%3F/g, "?");
        value = value.replace(/\%25/g, "%");
        value = value.replace(/\%22/g, "\"");
        value = value.replace(/\%27/g, "\'");
        value = value.replace(/\%5C/g, "\\");
    }
    return value;
}

/**
 * 给下拉框及其选项添加title
 * 
 * @param id
 *            下拉框id
 * @return
 */
function setComboxTitle(id)
{
    var opts = document.getElementById(id).options;
    var len = opts==null?0:opts.length;
    for(var i=0; i<len; i++)
    {
        var opt = opts[i];
        opt.title = opt.text;
        if(opt.selected)
        {
            document.getElementById(id).title = opt.text;
        }
    }
}

/**
 * 加载语言文件
 */
function loadlanguageFile(language)
{
    var langSrc="js/" ,
        isChangPath = true;//标志位，判断路径是否改变

    if (language == LANG_TYPE.Chinese || language == LANG_TYPE.English) {
        langSrc += supportLangList[language]["fileName"];
    } else if (LANG_TYPE.CustomLang == language) {
        langSrc="js/custom/custom_lang.js";
    } else if (language > 1) {
        langSrc += "custom/";
        langSrc += supportLangList[language]["fileName"];
        $.ajaxSettings.async = false;
        $.get(langSrc + "?date="+new Date().getTime(), function(){
                isChangPath = false;
            });
        $.ajaxSettings.async = true;
        if(isChangPath == true){
            langSrc=langSrc.replace("custom/", "");
        }
    } 
    $("head").append("<script type='text/javascript' id='langScript' src='" + langSrc + "'></script>");
}

/**
 * 渲染语言内容
 * 
 * @return
 */
function initLang()
{
    $("lang").each(function(){
        var $this = $(this),
             html,
             name = $this.attr("name"),
             parent = $this.parent("td");
        if("" != name) {
            $this.after($.lang.pub[name]);
            $this.remove();
            if (parent.length > 0) {
                html = "<span class = 'strLimit'>" + parent.html().trim() + "</span>" ;
                parent.html(html);
            }
        }
    });

    $("option[lang]").each(function(){
        var name = $(this).attr("lang");
        if("" != name) {
            $(this).text($.lang.pub[name]+$(this).text());
            $(this).removeAttr("lang");
        }
    });

    $("*[data-lang]").each(function(){
        var $this = $(this),
             html,
             len = $this.parent().find("td").length,
             name = $this.attr("data-lang");
        if("" != name) {
            if(len == 0 ){
                $this.html($.lang.pub[name]+$this.text());
                $this.removeAttr("data-lang");
            }else {
                html = "<span class = 'strLimit'>" + $.lang.pub[name] +$this.text()+ "</span>";
                $this.empty();
                $this.append(html);
                $this.removeAttr("data-lang");
                   }        
	    } 
    });
    $("*[data-title]").each(function(){
        var name = $(this).attr("data-title");
        if("" != name) {
            $(this).attr("title", $.lang.pub[name]);
            $(this).removeAttr("data-title");
        }
    });
    $("*[data-lang-tip]").each(function(){
        var name = $(this).attr("data-lang-tip");
        if("" != name) {
            $(this).text($.lang.tip[name]+$(this).text());
            $(this).removeAttr("data-lang-tip");
        }
    });
    
    $("*[data-title-tip]").each(function(){
        var name = $(this).attr("data-title-tip");
        if("" != name) {
            $(this).attr("title", $.lang.tip[name]);
            $(this).removeAttr("data-title-tip");
        }
    });

    $("input[lang]").each(function(){
        var name = $(this).attr("lang");
        if("" != name) {
            if(($(this).attr("type") == "button") ||
               ($(this).attr("type") == "reset") ||
               ($(this).attr("type") == "submit")){
                $(this).val($.lang.pub[name]);
                $(this).removeAttr("lang");
            }
        }
    });
}

/**
 * 全局调用函数
 * 
 * @param window
 *            调用页面的window对象
 * @return
 * 
 * 特殊说明： 1、在引用了util.js的htm和jsp页面，除了Index.htm、jump.htm都调用了该函数
 */
function GlobalInvoke(window)
{
    if(!window || !window.document)
    {
        throw "window is null";
        return false;
    }
    // 屏蔽右键菜单
    window.document.oncontextmenu = function(){
        return false;
    };
    addCfg(window);
}

/**
 * 检查版本兼容性
 * 
 * @param curActiveVer
 *            当前版本
 * @param curCompVer
 *            兼容版本
 * @return false---版本不兼容， true---版本兼容
 */
function check_compatible(curActiveVer, curCompVer){
    // 控件版本号类型是否相同
    if (WEB_CTRL_VERSION.split(".")[0] != curActiveVer.split(".")[0]) return false;

    // 版本号是否兼容
    var curDeviceVer = translateVer(WEB_CTRL_VERSION);
    curActiveVer = translateVer(curActiveVer);
    curCompVer = translateVer(curCompVer);
    return !((curDeviceVer > curActiveVer) ||(curDeviceVer < curCompVer));
}

/**
 * 解析版本号
 * 
 * @param verNo
 *            版本号字符串
 * @return 版本号数值
 */
function translateVer(verNo){
    verNo = verNo||"";
    var retNo = 0;
    var arrVerNo = verNo.split(".")||[];
    if(3 == arrVerNo.length){
        retNo = (Number(arrVerNo[1]) * 10000) + (Number(arrVerNo[2]));
    }
    return retNo;
}

/**
 * 验证控件版本号的兼容性
 * 
 * @param playActiveXObj
 *            控件对象
 * @return
 */
function check_version(playActiveXObj){
    var isVersionValid = true;
    var top = GetTopWindow();
    var resultList = [];
    var retval;

    try{
        retval = playActiveXObj.ViewerAxGetVersion20();// 当前安装的控件版本号
        resultList = getSDKParam(retval);
        if (ResultCode.RESULT_CODE_SUCCEED == resultList[0]){
            top.versionNo = resultList[1];
        }
        retval = playActiveXObj.ViewerAxGetCompVersion20();// 当前安装控件的兼容版本号
        resultList = getSDKParam(retval);
        if (ResultCode.RESULT_CODE_SUCCEED == resultList[0]){
            top.compVersionNo = resultList[1];
        }
        isVersionValid = check_compatible(top.versionNo, top.compVersionNo);
    }catch(e){
        isVersionValid = false;
    }
    return isVersionValid;
}

/** ******************* 用xmlHttpRequest发送soap消息的机制获取/下发数据 ****************** */
var soapXmlHead= "<?xml version='1.0' encoding='UTF-8'?>"+
                    "<SOAP-ENV:Envelope " +
                        "xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/' " +
                        "xmlns:SOAP-ENC='http://schemas.xmlsoap.org/soap/encoding/' " +
                        "xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
                        "xmlns:xsd='http://www.w3.org/2001/XMLSchema' " +
                        "xmlns:xop='http://www.w3.org/2004/08/xop/include' "+
                        "xmlns:xmime4='http://www.w3.org/2004/11/xmlmime' " +
                        "xmlns:ns='urn:calc'>" +
                    "<SOAP-ENV:Body>";
var soapXmlEnd = "</SOAP-ENV:Body></SOAP-ENV:Envelope>";
var xmlhttp = null;

/**
 * 创建xmlHttpRequest对象
 * 
 * @return
 */
function getXmlHttpRequest()
{
    if(xmlhttp == null)
    {
        if(window.ActiveXObject)
        {
            var ieArr = ["Msxml2.XMLHTTP.4.0","Msxml2.XMLHTTP.3.0","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];
            for(var i=0;i<ieArr.length;i++)
            {
                try
                {
                    xmlhttp = new ActiveXObject(ieArr[i]);
                }catch(e){}
            }
        }else if(window.XMLHttpRequest){
            xmlhttp = new XMLHttpRequest();
        }
    }
    return xmlhttp;
}

/**
 * 给soapXml里的某个标签赋值
 * 
 * @param value
 *            值
 * @param soapXml
 *            xml对象
 * @param path
 *            某个字段的绝对路径（list）
 * @return
 */
function  setValueToSoapXml(value, soapXml, path)
{
    var node = soapXml.getElementsByTagName(path[0])[0];
    for(var i=1,len=path.length; i<len && (null != node); i++)
    {
        node = node.getElementsByTagName(path[i])[0];
    }
    if(null != node)
    {
        node.text = value;
    }
}

/**
 * 页面风格处理
 *@param linkId
 *		css文件ID
 *@param url
 *		目标url
 * @return
 */
function loadCss(linkId, url){
    var head=document.getElementsByTagName('head').item(0);
    var link = document.getElementById(linkId);
    if(link)
    {
        head.removeChild(link);
    }
    var css=document.createElement('link');
    css.href=url;
    css.rel='stylesheet';
    css.type='text/css';
    css.id=linkId;
    head.appendChild(css);
}

/**
 * 页面加载数据之前要执行的方法
 * 
 * @return
 */
function beforeDataLoad()
{
    var $input = $("input");
    $input.attr("autocomplete", "off");
    $("form").attr("autocomplete", "off");
    $("span").each(
        function()
        {
            if($(this).hasClass("button"))
            {
                $(this).children("a").before("<span class='btn_l'></span>");
                $(this).children("input").before("<span class='btn_l'></span>");
                $(this).children("button").before("<span class='btn_l'></span>");
                $(this).children("a").after("<span class='btn_r'></span>");
                $(this).children("input").after("<span class='btn_r'></span>");
                $(this).children("button").after("<span class='btn_r'></span>");
            }
            if($(this).hasClass("button_green"))
            {
                $(this).children("a").before("<span class='btn_l_green'></span>");
                $(this).children("input").before("<span class='btn_l_green'></span>");
                $(this).children("button").before("<span class='btn_l_green'></span>");
                $(this).children("a").after("<span class='btn_r_green'></span>");
                $(this).children("input").after("<span class='btn_r_green'></span>");
                $(this).children("button").after("<span class='btn_r_green'></span>");
            }
        }
    );

    var top = GetTopWindow();
    if(SkinStyle.Gray == top.style)
    {// 灰风格
        loadCss("pageCss", "skin/gray/gray.css");
    }
    else if(SkinStyle.Black == top.style)
    {// 黑风格
        loadCss("dataviewCss", "skin/black/dataview.css");
        loadCss("pageCss", "skin/black/black.css");
        $input.each(
            function(){
                if("text" == this.type)
                {
                    $(this).addClass("text");
                }
            }
        );
    }
}

/**
 * 页面加载数据之后要执行的方法
 * 
 * @return
 */
function afterDataLoad()
{
    var w = (document.body.scrollWidth<=document.body.clientWidth)? "100%": document.body.scrollWidth+"px";
    var h = (document.body.scrollHeight<=document.body.clientHeight)? "100%": document.body.scrollHeight+"px";

    $("div[class='blockDiv']").css({width: w, height: h});

    //新增定制文件，统一修改定制样式
    loadCss("customizedCSS", "css/customized.css");
    strLimit();
}

/**
 * 事件上报错误码统一入口
 * 
 * @param msg
 *            提示信息
 * @return
 */
function eventAlert(msgMap)
{
    var top = GetTopWindow();
    if(top.showedFlag)
    {
        top.banner.eventMsgList.push(msgMap);
    }
}

/**
 * 弹出窗口页面
 * 
 * @param title
 *            窗口标题
 * @param pagePath
 *            页面路径
 * @param w
 *            窗口宽
 * @param h
 *            窗口高
 * @param isNeedHideBtn
 *            是否隐藏按钮条
 * @param winPosX
 *            窗口左上角x坐标
 * @param winPosY
 *            窗口左上角y坐标
 * @param isMove
 *            是否可拖动
 * @return
 */
function openWin(title, pagePath, w, h, isNeedHideBtn, winPosX, winPosY, isMove){
    if(null !== document.getElementById("msgObj"))return;
    var isMove = ("undefined" == typeof isMove)? true : isMove;

    var iWidth = Math.max(document.body.offsetWidth, document.body.clientWidth);
    var iHeight = Math.max(document.body.offsetHeight, document.body.clientHeight);
    // 拖动遮盖层
    var frontDiv = document.createElement("div");
    frontDiv.style.cssText = "display:;display:none;position:absolute;left:0px;top:0px;width:100%;min-width:"+iWidth+
                              "px;height:100%;min-height:"+iHeight+
                              "px;filter:Alpha(Opacity=0);opacity:0;background-color:#000000;z-index:1003;cursor:move;";
    document.body.appendChild(frontDiv);
    frontDiv.setAttribute("id", "frontDiv");
    frontDiv.setAttribute("name", "frontDiv");

    // 遮盖层
    var bgObj = document.createElement("div");
    bgObj.style.cssText = "display:;visibility:show;position:absolute;left:0px;top:0px;width:100%;min-width:"+iWidth+
                            "px;height:100%;min-height:"+iHeight+
                            "px;filter:Alpha(Opacity=30);opacity:0.3;background-color:#000000;z-index:1001;";
    document.body.appendChild(bgObj);
    bgObj.setAttribute("id", "bgObj");
    bgObj.setAttribute("name", "bgObj");

    // 窗口层
    var msgObj=document.createElement("div");
    msgObj.className = "popwin";
    msgObj.style.cssText = "width:"+w+"px;height:"+h+"px;";
    if ("undefined" !== typeof winPosX) {
        if (!isNaN(Number(winPosX))) {
            winPosX = winPosX + "px";
        }
        msgObj.style.left = winPosX;
    }
    if ("undefined" !== typeof winPosY) {
        if (!isNaN(Number(winPosY))) {
            winPosY = winPosY + "px";
        }            
        msgObj.style.top = winPosY;
    }
    document.body.appendChild(msgObj);
    msgObj.setAttribute("id", "msgObj");
    msgObj.setAttribute("name", "msgObj");
    
    var contentHtml = "<iframe id='iframeWin' name='iframeWin' frameborder='0' src='"+pagePath+"'></iframe>";
    if (-1 == pagePath.indexOf(".htm")) {
        contentHtml = document.getElementById(pagePath).innerHTML;
    }
    
    var windowHtml = "<iframe frameborder='0' class='popwin_bg' style='width:"+w+"px;height:"+h+"px;'></iframe>"+
                    "<div class='popwin_div'>"+
                        "<div id='titleBar' name='titleBar' class='popwin_title'>"+
                            "<span class='left'>"+title+"</span>"+
                            "<a class='icon close right' onclick='closeWin()'></a>"+
                        "</div>"+
                        "<div id='popwin_content' name='popwin_content' class='popwin_content'>"+
                            contentHtml+
                        "</div>"+
                        "<div id='popwin_btnbar' name='popwin_btnbar' class='popwin_btnbar hidden'>"+
                            "<span class='button'>" +
                                "<span class='btn_l'></span>" +
                                "<input type='button' style='cursor:pointer;' value='"+$.lang.pub['confirm']+"' onclick='submitWin();' />"+
                                "<span class='btn_r'></span>" +
                            "</span>" +
                            "<span class='button'>" +
                                "<span class='btn_l'></span>" +
                                "<input type='button' style='cursor:pointer;' value='"+$.lang.pub['cancel']+"' onclick='closeWin()'/>"+
                                "<span class='btn_r'></span>" +
                            "</span>" +
                        "</div>"+
                    "</div>";

    msgObj.innerHTML = windowHtml;

    if (("undefined" == typeof(isNeedHideBtn)) || (!isNeedHideBtn))
    {
        document.getElementById("popwin_content").style.bottom = "30px";
        document.getElementById("popwin_btnbar").className = "popwin_btnbar";
    }

    if (isMove) {
        // 拖动事件
        var moveX = 0;
        var moveY = 0;
        var moveTop = 0;
        var moveLeft = 0;
        var moveable = false;
        var docMouseMoveEvent = document.onmousemove;
        var docMouseUpEvent = document.onmouseup;
        var docMouseSelectEvent = document.onselectstart;
    
        // 拖动事件
        document.getElementById("titleBar").onmousedown = function() {
            document.onselectstart = function(){return false;};
            var evt = getEvent();
            var oSrc = evt.srcElement? evt.srcElement: evt.target;
            if("A" == oSrc.nodeName){return false;};
            frontDiv.style.display = "block";
            moveable = true;
            moveX = evt.clientX;
            moveY = evt.clientY;
            moveTop = parseInt(msgObj.offsetTop);
            moveLeft = parseInt(msgObj.offsetLeft);
            document.onmousemove = function() {
                var evt = getEvent();
                var leftButton = (document.all)? (evt.button == 1): (evt.button == 0);
                if (leftButton && moveable) {
                    var x = moveLeft + evt.clientX - moveX;
                    var y = moveTop + evt.clientY - moveY;
                    if(x < 0)
                    {
                        x = 0;
                    }
                    else if( x + w > iWidth-10)
                    {
                        x = iWidth -10- w;
                    }
                    msgObj.style.left = x + "px";
                    if(y < 0)
                    {
                        y = 0;
                    }
                    else if( y + h > iHeight-10)
                    {
                        y = iHeight-10 - h;
                    }
                    msgObj.style.top = y + "px";
                }
            };
            if (moveable) {
                document.onmouseup = function () {
                    document.onmousemove = docMouseMoveEvent;
                    document.onmouseup = docMouseUpEvent;
                    document.onselectstart = docMouseSelectEvent;
                    frontDiv.style.display = "none";
                    moveable = false;
                    moveX = 0;
                    moveY = 0;
                    moveTop = 0;
                    moveLeft = 0;
                };
                frontDiv.onmouseout = document.onmouseup;
            }
        }
    }
}

// 获得事件Event对象，用于兼容IE和FireFox
function getEvent() {
    if(document.all) return window.event;
    var func = getEvent.caller;
    while(func != null) {

        var arg0 = func.arguments[0];
        if (arg0) {

            if((arg0.constructor == Event || arg0.constructor == MouseEvent) ||
                    (typeof arg0 == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                return arg0;
            }
        }
        func = func.caller;
    }
    return null;
}

// 取消冒泡
function stopBubble(){
    var e = getEvent();

    if(e) {
        // 非IE
        if (e.stopPropagation) {
            //W3C标准
            e.stopPropagation();
        } else {
            //IE
            e.cancelBubble = true;
        }
    }
}

/**
 * 窗口提交数据事件，和openWin配合使用
 * 
 * @return
 */
function submitWin()
{
    var iframe = document.getElementById("iframeWin");
    iframe.contentWindow.submitWinData();
}

/**
 * 窗口关闭事件，和openWin配合使用
 * 
 * @return
 */
function closeWin()
{
    document.getElementById("iframeWin").src = "";
    // 解决chrome窗口关闭不触发release的问题
    if(checkNavigator("chrome")) {
        setTimeout(function () {
            $("#msgObj").remove();
            $("#bgObj").remove();
            $("#frontDiv").remove();
        }, 200);
    }else{
        $("#msgObj").remove();
        $("#bgObj").remove();
        $("#frontDiv").remove();
    }
}

/**
 * 将sdk返回的数据放到map容器中，若不传参数map则放到dataMap中。
 * 
 * @param map
 *            js中模拟的简单Map对象，用于存放数据。
 * @return
 */
function sdkAddCfg(map, sdkStr)
{
    var kvArray = sdkStr.split("&");
    var len = 0;
    for(var i=0;i<kvArray.length;i++)
    {
        var tmpArr = kvArray[i].split("=");
        if(tmpArr.length==2)
        {
            if(map != null && map != undefined && map != "")
            {
                map[tmpArr[0].trim()] = decodeString(tmpArr[1]);
            }
            else
            {
                dataMap[tmpArr[0].trim()] = decodeString(tmpArr[1]);
            }
            len++;
        }
    }
    return len;
}

/**
 * 将界面上的值更新到map里
 * 
 * @param f
 *            界面对象
 * @param map
 *            存放数据的容器
 */

function formToCfg(f,map)
{
    map = map||dataMap;
    for (var n in map)
    {
        var e=eval('f.'+n);
        if ( e )
        {
            if (typeof(e.name)=="undefined")
            {
                if (e.length)
                {
                    if(e[0].type == 'radio')
                    {
                        for (var j=0;j<e.length;j++)
                        {
                            if(e[j].checked)
                            {
                                map[n]=e[j].value;
                            }
                        }
                    }
                    else if(e[0].type=='text')
                    {
                        if (e.length==4)
                        {
                            map[n] = e[0].value+"."+e[1].value+"."+e[2].value+"."+e[3].value;
                        }
                    }
                }
            }
            else if (e.type=='checkbox')
            {
                var v = e.checked?"1":"0";
                map[n] = v;
            }
            else
            {
                map[n] = e.value;
            }
        }
    }
}

/**
 * 界面的值是否发生变化(新)
 * 
 * @param formId
 * @param map
 * @return
 */
function IsChanged(formId, map)
{
    var isChanged = false;
    var f = document.getElementById(formId);
    for (var n in map)
    {
        var e=eval('f.'+n);
        if (e && !e.disabled)
        {
            if (typeof(e.name)=="undefined")
            {// 判断是否为一个数组
                if (e.length)
                {
                    if(e[0].type == 'radio')
                    {
                        for (var j=0;j<e.length;j++)
                        {
                            if(e[j].checked && (e[j].value!=map[n]))
                            {
                                isChanged = true;
                                break;
                            }
                        }
                        if(isChanged)break;
                    }
                    else if(e[0].type=='text')
                    {
                        if (e.length==4)
                        {
                            var ips =e[0].value+"."+e[1].value+"."+e[2].value+"."+e[3].value;
                            if(ips!=map[n])
                            {
                                isChanged = true;
                                break;
                            }
                        }
                    }
                }
            }
            else if (e.type=='checkbox')
            {
                if(e.checked!=Number(map[n]))
                {
                    isChanged = true;
                    break;
                }
            }
            else
            {
                if(e.value!=map[n])
                {
                    isChanged = true;
                    break;
                }
            }
        }
    }
    return isChanged;
}

/**
 * 获取界面的配置参数
 * 
 * @param ChnId
 *            通道号
 * @param CmdType
 *            命令字（参考ComScript.js中的CMD_TYPE）
 * @param map
 *            map 数据map
 * @param Param
 *            扩展字段（不传则默认为0）
 * @return 是否成功
 */
function getCfgData(ChnId, CmdType, map, Param)
{
    Param = (undefined == Param)?"": Param;
    var flag = false;
    var top = GetTopWindow();
    var retcode = top.sdk_viewer.ViewerAxGetConfig20(ChnId, CmdType, Param);
    var resultList = getSDKParam(retcode);

    if(ResultCode.RESULT_CODE_SUCCEED == resultList[0]){
        sdkAddCfg(map, resultList[1]);
        flag = true;
    }
    else
    {
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
    }
    return flag;
}

/**
 * 将界面上要下发的数据拼装成sdk控件用的字符串
 * 
 * @param formId
 *            界面表单对象id
 * @param map
 *            数据对象
 * @return sdk字符串
 */
function sdkGetValueString(formId, map)
{
    var f = document.getElementById(formId);
    var sdkValueStr = "";
    for (var n in map)
    {
        var e=eval('f.'+n);
        if ( e )
        {
            if (typeof(e.name)=="undefined")
            {
                if (e.length)
                {
                    if(e[0].type == 'radio')
                    {
                        for (var j=0;j<e.length;j++)
                        {
                            if(e[j].checked)
                            {
                                sdkValueStr += n+"="+e[j].value+"&";
                            }
                        }
                    }
                    else if(e[0].type=='text')
                    {
                        if (e.length==4)
                        {
                            sdkValueStr += n+"="+e[0].value+"."+e[1].value+"."+e[2].value+"."+e[3].value+"&";
                        }
                    }
                }
            }
            else if (e.type=='checkbox')
            {
                var v = e.checked?"1":"0";
                sdkValueStr += n+"="+v+"&";
            }
            else
            {
                sdkValueStr += n+"="+encodeString(e.value)+"&";
            }
        }
    }
    sdkValueStr = sdkValueStr.substring(0,sdkValueStr.length-1);
    return sdkValueStr;
}

/**
 * 下发配置参数
 * 
 * @param ChnId
 *            通道号
 * @param CmdType
 *            命令字（参考ComScript.js中的CMD_TYPE）
 * @param formId
 *            表单Id
 * @param map
 *            数据对象
 * @param param
 * @return 是否成功
 */
function setCfgData(ChnId, CmdType, formId, map, param)
{
    var flag = false;
    var pcParam = sdkGetValueString(formId, map);
    var msg = "";
    if(param)
    {
        pcParam += "&"+param;
    }
    var top = GetTopWindow();
    var retcode = top.sdk_viewer.ViewerAxSetConfig(ChnId, CmdType, pcParam);
    if(ResultCode.RESULT_CODE_SUCCEED == retcode)
    {// 刷新内存数据
        formToCfg(formId, map);

        flag = true;
    } else if (ResultCode.SDK_MEDIA_ENCODELIMITED == retcode) {
        msg = $.lang.tip["tipUplimitEncode"];
    }
    
    top.banner.showMsg(flag, msg);
    return flag;
}

/**
 * 给界面赋值
 * 
 * @param map
 *            数据对象
 * @param formId
 *            表单id
 * @return
 */
function cfgToForm(map, formId)
{
    var f = document.getElementById(formId);
    for (var n in map)
    {
        var e=eval('f.'+n);
        if ( e )
        {
            if (typeof(e.name)=="undefined")
            {
                if (e.length)
                {
                    if(e[0].type == 'radio')
                    {
                        for (var j=0;j<e.length;j++)
                        {
                            e[j].checked=e[j].defaultChecked=(e[j].value==map[n]);
                        }
                    }
                    else if(e[0].type=='text')
                    {
                        if (e.length==4) decomIP2(e,map[n]);
                    }
                }
            }
            else if (e.type=='checkbox')
            {
                e.checked=e.defaultChecked=Number(map[n]);
            }
            else
            {
                if("select-one" == e.type)
                {
                    var optionIndex = 0,
                        optionNum = e.options.length;

                    if(0 == optionNum)continue;
                    for(; optionIndex <optionNum; optionIndex++)
                    {
                        var option = e.options[optionIndex];
                        if(option.value == map[n])
                        {
                            option.selected = true;
                            break;
                        }
                    }
                    if(optionIndex == optionNum){
                        e.options[0].selected = true;
                    }
                }
                else
                {
                    e.value = map[n];
                }
                e.setAttribute("defaultValue", e.value);
            }
        }
    }
}

/**
 * 给label赋值
 * 
 * @param map
 *            数据
 * @return
 */
function setLabelValue(map)
{
    for (var n in map)
    {
        var e = document.getElementById(n);
        if (e && ("LABEL" == e.tagName || "SPAN" == e.tagName || "A" == e.tagName))
        {
            e.innerHTML = map[n];
        }
    }
}

/**
 * 将界面上的值更新到map里
 * 
 * @param formId
 *            表单id
 * @param map
 *            存放数据的容器
 */

function formToCfg(formId,map)
{
    var f = document.getElementById(formId);
    for (var n in map)
    {
        var e=eval('f.'+n);
        if ( e )
        {
            if (typeof(e.name)=="undefined")
            {
                if (e.length)
                {
                    if(e[0].type == 'radio')
                    {
                        for (var j=0;j<e.length;j++)
                        {
                            if(e[j].checked)
                            {
                                if ("number" == typeof map[n]) {
                                    map[n] = Number(e[j].value);
                                } else {
                                    map[n] = e[j].value;
                                }
                                
                            }
                        }
                    }
                    else if(e[0].type=='text')
                    {
                        if (e.length==4)
                        {
                            map[n] = e[0].value+"."+e[1].value+"."+e[2].value+"."+e[3].value;
                        }
                    }
                }
            }
            else if (e.type=='checkbox')
            {
                var v = e.checked?"1":"0";
                if ("number" == typeof map[n]) {
                    map[n] = Number(v);
                } else {
                    map[n] = v;
                }
            }
            else
            {
                if ("number" == typeof map[n]) {
                    map[n] = Number(e.value);
                } else {
                    map[n] = e.value;
                }
            }
        }
    }
}

/**
 * 显示jquery错误提示信息
 * 
 * @param error
 *            错误提示信息对象
 * @param element
 *            要提示的界面元素
 * @param parentTagName
 *            父元素的tagName
 * @param contentDivID
 *            验证元素所在的容器，验证提示信息不允许超过该容器时传入该参数
 * @return
 */
function showJqueryErr(error, element, parentTagName,contentDivID)
{
    var parentElement = parentTagName? element.parent(parentTagName): element.parent();
    var positionX = element.position().left + element.width() + 5;
    var postionY = element.position().top;
    var maxWidth = document.body.scrollWidth;
    var maxHeight = document.body.clientHeight;
    var errWidth = 0;
    var errHeight = 0;
    
    error.css("position","absolute");
    error.css("z-index","9999");
    error.css("white-space","nowrap");
    error.css("width","auto");
    error.appendTo(parentElement);
    errWidth = error.width();
    
    if ("undefined" != typeof contentDivID) {
        maxWidth = document.getElementById(contentDivID).scrollWidth;
    }
    
    if (positionX + errWidth > maxWidth) {
        positionX = element.position().left;
        
        if (positionX + errWidth > maxWidth) {
            errWidth = maxWidth - positionX - 5;
            error.css("width",errWidth);
            error.css("white-space","normal");
        }
        
        postionY = element.position().top + element.height() + 5;
    }
    
    errHeight = error.height();
    if (postionY + errHeight > maxHeight) {
        if (positionX == element.position().left) {
            postionY = element.position().top - errHeight -2;
        } else {
            postionY = element.position().top + element.height() - errHeight;
        }
    }
    
    error.css({
        left: positionX,
        top: postionY
    });
}

/**
 * 获取元素相对于页面的偏移量
 * 
 * @param object
 *            元素对象
 * @param offset
 *            偏移量对象
 * @return
 */
function GetOffset(object, offset)
{
    if (!object)
        return;
    offset.x += object.offsetLeft;
    offset.y += object.offsetTop;

    GetOffset(object.offsetParent, offset);
}

/**
 * 显示实况窗口
 * 
 * @param videoDivId
 *            播放窗口的容器id
 * @param streamType
 *            流类型
 * @param runMode
 *            运行模式 不传则默认为运动检测模式
 * @param streamID
 *            流id 不传则默认为主流
 * @param isShowPtz
 *            是否显示云台 不传则不显示
 * @param callback
 *            回调函数
 * @return
 */
function initVideo(videoDivId, streamType, runMode, streamID, isShowPtz, callback,ptzFlag)
{
    var top = GetTopWindow(),
        offset = {x : 0, y : 0},
        _streamID = top.banner.DefaultStreamID,
        _runMode = RunMode.CFG_NOFULL,
        videoTd,
        w,
        h,
        WndPos = 0;
    
    if (("undefined" !== typeof streamID) && (null !== streamID) && ("" !== streamID)) {
        _streamID = streamID;
    }

    if (("undefined" !== typeof runMode) && (null !== runMode) && ("" !== runMode)) {
        _runMode = runMode;
    }

    videoTd = document.getElementById(videoDivId);
    top.banner.video.frameWidth = videoTd.offsetWidth;
    top.banner.video.frameHeight = videoTd.offsetHeight;

    GetOffset(videoTd, offset);
    parent.showVideo(top.banner.video.frameWidth, top.banner.video.frameHeight,
                            offset.y, offset.x, isShowPtz);
    if(top.banner.isOldPlugin && !top.banner.isMac && !top.banner.video.initPlayWnd())return;
    //若存在停流的定时器则清空定时器
    if (null != top.banner.StopVideoTimeID && "undefined" != typeof top.banner.StopVideoTimeID) {
        top.banner.clearTimeout(top.banner.StopVideoTimeID);
        top.banner.StopVideoTimeID = null;
    }

    if(top.banner.isOldPlugin && !top.banner.isMac){
        top.sdk_viewer.ViewerAxSetRunMode20(_runMode);
    }else if(top.sdk_viewer.isInstalled){
        if(RunMode.LIVE_JPEG ==_runMode){ //天网卡口三分屏
            WndPos = 1;
        }else if(RunMode.SDFS == _runMode){ //照片页面
            WndPos = 2;
        }else if(RunMode.JPEG_INTEL == _runMode){ //智能业务页面
            WndPos = 3;
        }else{ //实况配置页面
            WndPos = 0;
        }
        /**
         * 新增：设置窗口位置
         *说明：参数为页面模式，现针对天网卡口应用：有4种模式：0单独实况窗口页面，1首页三个窗口页面，2照片页面，3配置智能页面（约定枚举）
         */
        top.sdk_viewer.execFunctionReturnAll("NetSDKSetWndPos",WndPos);
    }
    top.banner.StartVideoTimeID = setTimeout("startVideoLater(" + streamType + "," + _streamID + "," + _runMode + "," + callback + "," + ptzFlag + ")", 100);
}

function startVideoLater(streamType, streamID, runMode, callback,ptzFlag){
    var oldStreamType,
        newStreamType,
        wndType,
        videoInfoFlag =(RunMode.LIVE_JPEG == runMode || RunMode.LIVE == runMode) ;
    // 切到回放页面停主流,否则起主流
    if (255 == streamID) {
        top.banner.video.stopVideo(StreamType.LIVE);
    } else {
        if (top.banner.isOldPlugin) {
            top.banner.video.startVideo(streamType, streamID);
        } else if(RunMode.JPEG_INTEL != runMode){
            top.banner.video.startVideo(streamID,true,0,ptzFlag,videoInfoFlag);
        }
        if((RunMode.JPEG != runMode) &&
                (RunMode.JPEG_INTEL != runMode) && 
                (RunMode.SDFS != runMode)) {
            top.banner.video.isLiveReplay = true;
        }
    }

    // 非首页实况默认按比例显示
    if ((RunMode.LIVE !== runMode) && (RunMode.JPEG !== runMode) && (RunMode.EP !== runMode)
        && (RunMode.LIVE_JPEG !== runMode) && (RunMode.SCREEN_4 !== runMode)) {
        top.banner.video.cur_scale = UIRenderScale.PROPORTION;
        wndType = (StreamType.LIVE == streamType)? VideoType.LIVE : VideoType.PICTRUE;
        if(!top.banner.isOldPlugin && RunMode.JPEG_INTEL == runMode){
            wndType = 2;
        }
        top.banner.video.setRenderScale(wndType, 0);
    }
    if (callback && (callback instanceof Function)) {
        callback(streamType, streamID, runMode);
    }
}

/**
 * 选择路径
 * 
 * @param id
 *            显示路径的输入框ID
 * @return
 */
function chooseDir(id)
{
    var flag = false,
        pcSelPath;

    var top = GetTopWindow();

    if (!top.banner.isOldPlugin || top.banner.isMac) {
        var retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKBrowseDir");
        if(ResultCode.RESULT_CODE_SUCCEED == retcode.code){
            if("" != retcode.result){
                document.getElementById(id).value = retcode.result;
            }
            flag = true;
        }
    } else {
        var ulErrorCode = top.sdk_viewer.ViewerAxBrowseDir20();
        var resultList = getSDKParam(ulErrorCode);
        switch(resultList[0]){
            case FilePath.SUCCESSED:
                // 成功
                var pcSelPath = resultList[1];
                document.getElementById(id).value = pcSelPath;
                flag = true;
                break;
            case FilePath.ERR_INPUT_STR_FAIL:
                alert($.lang.tip["tipBrowseCodeErr1"]);
                break;
            case FilePath.ERR_NOTGETMYCOMPUTER:
                alert($.lang.tip["tipBrowseCodeErr2"]);
                break;
            case FilePath.ERR_BROWSE_FILE_CANCEL:
                break;
            case  FilePath.ERR_BROWSE_PATH_FAIL:
                alert($.lang.tip["tipBrowseCodeErr3"]);
                break;
            case FilePath.ERR_FILE_NOTEXIST:
                alert($.lang.tip["tipBrowseCodeErr4"]);
                break;
            case FilePath.ERR_PATH_LEN_EXCEED:
                alert($.lang.tip["tipBrowseCodeErr5"]);
                break;
            case FilePath.ERR_SYSTEM_FAIL:
                alert($.lang.tip["tipBrowseCodeErr6"]);
                break;
            default:
                alert($.lang.tip["tipUnknownErr"]);
                break;
        }
    }
    return flag;
}

/**
 * 选择文件
 * 
 * @param type
 *            文件类型
 * @param id
 *            显示文件名的输入框ID
 * @return
 */
function chooseFile(type, id) {
    var pcFileType;
    if (type < FileTypeList.length){
        pcFileType = FileTypeList[type];
    }
    else {
        return;
    }

    var top = GetTopWindow();
    var ulErrorCode = top.sdk_viewer.ViewerAxBrowseFile20(pcFileType);
    var resultList = getSDKParam(ulErrorCode);
    var flag = (ResultCode.RESULT_CODE_SUCCEED == resultList[0]);
    if (flag){
        var pcSelPath = resultList[1];
        document.getElementById(id).value = pcSelPath;
    }
    return flag;
}

/**
 * 回车键触发blur事件，仅用于即时下发的输入框,
 * 
 * @param obj
 * @return
 */
function onPicKeyPress(obj)
{
    var event = getEvent();
    var k = event.keyCode;
    if (KEY_CODE.keyEnter == k)  // checks whether the Enter key
    {
        obj.blur();
        event.keyCode = 0;
        return false;
    }
}

/**
 * 简单时间控件调用接口，仅用于时间段的时间控件
 * 
 * @return
 */
function pickerTime()
{
    var startTime = "00:00:00";
    var event = getEvent();
    var oSrc = event.srcElement? event.srcElement: event.target;
    if(oSrc.id.indexOf("End")>-1)
    {
        startTime = "23:59:59";
    }

    var top = GetTopWindow();
    WdatePicker({
        skin: "whyGreen",
        dateFmt: "HH:mm:ss",
        startDate: startTime,
        lang: top.wdateLang,
        readOnly:true
    });
}

/**
 * 转义字符串中的特殊字符 '&' -> 1 '=' -> 2 '%' -> 3
 * 
 * @param str
 *            要转义的字符串
 * @return
 */
function encodeString(str){
    str = str.replace(/&/g, String.fromCharCode(1));
    str = str.replace(/=/g, String.fromCharCode(2));
    str = str.replace(/%/g, String.fromCharCode(3));
    return str;
}

/**
 * 还原字符串中的特殊字符 1 -> '&' 2 -> '=' 3 -> '%'
 * 
 * @param str
 *            要转义的字符串
 * @return
 */
function decodeString(str){
    str = str.replace(/\x01/g, "&");
    str = str.replace(/\x02/g, "=");
    str = str.replace(/\x03/g, "%");
    return str;
}

/**
 * 验证通用用户名或密码（ASCII码大于32小于127的字符）
 * 
 * @param value
 * @return
 */
function checkCommonNamePwd(value)
{
    for (var i = 0; i < value.length; i++)
    {
        code = value.charCodeAt(i);
        if ((code >= 127) || (code < 32))
        {
            return false;
        }
    }
    return true;
}

/**
 * 对象的深拷贝方法
 * 
 * @param sObj
 *            要拷贝的对象
 * @return
 */
function objectClone(sObj){
    if ("object" !== typeof(sObj)) {
        return sObj;
    }

    var s = {};
    if (Object.prototype.toString.call(sObj) === '[object Array]') {
        s = [];
    }
    for (var i in sObj) {
        s[i] = objectClone(sObj[i])
    }
    return s;
}

/**
 * 比较2个对象的内容是否一样
 * 
 * @param obj1
 * @param obj2
 * @return
 */
function isObjectEquals(obj1, obj2){
    var bool = true;

    if (typeof(obj1) != typeof(obj2)) {
        bool = false;
    } else {
        if ("object" != typeof(obj1)) {
            bool = (obj1 == obj2);
        } else {
            for (var i in obj1) {
                if (!isObjectEquals(obj1[i], obj2[i])) {
                    bool = false;
                    break;
                }
            }
        }
    }
    return bool;
}

/**
 * 将全0时间段清空
 * 
 * @param startTimeId
 * @param endTimeId
 * @param data
 * @return
 */
function clearInvalidTimeRange(startTimeId, endTimeId, data){
    if ("00:00:00" == data[startTimeId] &&
        "00:00:00" == data[endTimeId]) {
        data[startTimeId] = "";
        data[endTimeId] = "";
    }
}

/**
 * 根据分辨率来调整播放窗口大小
 * 
 * @param streamID
 * @param videoDivID
 * @return
 */
function resetVideoSize(streamID, videoDivID, param)
{
    var tmpMap = {},
        videoWidth,
        videoHeight;

    // 获取图像分辨率
    top.banner.video.getVideoFormat();
    // 获取该流的分辨率大小
    top.banner.video.getCurVideoFormat(streamID);
    
    if ("undefined" == typeof(param)) {
    var $videoDivID = $("#" + videoDivID);
    videoWidth = Number($videoDivID.width());
    if (top.banner.video.videoWidth > top.banner.video.videoHeight) {
        videoHeight = videoWidth*top.banner.video.videoHeight/top.banner.video.videoWidth;
    } else {
        videoHeight = videoWidth*top.banner.video.videoWidth/top.banner.video.videoHeight;
    }
    $videoDivID.css("height", videoHeight + "px");
    }
}

/**
 * 创建默认字母下拉选项
 * 
 * @return
 */
function createLetterCombox(id)
{
    var letters = ["A","B","C","D","E","F","G","H","J","K","L","M","N","P","Q","R","S","T","U","V","W","X","Y","Z"];
    var combox = $("#" + id);
    for(var i=0,len=letters.length;i<len;i++)
    {
        var l = letters[i];
        var option = "<option value="+i+">"+l+"</option>";
        if("N" == l)
        {
            option += "<option value=24>O</option>";
        }
        combox.append(option);
    }
}

/**
 * 创建默认省份下拉选项
 * 
 * @return
 */
function createProvinceCombox(id)
{
    var province = ["",$.lang.pub["zang"],$.lang.pub["xiang"],$.lang.pub["zhe"],$.lang.pub["chuan"],$.lang.pub["liao"],$.lang.pub["jin"],
        $.lang.pub["xia"],$.lang.pub["yu"],$.lang.pub["ning"],$.lang.pub["lu"],$.lang.pub["su"],$.lang.pub["hu"],
        $.lang.pub["yue"],$.lang.pub["min"],$.lang.pub["gan"],$.lang.pub["xin"],$.lang.pub["hei"],$.lang.pub["ji"],
        $.lang.pub["qing"],$.lang.pub["meng"],$.lang.pub["jin2"],$.lang.pub["e"],$.lang.pub["ji2"],$.lang.pub["gan2"],
        $.lang.pub["jing"],$.lang.pub["wan"],$.lang.pub["gui"],$.lang.pub["qian"],$.lang.pub["gui2"],$.lang.pub["yun"],
        $.lang.pub["qiong"],$.lang.pub["yu2"],$.lang.pub["jun"],$.lang.pub["kong"],$.lang.pub["hai"],$.lang.pub["shen"],
        $.lang.pub["nan"],$.lang.pub["guang"],$.lang.pub["cheng"],$.lang.pub["lan"],$.lang.pub["ji3"],$.lang.pub["bei"]];
    var combox = $("#" + id);
    for(var i=1,len=province.length; i<len; i++)
    {
        var option = "<option value="+i+">"+province[i]+"</option>";
        combox.append(option);
    }
}

/**
 * 获得智能分析的状态
 * 
 * @return
 */
function getIVAState() {
    var flag,
        tmpMap = {};

    flag = LAPI_GetCfgData(LAPI_URL.FaceSmart,tmpMap);
    if (flag) {
        top.ivaEnable  = (1 == Number(tmpMap["Enabled"]));
    }
    return flag;
}

/**
 * 获取控件本地配置信息
 * 
 * @param playActiveXObj
 *            控件对象
 * @return
 */
function getLocalCfgByOcx(playActiveXObj){

    var top = GetTopWindow(),
        map = {},
        retval,
        resultList;

    try {
        retval = playActiveXObj.ViewerAxGetLocalCfgEx20();// 当前安装的控件版本号
        resultList = getSDKParam(retval);
        if (ResultCode.RESULT_CODE_SUCCEED == resultList[0]) {
            sdkAddCfg(map, resultList[1]);
        }
    } catch(e) {
        map["AutoPlay"] = 1;
    }

    return map
}

/**
 * 设置cookie
 * 
 * @return
 */
function setCookie(name,value,day) {
    var today = new Date();
    var expires = new Date();
    var days = ("undefined" == typeof(day)) ? 365 : day;
    expires.setTime(today.getTime() + 1000*60*60*24*days);
    document.cookie = escape(name) + "=" + escape(value) + "; path=/; expires=" + expires.toGMTString();
}

/**
 * 获取cookie
 * 
 * @return
 */
function getCookie(name) {
    name = escape(name);
    var result = "", search = name + "=";
    if (document.cookie.length > 0) {
        var offset = document.cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            var end = document.cookie.indexOf(";", offset);
            if(end == -1) end = document.cookie.length;
            result = unescape(document.cookie.substring(offset, end));
        }
    }
    return result;
}

/**
 * 删除cookie
 * 
 * @return
 */
function delCookie(name) {
    var today = new Date();
    var expires = new Date();
    expires.setTime(today.getTime() - 1);
    document.cookie = name + "=0; path=/; expires=" + expires.toGMTString();
}

// Cross-browser xml parsing
function parseXML(data) {
    var xml, tmp;
    if (!data || typeof data !== "string") {
        return null;
    }
    try {
        if ( window.DOMParser ) { // Standard
            tmp = new DOMParser();
            xml = tmp.parseFromString( data , "text/xml" );
        } else { // IE
            xml = new ActiveXObject( "Microsoft.XMLDOM" );
            xml.async = "false";
            xml.loadXML( data );
        }
    } catch( e ) {
        xml = undefined;
    }
    return xml;
}

/**
 * 解析sdk接口返回的字符串为结果码和字符串。
 * 
 * @param str
 * @return
 */
function getSDKParam(str) {
    var resultList=[];
    var arr = str.split("&");
    resultList[0] = Number(arr[0].split("=")[1]);

    if(ResultCode.RESULT_CODE_SUCCEED == resultList[0]){
        resultList[1] = str.replace(arr[0]+"&","");
    }

    return resultList;
}

/**
 * iframe高度自适应
 * 
 * @param iframeid
 * @return
 */
function setIframeHeight(iframeid) {
    var iframeElement = document.getElementById(iframeid); // iframe id

    if (iframeElement) {
        iframeElement.height = "10px";// 先给一个够小的初值,然后再长高.
        try{
            if (iframeElement.contentDocument && iframeElement.contentDocument.body.scrollHeight) {
                iframeElement.height = iframeElement.contentDocument.body.scrollHeight + 10;
            } else if (iframeElement.contentWindow && iframeElement.contentWindow.document.body.scrollHeight) {
                iframeElement.height = iframeElement.contentWindow.document.body.scrollHeight + 10;
            }
        } catch(e){}
    }
}

/**
 * 检测是否为某个浏览器
 * 
 * @param navigatorType
 *            浏览器类型（ie,firefox,opera,chrome,safari）
 * @return
 */
function checkNavigator(navigatorType) {
    var userAgent = navigator.userAgent.toLowerCase(),
        rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
        rFirefox = /(firefox)\/([\w.]+)/,
        rOpera = /(opera).+version\/([\w.]+)/,
        rChrome = /(chrome)\/([\w.]+)/,
        rSafari = /version\/([\w.]+).*(safari)/,
        flag = false;

    navigatorType = navigatorType.toLowerCase();
    switch(navigatorType) {
        case "ie":
            flag = (null != rMsie.exec(userAgent));
            break;

        case "firefox":
            flag = (null != rFirefox.exec(userAgent));
            break;

        case "opera":
            flag = (null != rOpera.exec(userAgent));
            break;

        case "chrome":
            flag = (null != rChrome.exec(userAgent));
            break;

        case "safari":
            flag = (null != rSafari.exec(userAgent));
            break;

        default:
            break;
    }

    return flag;
}

/**
 * 判断是否为外设类型
 * 
 * @param serialMode
 *            串口类型 参见utils里SerialMode
 * @return
 */
function isSubDevice(serialMode) {
    var subDevice = [5,6,7,8,9,10,11,13,14,15,17,18,19,20],
        i,
        len;
    
    for (i = 0, len = subDevice.length; i < len; i++) {
        if (serialMode == subDevice[i]) {
            return true;
        }
    }
    
    return false
}

function isContainsElement(e, list){
    var i = 0,
        len = list.length;
    for(;i < len; i++) {
        if (e == list[i]) {
            break;
        }
    }
    
    if (i == len) {
        i = -1;
    }
    return i;
}

/**
 * 能力集解析
 * 
 * @param id
 *            元素id或name
 * @param list
 *            能力项
 * @param type
 *            范围能力:range，否则：mode
 * @return
 */
function parseCapOptions(id, list, type)
{
    var $optionsArr = [],
        $obj = $("#"+id);
    
    if(0 == $obj.length) {
        $obj = $("[name='"+ id +"']");
        if (0 == $obj.length) return;
        $optionsArr = $obj;
    } else if($obj[0].type=='select-one') {
        $optionsArr = $("#" + id + " option");
    }
    
    // 范围能力集解析
    if ("range" == type) {
        if (list[0]==list[1]) {
            $obj.attr("disabled", true);
        }
        
        if($optionsArr.length <=0 ) {
            if ($obj[0].type=="text") {// 输入框范围
                $obj.attr("minValue", list[0]);
                $obj.attr("maxValue", list[1]);
                if (list[0] != list[1]) {
                    $obj.attr("title", $.lang.pub["range"]+list[0]+"-"+list[1]);
                    $obj.attr("maxLength", list[1].toString().length);
                }
            } 
            return;
        }
        // 起始
        while(Number(list[0]) > Number($optionsArr.first().attr("data-cap")))
        {
            $optionsArr.first().remove();
        }
        // 结束
        while(Number(list[1]) < Number($optionsArr.last().attr("data-cap")))
        {
            $optionsArr.last().remove();
        }
    } else {
        $optionsArr.each(function(){
            if (("undefined" != typeof($(this).attr("data-cap"))) && (-1 == isContainsElement($(this).attr("data-cap"), list))) {
                $(this).remove();
            }
        });
    }
}

/**
 * 能力集解析
 * 
 * @param id
 *            元素id或name
 * @param list
 *            能力项
 * @param type
 *            范围能力:range，否则：mode
 * @return
 */
function parseCapOptionsHidden(id, list, type)
{
    var $optionsArr = [],
        $obj = $("#"+id);
    
    if(0 == $obj.length) {
        $obj = $("[name='"+ id +"']");
        if (0 == $obj.length) return;
        $optionsArr = $obj;
    } else if($obj[0].type=='select-one') {
        $optionsArr = $("#" + id + " option");
    }
    
    // 范围能力集解析
    if ("range" == type) {
        if (list[0]==list[1]) {
            $obj.attr("disabled", true);
        }
        
        if($optionsArr.length <=0 ) {
            if ($obj[0].type=="text") {// 输入框范围
                $obj.attr("minValue", list[0]);
                $obj.attr("maxValue", list[1]);
                if (list[0] != list[1]) {
                    $obj.attr("title", $.lang.pub["range"]+list[0]+"-"+list[1]);
                    $obj.attr("maxLength", list[1].toString().length);
                }
            } 
            return;
        }
        // 起始
        while(Number(list[0]) > Number($optionsArr.first().attr("data-cap")))
        {
            $optionsArr.first().addClass("hidden");
        }
        // 结束
        while(Number(list[1]) < Number($optionsArr.last().attr("data-cap")))
        {
            $optionsArr.last().addClass("hidden");
        }
    } else {
        $optionsArr.each(function(){
            if (("undefined" != typeof($(this).attr("data-cap"))) && (-1 == isContainsElement($(this).attr("data-cap"), list))) {
                $(this).addClass("hidden");
            }
        });
    }
}

/**
 * 格式化日期为2015-01-01
 *
 * @param year
 * @param mounth
 * @param day
 * @return
 */
function formatDate(year, mounth, day) {
    var nowDate = year + "-";

    if(1 == mounth.toString().length)
    {
        nowDate += "0";
    }
    nowDate += mounth+"-";
    if(1 == day.toString().length)
    {
        nowDate +=  "0";
    }
    nowDate += day;

    return nowDate;
}


/**
 * 格式化时间为00:00:00
 * 
 * @param hour
 * @param minute
 * @param second
 * @return
 */
function formatTime(hour, minute, second) {
    var nowTime = "";
    
    if(1 == hour.toString().length)
    {
        nowTime += "0";
    }
    nowTime += hour+":";
    if(1 == minute.toString().length)
    {
        nowTime += "0";
    }
    nowTime += minute+":";
    if(1 == second.toString().length)
    {
        nowTime +=  "0";
    }
    nowTime += second;
    
    return nowTime;
}

/**
 * 格式化时间为如19701201020304
 *
 * @param hour
 * @param minute
 * @param second
 * @return
 */
function formatNewTime(year,month,date,hour, minute, second) {
    var nowTime = year;

    if(1 == month.toString().length)
    {
        nowTime += "0";
    }
    nowTime += month;
    if(1 == date.toString().length)
    {
        nowTime += "0";
    }
    nowTime += date;
    if(1 == hour.toString().length)
    {
        nowTime += "0";
    }
    nowTime += hour;
    if(1 == minute.toString().length)
    {
        nowTime += "0";
    }
    nowTime += minute;
    if(1 == second.toString().length)
    {
        nowTime +=  "0";
    }
    nowTime += second;

    return nowTime;
}

/**
 * safari浏览器中click触发方式
 * 
 * @param idOrObj
 * @return
 */
function safariClick(idOrObj) {
    var e = document.createEvent("MouseEvent"),
        obj = null;
    
    e.initEvent("click", false, false);
    if ("string" == typeof idOrObj) {
        obj = document.getElementById(idOrObj);
    } else {
        obj = idOrObj;
    }
    obj.dispatchEvent(e);
}

/**
 * 加载XML文件
 * 
 * @param xmlFile
 * @return
 */
function loadXML (xmlFile) {
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", xmlFile, false);
    xmlhttp.send();
    return xmlhttp.responseXML;
}
/**
 * 插入代码片段
 * 
 * @param id 容器ID
 * @param url 请求的地址
 * @return
 */
function loadHtml(id, url) {
    $.ajax({
        async: false,
        type: "GET",
        url: url,
        dataType: "html",
        success: function(data){
            $("#" + id).html(data);
        }
    });
}
/**
 * 构建命名空间
 * 
 * @param name
 * @return
 */
function $package(name) {
    var domains = name.split(".");
    var cur_domain = window;
    // 循环遍历每一级子域
    for (var i = 0; i < domains.length; i++) {
        var domain = domains[i];
        if ("undefined" == typeof(cur_domain[domain])) {
            cur_domain[domain] = {};
        }
        cur_domain = cur_domain[domain]
    }
    return cur_domain;
}

// 改变实况窗口大小
function changeRenderScale() {
    var video = top.banner.video;
    video.cur_scale = Number($("#renderScale").val());
    parent.changeVideoSize(video.videoWidth, video.videoHeight);// 设置视频高宽(界面部分)
    if (top.banner.isSupportCapture) {
        video.setRenderScale(VideoType.PICTRUE , 1);
    }
    video.setRenderScale(VideoType.LIVE, 1);
}

//获取服务器时间对象
function getIPCTime(){
    try {
        //FF, Opera, Safari, Chrome
        xmlHttp = new XMLHttpRequest();
    }
    catch (err1) {
        //IE
        try {
            xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (err2) {
            try {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            catch (eerr3) {
                //AJAX not supported, use CPU time.
                alert("AJAX not supported");
            }
        }
    }
    xmlHttp.open('POST',window.location.protocol+"//"+window.location.host+"/index.htm",false);
    xmlHttp.setRequestHeader("Content-Type", "text/html");
    xmlHttp.send('');
    return xmlHttp.getResponseHeader("Expires");   
}


/********************************** 弱密码校验 ***********************************/
function CharMode(ch){
    if (ch >= 48 && ch <= 57) { //数字
        return 1;
    } else if (ch >= 65 && ch <= 90) {  //大写字母
        return 2;
    } else if (ch >= 97 && ch <= 122) { //小写
        return 4;
    } else {    //特殊字符
        return 8;
    }
}

function bitTotal(num){
    var modes = 0,
        i;

    for (i = 0;i < 4; i++){

        if (num & 1) modes++;
        num>>>=1;
    }

    return modes;
}

function checkStrong(pwd){ //返回密码的强度级别
    var Modes=0,
        i;

    if (pwd.length < 8)
        return 0;

    for (i = 0;i < pwd.length; i++) {

        //测试每一个字符的类别并统计一共有多少种模式.
        Modes |= CharMode(pwd.charCodeAt(i));
    }
    return bitTotal(Modes);
}

/**
 * LAPI 获取参数接口
 * 
 * @param url 获取参数的url
 * @param map 存放数据的对象
 * @param dataStr （可选参数）自定义入参
 * @return
 */
function LAPI_GetCfgData(url, map, dataStr, isShowResultMsg, callback, paramMap)
{
    var _isShow = ("undefined" == typeof isShowResultMsg)? true : isShowResultMsg;
    var dataStr = ("undefined" == typeof dataStr)? "" : dataStr;
    var flag = true;
    var asyncFlag = false;
    var username,password;

    if("undefined"== typeof(top.banner)){
        username = "";
        password = "";
    }else{
        username = top.banner.loginUserName;
        password = top.banner.loginUserPwd;
    }

    url += "?randomkey="+ (new Date().getTime());

    if ("undefined" != typeof paramMap){
        if ("undefined" != typeof paramMap["async"]) asyncFlag = paramMap["async"];
    }

    $.ajax({
        type: "GET",
        async: asyncFlag,
        url: url,
        data: dataStr,
        dataType: "json",
        username: username,
        password :password,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ('Authorization', 'Basic ' + base64encode(username + ':' + password));
        },

        success: function(data){
            flag = (ResultCode.RESULT_CODE_SUCCEED == data.Response.StatusCode);
            if (flag) {
                if(LAPI_URL.LivingStream == data.Response.ResponseURL || LAPI_URL.RecordStream == data.Response.ResponseURL){
                    map["Data"] = data.Response.Data;
                } else {
                    $.extend(true, map, data.Response.Data);
                    if (callback && (callback instanceof Function)) {
                        callback(data.Response.StatusCode,map);
                    }
                }
            }
        },
        error: function() {
            flag = false;

            if(top.banner.PageBlockType == BlockType.UPDATE)return;
            //若有遮盖提示信息，则取消遮盖层
            if($(top.banner.document.getElementById("statusInfo")).length > 0){
                top.banner.updateBlock(false);
            }

            if (callback && (callback instanceof Function)) {
                callback(99999, map);
            }
        },
        complete: function() {
            if (_isShow && !flag) {
                top.banner.showMsg(false);
            }
        }
    }); 
    return flag;
}

/**
 * LAPI 修改参数接口
 * 
 * @param url 下发数据的url
 * @param map 下发的数据对象
 * @param isShowResultMsg （可选）是否显示下发结果的提示信息，默认为true
 * @param callback
 * @return
 */
function LAPI_SetCfgData(url, map, isShowResultMsg, callback) {
    return LAPI_SubmitCfgData(url, map, "PUT", isShowResultMsg, callback);
}

/**
 * LAPI 新增参数接口
 * 
 * @param url 下发数据的url
 * @param map 下发的数据对象
 * @param isShowResultMsg （可选）是否显示下发结果的提示信息，默认为true
 * @param callback
 * @return
 */
function LAPI_CreateCfgData(url, map, isShowResultMsg, callback) {
    return LAPI_SubmitCfgData(url, map, "POST", isShowResultMsg, callback);
}

/**
 * LAPI 删除参数接口
 * 
 * @param url 下发数据的url
 * @param map 下发的数据对象
 * @param isShowResultMsg （可选）是否显示下发结果的提示信息，默认为true
 * @param callback
 * @return
 */
function LAPI_DelCfgData(url, map, isShowResultMsg, callback) {
    return LAPI_SubmitCfgData(url, map, "DELETE", isShowResultMsg, callback);
}

/**
 * LAPI 下发参数接口
 * 
 * @param url 下发数据的url
 * @param map 下发的数据对象
 * @param isShowResultMsg （可选）是否显示下发结果的提示信息，默认为true
 * @param callback
 * @return
 */
function LAPI_SubmitCfgData(url, map, ajaxType, isShowResultMsg, callback)
{
    var _isShow = ("undefined" == typeof isShowResultMsg)? true : isShowResultMsg;
    var jsonStr = ("DELETE" == ajaxType)? "" : $.toJSON(map)+"\r\n";
    var flag = true;
    var username,password;

    if("undefined"== typeof(top.banner)){
        username = "";
        password = "";
    }else{
        username = top.banner.loginUserName;
        password = top.banner.loginUserPwd;
    }
    
    $.ajax({
        type: ajaxType,
        async: false,
        url: url,
        data: jsonStr,
        dataType: "json",
        username: username,
        password :password,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ('Authorization', 'Basic ' + base64encode(username + ':' + password));
         },
        success: function(data){
            flag = ResultCode.RESULT_CODE_SUCCEED == data.Response.StatusCode;
            if (callback && (callback instanceof Function)) {
                callback(data.Response.StatusCode, data.Response);
            }
        },
        error: function() {
            flag = false;
        }
     });
    
    if (_isShow) {
        top.banner.showMsg(flag);
    }
    
    return flag;
}

/**
 * 根据映射表将一个map中的数据赋值给另一个Map
 * 
 * @param jsonMap   LAPI返回的数据结构
 * @param mappingMap    页面ID和jsonMap中字段的映射关系表，key为页面控件的ID,value为jsonMap中的层级list
 * @param dataMap   页面的dataMap
 * @param type  0：表示jsonMap To dataMap，1：表示dataMap To JSONMap
 * @return
 */
function changeMapToMapByMapping(jsonMap, mappingMap, dataMap, type) {
    var n,
        keyList = [],
        i = 0,
        len = 0,
        pMap;
    
    for (n in mappingMap) {
        keyList = mappingMap[n];
        pMap = jsonMap;
        
        for (i = 0, len = keyList.length; i < (len - 1); i++) {
            pMap = pMap[keyList[i]];
        }
        
        if (0 == type) {
            dataMap[n] = pMap[keyList[i]];
        } else {
            if ("number" == typeof pMap[keyList[i]])
            {
                dataMap[n] = Number(dataMap[n]);
            }
            pMap[keyList[i]] = dataMap[n];
        }
    }
}

/**
 * 将JsonMap的值赋给页面
 * 
 * @param jsonMap  LAPI返回的数据结构
 * @param dataMap web赋值需要的数据对象,如果dataMap未定义，效果等价于cfgToForm
 * @param mappingMap 页面ID和jsonMap中字段的映射关系表，key为页面控件的ID,value为jsonMap中的层级list
 * @return
 */
function LAPI_CfgToForm(formId, jsonMap, dataMap, mappingMap) {
    if ("undefined" == typeof dataMap) {
        cfgToForm(jsonMap, formId);
        return;
    }
    if ("undefined" == typeof mappingMap) {
        $.extend(dataMap, jsonMap);
    } else {
        changeMapToMapByMapping(jsonMap, mappingMap, dataMap, 0);
    }
    cfgToForm(dataMap, formId);
}

/**
 * 将页面的值赋给JsonMap
 * 
 * @param jsonMap  LAPI返回的数据结构
 * @param dataMap web赋值需要的数据对象,如果dataMap未定义，效果等价于formToCfg
 * @param mappingMap 页面ID和jsonMap中字段的映射关系表，key为页面控件的ID,value为jsonMap中的层级list
 * @return
 */
function LAPI_FormToCfg(formId, jsonMap, dataMap, mappingMap) {
    if ("undefined" == typeof dataMap) {
        formToCfg(formId,jsonMap);
        return;
    }
    formToCfg(formId,dataMap);
    if ("undefined" == typeof mappingMap) {
        $.extend(jsonMap, dataMap);
    } else {
        changeMapToMapByMapping(jsonMap, mappingMap, dataMap, 1);
    }
}

/**
 *
 * @param url
 * @param fileId  文件上传的Id
 * @param callback (回调函数)
 * @constructor
 * @return {boolean}
 */
function LAPI_UploadFile(url, fileId, callback) {
    var flag = true;
    $.ajaxFileUpload({
        url: url,
        type: 'POST',
        secureuri: false, //一般设置为false
        dataType:'json',
        fileElementId: fileId, // 上传文件的id、name属性名
        timeout: 180000,
        success: function (data) {
            flag = (ResultCode.RESULT_CODE_SUCCEED == data.Response.StatusCode);
        },
        error: function (e,a,b,c,d) {
            flag = false;
        },
        complete: function () {//只要完成即执行，最后执行
            callback(flag);
        }
    });
    return flag;
}

/**
 * 云台控制 cmd {Number} 命令字 cmdparam1 命令字参数1 cmdparam2 命令字参数2
 */
function submitCtrolCmd(cmd, cmdparam1, cmdparam2) {
    var cmdparam3 = 0;
    
    if ("undefined" == typeof (cmdparam1)) {
        cmdparam1 = 0;
    }

    if ("undefined" == typeof (cmdparam2)) {
        cmdparam2 = 0;
    }
    
    if (top.banner.isSupportFishEye) {
        if(video.statusList.length != 0) {
            cmdparam3 = video.statusList[video.wndID]["streamID"] - 12;
        }
    }
    var jsonMap ={
        "PTZCmd":cmd,
        "ContinueTime":0,
        "Para1":parseInt(cmdparam1),
        "Para2":parseInt(cmdparam2),
        "Para3":parseInt(cmdparam3)
    }
    var flag = LAPI_SetCfgData(LAPI_URL.LAPI_PTZCtrl,jsonMap,false,dealResultCode);
    return flag;
}

function dealResultCode(retcode) {
    switch (parseInt(retcode, 10)) {
        case ResultCode.RESULT_CODE_SUCCEED:
            break;
        case ResultCode.PTZModeNotMatch:
            alert($.lang.tip["tipPTZModeNotMatch"]);
            break;
        case ResultCode.ERR_SDK_PTZ_MODE_CRUISE_FULL:
            alert($.lang.tip["tipTrackRecordFull"]);
            break;
        default:
            alert($.lang.tip["tipSetParamErr"]);
            break;
    }
}

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function() {
    var initializing = false,
        fnTest = /xyz/.test(function() {
            xyz;
        }) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function() {};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn) {
                return function() {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) : prop[name];
        }

        // The dummy class constructor

        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init) this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

function isWin64Platform(){
    var i = window.navigator.platform.toLowerCase();
        n = window.navigator.userAgent.toLowerCase();

    return - 1 === n.indexOf("wow64") && -1 !== n.indexOf("win64");
}

function isMacPlatform(){
    var i = window.navigator.platform.toLowerCase(),
        n = window.navigator.userAgent.toLowerCase(),
        o = null !== i.match("mac");

    return o
}
/**
 *
 * @param url
 * @param fileId  文件上传的Id
 * @param callback (回调函数)
 * @constructor
 * @return {boolean}
 */
function LAPI_UploadFile(url, fileId, callback) {
    var flag = true;
    $.ajaxFileUpload({
            url: url,
            type: 'POST',
            secureuri: false, //一般设置为false
            dataType:'json',
            fileElementId: fileId, // 上传文件的id、name属性名
            timeout: 180000,
            success: function (data) {
                flag = (ResultCode.RESULT_CODE_SUCCEED == data.Response.StatusCode);
            },
            error: function (e,a,b,c,d) {
                flag = false;
            },
            complete: function () {//只要完成即执行，最后执行
                callback(flag);
            }
    });
    return flag;
}
//字符过长截断
function strLimit() {
    $(".strLimit").each(function () {
        var $this = $(this),
            $td = $this.parent("td"),
            $oClone,
            nWidth;
        $oClone = $this.clone();
        $("body").append($oClone);
        if($td.length == 0){
            nWidth = $oClone.width();
            $oClone.css("max-width","none");
        }else{
            nWidth = $td.width();
			$this.css("display","block");
        }
        $oClone.css({
            "width":"auto",
            "display": "inline"
        });
        if ($oClone.width() > nWidth) {
            $this.attr("title", $this.text().trim());
        }
        $oClone.remove();
    })
}

function strShow($this) {
    var $clone = $this.clone();
    $this.addClass("sectionWidth");
    $this.siblings(".sectionWidth").removeClass("sectionWidth");

    if($this.width() < $clone.width()){
        $this.removeClass("sectionWidth");
    }
}
/**
 * 将输入的明文口令转换成密文口令
 *
 * @param str
 * @returns {string}
 */
function passwd2Cipher(str)
{
    var cipherStr = "",
        len = str.length,
        tmpData,
        number,
        i = 0;

    if (0 == len) {
        cipherStr = "nullpassword";
    } else {
        /* 先将明文依次与0x5a、0xa5进行异或，再将得到的结果的每个字节高低4位映射成一个字母，
         即将0~15的值映射为ASCII 33~126，公式为：5*x+33， */
        number = 0x5a;
        while (i < len) {
            tmpData = str.charCodeAt(i) ^ number;
            number = ~number;

            /* 高4位 */
            cipherStr += String.fromCharCode(((tmpData >> 4) & 0x0f) * 5 + 33);

            /* 低4位 */
            cipherStr += String.fromCharCode(((tmpData) & 0x0f) * 5 + 33);

            i++;
        }
    }

    return cipherStr;
}


//智能互斥关系
function smartMutexFunc(currentSmartId,smartMap){
    var SmartMutexMap = {},
        SmartMutex =[],//得到与当前选中功能互斥的功能数组
        releationNums,
        enableList,//得到切换前所有已启用的功能
        listLentgh,
        firstMutexArr =[],//存在不互斥的未过滤的数组
        notMutexArr = [],//得到不互斥的功能
        finalMutexList =[];//最终要变化的互斥功能

    if(!LAPI_GetCfgData(LAPI_URL.MutexRelationInfo,SmartMutexMap)){
        return ;
    }

    enableList = smartMap["EnableIDs"];
    listLentgh = smartMap["EnableIDs"].length;
    releationNums = SmartMutexMap["Num"];

    for(var i =0;i<releationNums;i++){
        var arrList = SmartMutexMap["CompatibleRelations"][i]["IDs"]
        if(-1 != $.inArray(currentSmartId,arrList)){
            for(var m=0;m<arrList.length;m++){
                notMutexArr.push(arrList[m]);//与当前选中不互斥的所有功能
            }
        }else{
            for(var j=0;j<arrList.length;j++){
                SmartMutex.push(arrList[j])//从接口中获取到的互斥关系，遍历若数组中不存在当前选中元素，就将该数组内的数值都添加到临时互斥数组中
            }
        }
    }
    firstMutexArr = objectClone(SmartMutex);
    for(var len=0;len < firstMutexArr.length;len++){
        var index;
        if( -1 != $.inArray(firstMutexArr[len], notMutexArr)){//临时互斥数组遍历，若存在元素和当前选中元素不互斥的则删除，最终得到真正需要去勾选的元素
            index = $.inArray(firstMutexArr[len], SmartMutex);
            SmartMutex.splice(index,1);
        }
    }
    for(var j=0;j < listLentgh;j++){
        if(-1 != $.inArray(enableList[j],SmartMutex)){//如果当前互斥的功能已启用
            finalMutexList.push(enableList[j])
        }
    }
    return finalMutexList;//此数组为已启用功能中与当前选中功能互斥的，得到该数组为了进行弹框提示以及去勾选操作
}

//互斥提示语
function smartMutexMsg(mutexList,value) {//参数1：已开启但是与当前勾选功能互斥的所有功能；参数2：当前选中的功能
    var  msg  = "",msg1,msg2 ="",smart1Flag = false;
    msg1 = top.banner.smartMapping[value];//当前点击的功能名称
    if(0 >= mutexList.length){//说明当前勾选操作不存在与已勾选的互斥，可以直接勾选上无需提示
        return msg;
    }
    if(0 <= value  && 100 > value){//人脸、人数统计、链式计算,跟踪与所有功能互斥
        for(var i in mutexList){
            var msgType = mutexList[i];
            if(0 <= msgType  && 100 > msgType){//人脸检测，客流量统计，链式计算和跟踪四个只能开一个，所以提示语也只有一个
                msg2 = top.banner.smartMapping[msgType];
            }else if(100 <=msgType && 300 > msgType){
                    if(100 <=msgType && 200 > msgType){//smart1开启
                        msg2 = $.lang.pub["alarmMenu"];
                        smart1Flag = true;
                    }
                    if(200 <=msgType && 300 > msgType){//smart2开启
                        if(smart1Flag){//smart1和smart2都开启着时提示语加起来
                            msg2 = $.lang.pub["alarmMenu"]+"、" +$.lang.pub["alarmAbnorMenu"];
                        }else{
                            msg2 = $.lang.pub["alarmAbnorMenu"];
                        }
                    }
            }
        }

    }else{
        for(var i in mutexList){
            if(100 <= value  && 200 > value){
                if(100 > mutexList[i]){ // smart1和跟踪不互斥
                    msg2 = top.banner.smartMapping[mutexList[i]]
                }
            }else{
                if(100 > mutexList[i]){ //人脸、人数统计、天网卡口,链式计算最多只会开着一个
                    msg2 = top.banner.smartMapping[mutexList[i]]
                }
            }
        }
    }
    msg = $.lang.tip["tipSmartMutex"].replace("%s1",
        msg1).replace("%s2", msg2);
    return msg;
}


function mutexSmartFunc(flag,currnetSmartnum) {
    var msg = "",
        mutexList=[],
        mutexLength,
        mutexMsg="",
        smartMap={}


    if(!LAPI_GetCfgData(LAPI_URL.MutexWorkingStatus,smartMap)){
        return ;
     }
    if(flag){
        if(-1 == $.inArray(currnetSmartnum, smartMap["DisableIDs"])){
            return true;
        }
    }else{
        if(-1 == $.inArray(currnetSmartnum, smartMap["EnableIDs"])){
            return true;
        }
    }
    if(flag){
        mutexList = smartMutexFunc(currnetSmartnum,smartMap);//得到与当前勾选操作互斥的已启用功能
           if(undefined != mutexList && [] != mutexList){
               mutexLength = mutexList.length;
               mutexMsg = smartMutexMsg(mutexList,currnetSmartnum);//已启用互斥功能提示语
           }


        if("" != mutexMsg){//不为空说明存在已启用功能与当前勾选功能互斥
            if(confirm(mutexMsg)){
                for(var i=0;i<mutexLength;i++){
                    smartMap["EnableIDs"].splice($.inArray(mutexList[i], smartMap["EnableIDs"]),1);
                    smartMap["DisableIDs"].push(mutexList[i]);
                }
                smartMap["DisableIDs"].splice($.inArray(currnetSmartnum, smartMap["DisableIDs"]),1);
                smartMap["EnableIDs"].push(currnetSmartnum);
                smartMap["DisableNum"] = smartMap["DisableIDs"].length;
                smartMap["EnableNum"] = smartMap["EnableIDs"].length;
            }else{
                return false;
            }
        }else{
            smartMap["DisableNum"] = smartMap["DisableNum"] - 1;
            smartMap["EnableNum"] = smartMap["EnableNum"] + 1;
            smartMap["EnableIDs"].push(currnetSmartnum);
            smartMap["DisableIDs"].splice($.inArray(currnetSmartnum, smartMap["DisableIDs"]),1);
        }
    }else{//反之，可以直接将当前勾选功能添加到启用数组，并从不启用数组中删除
        smartMap["DisableNum"] = smartMap["DisableNum"] + 1;
        smartMap["EnableNum"] = smartMap["EnableNum"] - 1;
        smartMap["DisableIDs"].push(currnetSmartnum);
        smartMap["EnableIDs"].splice($.inArray(currnetSmartnum, smartMap["EnableIDs"]),1);
    }

    if(LAPI_SetCfgData(LAPI_URL.MutexWorkingStatus, smartMap)){
        return true;
    }else{
        return false;
    }
}





