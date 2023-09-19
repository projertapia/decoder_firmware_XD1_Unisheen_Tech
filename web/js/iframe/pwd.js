var pwd_old_allow=0;
var pwd_new0_allow=0;
var pwd_new1_allow=0;

function check_pwd(str){
	var regular=/^\w+$/;
	return regular.test(str);
}

function allow_upload(){
	if(pwd_old_allow==1&&pwd_new0_allow==1&&pwd_new1_allow==1){
		if(pwd_new0_allow==pwd_new1_allow){
			$("#pwd_setting").attr("disabled",false);
		}
	}else{
		$("#pwd_setting").attr("disabled",true);
	}
}

function pwd_setting() {
    var pwd_old = $('#pwd_old').val();
    var pwd_new0 = $('#pwd_new0').val();
    var pwd_new1 = $('#pwd_new1').val();
    if (pwd_new0 != pwd_new1) {
        alert($.i18n.prop('pwd_error'));
        return;
    }
    pwd_old=encodeURIComponent(pwd_old);
    pwd_new0=encodeURIComponent(pwd_new0);
    pwd_new1=encodeURIComponent(pwd_new1);
    var param = "pwd_old=" + pwd_old + "&pwd_new=" + pwd_new0;
    $.ajax({
        type: "GET",
        url: "http://" + xc_gethost() + "/set_pwd" + "?" + param,
        cache: false,
        success: function (data) {
            var ret = $(data).find("return").text();
            if ("ok" == ret) {
                alert($.i18n.prop('pwd_change_ok'));
            }
            else {
                alert($.i18n.prop('pwd_change_error'));
            }
        },
        error: function (){
        	alert($.i18n.prop('pwd_change_error'));
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
            $('#pwd_old_txt').html($.i18n.prop('pwd_old_txt'));
            $('#pwd_new_txt0').html($.i18n.prop('pwd_new_txt0'));
            $('#pwd_new_txt1').html($.i18n.prop('pwd_new_txt1'));
            $('#pwd_setting').val($.i18n.prop('pwd_setting'));
            $('#header_text').html($.i18n.prop('index_pwd'));
            $('#pwd_old_hint_text').html($.i18n.prop('pwd_hint_input_text'));
            $('#pwd_new0_hint_text').html($.i18n.prop('pwd_hint_input_text'));
            $('#pwd_new1_hint_text').html($.i18n.prop('pwd_hint_input_text'));
        }
    });
}

$(function () {
	$("input[type='text']").focusin(function(){
		$(this).next().next().removeClass("display_off");;
	});
    $("#pwd_old").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#pwd_old_hint_image").removeClass("display_off");
    		$("#pwd_old_hint_text").removeClass("display_off").html($.i18n.prop('pwd_hint_empty_text'));
    		pwd_old_allow=0;
    	}else if(!check_pwd(value)){
    		$("#pwd_old_hint_image").removeClass("display_off");
    		$("#pwd_old_hint_text").removeClass("display_off").html($.i18n.prop('pwd_hint_format_text'));
    		pwd_old_allow=0;
    	}else{
    		$("#pwd_old_hint_image").addClass("display_off");
    		$("#pwd_old_hint_text").addClass("display_off").html("");
    		pwd_old_allow=1;
    	}
    	allow_upload();
    });
    $("#pwd_new0").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#pwd_new0_hint_image").removeClass("display_off");
    		$("#pwd_new0_hint_text").removeClass("display_off").html($.i18n.prop('pwd_hint_empty_text'));
    		pwd_new0_allow=0;
    	}else if(!check_pwd(value)){
    		$("#pwd_new0_hint_image").removeClass("display_off");
    		$("#pwd_new0_hint_text").removeClass("display_off").html($.i18n.prop('pwd_hint_format_text'));
    		pwd_new0_allow=0;
    	}else{
    		$("#pwd_new0_hint_image").addClass("display_off");
    		$("#pwd_new0_hint_text").addClass("display_off").html("");
    		pwd_new0_allow=1;
    	}
    	allow_upload();
    });
    $("#pwd_new1").focusout(function(){
    	var value=$(this).val();
    	if(value==""){
    		$("#pwd_new1_hint_image").removeClass("display_off");
    		$("#pwd_new1_hint_text").removeClass("display_off").html($.i18n.prop('pwd_hint_empty_text'));
    		pwd_new1_allow=0;
    	}else if(!check_pwd(value)){
    		$("#pwd_new1_hint_image").removeClass("display_off");
    		$("#pwd_new1_hint_text").removeClass("display_off").html($.i18n.prop('pwd_hint_format_text'));
    		pwd_new1_allow=0;
    	}else{
    		$("#pwd_new1_hint_image").addClass("display_off");
    		$("#pwd_new1_hint_text").addClass("display_off").html("");
    		pwd_new1_allow=1;
    	}
    	allow_upload();
    });
    init_language();
});