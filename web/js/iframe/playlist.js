var max_wnd = xc_getwndnum();
var clipboard_data = "";
var UsbfileNum =0;
var Usbflietext="";
function scan_window_and_copy_init() {
	clipboard = new ClipboardJS('#clipboard', {
		text: function () {
			return clipboard_data;
		}
	});

	clipboard.on('success', function (e) {
		alert($.i18n.prop('playlist_copy_text_ok') + "\n" + clipboard_data);
		console.log(e);
	});

	clipboard.on('error', function (e) {
		alert($.i18n.prop('playlist_copy_text_error'));
		console.log(e);
	});
}
function copyurl(url_text) {
	clipboard_data = url_text;
	$("#clipboard").trigger("click");

}
function get_playfile()
{         
	$.ajax({
		type: "GET",
		url: "http://" + xc_gethost() + "/findfiles",
		dataType: "xml",
		cache: false,
		async:false,
		error: function () {
		},
		success: function (data) {
			$(data).find("item").each(function () {
				var filelist = $(this).text();			
			    	Usbflietext += '<option value="' + UsbfileNum+ '">' + filelist + '</option>';
					UsbfileNum+=1;
				});
					
	   }
	
	});   	
}

function get_playlist() {
	$.ajax({
		type: "GET",
		url: "http://" + xc_gethost() + "/get_playlist",
		dataType: "xml",
		cache: false,
		error: function () {
		},
		success: function (data) {
			var wnd = $(data).find("playlist").attr("wnd");
			$('#wnd').val(wnd);
			showdiv(wnd);
			var usb = $(data).find("playlist").attr("usb");
			var uri = "";
			var uri_audio = "";
			var uri_pindex = 0;
			$('#full_btn_1000').hide();
			for (var i = 0; i < max_wnd; i++) {
				$('#playlist_file_select'+i).html(Usbflietext);	
				$('#full_btn_' + i).hide();
				uri = $(data).find("uri" + i).text();
				//增加
				var playlist_type= get_playtype(uri);
				$('#playlist_type_select' + i).attr("value", playlist_type);
				playlist_type_show_onload(playlist_type,i,wnd);
                if(playlist_type=="usb")
				{					
				 $('#playlist_file_select' + i).find("option").each(function(){
					if($(this).text()==uri){
						$(this).attr("selected",true);
					}
				 });	
				}
                else{				
			     $('#uri' + i).attr("value", uri);
                }
				
				uri_audio = $(data).find("uri" + i).attr('audio');
				if (uri_audio == "true" || uri_audio == "1") {
					//document.all.audioselect[i].checked = true;
					//$('#uri_audio_' + i).attr("custom_selected", "1");
					$('#uri_audio_' + i).attr("value", uri_audio);
				}
				var record = $(data).find("uri" + i).attr('record');
				if (record == "true" || record == "1") {
					$('#record' + i).attr("checked", "checked");
				}
				var recordtime = $(data).find("uri" + i).attr('recordtime');
				$('#recordtime' + i).attr("value", recordtime);

				uri_pindex = $(data).find("uri" + i).attr("pindex");
				$('#playlist_pid_select' + i).attr("value", uri_pindex);
				var cache = $(data).find("uri" + i).attr('cache');
				$('#cache' + i).attr("value", cache);
				if (usb == "false" || usb == undefined) {
					$('#div_record' + i).hide();
					
				}
				else {
					$('#div_record' + i).show();
				}

			}
		}
	});
}

