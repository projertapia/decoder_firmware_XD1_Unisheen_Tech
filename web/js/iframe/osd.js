var session_id = "20171121080011";
var timer_id;
var update_logo_region_index=1;

function parentpage_adjust_height() {
	window.parent.setup_iframe_height();
}

function language_setup() {
	jQuery.i18n.properties({
		name : 'common',
		path : '../lang/',
		mode : 'map',
		language : window.parent.get_language_setup(),
		callback : function() {
			$('#update_choose_file').html($.i18n.prop('osd_logo_update_choose_file'));
			$('#scan_button').html($.i18n.prop('osd_logo_update_scan_button'));
			$('#osd_logo_update_warning').html($.i18n.prop('update_warning'));
			$('#warning').html($.i18n.prop('osd_logo_update_warning'));
			$('#update_apply').val($.i18n.prop('osd_logo_update_apply'));

			$('#header_text').html($.i18n.prop('index_osdsetup'));

			$('#osd_region_1_setting_txt').html($.i18n.prop('osd_region_1_setting_txt'));
			$('#osd_region_2_setting_txt').html($.i18n.prop('osd_region_2_setting_txt'));
			$('#osd_region_3_setting_txt').html($.i18n.prop('osd_region_3_setting_txt'));
			$('#osd_region_4_setting_txt').html($.i18n.prop('osd_region_4_setting_txt'));
			
			for(var i=1;i<=4;++i){
				$("#osd_region_" + i + "_status_txt").html($.i18n.prop('osd_region_status_txt'));
				$("#osd_region_" + i + "_off_txt").html($.i18n.prop('osd_region_off_txt'));
				$("#osd_region_" + i + "_on_txt").html($.i18n.prop('osd_region_on_txt'));
				$("#osd_region_" + i + "_type_txt").html($.i18n.prop('osd_region_type_txt'));
	
				$("#osd_region_" + i + "_type_text_txt").html($.i18n.prop('osd_region_type_text_txt'));
				$("#osd_region_" + i + "_type_image_txt").html($.i18n.prop('osd_region_type_image_txt'));
				$("#osd_region_" + i + "_type_roll_text_txt").html($.i18n.prop('osd_region_type_roll_text_txt'));
	
				$("#osd_region_" + i + "_diaphaneity_txt").html($.i18n.prop('osd_region_diaphaneity_txt'));
				$("#osd_region_" + i + "_x_txt").html($.i18n.prop('osd_region_x_txt'));
				$("#osd_region_" + i + "_y_txt").html($.i18n.prop('osd_region_y_txt'));
				$("#osd_region_" + i + "_text_txt").html($.i18n.prop('osd_region_text_txt'));
				$("#osd_region_" + i + "_font_size_txt").html($.i18n.prop('osd_region_font_size_txt'));
				$("#osd_region_" + i + "_background_color_txt").html($.i18n.prop('osd_region_background_color_txt'));
	
				$("#osd_region_" + i + "_opacity_txt").html($.i18n.prop('osd_region_opacity_txt'));
				$("#osd_region_" + i + "_white_txt").html($.i18n.prop('osd_region_white_txt'));
				$("#osd_region_" + i + "_black_txt").html($.i18n.prop('osd_region_black_txt'));
	
				$("#osd_region_" + i + "_color_txt").html($.i18n.prop('osd_region_color_txt'));
				$("#osd_region_" + i + "_logo_txt").html($.i18n.prop('osd_region_logo_txt'));
				$("#osd_region_" + i + "_position_txt").html($.i18n.prop('osd_region_position_txt'));
				$("#osd_region_" + i + "_speed_txt").html($.i18n.prop('osd_region_speed_txt'));
			}

			$('#osd_setting').val($.i18n.prop('osd_setting'));
		}
	});
}

