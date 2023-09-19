
function IsValidate_ResetTime(schedule_restart_enable, schedule_restart_time) {
	validated = true;
	if (schedule_restart_time < 0) {
		alert($.i18n.prop('restart_time_error'));
		validated = false;
	}
	else if (schedule_restart_time >= 1440) {
		alert($.i18n.prop('restart_time_error'));
		validated = false;
	}
	return validated;
}

function timeStr2Int(timeStr) {
	var nums = timeStr.split(":");
	var hour = parseInt(nums[0]);
	var min = parseInt(nums[1]);
	return hour * 60 + min; //minutes
}
function timeInt2Str(timeInt) {
	var hour = parseInt(timeInt / 60);
	var min = parseInt(timeInt % 60);

	var str;
	if (hour < 10) str = "0" + hour;
	else str = hour.toString();

	if (min < 10) str += ":0" + min;
	else str += ":" + min;

	return str;
}

function get_data() {
	$.ajax({
	    type: "GET",
	    url: "http://" + xc_gethost() + "/get_rebootplan",
	    dataType: "xml",
	    cache: false,
	    error: function () {
	    },
	    success: function (data) { 	
	        var restart_enable = $(data).find("rebootplan").find("reboot_enable").text();
			var restart_time = $(data).find("rebootplan").find("reboot_time").text();
			restart_time = timeInt2Str(restart_time);

			$("#restart_enable").attr("value", restart_enable);
			$("#restart_time").attr("value", restart_time);
	    }
	});
}
function restart_setting() {
    var restart_enable = $("#restart_enable").val();
	var restart_time = $("#restart_time").val();
	restart_time = timeStr2Int(restart_time);

	var validated = IsValidate_ResetTime(restart_enable, restart_time);
	if (validated == true) {
		var param = "reboot_enable=" + restart_enable + "&reboot_time=" + restart_time;

		$.ajax({
        type: "GET",
        url: "http://" + xc_gethost() + "/set_rebootplan" + "?" + param,
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
}

function init_language(){
    jQuery.i18n.properties({
        name: 'common',
        path: '../lang/',
        mode: 'map',
        language: window.parent.get_language_setup(),
        callback: function () {
			$('#header_text').html($.i18n.prop('index_restart'));
			$('#restart_enable_txt').html($.i18n.prop('restart_enable_txt'));
			$('#restart_time_txt').html($.i18n.prop('restart_time_txt'));
			$('#restart_setting').val($.i18n.prop('restart_setting'));
			$('#restart_enable_off_txt').html($.i18n.prop('network_dhcp_off_txt'));
			$('#restart_enable_on_txt').html($.i18n.prop('network_dhcp_on_txt'));
        }
    });
}

$(function () {
	init_language();
	get_data();
});