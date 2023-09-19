var session_id = "20171121080011";
var timer_id;
var update_mode=0;
var waiting_timer;
var timeout_count=0;

function reboot_wait(){
	 $.ajax({
        type: "GET",
        url: "http://" + xc_gethost() + "/get_status",
        dataType: "xml",
        cache: false,
        timeout:1500,
        success: function (data) {
        	clearInterval(waiting_timer);
            setTimeout(function(){
           		window.parent.window.location.href="http://" + xc_gethost();
            },1000);
        },
        error: function (){
    		timeout_count++;
    		if(timeout_count>20){
    			timeout_count=0;
    			clearInterval(waiting_timer);
    			alert($.i18n.prop('reboot_timeout'));
    		}
        }
    });
}

function get_verion() {
    $.ajax({
        type: "GET",
        url: "http://" + xc_gethost() + "/get_version",
        dataType: "xml",
        cache: false,
        error: function () {
        },
        success: function (data) {
            var version = $(data).find("version").text();
			var b = version.indexOf(".");
            var c = version.lastIndexOf(".");
            var first = version.substr(0, b + 1);
            var mid = version.substr(b + 1, c - b - 1);
            var last = version.substr(c);
            var mint = parseInt(mid)
            mint += 13;
            var new_mid = mint.toString();
            version = first+new_mid+last;
            version = version + "-621Q-U";
			$('#update_version').html(version);
        }
    });
}

function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
function get_progress() {
    $.ajax({
        type: "GET",
        url: url="http://" + xc_gethost() + "/up_progress?id=" + session_id,
        dataType: "text",
        cache: false,
        error: function () {
        },
        success: function (data) {
            if (-1 == data) {
                $('#update_apply').val($.i18n.prop('update_apply'));
                $("#update_apply").attr("disabled", false);
                clearInterval(timer_id);
	            $("#progress_bar").addClass("display_off");
	            $("#progress_text").addClass("display_off");
		        $("#update_image").addClass("display_off");
		        $("#update_text").addClass("display_off");
	            $("#filename").removeClass("display_off");
	            $("#scan_button").removeClass("display_off");
	            $('#progress').width(0);
	            $('#progress_text').html("0%");
                alert($.i18n.prop('update_failed'));
            }
            else if (1 == data) {
                $('#update_apply').val($.i18n.prop('update_apply'));
                $("#update_apply").attr("disabled", false);
                clearInterval(timer_id);
	            $("#progress_bar").addClass("display_off");
	            $("#progress_text").addClass("display_off");
		        $("#update_image").addClass("display_off");
		        $("#update_text").addClass("display_off");
	            $("#filename").removeClass("display_off");
	            $("#scan_button").removeClass("display_off");
	            $('#progress').width(0);
	            $('#progress_text').html("0%");
	            if(update_mode==1){
        			$("#update_image").removeClass("display_off");
        			$("#update_kernel_mode_txt").removeClass("display_off");
        			setTimeout(function(){
        				reboot_wait();
            		},3000);
	            }else{
                	alert($.i18n.prop('update_succeed'));
	            }
            }
            else {
            	$('#progress_text').html(parseInt(data * 100)+"%");
            	//jquery 1.6.2 animate function,incompatible chrome brower
                //$('#progress').animate({width: data*184}, 100);
                $('#progress').width(data*184);
            }
        },
        error: function(){

        }
    });
}
function update_apply_fun() {
    session_id = randomString(14);
    var update = $("#update").val();
    if (update == "") {
        alert($.i18n.prop('update_choosefile'));
    }
    else {
        $("#update_apply").attr("disabled", true);
        $("#filename").addClass("display_off");
        $("#scan_button").addClass("display_off");
		$("#progress_bar").removeClass("display_off");
        $("#progress_text").removeClass("display_off");
        $("#update_image").removeClass("display_off");
        $("#update_text").removeClass("display_off");
        timer_id = setInterval(get_progress, 1000);
        $.ajaxFileUpload({
            type: "post",
            url: "http://" + xc_gethost() + "/?id=" + session_id,
            dataType: "json",
            fileElementId: 'update',
            cache: false,
            success: function (data) {
            }
        })
    }
}

function BackupFirmware(type)
{
	var uri = "http://" + xc_gethost() + "/";
	if(0 == type){
		uri += "box.ini";
		
	}
	else if(1 == type){
		uri += "up.bin";
	}
	window.open(uri);
}

function init_language() {
	var parent_language=window.parent.get_language_setup();
    jQuery.i18n.properties({
        name: 'common',
        path: '../lang/',
        mode: 'map',
        language: parent_language,
        callback: function () {
            $('#update_version_txt').html($.i18n.prop('update_version_txt'));
            $('#update_txt').html($.i18n.prop('update_txt'));
            $('#update_apply').val($.i18n.prop('update_apply'));
            $('#header_upload_text').html($.i18n.prop('update_upload_txt'));
            $('#update_choose_file').html($.i18n.prop('update_choose_file'));
            $('#scan_button').html($.i18n.prop('update_scan_button'));
            $('#update_text').html($.i18n.prop('update_text'));
            $('#update_kernel_mode_txt').html($.i18n.prop('update_kernel_mode_txt'));
            $('#warning').html($.i18n.prop('update_warning'));
			$('#header_backup_text').html($.i18n.prop('update_backup_txt'));
			$('#backup_firmware').val($.i18n.prop('update_backup_button_firmware'));
			$('#backup_config').val($.i18n.prop('update_backup_button_config'));
        }
    });
    if(!(parent_language=="zh"||parent_language=="zh-CN")){
    	$("#warning").addClass("warning");
    }
}
$(function () {
	$("#update").change(function(){
		var filepath=$("#update").val();
		filepath=filepath.substring(filepath.lastIndexOf("\\")+1);
		filepath_index=filepath.substring(0,2);
		$("#filename").val(filepath);
		update_mode=0;
		if(filepath=="uk.rar"||filepath=="uk.bin"){
			alert($.i18n.prop('update_kernel_mode_warning_txt'));
			update_mode=1;
		}else if(filepath=="factory.ini" || filepath=="box.ini"){
			
		}else if(filepath=="load"){
            
        }
        else if(filepath_index!="up"){
			alert($.i18n.prop('update_file_format_failed'));
			$("#update_apply").attr("disabled","disabled");
			return;
		}
		$("#update_apply").removeAttr("disabled");
	});
	$("#scan_button").click(function(){
		var filepath=$("#update").trigger("click");
	});
	init_language();
    get_verion();
});
    