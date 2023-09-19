/**
 * @author Eternal
 */
// var nav_item_0;
// var nav_item_1;
var nav_item_2;
var	language_setup="zh";
var wifi_exist=0;
var wifi_enable=0;

function init_menu_option(){
	$.ajax({
	    type: "GET",
	    url: "http://" + xc_gethost() + "/get_wifi",
	    dataType: "xml",
	    cache: false,
	    error: function () {
	    },
	    success: function (data) {
	    	var wifi_dev_exist=$(data).find("wifi_dev_exist").text();
	    	if(wifi_dev_exist==1){
	    		$("#wifi_option").removeClass("display_off");
	    		wifi_exist=1;
	    	}else if(wifi_dev_exist==0){
	    		$("#wifi_option").addClass("display_off");
	    		wifi_exist=0;
	    	}
			wifi_enable = $(data).find("wifi_enable").text();
			nav_item_2 = $("#main_nav .nav_item:eq(2)").next("ul").height();
	    }
	});

	$.ajax({
		type: "GET",
	    url: "http://" + xc_gethost() + "/get_status",
	    dataType: "xml",
	    cache: false,
	    error: function () {
	    },
	    success: function (data) {
	    	var show_switcher=$(data).find("show_switcher").text();
	    	if(show_switcher==1){
	    		$("#video_switch_option").removeClass("display_off");
	    	}else if(show_switcher==0){
	    		$("#video_switch_option").addClass("display_off");
	    	}
			nav_item_2 = $("#main_nav .nav_item:eq(2)").next("ul").height();
	    }
	});
}

function init_language(){
	language_setup=$.cookie('language_setup');
	if(language_setup==null){
		language_setup=getlanguage();
		if(language_setup==null)
		{
		 // language_setup=$.cookie('language_setup');
	 	  language_setup = navigator.language;
		  if(!language_setup){
		    language_setup = navigator.browserLanguage;
		 }
		}
	}
	language_setup=language_setup.toLowerCase();
}

function get_language_setup(){
		return language_setup;
}

function get_wifi_exist(){
	return wifi_exist;
}
function get_wifi_enable(){
	return wifi_enable;
}
	
function setup_current_language(){
	jQuery.i18n.properties({
		name: 'common',
		path: 'lang/',
		mode: 'map',
		language: get_language_setup(),
		callback: function () {
			$('#index_status').html($.i18n.prop('index_status'));
			$('#index_playlist').html($.i18n.prop('index_playlist'));
			$('#index_system').html($.i18n.prop('index_system'));
			$('#index_advance').html($.i18n.prop('index_advance'));
			$('#index_network').html($.i18n.prop('index_network'));
			$('#index_wifi').html($.i18n.prop('index_wifi'));
			$('#index_remserial').html($.i18n.prop('index_remserial'));
			$('#index_pwd').html($.i18n.prop('index_pwd'));
			$('#index_systemout').html($.i18n.prop('index_systemout'));
			$('#index_chnlayout').html($.i18n.prop('index_chnlayout'));
			$('#index_osdsetup').html($.i18n.prop('index_osdsetup'));
			$('#index_cropsetup').html($.i18n.prop('index_cropsetup'));
			$('#index_videoswitch').html($.i18n.prop('index_videoswitch'));
			$('#index_factory').html($.i18n.prop('index_factory'));
			$('#index_update').html($.i18n.prop('index_update'));
			$('#index_reset').html($.i18n.prop('index_reset'));
			$('#index_reboot').html($.i18n.prop('index_reboot'));
			$('#index_restart').html($.i18n.prop('index_restart'));
			$('#index_language').html($.i18n.prop('index_language'));
			$('head title').html($.i18n.prop('index_title'));
		}
	});
}

function setup_iframe_height(){
	var subpage_content_height=$("#subframe").contents().find("#main_content").outerHeight(true);
	if(subpage_content_height < 600) subpage_content_height = 600;
	$("#subframe").height(subpage_content_height);
}

function iframe_adjust_height(){
	var iframe = document.getElementById("subframe");
	if (iframe.attachEvent) {
		iframe.attachEvent("onload", function() {
			setup_iframe_height();
		});            
	} else {
		iframe.onload = function() {
			setup_iframe_height();
		};
	}
}

