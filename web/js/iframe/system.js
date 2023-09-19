var last_dividing_pointer_X=0;

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

function get_vo() {
    $.ajax({
        type: "GET",
        url: "http://" + xc_gethost() + "/get_vo",
        dataType: "xml",
        cache: false,
        error: function () {
        },
        success: function (data) {
            $('#vo').val($(data).find("hdmi").find("vo").text());

            var Luma=$(data).find("hdmi").find("Luma").text();
            var Contrast=$(data).find("hdmi").find("Contrast").text();
            var Hue=$(data).find("hdmi").find("Hue").text();
            var Saturationvo=$(data).find("hdmi").find("Saturationvo").text();
			var ao_volume=$(data).find("hdmi").find("ao_volume").text();
			
            $("#system_luma").html(Luma);
            setup_pointer_position($("#system_luma_dividing_rule"),parseInt(Luma)/100*240);

            $("#system_contrast").html(Contrast);
            setup_pointer_position($("#system_contrast_dividing_rule"),parseInt(Contrast)/100*240);

            $("#system_hue").html(Hue);
            setup_pointer_position($("#system_hue_dividing_rule"),parseInt(Hue)/100*240);
			
            $("#system_saturation").html(Saturationvo);
            setup_pointer_position($("#system_saturation_dividing_rule"),parseInt(Saturationvo)/100*240);
			$("#system_ao_volume").html(ao_volume);
            setup_pointer_position($("#system_ao_volume_dividing_rule"),parseInt(ao_volume)/100*240);

            $("#main_content").removeAttr("class");
            $("#main_content").removeAttr("class");
        }
    });
}

function system_setting() {
    var vo = "vo=" + $('#vo').val();
    var luma = "Luma=" + $('#system_luma').attr("value");
    var contrast = "Contrast=" + $('#system_contrast').attr("value");
    var hue = "Hue=" + $('#system_hue').attr("value");
    var saturation = "Saturation=" + $('#system_saturation').attr("value");
    var ao_volume = "ao_volume=" + $('#system_ao_volume').attr("value");
	if(true) {
		$.ajax({
			type: "GET",
			url: "http://" + xc_gethost() + "/set_vo" + "?" + vo+"&"+luma+"&"+contrast+"&"+hue+"&"+saturation+"&"+ao_volume,
			cache: false,
			success: function (data) {
				var ret = $(data).find("return").text();
				if ("ok" == ret) {
					alert($.i18n.prop('system_setting_success'));
				}
				else {
					alert($.i18n.prop('system_setting_failed'));
				}
			},
			error: function (){
				alert($.i18n.prop('system_setting_failed'));
			}
		});
	}
}

function system_default()
{
	var vo = "vo=" + $('#vo').val();
	//
	var Luma= 50;
	var Contrast= 50;
	var Hue= 50;
	var Saturationvo=50;
	var ao_volume=80;
	
	$("#system_luma").html(Luma);
	setup_pointer_position($("#system_luma_dividing_rule"),parseInt(Luma)/100*240);

	$("#system_contrast").html(Contrast);
	setup_pointer_position($("#system_contrast_dividing_rule"),parseInt(Contrast)/100*240);

	$("#system_hue").html(Hue);
	setup_pointer_position($("#system_hue_dividing_rule"),parseInt(Hue)/100*240);
	
	$("#system_saturation").html(Saturationvo);
	setup_pointer_position($("#system_saturation_dividing_rule"),parseInt(Saturationvo)/100*240);
	$("#system_ao_volume").html(ao_volume);
	setup_pointer_position($("#system_ao_volume_dividing_rule"),parseInt(ao_volume)/100*240);
}

function init_language() {
    jQuery.i18n.properties({
        name: 'common',
        path: '../lang/',
        mode: 'map',
        language: window.parent.get_language_setup(),
        callback: function () {
            $('#system_vo_txt').html($.i18n.prop('system_vo_txt'));
            $('#system_luma_txt').html($.i18n.prop('system_luma_txt'));
            $('#system_contrast_txt').html($.i18n.prop('system_contrast_txt'));
            $('#system_hue_txt').html($.i18n.prop('system_hue_txt'));
            $('#system_saturation_txt').html($.i18n.prop('system_saturation_txt'));
			$('#system_ao_volume_txt').html($.i18n.prop('system_ao_volume_txt'));
            
            $('#system_setting').val($.i18n.prop('system_setting'));
			$('#system_default').val($.i18n.prop('system_default'));
			
            $('#header_text').html($.i18n.prop('index_systemout'));
        }
    });
}

function setup_pointer_position(element,offset){
	if(offset>0&&offset<241){
		element.find(".rule_pointer").attr("style","margin-left:"+offset+"px;");
		var value=parseInt(offset/240*100);
		element.next(".number").html(value).attr("value",value);
	}
}

function init_dividing_rule(){
	$(".dividing_rule").mousedown(function(e1){
		setup_pointer_position($(this),e1.pageX-$(this).offset().left-5);
		$(this).mousemove(function(e2){
			setup_pointer_position($(this),e2.pageX-$(this).offset().left-5);
		});
	}).mouseup(function(){
		$(this).unbind("mousemove");
	}).mouseleave(function(){
		$(this).unbind("mousemove");
	});
}

function check_cvbs_position()
{
	var x = $("#system_cvbs_x").val();
	var y = $("#system_cvbs_y").val();
	var w = $("#system_cvbs_w").val();
	var h = $("#system_cvbs_h").val();
	//js �ַ�"" == 0
	if(x == "" || y == "" || w == "" || h == "") {
		alert($.i18n.prop('system_cvbs_empty_txt'));
		return false;
	}
	
	var Intx = IsInteger(x);
	var Inty = IsInteger(y);
	var Intw = IsInteger(w);
	var Inth = IsInteger(h);
	x = parseInt(x);
	y = parseInt(y);
	w = parseInt(w);
	h = parseInt(h);
	if(x < 0 || x > 720 || Intx == false) {
		alert("CVBS show X " + $.i18n.prop('system_cvbs_format_txt'));
		return false;
	}
	else if(y < 0 || y > 576 || Inty == false) {
		alert("CVBS show Y " + $.i18n.prop('system_cvbs_format_txt'));
		return false;
	}
	else if(w < 0 || w > 720 || Intw == false) {
		alert("CVBS show W " + $.i18n.prop('system_cvbs_format_txt'));
		return false;
	}
	else if(h < 0 || h > 576 || Inth == false) {
		alert("CVBS show H " + $.i18n.prop('system_cvbs_format_txt'));
		return false;
	}
	else if(x + w < 0 || x + w > 720) {
		alert("CVBS show X and CVBS show W " + $.i18n.prop('system_cvbs_format_txt'));
		return false;
	}
	else if(y + h < 0 || y + h > 576) {
		alert("CVBS show y and CVBS show H " + $.i18n.prop('system_cvbs_format_txt'));
		return false;
	}
	return true;
}

$(function () {
	init_language();
    get_vo();
    init_dividing_rule();
});