function playlist_type_show(playlist_type,i)
{
	var file=UsbfileNum;
	if(file!=0) 
	{
	   if(playlist_type=="usb")
	  {
		$('#uri'+i).hide();
		$('#playlist_file_select'+i).show();
		$('#div_playlist' + i).hide();	
	  }
	  else
	 {
		$('#uri'+i).show();
		$('#playlist_file_select'+i).hide();
		$('#div_playlist' + i).show();	
	 }
	}
	else{
		  if(playlist_type=="usb")
	   {
		$('#uri' + i).attr("value", "");	
	   }	 
		$('#uri'+i).show();
		$('#playlist_file_select'+i).hide();
		$('#div_playlist' + i).show();	
		$('#div_type' + i).hide();					
	}
}
function playlist_type_show_onload(playlist_type,i,wndnum)
{
	if (i < wndnum) {
	 playlist_type_show(playlist_type,i);
	}
}
function change_playtype(i) {
	var playlist_type = $("#playlist_type_select" + i + " option:checked").val();
	playlist_type_show(playlist_type,i);
}
 function change_audio(j)
 {
	 var playlist_audio =$("#uri_audio_" + j + " option:checked").val();
	 if(playlist_audio=="1")
	 {
	   for (var i = 0; i < max_wnd; i++) {
       if(i!=j){
		  $('#uri_audio_'+ i).attr("value", 0); 
	   }		   
	  } 
	}
 }
function change_onvifdive() {
	var device_service = $("#onviflist_sel option:checked").text();
	$('#onvifdivce').attr("value", device_service);
}
function set_playtype()
{
	for (var i = 0; i < max_wnd; i++) {
        var result="";
		result += "<option value='usb'>" + $.i18n.prop('playlist_select_usb') + "</option>";
		result += "<option value='network'>" + $.i18n.prop('playlist_select_net') + "</option>";
	    $("#playlist_type_select"+i).html(result);		
	}
}
function set_playaudio()
{
	for (var i = 0; i < max_wnd; i++) {
        var result="";
		result += "<option value='0'>" + $.i18n.prop('playlist_audio_disable') + "</option>";
		result += "<option value='1'>" + $.i18n.prop('playlist_audio_enable') + "</option>";
	    $("#uri_audio_"+i).html(result);		
	}
}
function get_playtype(uri)
{
	var rerult=uri.charAt(0);
	if(rerult=='/')
	{
		return "usb";
	}
	else{
		return "network";
	}
}
function change_sapdive() {
	var url = $("#saplist_sel option:checked").val();
	if ("1000" == url) {
		$('#sap_sap_div').hide();
		$('#sap_sap_div_discription').hide();
	}
	else {
		$('#sap_sap_div').show();
		$('#sap_sap_div_discription').show();
		var url_text = "'" + url + "'";
		$('#sap_url_text').html(url + '<span id="playlist_copy_sap" class="copycss" onclick="copyurl(' + url_text + ');"></span>');
		$('#playlist_copy_sap').html($.i18n.prop('playlist_copy'));
	}
}

function get_onviflist() {
	$('#rtsp_url_div').hide();
	$('#rtsp_explain_div').hide();
	$.ajax({
		type: "GET",
		url: "http://" + xc_gethost() + "/onvifcfind",
		dataType: "xml",
		cache: false,
		error: function () {
		},
		success: function (data) {
			var result = "<select id='onviflist_sel' name='onviflist_sel' onchange='change_onvifdive()'>";
			var i = 0;
			$(data).find("d").each(function () {
				var onviflist_sel = $(this).text();
				result += '<option value="' + i + '">' + onviflist_sel + '</option>';
				i += 1;
			});
			if (i == 0) {
				var playlist_serchonvif = $.i18n.prop('playlist_serchonvif')
				result += '<option value="1000">' + playlist_serchonvif + '</option>';
			}

			result += "</select>";
			$('#onviflist_div').append(result);
			$('#onvifdivce').attr("value", $("#onviflist_sel option:checked").text());
		}
	});
}

