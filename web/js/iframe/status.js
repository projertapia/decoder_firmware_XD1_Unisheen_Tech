var g_wnd_num = 0;
var wifi_exist;
var wifi_enable;

function scan_window_init() {
	$(".uri").mouseover(function (e) {
		var x = e.originalEvent.x || e.originalEvent.layerX || 0;
		var y = e.originalEvent.y || e.originalEvent.layerY || 0;
		$("#uri_scan").text($(this).next("span").text()).attr("style", "left:" + x + "px;top:" + y + "px;");
	}).mouseout(function (e) {
		$("#uri_scan").attr("style", "display:none;");
	});
}
function handle_wndnum(wnd_num) {
	if (g_wnd_num == 0) {
		for (var i = 0; i < wnd_num; ++i) {
			var temp_string = "";
			temp_string += "<hr />";
			temp_string += "<div class='subtitle'>";
			temp_string += "<span id='status_wnd_text_" + i + "' class='status_subtitle'></span>";
			temp_string += "</div>";
			temp_string += "<div>";
			temp_string += "<span id='status_decode_uri_text_" + i + "' class='small_title'></span>\n\r";
			temp_string += "<span id='status_decode_uri_" + i + "' class='dynamic_data uri'></span>";
			temp_string += "<span id='status_decode_uri_display_" + i + "' style='display:none;'></span>";
			temp_string += "</div>";
			temp_string += "<div>";
			temp_string += "<span id='status_wnd_status_text_" + i + "' class='small_title'></span>\n\r";
			temp_string += "<span id='status_wnd_status_" + i + "' class='dynamic_data'></span>";
			temp_string += "</div>";
			temp_string += "<div>";
			temp_string += "<span id='status_wnd_codec_text_" + i + "' class='small_title'></span>\n\r";
			temp_string += "<span id='status_wnd_codec_" + i + "' class='dynamic_data'></span>";
			temp_string += "</div>";
			temp_string += "<div>";
			temp_string += "<span id='status_wnd_resolution_text_" + i + "' class='small_title'></span>\n\r";
			temp_string += "<span id='status_wnd_resolution_" + i + "' class='dynamic_data'></span>";
			temp_string += "</div>";
			temp_string += "<div>";
			temp_string += "<span id='status_wnd_fps_text_" + i + "' class='small_title'></span>\n\r";
			temp_string += "<span id='status_wnd_fps_" + i + "' class='dynamic_data'></span>";
			temp_string += "</div>";
			temp_string += "<div>";
			temp_string += "<span id='status_wnd_bps_text_" + i + "' class='small_title'></span>\n\r";
			temp_string += "<span id='status_wnd_bps_" + i + "' class='dynamic_data'></span>";
			temp_string += "</div>";
			$("#status").append(temp_string);
		}
		g_wnd_num = wnd_num;
		language_setup(g_wnd_num);
		parentpage_adjust_height();
		scan_window_init();
	} else {
		if (g_wnd_num != wnd_num) {
			window.parent.location.reload(true);
		}
	}
}

function init_wifi_option() {
	wifi_exist = window.parent.get_wifi_exist();
	if (wifi_exist == 1) {
		$("#wifi_status").removeClass("display_off");
	} else if (wifi_exist == 0) {
		$("#wifi_status").addClass("display_off");
	}

	wifi_enable = window.parent.get_wifi_enable();
	if (wifi_enable == 1) {
		$("#wifi_status_info").removeClass("display_off");
	}
	else if (wifi_enable == 0) {
		$("#wifi_status_info").addClass("display_off");
	}
}

