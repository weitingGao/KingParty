$(function(){
	$("#btn_search").on("touchend",function(){
		var searchBar = $(".header .search");
		if(searchBar.hasClass('active')){
            doSearch();
		}else{
			searchBar.addClass('active')
		}
	});
	$("#btn_close").on("touchend",function(){
		$(".header .search").removeClass('active')
	});
	$(".header .menu").on("touchend",function(){
		var header = $(".header");
		var _body  = $("body");
		var _html  = $("html")
		if($(header).hasClass('active')){
			// $(document).unbind('touchmove');
			header.removeClass('active');
			// _body.removeClass('donot_scroll');
			// _html.removeClass('donot_scroll');
		}else{
			// $(document).unbind('touchmove');
			header.addClass('active');
			// _body.addClass('donot_scroll');
			// _html.addClass('donot_scroll');
		}
	});
	// $("body").on("touchmove",function(event){
	//     $(document).unbind('touchmove')
	// })
	$(".head_nav dt, .foot_nav dt").on("click",function(){
		if($(this).parent().hasClass('show')){
			$(this).parent().removeClass('show')
			return;
		}
		$(".head_nav dl").removeClass('show');
		$(this).parent().addClass('show')
	});
});