function get_saplist() {
	$.ajax({
		type: "GET",
		url: "http://" + xc_gethost() + "/sapcfind",
		dataType: "xml",
		cache: false,
		error: function () {
		},
		success: function (data) {
			var result = "<select id='saplist_sel' name='saplist_sel' onchange='change_sapdive()'>";
			var i = 0;
			$(data).find("d").each(function () {
				var name = (this).getAttribute('name');
				var ip = (this).getAttribute('ip');;
				var sap = $(this).text();
				var fox = name + "(" + ip + ")";
				result += '<option value="' + sap + '">' + fox + '</option>';
				i += 1;
			});
			if (i == 0) {
				var playlist_serchsap = $.i18n.prop('playlist_serchsap')
				result += '<option value="1000">' + playlist_serchsap + '</option>';
			}
			result += "</select>";
			$('#saplist_div').append(result);
			change_sapdive();
		}
	});
}

function get_ndilist() {
	$.ajax({
		type: "GET",
		url: "http://" + xc_gethost() + "/ndifind",
		dataType: "xml",
		cache: false,
		error: function () {
		},
		success: function (data) {
			var result = "<span id='playlist_ndilist_txt'>";
			var i = 0;
			$(data).find("d").each(function () {
				var ndilist = $(this).text();
				url_text = "'" + ndilist + "'";
				result += '<span>' + ndilist + '<span id="playlist_copy_' + i + '" class="copycss" onclick="copyurl(' + url_text + ');"></span></span><br/>';
				i += 1;
				$('#content_box_ndi').show();
			});
			if (i == 0) {
				$('#content_box_ndi').hide();
			}
			else {
				result += "</span>";
				$('#ndilist_div').append(result);
				for (var j = 0; j < i; j++) {
					$('#playlist_copy_' + j).html($.i18n.prop('playlist_copy'));
				}
			}
		}
	});
}

function getrtspurl() {
	var device_service = $('#onvifdivce').val();
	var device_usr = $('#username_text').val();
	var device_pwd = $('#password_text').val();
	$.ajax({
		type: "GET",
		url: "http://" + xc_gethost() + "/onvifcrtsp?device_service=" + device_service + "&device_usr=" + device_usr + "&device_pwd=" + device_pwd,
		cache: false,
		success: function (data) {
			$('#rtsp_url_div').show();
			var rtsp_url_text = $(data).find("rtsp").text();
			if (rtsp_url_text != "") {
				$('#rtsp_explain_div').show();
				url_text = "'" + rtsp_url_text + "'";
				$('#rtsp_url_text').html(rtsp_url_text + '<span id="playlist_copy" class="copycss" onclick="copyurl(' + url_text + ');"></span>');
				$('#playlist_copy').html($.i18n.prop('playlist_copy'));
			}
			else {
				$('#rtsp_explain_div').hide();
				$('#rtsp_url_text').html($.i18n.prop('playlist_get_nortsp'));
			}
		},
		error: function () {
			$('#rtsp_url_text').html($.i18n.prop('playlist_get_rtsp'));
		}
	});
}

function showdiv(wndnum) {
	for (var i = 0; i < max_wnd; i++) {
		if (i < wndnum) {
			$('#div' + i).show();
			$('#div_type' + i).show();	
            $('#div_audio' + i).show();
			$('#div_cache' + i).show();
			$('#div_record' + i).hide();
			$('#div_playlist' + i).show();
			$('#line_' + i).show();							    
		} else {
			$('#div' + i).hide();
			$('#div_type' + i).hide();	
			$('#div_audio' + i).hide();
			$('#div_cache' + i).hide();
			$('#div_record' + i).hide();
			$('#div_playlist' + i).hide();
			$('#line_' + i).hide();		          	
		}			
	}
	if (wndnum == 1) {
		$('#line_0').hide();
		$('#full_btn_0').hide();
		$('#full_btn_1000').hide();
		$('#line_1').show();
	} else {
		$('#full_btn_0').hide();
		$('#full_btn_1000').hide();
	}

}

function changewnd() {
	var wndnum = $('#wnd').val();
	showdiv(wndnum); 
	for (var i = 0; i < wndnum; i++) {	
	var playlist_type = $("#playlist_type_select" + i + " option:checked").val();
	 playlist_type_show(playlist_type,i);
	}
}