function get_status() {
	$.ajax({
		type: "GET",
		url: "http://" + xc_gethost() + "/get_status",
		dataType: "xml",
		cache: false,
		error: function () {
		},
		success: function (sxml) {
			// cpu usage
			var cpu_usage = $(sxml).find("cpu_usage").text();
			$('#cpu_usage').html(cpu_usage + "%");
			// mem usage
			var mem_free = $(sxml).find("mem_free").text();
			var mem_total = $(sxml).find("mem_total").text();
			
			mem_free = mem_total - mem_free;
			mem_free = parseInt(mem_free / 1000);
			mem_total = parseInt(mem_total / 1000);
			$('#mem_free').html(mem_free + "MB/" + mem_total + "MB");
			var usb_totalspace= $(sxml).find("usb_totalspace").text();
			if(usb_totalspace==0)
			{
				$('#status_usb').hide();
			}
			else{
				 $('#status_usb').show();
			     var usb_freespace= $(sxml).find("usb_freespace").text();
			     var usb_usespace=usb_totalspace-usb_freespace;
			     $('#status_usb_space').html(usb_usespace + "MB/" + usb_totalspace + "MB");
			}
			var runtime = $(sxml).find("runtime").text();
			$('#status_runtime').html(runtime);
			var systime = $(sxml).find("systime").text();
			$('#status_systime').html(systime);
			var vo = $(sxml).find("vo").text();
			$('#status_vo').html(vo);
			var wnd_num = $(sxml).find("wndnum").text();
			$('#status_wnd_num').html(wnd_num);
			handle_wndnum(wnd_num);
			for (var i = 0; i < wnd_num; ++i) {
				var uri_text = $(sxml).find("s" + i).find("uri").text();
				$("#status_decode_uri_display_" + i).html(uri_text);
				if (uri_text.length > 60) {
					uri_text = uri_text.substring(0, 60);
					uri_text += "...";
				}
				$("#status_decode_uri_" + i).html(uri_text);
				var current_wnd_status = $(sxml).find("s" + i).find("alive").text();
				if (current_wnd_status == "1") {
					$("#status_wnd_status_" + i).html($.i18n.prop('status_wnd_status_text_ok'));
				} else {
					$("#status_wnd_status_" + i).html($.i18n.prop('status_wnd_status_text_error'));
				}
				$("#status_wnd_codec_" + i).html($(sxml).find("s" + i).find("codecid").text());
				$("#status_wnd_resolution_" + i).html($(sxml).find("s" + i).find("width").text()+"x"+$(sxml).find("s" + i).find("height").text());
				$("#status_wnd_fps_" + i).html($(sxml).find("s" + i).find("fps").text());
				$("#status_wnd_bps_" + i).html($(sxml).find("s" + i).find("bps").text());
			}
			// net status
			var net_status = $(sxml).find("net_status").text();
			if ("1" == net_status) {
				$("#status_net").html($.i18n.prop('status_net_INTERNET'));
			}
			else if ("2" == net_status) {
				$("#status_net").html($.i18n.prop('status_net_INTERNET_IP'));
			}
			else if ("3" == net_status) {
				$("#status_net").html($.i18n.prop('status_net_INTERNET_LAN'));
			}
			else if ("4" == net_status) {
				$("#status_net").html($.i18n.prop('status_net_INTERNET_LOCAL'));
			}
			else {
				$("#status_net").html($.i18n.prop('status_net_INTERNET_LOCAL'));
			}
		}
	});
	if (wifi_exist == 1) {
		$.ajax({
			type: "GET",
			url: "http://" + xc_gethost() + "/get_wifistatus",
			dataType: "xml",
			cache: false,
			error: function () {
			},
			success: function (sxml) {
				if (wifi_enable == 1) {
					$('#status_wifi_dev_enable').html($.i18n.prop('status_wifi_dev_enable_on_text'));
				}
				else if (wifi_enable == 0) {
					$('#status_wifi_dev_enable').html($.i18n.prop('status_wifi_dev_enable_off_text'));
				}

				var wifi_status = $(sxml).find("state").text();
				var wifi_ssid = $(sxml).find("ssid").text();
				var wifi_ip = $(sxml).find("ip").text();
				var wifi_freq = $(sxml).find("freq").text();
				var wifi_level = $(sxml).find("level").text();
				var wifi_mac = $(sxml).find("mac").text();
				if (wifi_status == "COMPLETED") {
					$('#status_link_status').html($.i18n.prop('status_connected_text'));
				} else if (wifi_status == "DISCONNECTED") {
					$('#status_link_status').html($.i18n.prop('status_disconneted_text'));
				} else {
					$('#status_link_status').html($.i18n.prop('status_connecting_text'));
				}
				$('#status_wifi_essid').html(wifi_ssid);
				$('#status_wifi_ip').html(wifi_ip);
				$('#status_freq').html(wifi_freq + "MHz");
				$('#status_singal_level').html(wifi_level + "dB");
				$('#status_wifi_mac').html(wifi_mac);
			}
		});
	}


}

