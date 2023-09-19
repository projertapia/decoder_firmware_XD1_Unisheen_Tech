var ip_allow=1;
var netmask_allow=1;
var gateway_allow=1;

function parentpage_adjust_height(){
	window.parent.setup_iframe_height();
}

function init_wifi_list_width(){
	$("#wifi_list").width($("#wifi_essid").width()+6);
}

function checkIp(str) {
		var regular = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	return regular.test(str);
}

function checkNetmask(str) {
	var regular = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
	return regular.test(str);
}

function allow_upload_config(){
	if(ip_allow==1&&netmask_allow==1&&gateway_allow==1){
		$("#wifi_config_button").attr("disabled",false);
	}else{
		$("#wifi_config_button").attr("disabled",true);
	}
}

function auto_padding_ssid(){
	$("#wifi_essid").val($("#wifi_list").val());
	$("#wifi_password").attr("value","");
}

function wifi_refresh_ap(){
	$("#wifi_list_hint_text").removeClass("display_off");
	$.ajax({
	    type: "GET",
	    url: "http://" + xc_gethost() + "/get_ap",
	    dataType: "xml",
	    cache: false,
        async: false,
	    error: function () {
	    },
	    success: function (data) {
			$("#wifi_list_hint_text").addClass("display_off");
	    	var nodeList = $(data).find("ap");
	    	var result;
			for (var i = 0; i < nodeList.length; i++) {
				var ssid = $(data).find("ap[id=" + i + "]").children("ssid").text();
				var mac = $(data).find("ap[id=" + i + "]").children("mac").text();
				mac = mac.toUpperCase();
				var level = $(data).find("ap[id=" + i + "]").children("level").text();
				var frequency = $(data).find("ap[id=" + i + "]").children("frequency").text();
				result += '<option value="' + ssid + '">' + ssid + '(' + mac + '/' + level + 'dB/' + frequency + 'MHz)</option>';
			}
			$("#wifi_list").empty().append(result);
            
            auto_padding_ssid();
	    },
	    error: function (){
        	alert($.i18n.prop('wifi_refresh_failed'));
			$("#wifi_list_hint_text").addClass("display_off");
        }
	});
}

function wifi_dhcp_change(){
	var wifi_dhcp = $('#wifi_dhcp').val();
	if(wifi_dhcp==1){
		$("#wifi_ip").attr("disabled","true");
		$("#wifi_netmask").attr("disabled","true");
		$("#wifi_gateway").attr("disabled","true");
	}else if(wifi_dhcp==0){
		$("#wifi_ip").removeAttr("disabled");
		$("#wifi_netmask").removeAttr("disabled");
		$("#wifi_gateway").removeAttr("disabled");
	}
}

function get_wifi_status() {
	$.ajax({
	    type: "GET",
	    url: "http://" + xc_gethost() + "/get_wifi",
	    dataType: "xml",
	    cache: false,
	    error: function () {
	    },
	    success: function (data) {
	    	var wifi_enable=$(data).find("wifi_enable").text();
	    	if(wifi_enable==1){
	    		$("#wifi_switch_on_txt").attr("selected","selected");
	    	}else{
	    		$("#wifi_switch_off_txt").attr("selected","selected");
	    	}
			parentpage_adjust_height();
    		init_wifi_list_width();
	    	
	        var wifi_essid = $(data).find("wifi_essid").text();
	        if(wifi_essid != "") $("#wifi_essid").val(wifi_essid);
	
	        var wifi_password = $(data).find("wifi_psk").text();
	        $("#wifi_password").val(wifi_password);
	
	        var wifi_dhcp_enable = $(data).find("wifi_dhcp_enable").text();
	    	if(wifi_dhcp_enable==1){
	    		$("#wifi_dhcp_on_txt").attr("selected","selected");
	    	}else{
	    		$("#wifi_dhcp_off_txt").attr("selected","selected");
	    	}
	    	wifi_dhcp_change();
	
	        var wifi_ip = $(data).find("wifi_ip").text();
	        $("#wifi_ip").val(wifi_ip);
	
	        var wifi_netmask = $(data).find("wifi_netmask").text();
	        $("#wifi_netmask").val(wifi_netmask);
	
	        var wifi_gateway = $(data).find("wifi_gateway").text();
	        $("#wifi_gateway").val(wifi_gateway);
	        
	      }
	});
}

