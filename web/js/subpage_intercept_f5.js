$(function() {
	$(document).keydown(function(e) {
		if(e.keyCode == 116) {
			var parent_iframe=$("iframe", window.parent.document);
			parent_iframe.attr("src",parent_iframe.attr("src"));
			e.keyCode = 0;
			return false;
		}
	});
});