function osd_setting() {
	var ptmp = "";
	var osd_enable;
	var osd_enable;
	var osd_region_diaphaneity;
	var osd_region_x;
	var osd_region_y;
	var osd_region_font_size;
	var osd_region_color;
	var osd_region_background_color;
	var osd_region_text;

	for(var i = 1; i <= 4; ++i) {
		osd_enable = $("#osd_region_" + i + "_enable").val();
		osd_type = $("#osd_region_" + i + "_type").val();
		osd_region_diaphaneity = $("#osd_region_" + i + "_diaphaneity").val();
		if(osd_type == 2) {
			osd_region_x = $("#osd_region_" + i + "_position").val();
			osd_region_y = $("#osd_region_" + i + "_speed").val();
		} else {
			osd_region_x = $("#osd_region_" + i + "_x").val();
			osd_region_y = $("#osd_region_" + i + "_y").val();
		}
		osd_region_font_size = $("#osd_region_" + i + "_font_size").val();
		osd_region_color = $("#osd_region_" + i + "_color").val();
		osd_region_background_color=$("#osd_region_" + i + "_background_color").val();
		osd_region_text = $("#osd_region_" + i + "_text").val();
		
		ptmp += "osd_" + (i-1) + "_enable=" + osd_enable + "&";
		ptmp += "osd_" + (i-1) + "_type=" + osd_type + "&";
		ptmp += "osd_" + (i-1) + "_alpha=" + osd_region_diaphaneity + "&";
		ptmp += "osd_" + (i-1) + "_x=" + osd_region_x + "&";
		ptmp += "osd_" + (i-1) + "_y=" + osd_region_y + "&";
		ptmp += "osd_" + (i-1) + "_font_size=" + osd_region_font_size + "&";
		ptmp += "osd_" + (i-1) + "_color=" + osd_region_color + "&";
		ptmp += "osd_" + (i-1) + "_bcolor=" + osd_region_background_color + "&";
		ptmp += "osd_" + (i-1) + "_txt=" + osd_region_text + "&";
	}
	$.ajax({
		type : "GET",
		url : "http://" + xc_gethost() + "/set_osd" + "?" + ptmp,
		cache : false,
		success : function(data) {
			var ret = $(data).find("return").text();
			if("ok" == ret) {
				alert($.i18n.prop('osd_setting_success'));
			} else {
				alert($.i18n.prop('osd_setting_failed'));
			}
		},
		error : function() {
			alert($.i18n.prop('osd_setting_failed'));
		}
	});
}

function osd_preset() {
	$.ajax({
		type : "GET",
		url : "http://" + xc_gethost() + "/get_osd",
		cache : false,
		success : function(data) {
			var osd_enable;
			var osd_type;
			var osd_region_diaphaneity;
			var osd_region_x;
			var osd_region_y;
			var osd_region_font_size;
			var osd_region_color;
			var osd_region_background_color;
			var osd_region_text;
			var osd_region_logo;
			for(var i = 1; i <= 4; ++i) {
				osd_enable = $(data).find("osd_" + (i - 1) + "_enable").text();
				osd_type = $(data).find("osd_" + (i - 1) + "_type").text();
				osd_region_diaphaneity = $(data).find("osd_" + (i - 1) + "_alpha").text();
				osd_region_x = $(data).find("osd_" + (i - 1) + "_x").text();
				osd_region_y = $(data).find("osd_" + (i - 1) + "_y").text();
				osd_region_font_size = $(data).find("osd_" + (i - 1) + "_font_size").text();
				osd_region_color = $(data).find("osd_" + (i - 1) + "_color").text();
				osd_region_background_color = $(data).find("osd_" + (i - 1) + "_bcolor").text();
				osd_region_text = $(data).find("osd_" + (i - 1) + "_txt").text();
				osd_region_logo = $(data).find("osd_" + (i - 1) + "_bmp").text();

				if(osd_enable == 1) {
					$("#osd_region_" + i + "_on_txt").attr("selected", "selected");
				} else {
					$("#osd_region_" + i + "_off_txt").attr("selected", "selected");
				}
				if(osd_type == 0) {
					$("#osd_region_" + i + "_type_text_txt").attr("selected", "selected");
				} else if(osd_type == 1) {
					$("#osd_region_" + i + "_type_image_txt").attr("selected", "selected");
				} else if(osd_type == 2) {
					$("#osd_region_" + i + "_type_roll_text_txt").attr("selected", "selected");
				} else {
					$("#osd_region_" + i + "_type_text_txt").attr("selected", "selected");
				}
				$("#osd_region_" + i + "_diaphaneity").val(osd_region_diaphaneity);
				$("#osd_region_" + i + "_x").val(osd_region_x);
				$("#osd_region_" + i + "_y").val(osd_region_y);
				$("#osd_region_" + i + "_position").val(osd_region_x);
				$("#osd_region_" + i + "_speed").val(osd_region_y);
				
				$("#osd_region_" + i + "_font_size").val(osd_region_font_size);
				$("#osd_region_" + i + "_color").val(osd_region_color);
				$("#osd_region_" + i + "_color").css('background-color', '#' + parseInt(osd_region_color).toString(16)).css('color', '#' + parseInt(osd_region_color).toString(16));
				
				if(osd_region_background_color == 0) {
					$("#osd_region_" + i + "_opacity_txt").attr("selected", "selected");
				} else if(osd_region_background_color == 1) {
					$("#osd_region_" + i + "_white_txt").attr("selected", "selected");
				} else if(osd_region_background_color == 2) {
					$("#osd_region_" + i + "_black_txt").attr("selected", "selected");
				} else {
					$("#osd_region_" + i + "_opacity_txt").attr("selected", "selected");
				}
				
				$("#osd_region_" + i + "_text").val(osd_region_text);
				$("#osd_region_" + i + "_logo").attr("src", osd_region_logo);
				osd_region_status_change(i);
			}
		},
		error : function() {

		}
	});
}