function IsInteger(interger) {
	var IsInteger = true;
	if (parseInt(interger) == interger) {
		IsInteger = true;
	} else {
		IsInteger = false;
	}
	return IsInteger;
}

function check_url_valid(url, cache) {
	var temp_url = $.trim(url);
	if (!(temp_url.substring(0, 3) == "ndi")) {
		if (temp_url.indexOf(" ") != -1) {
			return -1;
		}
	}
	var Intcache = parseInt(cache);
	var IsIntcache = IsInteger(cache);
	if (Intcache < 0 || Intcache > 4000 || IsIntcache == false) {
		return -1;
	}

	return 0;
}

function playlist_setting() {
	var wnd = $('#wnd').val();
	var ptmp = "";
	ptmp += ("wnd=" + wnd + "&");
	for (var i = 0; i < max_wnd; i++) {
		var audio = $("#uri_audio_" + i + " option:checked").val();
		var playlist_type_select=$('#playlist_type_select' + i).val()
		var url="";
		if(playlist_type_select=="usb")
		{
		  url = $.trim($('#playlist_file_select' + i+' option:selected').text());
		}
		else
		{
		  url = $.trim($('#uri' + i).val());
		}
		url=encodeURIComponent(url);
		var cache = $('#cache' + i).val();
		var record = $("#record" + i).attr("checked") == "checked" ? "1" : "0";
		var recordtime = $('#recordtime' + i).val();
		var valid = check_url_valid(url, cache);
		if (valid == -1) {
			alert($.i18n.prop("playlist_format_error_start_info") + i + $.i18n.prop("playlist_format_error_end_info"));
			return;
		}
		var url_playlist_pid = $('#playlist_pid_select' + i).val();
		ptmp += ("uri" + i + "=" + url + "&uri" + i + "_audio=" + encodeURIComponent(audio) + "&uri" + i + "_record=" + record + "&uri" + i + "_recordtime=" + recordtime + "&uri" + i + "_pindex=" + url_playlist_pid + "&uri" + i + "_cache=" + cache + "&");
	}
	$.ajax({
		type: "GET",
		url: "http://" + xc_gethost() + "/set_playlist" + "?" + ptmp,
		cache: false,
		success: function (data) {
			alert($.i18n.prop('playlist_setting_success'));
		},
		error: function () {
			alert($.i18n.prop('playlist_setting_failed'));
		}
	});
}

function click_full_btn(id) {
	$.ajax({
		type: "GET",
		url: "http://" + xc_gethost() + "/set_full" + "?chn=" + id,
		cache: false,
		success: function (data) {
			//alert($.i18n.prop('playlist_setting_success'));
			/*for (var i = 0; i < max_wnd; i++) {
			 $('#uri_audio_' + i).attr("checked",false);
			 $('#uri_audio_' + i).attr("custom_selected","0");
			 }
			 $('#uri_audio_' + id).attr("checked",true);
			 $('#uri_audio_' + id).attr("custom_selected","1");*/
		},
		error: function () {
			//alert($.i18n.prop('playlist_setting_failed'));
		}
	});
}

function parentpage_adjust_height() {
	changewnd();
	window.parent.setup_iframe_height();
}

