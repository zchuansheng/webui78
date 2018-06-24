////////////////////////////////////////////////////////////////////////////////
/*
 * JQuery webui78-WebTabpanel.js
 * Description: 
 * Usage: $(document).ready(function(){		$("#yourID").WebTabpanel(); });
 * Depends:jquery 1.7.X
 * Date: 2011-12-01 ~ 2016-01-19
 * Author: zhangchuansheng
 * Email: zchuansheng@163.com，zchuansheng@gmail.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */////////////////////////////////////////////////////////////////////////////////
 
(function($){
		$.fn.extend({
				webPanel:function(options){
						var s ={
							width:null,
							title:"",
							hasHead:true,
							collapsable:false,
							dir:1,
							resizable:true,
 							ttCls:"webpanel/webpanel_header/webpanel_title/webpanel_tool/webpanel_content/pup/pdown"
						};
						if(options) {	jQuery.extend(s, options); };
						$(this).each(function(){
							var pCls=s.ttCls.split("/");
							var slf = $(this);
 							slf.addClass(pCls[0]);
 							var txtT=slf.attr("title");
							if(s.width!=null)	slf.width(s.width);//如果给出宽度，在此设置宽度
							slf.wrapInner($("<div></div>").addClass(pCls[4]));//用div包裹内容
							slf.prepend($("<div></div>").addClass(pCls[1])); 
							var cont=slf.find(">."+pCls[4]);
							var head=slf.find(">."+pCls[1]);
							head.append($("<div></div>").addClass(pCls[2])).append($("<div></div>").addClass(pCls[3]));
							var tit=head.find(">."+pCls[2]);							
							tit.text(txtT);
							//查找所有标题div，并添加
							var pht=s.height;
				 			var sss=slf[0].style.height;
							if(pht==null && sss!=null && sss!=""){//如果设置了高度
								pht=slf.height();
							}							 					
							if(!isNaN(pht)){//如果设置了高度
									slf.outerHeight(pht);//如果给出高度，在此设置高度
									var dd=slf.height()-head.outerHeight()
										cont.height(dd);
									if($.browser.msie){
									}else{
										cont.height(dd-(cont.outerHeight()-cont.height()));
									}							 
							}else {//如果没有设置高度
								cont.height("100%");
							}
							slf.css("height","");
							if(s.collapsable){//如果设置了可折叠
								var tol=head.find(">."+pCls[3]);
								var btn=tol.append($("<a href='#'></a>").addClass("panelbtn").addClass(pCls[5]));
								btn.bind("click", {target:this},function(e){
									var h1 =head.height();
									var h2 =slf.height();
									if(h2>h1) {
										s.old_h1=h2;
										$('.panelbtn',this).removeClass(pCls[5]).addClass(pCls[6]);
										slf.animate({height: h1});
										}	else {
										$('.panelbtn',this).removeClass(pCls[6]).addClass(pCls[5]);
										slf.animate({height: s.old_h1});
									}
								});
							}
						if(s.resizable) slf.webResizable();									
						if(!s.hasHead) head.hide(); 

 		    		});
		    		return $(this);
			}
		});
})(jQuery);
////////////////////////////////////////////////////////////////////////////////




