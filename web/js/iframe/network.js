var max_wnd = xc_getwndnum();
var ip_allow=1;
var netmask_allow=1;
var gateway_allow=1;
var mac_allow=1;
var dns0=1;
var dns1=1;
var httpport=1;
var ntpserver=1;

function checkIp(str) {
	var regular = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	return regular.test(str);
}

function CheckMac(str) {
	var regular = /^[a-fA-F\d]{2}:[a-fA-F\d]{2}:[a-fA-F\d]{2}:[a-fA-F\d]{2}:[a-fA-F\d]{2}:[a-fA-F\d]{2}$/;
	return regular.test(str);
}

function checkNetmask(str) {
	var regular = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
	return regular.test(str);
}

function IsInteger(interger) {
    var IsInteger = true;
    if (parseInt(interger) == interger) {
        IsInteger = true;
    }
    else {
        IsInteger = false;
    }
    return IsInteger;
}
function checkPort(str)
{
	var IntPort = IsInteger(str);
	var port = parseInt(str);

	if(port < 1 || port > 65535 || IntPort == false) {
		return false;
	}
	return true;
}
function allow_upload_config(){
	if(ip_allow==1&&netmask_allow==1&&gateway_allow==1&&mac_allow==1&&dns0==1&&dns1==1&&httpport==1&&ntpserver==1){
		$("#network_setting").attr("disabled",false);
	}else{
		$("#network_setting").attr("disabled",true);
	}
}

function network_dhcp_change(){
	var network_dhcp = $('#network_dhcp').val();
	if(network_dhcp==1){
		$("#network_ip").attr("disabled","true");
		$("#network_netmask").attr("disabled","true");
		$("#network_gateway").attr("disabled","true");
	}else if(network_dhcp==0){
		$("#network_ip").removeAttr("disabled");
		$("#network_netmask").removeAttr("disabled");
		$("#network_gateway").removeAttr("disabled");
	}
}

function get_playlist() {
	$.ajax({
	    type: "GET",
	    url: "http://" + xc_gethost() + "/get_net",
	    dataType: "xml",
	    cache: false,
	    error: function () {
	    },
	    success: function (data) {
	        $(data).find("net");
	        
	        var dhcp_enable = $(data).find("dhcp_enable").text();
	    	if(dhcp_enable==1){
	    		$("#network_dhcp_on_txt").attr("selected","selected");
	    	}else{
	    		$("#network_dhcp_off_txt").attr("selected","selected");
	    	}
	    	
	        var network_ip = $(data).find("ip").text();
	        $("#network_ip").val(network_ip);
	
	        var network_netmask = $(data).find("netmask").text();
	        $("#network_netmask").attr("value", network_netmask);
	
	        var network_gateway = $(data).find("gateway").text();
	        $("#network_gateway").attr("value", network_gateway);
	
	        var network_mac = $(data).find("mac").text();
	        $("#network_mac").attr("value", network_mac);
	
	        var network_dns0 = $(data).find("dns0").text();
	        $("#network_dns0").attr("value", network_dns0);
	
	        var network_dns1 = $(data).find("dns1").text();
	        $("#network_dns1").attr("value", network_dns1);

			var network_httpport = $(data).find("http_port").text();
			$("#network_webport").attr("value", network_httpport);

			var ntp_enable = $(data).find("ntp_enable").text();
			var ntp_server = $(data).find("ntp_server").text();
			var ntp_timezone = $(data).find("ntp_zone").text();
			$("#network_ntp_enable").attr("value", ntp_enable);
			$("#network_ntp_server").attr("value", ntp_server);
			$("#network_ntp_timezone").attr("value", ntp_timezone);
			
			network_dhcp_change();
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
            $('#network_interface_txt').html($.i18n.prop('network_interface_txt'));
            $('#network_dhcp_txt').html($.i18n.prop('network_dhcp_txt'));
            $('#network_dhcp_off_txt').html($.i18n.prop('network_dhcp_off_txt'));
            $('#network_dhcp_on_txt').html($.i18n.prop('network_dhcp_on_txt'));
            $('#network_ip_txt').html($.i18n.prop('network_ip_txt'));
            $('#network_netmask_txt').html($.i18n.prop('network_netmask_txt'));
            $('#network_gateway_txt').html($.i18n.prop('network_gateway_txt'));
            $('#network_mac_txt').html($.i18n.prop('network_mac_txt'));
            $('#network_dns_setting_txt').html($.i18n.prop('network_dns_setting_txt'));
            $('#network_dns0_txt').html($.i18n.prop('network_dns0_txt'));
            $('#network_dns1_txt').html($.i18n.prop('network_dns1_txt'));
            $('#network_setting').val($.i18n.prop('network_setting'));
            $('#header_text').html($.i18n.prop('index_network'));
			$('#network_port_setting_txt').html($.i18n.prop('network_port_setting_txt'));
			$('#network_webport_txt').html($.i18n.prop('network_webport_txt'));
			$('#network_ntp_setting_txt').html($.i18n.prop('network_ntp_setting_txt'));
			$('#network_ntp_enable_txt').html($.i18n.prop('network_ntp_enable_txt'));
            $('#network_ntp_enable_off_txt').html($.i18n.prop('network_dhcp_off_txt'));
            $('#network_ntp_enable_on_txt').html($.i18n.prop('network_dhcp_on_txt'));
			$('#network_ntp_server_txt').html($.i18n.prop('network_ntp_server_txt'));
			$('#network_ntp_timezone_txt').html($.i18n.prop('network_ntp_timezone_txt'));
        }
    });
}

