////////////////////////////////////////////////////////////////////////////////
/*
 * JQuery webui78-webDatepicker.js
 * Description: 
 * Usage: $(document).ready(function(){		$("#yourID").webDatepicker(); });
 * Depends:jquery 1.7.X
 * Date: 2011-12-01~2016-01-19
 * Author: zhangchuansheng
 * Email: zchuansheng@163.com，zchuansheng@gmail.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */////////////////////////////////////////////////////////////////////////////////
 
 (function($) {
	var today = new Date(); // used in defaults
  var months = '1,2,3,4,5,6,7,8,9,10,11,12'.split(',');
	var monthDays = '31,28,31,30,31,30,31,31,30,31,30,31'.split(',');
 	var dateRegEx = /^\d{2}|\d{4}-\d{1,2}-\d{1,2}$/;
	var yearRegEx = /^\d{4,4}$/;
  $.fn.webDatepicker = function(options) {
		var opts = $.extend({}, $.fn.webDatepicker.defaults, options);
		opts.hasday=(opts.fmt.indexOf('dd')>=0)?true:false;
		setYearRange();
		/** 设置年的范围 **/
		function setYearRange () {
			var startyear, endyear;
			if (opts.startdate.constructor == Date) 	startyear = opts.startdate.getFullYear();
			else if (!opts.startdate) startyear = today.getFullYear();
 			else if (yearRegEx.test(opts.startdate)) {
					startyear = opts.startdate;
			} else{
					var isdate=dateRegEx.test(opts.startdate);
					if(isdate) opts.startdate = new Date(opts.startdate);
					startyear= (isdate)?  opts.startdate.getFullYear(): today.getFullYear();
				}
			startyear-=opts.downYears;	opts.startyear = startyear;
			if (opts.enddate.constructor == Date) {
				endyear = opts.enddate.getFullYear();
			} else if (!opts.enddate)   endyear = today.getFullYear();
			else if (yearRegEx.test(opts.enddate)) {
					endyear = opts.enddate;
				} else {
					var isdate=dateRegEx.test(opts.enddate);
					if(isdate) opts.enddate = new Date(opts.enddate);
					endyear= (isdate)?  opts.enddate.getFullYear(): today.getFullYear();
				}
			endyear+=opts.upYears;	opts.endyear = endyear;
		}

		if(options!=null && options.startyear!=null) opts.startyear=options.startyear;
		if(options!=null &&  options.endyear!=null) opts.endyear=options.endyear;
		var vname={clName:"webdatepickercss",fName:"webDatepicker",focName:"webDatepicker_isfc"};

		function newDatepickerHTML () {
			var years = [];
			// 将可选择的年放置于数组
			for (var i = 0; i <= opts.endyear - opts.startyear; i ++) years[i] = opts.startyear + i;
			// 创建显示日历的表
			var t = $('<table class="'+vname.clName+'" style="display:none" tabIndex="0" cellpadding="0" cellspacing="0"><thead></thead><tbody></tbody><tfoot></tfoot></table>');
			// 月选择框
			var monthselect = '<select name="month" class="month">';
			for (var i in months) monthselect += '<option value="'+i+'">'+months[i]+'</option>';
			monthselect += '</select>';
			// 年选择框
			var yearselect = '<select name="year">';
			for (var i in years) yearselect += '<option  value="'+years[i]+'">'+years[i]+'</option>';
			yearselect += '</select>';
			$("thead",t).append('<tr class="controls"><th colspan="7" ><span class="prevYear" >&laquo;</span>&nbsp;<span class="prevMonth" >&lsaquo;&nbsp;</span>&nbsp;'+yearselect+ monthselect+'&nbsp;<span class="nextMonth" >&nbsp;&rsaquo;</span>&nbsp;<span class="nextYear" >&raquo;</span></th></tr>');
			if(opts.hasday) $("thead",t).append('<tr class="days"><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>');
			$("tfoot",t).append('<tr><td ><span class="prevMonth" >&nbsp;&lsaquo;&nbsp;&nbsp;</span></td><td  class="td_today" ><span class="today">选今天</span>&nbsp;<span class="clear" >清空</span>&nbsp;<span class="close" >关闭</span></td><td ><span class="nextMonth" >&nbsp;&nbsp;&rsaquo;&nbsp;</span></td></tr>');
			if(!opts.hasday) $("span.today", t).after('&nbsp;<span class="ok" >确定</span>');
			for (var i = 0; opts.hasday&& i < 6; i++) $("tbody",t).append('<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
			return t;
		}
		function findPosition (obj) {
			var curleft = curtop = 0;
			if (!obj.offsetParent) return false;
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
			return [curleft,curtop];
		}
		function toPosition (el,dp,op) {
			var elPos = findPosition(el);
			var e_l =  elPos[0],e_t =  elPos[1];
			var off_l=(parseInt(op.x) ? parseInt(op.x) : 0),off_t=(parseInt(op.y) ? parseInt(op.y) : 0);
			var e_h=el.clientHeight;
			var dp_l,dp_t,dp_w =dp[0].clientWidth,dp_h =dp[0].clientHeight;
			var dw = document.documentElement.scrollWidth,dh=document.documentElement.clientHeight;
			var dl = document.body.scrollLeft, dt =document.body.scrollTop||document.documentElement.scrollTop;
     //文档高度+文档顶边界-元素的顶边界-元素高度>=div的高度 ，div的顶边界=元素的顶边界+元素高度，
     //否则  判断，如果元素顶边界-文档滚动顶边界<div高度？如果小于，div的顶边界=元素的顶边界+元素高度，否则元素的顶-div的高度
      if (dh + dt - e_t - e_h >= dp_h) dp_t =  e_t+ off_t;
   	  else dp_t = (e_t - dt < dp_h) ? ( e_t +off_t) :(e_t-dp_h+55);
    //文档宽度+文档左边界-元素的左边界>=div的宽度 ，div的左边界=元素的左边界，否则 文档宽度>div宽度?div的左边界=文档宽度-div宽度+文档左边界,否则div的左边界=文档左边界
    	if (dw + dl - e_l >= dp_w) dp_l = e_l+off_l; else dp_l = (dw >= dp_w) ? dw - dp_w + dl : dl;
    	return [dp_l,dp_t];
		}
		function loadMonth (e, el, dp, chosendate) {
			var moObj=$("select[name=month]", dp);
			var yrObj=$("select[name=year]", dp);
			var preM=$("span.prevMonth", dp);
			var nxtM=$("span.nextMonth", dp);
			var mo = moObj.get(0).selectedIndex;
			var yr = yrObj.get(0).selectedIndex;
			var yrs = $("select[name=year] option", dp).get().length;
			if (e && $(e.target).hasClass('prevMonth')) {
				if (0 == mo && yr) {
					yr -= 1; mo = 11;
					moObj.get(0).selectedIndex = 11;
					yrObj.get(0).selectedIndex = yr;
				} else {
					mo -= 1;moObj.get(0).selectedIndex = mo;
				}
			} else if (e && $(e.target).hasClass('nextMonth')) {
				if (11 == mo && yr + 1 < yrs) {
					yr += 1; mo = 0;
					moObj.get(0).selectedIndex = 0;
					yrObj.get(0).selectedIndex = yr;
				} else { mo += 1;moObj.get(0).selectedIndex = mo;}
			} else if (e && $(e.target).hasClass('prevYear')) {	if(yr) {yr-=1;yrObj.get(0).selectedIndex = yr;}	}
			else if (e && $(e.target).hasClass('nextYear')) {		if(yr + 1 < yrs) {yr += 1;yrObj.get(0).selectedIndex = yr;}
			}
			// 设置翻阅按钮的状态
			if (0 == mo && !yr) preM.hide();
			else preM.show();
			if (yr + 1 == yrs && 11 == mo) nxtM.hide();
			else nxtM.show();
			if(!opts.hasday) {
				preM.hide();nxtM.hide();

				$('select.month',dp).change(function(){	closeIt(el, dp, new Date(yrObj.val(), moObj.val(), 1));});
				return;
			}
			$('.td_today',dp).attr('colspan',5);
			var cells = $("tbody td", dp).unbind().empty().removeClass('date');
			// 用选择的年月加载日期
			var m = moObj.val();
			var y = yrObj.val();
			var d = new Date(y, m, 1);
			var startindex = d.getDay();//开始是星期几
			var numdays = monthDays[m];
			if (1 == m){
				numdays= ((y%4 == 0 && y%100 != 0) || y%400 == 0)? 29:28;
				monthDays[m]=numdays;
			}
			if (opts.startdate.constructor == Date) {
				var startMonth = opts.startdate.getMonth();
				var startDate = opts.startdate.getDate();
			}
			if (opts.enddate.constructor == Date) {
				var endMonth = opts.enddate.getMonth();
				var endDate = opts.enddate.getDate();
			}
			//初始化第一行其他月份的最后几天
			for(var b=0;b<startindex;b++) $(cells.get(b)).text((monthDays[m-1<=0?11:m-1]-startindex+1)+b).addClass('othermonth');
			for (var i = 0; i < numdays; i++) {
				var cell = $(cells.get(i+startindex)).removeClass('chosen').removeClass('othermonth').removeClass('today');
				if (
					(yr || ((!startDate && !startMonth) || ((i+1 >= startDate && mo == startMonth) || mo > startMonth))) &&
					(yr + 1 < yrs || ((!endDate && !endMonth) || ((i+1 <= endDate && mo == endMonth) || mo < endMonth)))) {
					cell.text(i+1).addClass('date').hover(
						function () { $(this).addClass('over'); },
						function () { $(this).removeClass('over'); }).click(function () {
							var chosenDateObj = new Date(yrObj.val(), moObj.val(), $(this).text());
							closeIt(el, dp, chosenDateObj);
						});
					if (i+1 == chosendate.getDate() && m == chosendate.getMonth() && y == chosendate.getFullYear()) cell.addClass('chosen');
					if (i+1 == today.getDate() && m == today.getMonth() && y == today.getFullYear()) cell.addClass('today');
				}
			}
			//初始化最后一行其他月份的开始几天
			for(var e1=0;e1<(6*7-(b+i));e1++) $(cells.get(e1+b+i)).text(e1+1).addClass('othermonth');
		}
		function closeIt (el, dp, dateObj) {
			if (dateObj && dateObj.constructor == Date)		el.val($.fn.webDatepicker.formatOutput(dateObj,opts.fmt));
			dp.remove();dp = null;
			var d=el.data(vname.fName);
			d.hasDatepicker=false;
			//el.data("isaction",true);
 	 		el.focus();
		}
		var dp=null;
		function openIt (ev) {
					var d={hasDatepicker:false};
					var el = $(ev.target);
					el.data(vname.fName,d);
					$("span.close", $(document)).trigger('click');
					if ( d.hasDatepicker==false) {
						d.hasDatepicker=true;
						var initialDate = el.val();
						if(initialDate.length==4) initialDate=initialDate+"-01-01";
						if(initialDate.length==7) initialDate=initialDate+"-01";
						if (initialDate && dateRegEx.test(initialDate)) {
							var chosendate=$.fn.webDatepicker.parseDate(initialDate,opts.fmt);
						} else {
							var chosendate= (opts.chosendate.constructor == Date) ? opts.chosendate : (opts.chosendate)? new Date(opts.chosendate):today;
						}
						
						dp = newDatepickerHTML();
						d.dp=dp;
						$("body").prepend(dp);
						$(dp).show();
						var pos = toPosition(el.get(0),dp,opts);
						dp.css({ position: 'absolute', left: pos[0], top: pos[1] });
						$("span", dp).css("cursor","pointer");
						$("select", dp).bind('change', function () { loadMonth (null, el, dp, chosendate); });
						$("span.prevMonth", dp).attr('title','前翻1月\n快捷键：←').click(function (e) { loadMonth (e, el, dp, chosendate); return false;});
						$("span.nextMonth", dp).attr('title','向后翻 1 月\n快捷键：→').click(function (e) { loadMonth (e, el, dp, chosendate); return false; });
						$("span.prevYear", dp).attr('title','向前翻 1 年\n快捷键：↑').click(function (e) { loadMonth (e, el, dp, chosendate);return false; });
						$("span.nextYear", dp).attr('title','向后翻 1 年\n快捷键：↓').click(function (e) { loadMonth (e, el, dp, chosendate);return false; });
						$("span.today", dp).attr('title','选择今天\n快捷键：T').click(function () { closeIt(el, dp, new Date()); return false;});
						$("span.close", dp).attr('title','关闭的快捷键：[Esc]').click(function () { closeIt(el, dp); } );
						$("span.clear", dp).attr('title','清空的快捷键：[C]').click(function () { closeIt(el, dp); el.val(""); } );
						$("span.ok", dp).click(function () { closeIt(el, dp, new Date($('[name="year"]',dp).val(), $('[name="month"]',dp).val(), 1)); return false;});
						//el.data("isaction",true);
						var isread=(el.attr('is_readonly')==null||el.attr('is_readonly')=="1");
						if(isread) dp.focus();
						dp.keydown(function(evnt){
							var keyCode = evnt.which ? evnt.which : evnt.keyCode;
							 switch(keyCode){
								case 27 : $("span.close", dp).trigger('click');break;
								case 37 : $($("span.prevMonth", dp).get(0)).trigger('click'); break;
								case 38 : $("span.prevYear", dp).trigger('click'); break;
								case 39 : $($("span.nextMonth", dp).get(0)).trigger('click');break;
								case 40 : $("span.nextYear", dp).trigger('click');break;
								case 84 : $("span.today", dp).trigger('click');break;
								case 67 : $("span.clear", dp).trigger('click');break;
 							}
 							return false;
						});
						$("select[name=month]", dp).get(0).selectedIndex = chosendate.getMonth();
						$("select[name=year]", dp).get(0).selectedIndex = Math.max(0, chosendate.getFullYear() - opts.startyear);
						loadMonth(null, el, dp, chosendate);
						$(dp).css("z-index", parseInt( new Date().getTime()/1000 )+1);
					}

					return $(dp);
				};
			$(document).click(function(e){
				$this=$(e.target);
				var d=$this.data(vname.fName);
	 			if($this.closest('.'+vname.clName).length>0 ) return  ;
			  if(d&& d.hasDatepicker==true ) return;
				$('span.close',dp).trigger('click');
				return  ;
 			});/**/
    	return this.each(function() {
	    	var inEl=$(this);
				if ( inEl.is('input') && 'text' ==inEl.attr('type')) {
					var isread=(inEl.attr('is_readonly')==null||inEl.attr('is_readonly')=="1");
					if(isread) inEl.click(function(e){
 						openIt(e) ;
 						return false;
 					});
 					if(!isread) {
						inEl.dblclick(openIt);
						inEl.keyup(function(e){
							var keyCode = e.which ? e.which : e.keyCode;							   
							if((keyCode>=47 && keyCode<=57) && $(e.target).val().length>=4) openIt(e);
						});
 					}
 					inEl.focus(function(e){
 						var el=$(e.target);
 						if(isread)	$(e.target).attr('readonly','readonly');
 					});
			}

    });
    };
	$.fn.webDatepicker.formatOutput = function (dateObj,fmt) {
			var month=dateObj.getMonth() + 1;
			var d=dateObj.getDate() ;
			var pattern = "",retValue = "";
			if(fmt==undefined) fmt="yyyy-mm-dd";
			for (var i = 0; i < fmt.length; i++) {
				var currentPattern = fmt.charAt(i);
				pattern += currentPattern;
				switch (pattern) {
				case "dd":retValue+=(String(d).length === 1)?('0' + d):d;pattern = ""; break;
				 case "mm": retValue+=(String(month).length === 1)? (month = '0' + month):month; pattern = "";   break;
				case "yyyy": retValue += dateObj.getFullYear(); pattern = ""; break;
      	default: if (pattern.length === 2 && pattern.indexOf("y") !== 0 ) {
					    retValue += pattern.substring(0, 1);pattern = pattern.substring(1, 2);
					} else if ((pattern.length === 3 && pattern.indexOf("yyy") === -1)) pattern = "";
				}
			}
			return retValue;
	};
	$.fn.webDatepicker.parseDate = function (dateVal,fmt) {
			var month=1,  d=1, yy=0, pattern = "";
			if(fmt==undefined) fmt="yyyy-mm-dd";
			for (var i = 0; i < fmt.length; i++) {
				pattern += fmt.charAt(i);
				switch (pattern) {
				case "dd": d=dateVal.substring(i-1,i+1); pattern = ""; break;
				 case "mm": month=dateVal.substring(i-1,i+1); pattern = "";   break;
				case "yyyy": yy=dateVal.substring(i-4,i+1); pattern = "";break;
				default : 	if (pattern.indexOf("y") === -1 && pattern.indexOf("m") === -1 && pattern.indexOf("d") === -1)   pattern = "";
				}
			}
			return new Date( parseInt(yy,10), parseInt(month-1,10),parseInt(d,10));
	};
	$.fn.webDatepicker.defaults = {
		chosendate : today,
		fmt : "yyyy-mm-dd",
		startdate : today.getFullYear(),
		enddate : today.getFullYear() + 1,
		downYears:20,
		upYears:20,
		x : 18,
		y : 18
	};


})(jQuery);

////////////////////////////////////////////////////////////////////////////////
