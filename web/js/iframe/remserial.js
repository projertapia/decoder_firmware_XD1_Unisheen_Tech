var remserial_ip_allow=1;
var remserial_port_allow=1;

function checkIp(str){			
	var ss =/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	return ss.test(str);	
}
function checkPort(str){
	var ss =  /^([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
	return ss.test(str);
}

function allow_upload(){
	//如果IP可见，且ip_allow为0则表示数据错误;否则启用设置按钮
	var temp1 = $("#remserial_ip").is(":visible");
	var temp2 = $("#remserial_port").is(":visible");
	if(temp1 && remserial_ip_allow == 0) temp1 = 0;
	else temp1 = 1;
	if(temp2 && remserial_port_allow == 0) temp2 = 0;
	else temp2 = 1;

	if(temp1 && temp2){
		$("#remsera_setting").attr("disabled",false);
	}else{
		$("#remsera_setting").attr("disabled",true);
	}
}

function remserial_mode_change(){
	var remserial_mode = $('#remserial_mode').val();
	if(remserial_mode=="server"){
		$("#remserial_ip_txt").addClass("display_off");
		$("#remserial_ip").addClass("display_off");
		$('#remserial_port_txt').html($.i18n.prop('remserial_port_server_txt'));
	}else if(remserial_mode=="client"){
		$("#remserial_ip_txt").removeClass("display_off");
		$("#remserial_ip").removeClass("display_off");
		$('#remserial_port_txt').html($.i18n.prop('remserial_port_txt'));
	}
}
function get_serial() {
	$.ajax({
	    type: "GET",
	    url: "http://" + xc_gethost() + "/get_serial",
	    dataType: "xml",
	    cache: false,
	    error: function () {
	    },
	    success: function (data) {	        
	        var serial_mod = $(data).find("serial").find("serial_mod").text();
	    	if(serial_mod=="server"){
	    		$("#remserial_mode_server_txt").attr("selected","selected");
	    	}else{
	    		$("#remserial_mode_client_txt").attr("selected","selected");
	    	}
			remserial_mode_change();
	    	
	        var serial_baud = $(data).find("serial").find("serial_baud").text();
	        $("#remserial_baud").attr("value", serial_baud);

			var serial_ip = $(data).find("serial").find("serial_ip").text();
	        $("#remserial_ip").attr("value", serial_ip);

			var serial_port = $(data).find("serial").find("serial_port").text();
	        $("#remserial_port").attr("value", serial_port);
	      }
	});
}
function remserial_setting() {
    var serial_mode = $('#remserial_mode').val();
    var serial_baud = $('#remserial_baud').val();
    var serial_ip = $('#remserial_ip').val();
	var serial_port = $('#remserial_port').val();
   
    var param = "serial_mod=" + serial_mode + "&serial_baud=" + serial_baud + "&serial_ip=" + serial_ip + "&serial_port=" + serial_port;
    $.ajax({
        type: "GET",
        url: "http://" + xc_gethost() + "/set_serial" + "?" + param,
        cache: false,
        success: function (data) {
            var ret = $(data).find("return").text();
            if ("ok" == ret) {
                alert($.i18n.prop('remserial_setting_success'));
            }
            else {
                alert($.i18n.prop('remserial_setting_failed'));
            }
        },
        error: function (){
        	alert($.i18n.prop('remserial_setting_failed'));
        }
    });
}

function init_language(){
    jQuery.i18n.properties({
        name: 'common',
        path: '../lang/',
        mode: 'map',
        language: window.parent.get_language_setup(),
        callback: function () {
			$('#header_text').html($.i18n.prop('index_remserial'));
			$('#remserial_mode_txt').html($.i18n.prop('remserial_mode_txt'));
			$('#remserial_mode_server_txt').html($.i18n.prop('remserial_mode_server_txt'));
            $('#remserial_mode_client_txt').html($.i18n.prop('remserial_mode_client_txt'));
			$('#remserial_baud_txt').html($.i18n.prop('remserial_baud_txt'));
			$('#remserial_ip_txt').html($.i18n.prop('remserial_ip_txt'));
			$('#remserial_port_txt').html($.i18n.prop('remserial_port_txt'));
			$('#remserial_setting').val($.i18n.prop('remserial_setting'));
        }
    });
}

$(function () {
	init_language();
	get_serial();

	$("input[type='text']").focusin(function(){
		$(this).next().next().removeClass("display_off");;
	});
    $("#remserial_ip").focusout(function(){
		if($(this).is(":visible")){
			var value=$(this).val();
			if(value==""){
				$("#remserial_ip_hint_image").removeClass("display_off");
				remserial_ip_allow=0;
			}else if(!checkIp(value)){
				$("#remserial_ip_hint_image").removeClass("display_off");
				remserial_ip_allow=0;
			}else{
				$("#remserial_ip_hint_image").addClass("display_off");
				remserial_ip_allow=1;
			}
		}
    	allow_upload();
    });
    $("#remserial_port").focusout(function(){
		if($(this).is(":visible")){
    	var value=$(this).val();
			if(value==""){
				$("#remserial_port_hint_image").removeClass("display_off");
				remserial_port_allow=0;
			}else if(!checkPort(value)){
				$("#remserial_port_hint_image").removeClass("display_off");
				remserial_port_allow=0;
			}else{
				$("#remserial_port_hint_image").addClass("display_off");
				remserial_port_allow=1;
			}
		}
    	allow_upload();
    });
});