function region_display_type_reset(index) {
	$("#osd_region_"+index+"_diaphaneity_block").attr("style", "display:none;");
	$("#osd_region_"+index+"_x_block").attr("style", "display:none;");
	$("#osd_region_"+index+"_y_block").attr("style", "display:none;");
	$("#osd_region_"+index+"_logo_block").attr("style", "display:none;");
	$("#osd_region_"+index+"_position_block").attr("style", "display:none;");
	$("#osd_region_"+index+"_speed_block").attr("style", "display:none;");
	$("#osd_region_"+index+"_text_block").attr("style", "display:none;");
	$("#osd_region_"+index+"_font_size_block").attr("style", "display:none;");
	$("#osd_region_"+index+"_background_color_block").attr("style", "display:none;");
	$("#osd_region_"+index+"_color_block").attr("style", "display:none;");
}

function osd_region_type_change(index) {
	var type = $("#osd_region_"+index+"_type").val();
	region_display_type_reset(index);
	if(type == 0) {
		$("#osd_region_"+index+"_diaphaneity_block").removeAttr("style");
		$("#osd_region_"+index+"_x_block").removeAttr("style");
		$("#osd_region_"+index+"_y_block").removeAttr("style");
		$("#osd_region_"+index+"_text_block").removeAttr("style");
		$("#osd_region_"+index+"_font_size_block").removeAttr("style");
		$("#osd_region_"+index+"_background_color_block").removeAttr("style");
		$("#osd_region_"+index+"_color_block").removeAttr("style");
	} else if(type == 1) {
		$("#osd_region_"+index+"_diaphaneity_block").removeAttr("style");
		$("#osd_region_"+index+"_x_block").removeAttr("style");
		$("#osd_region_"+index+"_y_block").removeAttr("style");
		$("#osd_region_"+index+"_logo_block").removeAttr("style");
	} else if(type == 2) {
		$("#osd_region_"+index+"_diaphaneity_block").removeAttr("style");
		$("#osd_region_"+index+"_position_block").removeAttr("style");
		$("#osd_region_"+index+"_speed_block").removeAttr("style");
		$("#osd_region_"+index+"_text_block").removeAttr("style");
		$("#osd_region_"+index+"_font_size_block").removeAttr("style");
		$("#osd_region_"+index+"_background_color_block").removeAttr("style");
		$("#osd_region_"+index+"_color_block").removeAttr("style");
	}
	parentpage_adjust_height();
}

function osd_region_status_change(index) {
	var status = $("#osd_region_"+index+"_enable").val();
	osd_region_type_change(index);
	if(status == 0) {
		region_display_type_reset(index);
		$("#osd_region_"+index+"_type_block").attr("style", "display:none;");
	} else if(status == 1) {
		$("#osd_region_"+index+"_type_block").removeAttr("style");
	}
	parentpage_adjust_height();
}

function update_logo_window_initialization(scrolltop) {
	var parentWidth = window.parent.innerWidth;
	var parentHeight = window.parent.innerHeight;
	$("#update_logo_block").attr("style", "top:" + (parentHeight / 2 - 100 - 91+scrolltop) + "px;left:" + (parentWidth / 2 - 300 - 260) + "px;");
}

function update_logo_window_on(index) {
	if(index == 1) {
		$("#logo_update_header").html($.i18n.prop('osd_region_1_setting_txt') + " " + $.i18n.prop('osd_logo_update_header'));
	} else if(index == 2) {
		$("#logo_update_header").html($.i18n.prop('osd_region_2_setting_txt') + " " + $.i18n.prop('osd_logo_update_header'));
	} else if(index == 3) {
		$("#logo_update_header").html($.i18n.prop('osd_region_3_setting_txt') + " " + $.i18n.prop('osd_logo_update_header'));
	} else if(index == 4) {
		$("#logo_update_header").html($.i18n.prop('osd_region_4_setting_txt') + " " + $.i18n.prop('osd_logo_update_header'));
	}else{
		return;
	}
	update_logo_region_index=index;
	$('#update_txt').html($.i18n.prop('osd_logo_update_txt')+index);
	$("#update_logo_block").removeClass("display_off");
}