function network_setting() {
    var ptmp = "";
    var network_dhcp = $('#network_dhcp').val();
    ptmp += "dhcp_enable=" + network_dhcp + "&";
    
    var network_ip = $('#network_ip').val();
    ptmp += "ip=" + network_ip + "&";

    var network_netmask = $('#network_netmask').val();
    ptmp += "netmask=" + network_netmask + "&";

    var network_gateway = $('#network_gateway').val();
    ptmp += "gateway=" + network_gateway + "&";

    var network_mac = $('#network_mac').val();
    ptmp += "mac=" + network_mac + "&";

    var network_dns0 = $('#network_dns0').val();
    ptmp += "dns0=" + network_dns0 + "&";

    var network_dns1 = $('#network_dns1').val();
    ptmp += "dns1=" + network_dns1 + "&";

	var webport = $("#network_webport").val();
	ptmp += "http_port=" + webport + "&";

	var ntp_enable = $('#network_ntp_enable').val();
	var ntp_server = $('#network_ntp_server').val();
	var ntp_timezone = $('#network_ntp_timezone').val();
	ptmp += "ntp_enable=" + ntp_enable + "&ntp_server=" + ntp_server + "&ntp_zone=" + ntp_timezone;

    $.ajax({
        type: "GET",
        url: "http://" + xc_gethost() + "/set_net" + "?" + ptmp,
        cache: false,
        success: function (data) {
        	var ret = $(data).find("return").text();
            if ("ok" == ret) {
                alert($.i18n.prop('network_setting_success'));
            }
            else {
                alert($.i18n.prop('network_setting_failed'));
            }
        },
        error: function (){
        	alert($.i18n.prop('network_setting_failed'));
        }
    });
}

