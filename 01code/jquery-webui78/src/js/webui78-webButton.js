////////////////////////////////////////////////////////////////////////////////
/*
 * JQuery webui78-webButton.js
 * Description: 
 * Usage: $(document).ready(function(){		$("#yourID").webButton(); });
 * Depends:jquery 1.7.X
 * Date: 2011-07-01 ~2016-01-19
 * Author: zhangchuansheng
 * Email: zchuansheng@163.com，zchuansheng@gmail.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */////////////////////////////////////////////////////////////////////////////////
 (function($){
		$.fn.extend({
				webButton:function(options){
					var getDef=function (){return  $.extend({}, $.fn.webButton.defaults);}
					var e=$(this);
					e.each(function (){
							var s=getDef();
							var bo=$(this);//button object
							if(bo.hasClass(s.btn_class)==true) return bo;
							if(bo.attr('btn_href')!==undefined) s.btn_href=bo.attr('btn_href');
					   	if(bo.attr('force')!==undefined) s.force=true;
					   	if(bo.attr('istip')!==undefined) s.istip=bo.attr('istip')=="1"?true:false;
					   	if(bo.attr('issubmit')!==undefined) s.issubmit=bo.attr('issubmit')=="1"?true:false;
					   	if(bo.attr('ischeck')!=undefined) s.ischeck=bo.attr('ischeck')=="1"?true:false;
					   	if(bo.attr('ismask')!=undefined) s.ismask=bo.attr('ismask')=="1"?true:false;
					   	if(bo.attr('popup')!==undefined) s.popup=true;
					   	if(bo.attr('enableIcon')!=undefined) s.enableIcon=bo.attr('enableIcon')=="0"?false:true;
					   	if(bo.attr('icon')!=undefined) s.icon=bo.attr('icon');
		 					if(s.formobj==null) s.formobj=$($("form")[0]);
		 					if(s.maskobj==null) s.maskobj=$("body");
					   	var op =$.extend({},s,options||{});
					   	bo.data("btn_setting",op);
							var btnleft=$('<div class="btn_pic"></div>').addClass(s.pic_l);//生成靠左div

							var btnright=$('<span class="btn_pic"></span>').append(bo.html()).addClass(s.pic_r);//生成最内层靠右元素
							if(op.enableIcon) {//如果启用按钮图标，则追加按钮图标的元素
								var ic=$('<span class="btn_icon"></span>');
								btnright.prepend(ic);
								if(op.icon!=null){ic.addClass(op.icon);}
								else {//如果没有指定图标，则根据按钮文字定位图标
									var txt=$.trim(btnright.text());
									var icc=$.webUtil.setting.btn_icons[txt];
									if(icc==null) icc=$.webUtil.setting.btn_icons[txt.substring(0,2)];
									ic.addClass((icc==null)?'btn_icon_def':'icon_'+icc);
								}
							}
							bo.empty();
							bo.append($(btnleft).append(btnright)).addClass(s.btn_class);
							bo.hover(function(){ $('.'+s.pic_l,this).addClass(s.pic_lo_c); $('.'+s.pic_r,this).addClass(s.pic_ro_c);	},
					   	function(){$('.'+s.pic_l,this).removeClass(s.pic_lo_c);	$('.'+s.pic_r,this).removeClass(s.pic_ro_c);});
					   	if(s.enableActiveClass){//如果启用按下状态的样式效果
						   	bo.mousedown(function(e){
						   		$('.'+s.pic_l,this).addClass(s.pic_la_c); $('.'+s.pic_r,this).addClass(s.pic_ra_c);
						   	}).mouseup(function(e){
						   		$('.'+s.pic_l,this).removeClass(s.pic_la_c);	$('.'+s.pic_r,this).removeClass(s.pic_ra_c);
						   	}).mouseout(function(e){
						   		$('.'+s.pic_l,this).removeClass(s.pic_la_c);	$('.'+s.pic_r,this).removeClass(s.pic_ra_c);
						   	});
					  	}
							bo.bind("click", function (e) {
								  var bs=$(this).data("btn_setting");
								  //alert("issubmit="+bs.issubmit);
									if(bs!=null&& bs.btn_href!=null) {//判断是否设置btn_href属性
										if(bs.issubmit==true)
										{
											$.webUtil.submitByButton({button:bo,url:bs.btn_href,target:bs.popup?"_blank":""});
											return false;
											//$.webUtil.submitOnBtn(bs.btn_href,bo,bs.popup?"_blank":"");
										}
										else if(bs.popup) $.webUtil.open(bs.btn_href,{widths:null,heights:null,popup:true});
												 else{e.preventDefault(); $.webUtil.gotoPage(bs.btn_href);}
									}


							});


					  });
		   		return e;
				},
				BtnToolBar:function(p){
					p = $.extend({
							hasborder:false,
							bcls:'web-ui-btn_toolbar'
							}, p);
					var e=$(this);
					if(e.hasClass(p.bcls)==true) return ;
					e.addClass(p.bcls);
					var bt=$('button',e).webButton();//初始化按钮
					var b = {
						refreshbyName: function (cond_id) {
							var btncond="";
							//alert(cond_id);
							if(this.btnCond!=null ) btncond=$('#'+cond_id,this.btnCond).text();
								else  btncond=$('.btns_info',this).text();

							if(btncond==null) btncond="";
							btncond=btncond.split(',');
							$(this.btns).each(function(){
								if($(this).attr('force')!==undefined) return;
								if($.inArray($.trim($(this).text()),btncond)>=0){
								 $(this).show();
								 //$(this).parent().show();
								}
								else {
									$(this).hide();
									//$(this).parent().hide();
								}

							});
						},
						btns: bt
					};
					b.btnCond=$('.btn_condition',e);
					//e.append('<div style="clear:both" ></div>');
					b.refreshbyName("condition_null");
				  e.show();
				  return b;
				 //alert($(this).html());
				 //alert($('.btn_toolbar').html());

				}
		});
		$.fn.webButton.defaults ={
				btn_href:null,
				istip : false,
				issubmit:true,
				ischeck:true,
				popup:false,
				force:false,
				formobj : null,
				maskobj : null,
				ismask : true,
				enableIcon:true,
				enableActiveClass:true,
				icon:null,
				btn_class : "web-ui-btn",
				pic_l : "pic-l",
				pic_r : "pic-r",
				pic_lo_c : "pic-l-o",
				pic_ro_c : "pic-r-o",
				pic_la_c : "pic-l-a",
				pic_ra_c : "pic-r-a"
		};
		$.fn.PicButton =$.fn.webButton;//此句用于名称兼容
})(jQuery);
////////////////////////////////////////////////////////////////////////////////
 


