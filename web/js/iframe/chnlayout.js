var screen_max_width = 1920;
var screen_max_height = 1080;

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

function get_vopos() {
    $.ajax({
        type: "GET",
        url: "http://" + xc_gethost() + "/get_vopos",
        dataType: "xml",
        cache: false,
        error: function () {
        },
        success: function (data) {
			var enable = $(data).find("vopos").find("enable").text();
            $('#chnlayout_enable').attr("value", enable);
			screen_max_width = $(data).find("vopos").find("screewidth").text();
			screen_max_height = $(data).find("vopos").find("screeheight").text();
			screen_max_width = parseInt(screen_max_width);
			screen_max_height = parseInt(screen_max_height);
			
			for(var i = 0; i < xc_getwndnum(); ++i) {
				var x = $(data).find("vopos").find("voposx" + i).text();
				var y = $(data).find("vopos").find("voposy" + i).text();
				var w = $(data).find("vopos").find("voposw" + i).text();
				var h = $(data).find("vopos").find("voposh" + i).text();

				$("#chn" + i + "_x").attr("value", x);
				$("#chn" + i + "_y").attr("value", y);
				$("#chn" + i + "_w").attr("value", w);
				$("#chn" + i + "_h").attr("value", h);

				$("#chn" + i + "_width_x").html(screen_max_width);
				$("#chn" + i + "_width_y").html(screen_max_height);
				$("#chn" + i + "_width_w").html(screen_max_width);
				$("#chn" + i + "_width_h").html(screen_max_height);
			}
			
            $("#main_content").removeAttr("class");
        }
    });
}

function ClickTemplate()
{
	var xarray;
	var yarray;
	var warray;
	var harray;
	var template = $("#chnlayout_template").val();
	if(template == 0) {
		xarray = new Array(0, 0, 0, 0);
		yarray = new Array(0, 0, 0, 0);
		warray = new Array(screen_max_width, 0, 0, 0);
		harray = new Array(screen_max_height, 0, 0, 0);
	}
	else if(template == 1){
		xarray = new Array(0, 0, 0, 0);
		yarray = new Array(0, 0, 0, 0);
		warray = new Array(0, screen_max_width, 0, 0);
		harray = new Array(0, screen_max_height, 0, 0);
	}
	else if(template == 2){
		xarray = new Array(0, 0, 0, 0);
		yarray = new Array(0, 0, 0, 0);
		warray = new Array(0, 0, screen_max_width, 0);
		harray = new Array(0, 0, screen_max_height, 0);
	}
	else if(template == 3){
		xarray = new Array(0, 0, 0, 0);
		yarray = new Array(0, 0, 0, 0);
		warray = new Array(0, 0, 0, screen_max_width);
		harray = new Array(0, 0, 0, screen_max_height);
	}
	else if(template == 4){
		var half_x = Math.floor(screen_max_width / 2);
		half_x = Math.floor(half_x / 2) * 2 - 2;
		var half_y = Math.floor(screen_max_height / 2);
		half_y = Math.floor(half_y / 2) * 2 - 2;
		xarray = new Array(0, half_x + 4, 0, half_x + 4);
		yarray = new Array(0, 0, half_y + 4, half_y + 4);
		warray = new Array(half_x, half_x, half_x, half_x);
		harray = new Array(half_y, half_y, half_y, half_y);
	}
	else if(template == 5){//top 3
		var chn_w = Math.floor(screen_max_width / 3);
		var chn_h = Math.floor(screen_max_height / 4);
		chn_w = Math.floor(chn_w / 2) * 2 - 2;
		chn_h = Math.floor(chn_h / 2) * 2;
		xarray = new Array(0, chn_w + 4, chn_w*2 + 6, 0);
		yarray = new Array(0, 0, 0, chn_h + 2);
		warray = new Array(chn_w, chn_w, chn_w, screen_max_width);
		harray = new Array(chn_h, chn_h, chn_h, screen_max_height-chn_h - 2);
	}
	else if(template == 6){//left 3
		var chn_w = Math.floor(screen_max_width / 4);
		var chn_h = Math.floor(screen_max_height / 3);
		chn_w = Math.floor(chn_w / 2) * 2;
		chn_h = Math.floor(chn_h / 2) * 2 - 2;
		xarray = new Array(0, 0, 0, chn_w + 2);
		yarray = new Array(0, chn_h + 4, chn_h*2 + 6, 0);
		warray = new Array(chn_w, chn_w, chn_w, screen_max_width-chn_w - 2);
		harray = new Array(chn_h, chn_h, chn_h, screen_max_height);
	}
	else if(template == 7){//down 3
		var chn_w = Math.floor(screen_max_width / 3);
		var chn_h = Math.floor(screen_max_height / 4);
		chn_w = Math.floor(chn_w / 2) * 2 - 2;
		chn_h = Math.floor(chn_h / 2) * 2;
		xarray = new Array(0, 0, chn_w + 4, chn_w*2 + 6);
		yarray = new Array(0, screen_max_height-chn_h, screen_max_height-chn_h, screen_max_height-chn_h);
		warray = new Array(screen_max_width, chn_w, chn_w, chn_w);
		harray = new Array(screen_max_height-chn_h - 2, chn_h, chn_h, chn_h );
	}
	else if(template == 8){//right 3
		var chn_w = Math.floor(screen_max_width / 4);
		var chn_h = Math.floor(screen_max_height / 3);
		chn_w = Math.floor(chn_w / 2) * 2;
		chn_h = Math.floor(chn_h / 2) * 2 - 2;
		xarray = new Array(0, screen_max_width - chn_w, screen_max_width - chn_w, screen_max_width - chn_w);
		yarray = new Array(0, 0, chn_h + 4, chn_h * 2 + 6);
		warray = new Array(screen_max_width - chn_w - 2, chn_w, chn_w, chn_w);
		harray = new Array(screen_max_height, chn_h, chn_h, chn_h);
	}

	for(var i = 0; i < xc_getwndnum(); ++i) {
		$("#chn" + i + "_x").attr("value", xarray[i]);
		$("#chn" + i + "_y").attr("value", yarray[i]);
		$("#chn" + i + "_w").attr("value", warray[i]);
		$("#chn" + i + "_h").attr("value", harray[i]);
	}
}