$(function () {
	language_setup();
    get_playlist();
    $("#network_ip").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#ip_hint_image").removeClass("display_off");
    		$("#ip_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_empty_text'));
    		ip_allow=0;
    	}else if(!checkIp(value)){
    		$("#ip_hint_image").removeClass("display_off");
    		$("#ip_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_format_text'));
    		ip_allow=0;
    	}else{
    		$("#ip_hint_image").addClass("display_off");
    		$("#ip_hint_text").addClass("display_off").html("");
    		ip_allow=1;
    	}
    	allow_upload_config();
    });
    $("#network_netmask").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#netmask_hint_image").removeClass("display_off");
    		$("#netmask_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_empty_text'));
    		netmask_allow=0;
    	}else if(!checkNetmask(value)){
    		$("#netmask_hint_image").removeClass("display_off");
    		$("#netmask_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_format_text'));
    		netmask_allow=0;
    	}else{
    		$("#netmask_hint_image").addClass("display_off");
    		$("#netmask_hint_text").addClass("display_off").html("");
    		netmask_allow=1;
    	}
    	allow_upload_config();
    });
    $("#network_gateway").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#gateway_hint_image").removeClass("display_off");
    		$("#gateway_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_empty_text'));
    		gateway_allow=0;
    	}else if(!checkIp(value)){
    		$("#gateway_hint_image").removeClass("display_off");
    		$("#gateway_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_format_text'));
    		gateway_allow=0;
    	}else{
    		$("#gateway_hint_image").addClass("display_off");
    		$("#gateway_hint_text").addClass("display_off").html($.i18n.prop(''));
    		gateway_allow=1;
    	}
    	allow_upload_config();
    });
    $("#network_mac").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#mac_hint_image").removeClass("display_off");
    		$("#mac_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_empty_text'));
    		mac_allow=0;
    	}else if(!CheckMac(value)){
    		$("#mac_hint_image").removeClass("display_off");
    		$("#mac_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_format_text'));
    		mac_allow=0;
    	}else{
    		$("#mac_hint_image").addClass("display_off");
    		$("#mac_hint_text").addClass("display_off").html($.i18n.prop(''));
    		mac_allow=1;
    	}
    	allow_upload_config();
    });
    $("#network_dns0").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#dns1_hint_image").addClass("display_off");
    		$("#dns1_hint_text").addClass("display_off").html($.i18n.prop(''));
    		dns0=1;
    	}else if(!checkIp(value)){
    		$("#dns0_hint_image").removeClass("display_off");
    		$("#dns0_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_format_text'));
    		dns0=0;
    	}else{
    		$("#dns0_hint_image").addClass("display_off");
    		$("#dns0_hint_text").addClass("display_off").html($.i18n.prop(''));
    		dns0=1;
    	}
    	allow_upload_config();
    });
    $("#network_dns1").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#dns1_hint_image").addClass("display_off");
    		$("#dns1_hint_text").addClass("display_off").html($.i18n.prop(''));
    		dns1=1;
    	}else if(!checkIp(value)){
    		$("#dns1_hint_image").removeClass("display_off");
    		$("#dns1_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_format_text'));
    		dns1=0;
    	}else{
    		$("#dns1_hint_image").addClass("display_off");
    		$("#dns1_hint_text").addClass("display_off").html($.i18n.prop(''));
    		dns1=1;
    	}
    	allow_upload_config();
    });
	$("#network_webport").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#webport_hint_image").addClass("display_off");
			$("#webport_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_empty_text'));
    		httpport=0;
    	}else if(!checkPort(value)){
    		$("#webport_hint_image").removeClass("display_off");
    		$("#webport_hint_text").removeClass("display_off").html($.i18n.prop('netword_port_range_text'));
    		httpport=0;
    	}else{
    		$("#webport_hint_image").addClass("display_off");
    		$("#webport_hint_text").addClass("display_off").html($.i18n.prop(''));
    		httpport=1;
    	}
    	allow_upload_config();
    });
	$("#network_ntp_server").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#ntp_server_hint_image").addClass("display_off");
			$("#ntp_server_hint_text").removeClass("display_off").html($.i18n.prop('netword_hint_empty_text'));
    		ntpserver=0;
    	}else {
    		$("#ntp_server_hint_image").addClass("display_off");
    		$("#ntp_server_hint_text").addClass("display_off").html($.i18n.prop(''));
    		ntpserver=1;
    	}
    	allow_upload_config();
    });
})