function language_setup() {
    jQuery.i18n.properties({
        name: 'common',
        path: '../lang/',
        mode: 'map',
        language: window.parent.get_language_setup(),
        callback: function () {
            $('#header_text').html($.i18n.prop('wifi_header_txt'));
            $('#wifi_status_txt').html($.i18n.prop('wifi_status_txt'));
            $('#wifi_switch_txt').html($.i18n.prop('wifi_switch_txt'));
            $('#wifi_switch_on_txt').html($.i18n.prop('wifi_switch_on_txt'));
            $('#wifi_switch_off_txt').html($.i18n.prop('wifi_switch_off_txt'));
            $('#wifi_connect_setting_text').html($.i18n.prop('wifi_connect_setting_text'));
            $('#wifi_essid_txt').html($.i18n.prop('wifi_essid_txt'));
            $('#wifi_list_txt').html($.i18n.prop('wifi_list_txt'));
            $('#wifi_list_hint_text').html($.i18n.prop('wifi_list_hint_text'));
            $('#wifi_password_txt').html($.i18n.prop('wifi_password_txt'));
            $('#wifi_dhcp_txt').html($.i18n.prop('wifi_dhcp_txt'));
            $('#wifi_dhcp_on_txt').html($.i18n.prop('wifi_dhcp_on_txt'));
            $('#wifi_dhcp_off_txt').html($.i18n.prop('wifi_dhcp_off_txt'));
            $('#wifi_ip_txt').html($.i18n.prop('wifi_ip_txt'));
            $('#wifi_netmask_txt').html($.i18n.prop('wifi_netmask_txt'));
            $('#wifi_gateway_txt').html($.i18n.prop('wifi_gateway_txt'));
            $('#wifi_config_button').val($.i18n.prop('wifi_config_button_txt'));
        }
    });
}

function wifi_setting() {
    var ptmp = "";
    
    var wifi_switch = $('#wifi_switch').val();
    ptmp += "wifi_enable=" + wifi_switch + "&";
    
    var wifi_essid = encodeURIComponent($('#wifi_essid').val());
    ptmp += "wifi_essid=" + wifi_essid + "&";

    var wifi_password = encodeURIComponent($('#wifi_password').val());
    ptmp += "wifi_psk=" + wifi_password + "&";

    var wifi_dhcp = $('#wifi_dhcp').val();
    ptmp += "wifi_dhcp_enable=" + wifi_dhcp + "&";

    var wifi_ip = $('#wifi_ip').val();
    ptmp += "wifi_ip=" + wifi_ip + "&";

    var wifi_netmask = $('#wifi_netmask').val();
    ptmp += "wifi_netmask=" + wifi_netmask + "&";

    var wifi_gateway = $('#wifi_gateway').val();
    ptmp += "wifi_gateway=" + wifi_gateway + "&";
    
    ptmp += "index=0";
    
    $.ajax({
        type: "GET",
        url: "http://" + xc_gethost() + "/set_wifi" + "?" + ptmp,
        cache: false,
        success: function (data) {
        	var ret = $(data).find("return").text();
            if ("ok" == ret) {
                alert($.i18n.prop('wifi_setting_success'));
            }
            else {
                alert($.i18n.prop('wifi_setting_failed'));
            }
        },
        error: function (){
        	alert($.i18n.prop('wifi_setting_failed'));
        }
    });
}

$(function () {
	language_setup();
    wifi_refresh_ap();
    get_wifi_status();
    $("#wifi_essid").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#wifi_essid_hint_image").removeClass("display_off");
    		$("#wifi_essid_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_empty_text'));
    		ip_allow=0;
    	}else{
    		$("#wifi_essid_hint_image").addClass("display_off");
    		$("#wifi_essid_hint_text").addClass("display_off").html("");
    		ip_allow=1;
    	}
    	allow_upload_config();
    });
    $("#wifi_ip").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#wifi_ip_hint_image").removeClass("display_off");
    		$("#wifi_ip_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_empty_text'));
    		ip_allow=0;
    	}else if(!checkIp(value)){
    		$("#wifi_ip_hint_image").removeClass("display_off");
    		$("#wifi_ip_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_format_text'));
    		ip_allow=0;
    	}else{
    		$("#wifi_ip_hint_image").addClass("display_off");
    		$("#wifi_ip_hint_text").addClass("display_off").html("");
    		ip_allow=1;
    	}
    	allow_upload_config();
    });
    $("#wifi_netmask").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#wifi_netmask_hint_image").removeClass("display_off");
    		$("#wifi_netmask_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_empty_text'));
    		netmask_allow=0;
    	}else if(!checkNetmask(value)){
    		$("#wifi_netmask_hint_image").removeClass("display_off");
    		$("#wifi_netmask_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_format_text'));
    		netmask_allow=0;
    	}else{
    		$("#wifi_netmask_hint_image").addClass("display_off");
    		$("#wifi_netmask_hint_text").addClass("display_off").html("");
    		netmask_allow=1;
    	}
    	allow_upload_config();
    });
    $("#wifi_gateway").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#wifi_gateway_hint_image").removeClass("display_off");
    		$("#wifi_gateway_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_empty_text'));
    		gateway_allow=0;
    	}else if(!checkIp(value)){
    		$("#wifi_gateway_hint_image").removeClass("display_off");
    		$("#wifi_gateway_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_format_text'));
    		gateway_allow=0;
    	}else{
    		$("#wifi_gateway_hint_image").addClass("display_off");
    		$("#wifi_gateway_hint_text").addClass("display_off").html($.i18n.prop(''));
    		gateway_allow=1;
    	}
    	allow_upload_config();
    });
})