function language_setup(wnd_num) {
	jQuery.i18n.properties({
		name: 'common',
		path: '../lang/',
		mode: 'map',
		language: window.parent.get_language_setup(),
		callback: function () {
			$('#status_system_status_text').html($.i18n.prop('status_system_status_text'));
			$('#status_cpu_usage_txt').html($.i18n.prop('status_cpu_usage_txt'));
			$('#status_mem_free_txt').html($.i18n.prop('status_mem_free_txt'));
			$('#status_usb_space_text').html($.i18n.prop('status_usb_space_text'));
			$('#header_text').html($.i18n.prop('index_status'));
			$('#status_runtime_text').html($.i18n.prop('status_runtime_text'));
			$('#status_systime_text').html($.i18n.prop('status_systime_text'));
			$('#status_systime_sync_text').html($.i18n.prop('status_systime_sync_text'));

			$('#status_vo_text').html($.i18n.prop('status_vo_text'));
			$('#status_wnd_num_text').html($.i18n.prop('status_wnd_num_text'));
			$('#status_net_text').html($.i18n.prop('status_net_text'));
			$('#status_wifi_status_text').html($.i18n.prop('status_wifi_status_text'));
			$('#status_wifi_dev_enable_text').html($.i18n.prop('status_wifi_dev_enable_text'));
			$('#status_link_status_text').html($.i18n.prop('status_link_status_text'));
			$('#status_wifi_essid_text').html($.i18n.prop('status_wifi_essid_text'));
			$('#status_wifi_ip_text').html($.i18n.prop('status_wifi_ip_text'));
			$('#status_wifi_mac_text').html($.i18n.prop('status_wifi_mac_text'));
			$('#status_freq_text').html($.i18n.prop('status_freq_text'));
			$('#status_singal_level_text').html($.i18n.prop('status_singal_level_text'));
			for (var i = 0; i <= wnd_num; ++i) {
				$("#status_wnd_text_" + i).html($.i18n.prop('status_wnd_text') + (i + 1));
				$("#status_decode_uri_text_" + i).html($.i18n.prop('status_decode_uri_text'));
				$("#status_wnd_status_text_" + i).html($.i18n.prop('status_wnd_status_text'));
				$("#status_wnd_codec_text_" + i).html($.i18n.prop('status_wnd_codec_text'));
				$("#status_wnd_resolution_text_" + i).html($.i18n.prop('status_wnd_resolution_text'));
				$("#status_wnd_fps_text_" + i).html($.i18n.prop('status_wnd_fps_text'));
				$("#status_wnd_bps_text_" + i).html($.i18n.prop('status_wnd_bps_text'));
			}
		}
	});
}

function parentpage_adjust_height() {
	window.parent.setup_iframe_height();
}

function getNowFormatDate() {
	var now = new Date();
	var currenseconds = Math.round(now.getTime() / 1000);
	return currenseconds;
}

function syncTime() {
	var nowtime = getNowFormatDate();
	$.ajax({
		type: "GET",
		url: "http://" + xc_gethost() + "/set_time?sync_time=" + nowtime,
		dataType: "xml",
		cache: false,
		error: function () {
		},
		success: function (data) {
		}
	});
}
$(function () {
	init_wifi_option();
	language_setup(g_wnd_num);
	get_status();
	setInterval(get_status, 1000);
});