function chnlayout_setting() {
	var args = "";
	var valid = true;

	var enable = $('#chnlayout_enable').val();
	args += "&enable=" + enable;
	if(enable == 1){
		for(var i = 0; i < xc_getwndnum(); ++i) {
			valid = check_vopos(i);
			if(valid == false) break;

			var x = $("#chn" + i + "_x").val();
			var y = $("#chn" + i + "_y").val();
			var w = $("#chn" + i + "_w").val();
			var h = $("#chn" + i + "_h").val();
			var p = 0;
			args += "&voposx" + i + "=" + x + "&voposy" + i + "=" + y + "&voposw" + i + "=" + w + "&voposh" + i + "=" + h + "&priority" + i + "=" + p;
		}
	}
    
	if(valid == true) {
		$.ajax({
			type: "GET",
			url: "http://" + xc_gethost() + "/set_vopos" + "?" + args,
			cache: false,
			success: function (data) {
				var ret = $(data).find("return").text();
				if ("ok" == ret) {
					alert($.i18n.prop('chnlayout_setting_success'));
				}
				else {
					alert($.i18n.prop('chnlayout_setting_failed'));
				}
			},
			error: function (){
				alert($.i18n.prop('chnlayout_setting_failed'));
			}
		});
	}
}

function init_language() {
    jQuery.i18n.properties({
        name: 'common',
        path: '../lang/',
        mode: 'map',
        language: window.parent.get_language_setup(),
        callback: function () {
            $('#chnlayout_enable_txt').html($.i18n.prop('chnlayout_enable_txt'));
            $('#chnlayout_option_disable').html($.i18n.prop('chnlayout_disable'));
            $('#chnlayout_option_enable').html($.i18n.prop('chnlayout_enable'));

            $('#chnlayout_template_txt').html($.i18n.prop('chnlayout_template_txt'));
            $('#chnlayout_template_full1').html($.i18n.prop('chnlayout_template_full1'));
			$('#chnlayout_template_full2').html($.i18n.prop('chnlayout_template_full2'));
			$('#chnlayout_template_full3').html($.i18n.prop('chnlayout_template_full3'));
			$('#chnlayout_template_full4').html($.i18n.prop('chnlayout_template_full4'));
            $('#chnlayout_template_quar').html($.i18n.prop('chnlayout_template_quar'));
            $('#chnlayout_template_custom1').html($.i18n.prop('chnlayout_template_custom1'));
            $('#chnlayout_template_custom2').html($.i18n.prop('chnlayout_template_custom2'));
			$('#chnlayout_template_custom3').html($.i18n.prop('chnlayout_template_custom3'));
			$('#chnlayout_template_custom4').html($.i18n.prop('chnlayout_template_custom4'));
			$('#chnlayout_template_custom5').html($.i18n.prop('chnlayout_template_custom5'));
			$('#chnlayout_template_desc').html($.i18n.prop('chnlayout_template_desc'));

			for(var i = 0; i < xc_getwndnum(); ++i)
			{
				if("zh" == window.parent.get_language_setup()) {
					$('#chn' + i + '_txt').html($.i18n.prop('playlist_url') + (i + 1) + $.i18n.prop('chn_txt'));
					$('#chn' + i + '_desc_txt').html($.i18n.prop('chn_desc_txt'));
					$('#chn' + i + '_x_txt').html($.i18n.prop('playlist_url') + (i + 1) + $.i18n.prop('chn_x_txt'));
					$('#chn' + i + '_y_txt').html($.i18n.prop('playlist_url') + (i + 1) + $.i18n.prop('chn_y_txt'));
					$('#chn' + i + '_w_txt').html($.i18n.prop('playlist_url') + (i + 1) + $.i18n.prop('chn_w_txt'));
					$('#chn' + i + '_h_txt').html($.i18n.prop('playlist_url') + (i + 1) + $.i18n.prop('chn_h_txt'));
				}
				else {
					$('#chn' + i + '_txt').html($.i18n.prop('playlist_url') + " " + (i + 1) + " " + $.i18n.prop('chn_txt'));
					$('#chn' + i + '_desc_txt').html($.i18n.prop('chn_desc_txt'));
					$('#chn' + i + '_x_txt').html($.i18n.prop('playlist_url') + " " + (i + 1) + " " + $.i18n.prop('chn_x_txt'));
					$('#chn' + i + '_y_txt').html($.i18n.prop('playlist_url') + " " + (i + 1) + " " + $.i18n.prop('chn_y_txt'));
					$('#chn' + i + '_w_txt').html($.i18n.prop('playlist_url') + " " + (i + 1) + " " + $.i18n.prop('chn_w_txt'));
					$('#chn' + i + '_h_txt').html($.i18n.prop('playlist_url') + " " + (i + 1) + " " + $.i18n.prop('chn_h_txt'));
				}
			}
            
            $('#chnlayout_setting').val($.i18n.prop('chnlayout_setting'));
            $('#header_text').html($.i18n.prop('index_chnlayout'));
        }
    });
}