function change_event_handle(){
	var language_value=$("#LanSle option:selected").attr("value");
	if(language_value=="English"){
		language_setup="en";
		setup_current_language();
		var last_src=$("#subframe").attr("src");
		$("#subframe").attr("src","");
		$("#subframe").attr("src",last_src);
		$.cookie('language_setup', language_setup, { expires: 7 });
	}else if(language_value=="Chinese"){
		language_setup="zh";
		setup_current_language();
		var last_src=$("#subframe").attr("src");
		$("#subframe").attr("src","");
		$("#subframe").attr("src",last_src);
		$.cookie('language_setup', language_setup, { expires: 7 });
	}
	
}

function init_language_select(){
	if(language_setup=="en"||language_setup=="en-us"){
		$("#LanSle").val("English");
		language_setup="en";
	}else if(language_setup=="zh"||language_setup=="zh-cn"){
		$("#LanSle").val("Chinese");
		language_setup="zh";
	}else{
		language_setup="en";
	}
}

function main_iframe_change(this_href) {
	$("#right iframe").attr("src", this_href);
}
	

$(function () {
	// nav_item_0=$("#main_nav .nav_item:eq(0)").next("ul").height();
	// nav_item_1=$("#main_nav .nav_item:eq(1)").next("ul").height();
	nav_item_2 = $("#main_nav .nav_item:eq(2)").next("ul").height();

	$("#main_nav li .nav_item").hover(function () {
		$(this).addClass("select_nav_item");
		$(this).animate({
			paddingRight: "25px"
		}, 100);
	}, function () {
		$(this).removeClass("select_nav_item");
		$(this).animate({
			paddingRight: "15px"
		}, 100);
	});

	$("#main_nav li .nav_item").click(function () {
		var self = $(this);
		$("#main_nav li .nav_item").removeClass("select_nav_item").mouseout(function () {
			$(this).removeClass("select_nav_item");
			$(this).animate({
				paddingRight: "15px"
			}, 100);
		});
		$("#main_nav li .nav_item").not(self).animate({
			paddingRight: "15px"
		}, 100);
		if ($(this).attr("value") == "have_secondary_nav") {
			if ($(this).next("ul").attr("value") == "off") {
				$(this).next("ul").attr("style", "height:0px;").removeClass("display_off").addClass("display_on").animate({
					height: nav_item_2
				}, 100,function(){
					$(this).removeAttr("style");
				}).attr("value", "on");
			} else {
				$(this).next("ul").animate({
					height: "0px"
				}, 100, function () {
					$(this).removeAttr("style");
					$(this).removeClass("display_on");
					$(this).addClass("display_off");
				}).attr("value", "off");
			}
		} else {
			$("#main_nav .main_nav_li span:eq(2)").next("ul").animate({
				height: "0px"
			}, 100, function () {
				$(this).removeAttr("style");
				$(this).removeClass("display_on");
				$(this).addClass("display_off");
			}).attr("value", "off");
			$(".secondary_nav li span").removeClass("select_secondary_nav").mouseout(function () {
				$(this).removeClass("select_secondary_nav");
				$(this).animate({
					paddingRight: "15px"
				}, 100);
			}).animate({
				paddingRight: "15px"
			}, 100);
		}
		$(this).addClass("select_nav_item");
		$(this).unbind("mouseout");
	});

	$(".secondary_nav li span").hover(function () {
		$(this).addClass("select_secondary_nav");
		$(this).animate({
			paddingRight: "20px"
		}, 100);
	}, function () {
		$(this).removeClass("select_secondary_nav");
		$(this).animate({
			paddingRight: "15px"
		}, 100);
	});

	$(".secondary_nav li span").click(function () {
		var self = $(this);
		$(".secondary_nav li span").removeClass("select_secondary_nav").mouseout(function () {
			$(this).removeClass("select_secondary_nav");
			$(this).animate({
				paddingRight: "15px"
			}, 100);
		});
		$(".secondary_nav li span").not(self).animate({
			paddingRight: "15px"
		}, 100)
		$(this).addClass("select_secondary_nav");
		$(this).unbind("mouseout");
	});
	
	$(window).resize(function(){
		iframe_adjust_height();
	});
	
	init_menu_option();
	init_language();
	init_language_select();
	setup_current_language();
	iframe_adjust_height();
	change_event_handle();
	$("#main_nav li .nav_item:eq(0)").trigger("click");
});
