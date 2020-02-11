//ui-search定义
$.fn.UiSearch = function(){
	var ui = $(this);
	$('.ui-search-selected',ui).on('click',function(){
		$('.ui-search-select-list').show();
		return false;
	});
	$('.ui-search-select-list a',ui).on('click',function(){
		$('.ui-search-selected').text($(this).text());
		$('.ui-search-select-list').hide();
		return false;
	});
	$('body').on('click',function(){
		$('.ui-search-select-list').hide();
	})
}
//ui-tab 定规
/**
*@param {string} header Tab组件的选项卡切换部分classNmae,里面有若干个.item
*@param {string} content Tab组件的选项卡切换部分classNmae,里面有若干个.item
*/ 
$.fn.UiTab = function(header,content,focus_prefix){
	var ui = $(this);
	// var tabs = $(header+'>.item',ui);
	var tabs = $(header,ui);
	var cons = $(content,ui);
	var focus_prefix = focus_prefix || '';
	tabs.on('click',function(){
		var index = $(this).index();
		tabs.removeClass( focus_prefix + 'item_focus').eq(index).addClass(focus_prefix+ 'item_focus');
		cons.hide().eq(index).show();
		return false;
	})
}
//ui-backTab
$.fn.UiBackTop = function(){
	var ui = $(this);
	var el = $('<a class="ui-backTop" href="#0"></a>');
	ui.append(el);
	var windowHeight = $(window).height();
	$(window).on('scroll',function(){
		var top = $(document).scrollTop();
		if(top > windowHeight){
			el.show();	
		}else{
			el.hide();
		}
	});
	el.on('click',function(){
		$(window).scrollTop(0);
	});
}
//ui-slider
//1.左右箭头需要能控制翻页
//2.进度点要联动
//3.翻到第三页要回到第一页
//4.没有点击的时候需要自动滚动
//5.进度点,在点击的时候,需要切换到对应的页面
$.fn.UiSlider = function(){
	var ui = $(this);
	var wrap = $('.ui-slider-warp');
	var items = $('.ui-slider-warp .item',ui);
	var btn_prev = $('.ui-slider-arrow .left',ui);
	var btn_next = $('.ui-slider-arrow .right',ui);
	var tips = $('.ui-slider-process .item',ui);
	//预定义
	var current = 0;
	var size = items.length;
	var width = items.eq(0).width();
	var enableAuto = true;
	//设置自动滚动感应
	ui
	.on('mouseover',function(){
		enableAuto = false;
	})
	.on('mouseout',function(){
		enableAuto = true;
	})
	//具体操作
	wrap
	.on('move_prev',function(){
		if(current<=0){
			current = size;
		}
		current = current - 1 ;
		// console.log(current);
		wrap.triggerHandler('move_to',current);
	})
	.on('move_next',function(){
		if(current>=size-1){
			current = -1;
		}
		current = current + 1 ;
		// console.log(current);
		wrap.triggerHandler('move_to',current);
	})
	.on('move_to',function(evt,index){
		wrap.css('left',index*width*-1);
		tips.removeClass('item_focus').eq(index).addClass('item_focus');
	})
	.on('auto_move',function(){
		setInterval(function(){
			enableAuto && wrap.triggerHandler('move_next');
		},5000)
	})
	.triggerHandler('auto_move');
	btn_prev.on('click',function(){
		wrap.triggerHandler('move_prev');
	});
	btn_next.on('click',function(){
		wrap.triggerHandler('move_next');
	});
	tips.on('click',function(){
		var index = $(this).index();
		wrap.triggerHandler('move_to',index);
	})
}
//ui-cascading
$.fn.UiCascading = function(){
	var ui = $(this);
	var selects = $('select',ui);
	selects
	.on('change',function(){
		var val = $(this).val();
		var index = selects.index(this);
		//触发下一个select的值
		var where = $(this).attr('data-where');
		where = where ? where.split(',') : [];
		where.push($(this).val());
		selects
			.eq(index+1).attr('data-where',where.join(','))
			.triggerHandler('reloadOptions');
		//触发下一个之后的select的初始化
		ui.find('select:gt('+(index+1)+')').each(function(){
			$(this)
			.attr('data-where','')
			.triggerHandler('reloadOptions');
		})
	})
	.on('reloadOptions',function(){
		var method = $(this).attr('data-search');
		var args = $(this).attr('data-where').split(',');
		var data = AjaxRemoteGetData[method].apply(this,args);
		var select = $(this);
		select.find('option').remove();
		$.each(data,function(i,item){
			var el = $('<option value="'+item+'">'+item+'<option>');
			select.append(el);
		});
	});
	selects.eq(0).triggerHandler('reloadOptions');
}
//页面的逻辑脚本
$(function(){
	$('.ui-search').UiSearch();
	$('.content-tab').UiTab('.caption > .item','.block > .item');
	$('.content-tab .block .item').UiTab('.block-caption > a',
	'.block-content > .block-warp','.block-caption-');
	$('body').UiBackTop();
	$('.ui-slider').UiSlider();
	$('.ui-cascading').UiCascading();
})