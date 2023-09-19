
var waiting_timer;
var timeout_count=0;

function reboot_wait(ip){
	 $.ajax({
        type: "GET",
        url: "http://" + xc_gethost() + "/get_status",
        dataType: "xml",
        cache: false,
        timeout:1500,
        success: function (data) {
        	clearInterval(waiting_timer);
            setTimeout(function(){
           		window.parent.window.location.href="http://" + ip;
            },1000);
        },
        error: function (){
    		timeout_count++;
    		if(timeout_count>20){
    			timeout_count=0;
    			clearInterval(waiting_timer);
    			alert($.i18n.prop('reboot_timeout'));
    		}
        }
    });
}

function reboot_apply() {
    $.ajax({
        type: "GET",
        url: "http://" + xc_gethost() + "/reboot",
        cache: false,
        success: function (data) {
            var ret = $(data).find("return").find("status").text();
            if ("ok" == ret) {
            	$("#reboot_apply").attr("disabled","disabled");
            	$("#reload").removeClass("display_off");
            	$("#reboot_reload_text").removeClass("display_off");
            	var ip = $(data).find("return").find("redirection").text();
                waiting_timer=setInterval(function(){
               		reboot_wait(ip);
                },3000);
            }
            else {
                alert($.i18n.prop('reboot_failed'));
            }
        },
        error: function (){
        	alert($.i18n.prop('reboot_failed'));
        }
    });
}

function init_language() {
    jQuery.i18n.properties({
        name: 'common',
        path: '../lang/',
        mode: 'map',
        language: window.parent.get_language_setup(),
        callback: function () {
            $('#reboot_apply_txt').html($.i18n.prop('reboot_apply_txt'));
            $('#reboot_apply').val($.i18n.prop('reboot_apply'));
            $('#header_text').html($.i18n.prop('index_reboot'));
            $('#reboot_reload_text').html($.i18n.prop('reboot_reload_text'));
        }
    });
}

$(function () {
	init_language();
});