function language_setup() {
	var current_language = window.parent.get_language_setup();
	jQuery.i18n.properties({
		name: 'common',
		path: '../lang/',
		mode: 'map',
		language: current_language,
		callback: function () {
			$('#playlist_wndnum').html($.i18n.prop('playlist_wndnum'));
			for (var i = 0; i < max_wnd; i++) {
				if (!(current_language == "zh" || current_language == "zh-CN")) {
					$('#playlist_url' + i).html($.i18n.prop('playlist_url') + (i + 1) + " " + $.i18n.prop('playlist_url_symbol'));
				} else {
					$('#playlist_url' + i).html($.i18n.prop('playlist_url') + (i + 1) + $.i18n.prop('playlist_url_symbol'));
				}
                $('#playlist_type' + i).html($.i18n.prop('playlist_type'));
				$('#playlist_cache' + i).html($.i18n.prop('playlist_cache'));
				$('#playlist_audio' + i).html($.i18n.prop('playlist_audio'));
				$('#playlist_record' + i).html($.i18n.prop('playlist_record'));
				$('#playlist_recordtime' + i).html($.i18n.prop('playlist_recordtime'));
				$('#full_btn_' + i).val($.i18n.prop('playlist_full_btn'));

				$('#playlist_pid' + i).html($.i18n.prop('playlist_pid'));
				for (var pid = 0; pid < 32; pid++) {
					$('#playlist_pid_select' + i).append('<option value="' + pid + '">' + $.i18n.prop('playlist_pid_txt') + ' ' + (pid + 1) + '</option>');
				}
			}
			$('#playlist_setting').val($.i18n.prop('playlist_setting'));
			$('#full_btn_1000').val($.i18n.prop('playlist_nofull_btn'));
			$('#header_text').html($.i18n.prop('index_playlist'));
			$('#header_onvif').html($.i18n.prop('index_playlist_onvif'));
			$('#header_ndi').html($.i18n.prop('index_playlist_ndi'));
			$('#header_sap').html($.i18n.prop('index_playlist_sap'));

			$('#playlist_config_discription').html($.i18n.prop('playlist_config_discription'));
			$('#playlist_config_discription_rtsp').html($.i18n.prop('playlist_config_discription'));
			$('#playlist_config_discription_ndi').html($.i18n.prop('playlist_config_discription'));
			$('#playlist_config_discription_txt_per_1').html($.i18n.prop('playlist_config_discription_txt_per_1'));
			$('#playlist_config_discription_txt_per_2').html($.i18n.prop('playlist_config_discription_txt_per_2'));
			$('#playlist_config_discription_txt_per_2_2').html($.i18n.prop('playlist_config_discription_txt_per_2_2'));
			$('#playlist_config_discription_txt_per_3').html($.i18n.prop('playlist_config_discription_txt_per_3'));
			$('#playlist_onviflist').html($.i18n.prop('playlist_onviflist'));
			$('#playlist_username').html($.i18n.prop('playlist_username'));
			$('#playlist_password').html($.i18n.prop('playlist_password'));
			$('#playlist_get_btu_url').val($.i18n.prop('playlist_get_btu_url'));
			$('#playlist_rtsp_explain').html($.i18n.prop('playlist_rtsp_explain'));
			$('#playlist_ndi_explain').html($.i18n.prop('playlist_ndi_explain'));
			$('#playlist_ndilist').html($.i18n.prop('playlist_ndilist'));
			$('#playlist_onvifdivce').html($.i18n.prop('playlist_onvifdivce'));
			$('#playlist_rtsp_url').html($.i18n.prop('playlist_rtsp_url'));
			$('#playlist_saplist').html($.i18n.prop('playlist_saplist'));
			$('#playlist_config_discription_sap').html($.i18n.prop('playlist_config_discription'));
			$('#playlist_sap_explain').html($.i18n.prop('playlist_sap_explain'));
		}
	});
}

function init_input_ratio_click() {
	$("input[name='audioselect']").click(function () {
		if ($(this).attr("custom_selected") == "1") {
			$(this).attr("checked", false);
			$(this).attr("custom_selected", "0");
		} else {
			$(this).attr("checked", true);
			$("input[name='audioselect']").attr("custom_selected", "0");
			$(this).attr("custom_selected", "1");
		}
	});
}

$(function () {
	$('#sap_sap_div').hide();
	$('#sap_sap_div_discription').hide();
	language_setup();
	get_playfile();
	set_playtype();
	set_playaudio();
	get_playlist();
	get_onviflist();
	get_ndilist();
	get_saplist();
	init_input_ratio_click();
	scan_window_and_copy_init();
});