function update_logo_window_off() {
	$("#update_logo_block").addClass("display_off");
}

function get_progress() {
	$.ajax({
		type : "GET",
		url : url = "http://" + xc_gethost() + "/up_progress?id=" + session_id,
		dataType : "text",
		cache : false,
		error : function() {
		},
		success : function(data) {
			if(-1 == data) {
				$('#update_apply').val($.i18n.prop('update_apply'));
				$("#update_apply").attr("disabled", false);
				clearInterval(timer_id);
				$("#progress_bar").addClass("display_off");
				$("#progress_text").addClass("display_off");
				$("#filename").removeClass("display_off");
				$("#scan_button").removeClass("display_off");
				$('#progress').width(0);
				$('#progress_text').html("0%");
				alert($.i18n.prop('osd_logo_update_failed'));
			} else if(1 == data) {
				$('#update_apply').val($.i18n.prop('update_apply'));
				$("#update_apply").attr("disabled", false);
				clearInterval(timer_id);
				$("#progress_bar").addClass("display_off");
				$("#progress_text").addClass("display_off");
				$("#filename").removeClass("display_off");
				$("#scan_button").removeClass("display_off");
				$('#progress').width(0);
				$('#progress_text').html("0%");
				alert($.i18n.prop('osd_logo_update_succeed'));
				$("#update_logo_block").addClass("display_off");
			} else {
				$('#progress_text').html(parseInt(data * 100) + "%");
				//jquery 1.6.2 animate function,incompatible chrome brower
				//$('#progress').animate({width: data*184}, 100);
				$('#progress').width(data * 184);
			}
		},
		error : function() {

		}
	});
}

function randomString(len) {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxPos = $chars.length;
	var pwd = '';
	for( i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

function update_logo_filename_check(filename){
	if(update_logo_region_index==1){
		if(filename!="logo1.bmp" && filename != "logo1.png"){
			return 1;
		}
	}else if(update_logo_region_index==2){
		if(filename!="logo2.bmp" && filename != "logo2.png"){
			return 1;
		}
	}else if(update_logo_region_index==3){
		if(filename!="logo3.bmp" && filename != "logo3.png"){
			return 1;
		}
	}else if(update_logo_region_index==4){
		if(filename!="logo4.bmp" && filename != "logo4.png"){
			return 1;
		}
	}
	return 0;
}

function update_logo_apply_fun() {
	session_id = randomString(14);
	var update = $("#update").val();
	update = update.substring(update.lastIndexOf("\\") + 1);
	if(update == "") {
		alert($.i18n.prop('osd_logo_update_choosefile'));
	} else if(update_logo_filename_check(update)){
		alert($.i18n.prop('osd_logo_update_file_format_failed'));
	}else {
		$("#update_apply").attr("disabled", true);
		$("#filename").addClass("display_off");
		$("#scan_button").addClass("display_off");
		$("#progress_bar").removeClass("display_off");
		$("#progress_text").removeClass("display_off");
		timer_id = setInterval(get_progress, 1000);
		$.ajaxFileUpload({
			type : "post",
			url : "http://" + xc_gethost() + "/?id=" + session_id,
			dataType : "json",
			fileElementId : 'update',
			cache : false,
			success : function(data) {
				console.log(data);
			}
		});
	}
}

$(function() {
	language_setup();
	update_logo_window_initialization(0);
	osd_preset();
	$("#update").change(function() {
		var filepath = $("#update").val();
		filepath = filepath.substring(filepath.lastIndexOf("\\") + 1);
		$("#filename").val(filepath);
		if(update_logo_filename_check(filepath)){
			alert($.i18n.prop('osd_logo_update_file_format_failed'));
			$("#update_apply").attr("disabled","disabled");
			return;
		}
		$("#update_apply").removeAttr("disabled");
	});
	$("#scan_button").click(function() {
		var filepath = $("#update").trigger("click");
	});
	$('.color-box').colpick({
		colorScheme : 'dark',
		layout : 'rgbhex',
		color : '000000',
		onSubmit : function(hsb, hex, rgb, el) {
			$(el).css('background-color', '#' + hex);
			$(el).css('color', '#' + hex);
			$(el).val(parseInt(hex, 16));
			$(el).colpickHide();
		}
	});
	
	$(parent.window).scroll(function(){
		update_logo_window_initialization($(parent.window).scrollTop());
	});
	
	
	
	
});