function check_vopos(num)
{
	var x = $("#chn" + num + "_x").val();
	var y = $("#chn" + num + "_y").val();
	var w = $("#chn" + num + "_w").val();
	var h = $("#chn" + num + "_h").val();
	var p = $("#chn" + num + "_prior").val();
	//js ×Ö·û´®"" == 0
	if(x == "" || y == "" || w == "" || h == "" || p == "") {
		alert($.i18n.prop('system_cvbs_empty_txt'));
		return false;
	}
	
	var Intx = IsInteger(x);
	var Inty = IsInteger(y);
	var Intw = IsInteger(w);
	var Inth = IsInteger(h);
	var Intp = IsInteger(p);
	x = parseInt(x);
	y = parseInt(y);
	w = parseInt(w);
	h = parseInt(h);
	p = parseInt(p);
	if(x < 0 || x > screen_max_width || Intx == false) {
		alert($('#chn' + num + '_x_txt').html() + $.i18n.prop('system_cvbs_format_txt'));
		return false;
	}
	else if(y < 0 || y > screen_max_height || Inty == false) {
		alert($('#chn' + num + '_y_txt').html() + $.i18n.prop('system_cvbs_format_txt'));
		return false;
	}
	else if(w < 0 || w > screen_max_width || Intw == false) {
		alert($('#chn' + num + '_w_txt').html() + $.i18n.prop('system_cvbs_format_txt'));
		return false;
	}
	else if(h < 0 || h > screen_max_height || Inth == false) {
		alert($('#chn' + num + '_h_txt').html() + $.i18n.prop('system_cvbs_format_txt'));
		return false;
	}
	else if(x + w < 0 || x + w > screen_max_width) {
		alert($('#chn' + num + '_x_txt').html() + " and " + $('#chn' + num + '_w_txt').html() + $.i18n.prop('system_cvbs_format_txt'));
		return false;
	}
	else if(y + h < 0 || y + h > screen_max_height) {
		alert($('#chn' + num + '_y_txt').html() + " and " + $('#chn' + num + '_h_txt').html() + $.i18n.prop('system_cvbs_format_txt'));
		return false;
	}
	return true;
}

$(function () {
	init_language();
    get_vopos();
})
