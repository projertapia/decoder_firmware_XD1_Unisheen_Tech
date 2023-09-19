function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

function getlanguage() {
   /* var lang = getCookie("HI3520V300Language");
    
    if ("" != lang) {
        return lang;
    }
    */
	var lang ="";
    $.ajax({
        type: "GET",
        url: "http://" + xc_gethost() + "/get_language",
        dataType: "xml",
        cache: false,
        error: function () {
        },
        success: function (data) {
            lang = $(data).find("language").text();
           // setlanguage(lang);
        }
    });
    return lang;
}

function setlanguage(lang) {
    setCookie("HI3520V300Language", lang, 30);
    $.ajax({
        type: "GET",
        url: "http://" + xc_gethost() + "/set_language?language=" + lang,
        dataType: "xml",
        cache: false,
        error: function () {
        },
        success: function (data) {
        }
    });
}

function xc_gethost() {
    return window.location.host;
}

function xc_getwndnum() {
    return 4;
}
