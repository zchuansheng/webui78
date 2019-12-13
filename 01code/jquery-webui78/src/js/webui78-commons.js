////////////////////////////////////////////////////////////////////////////////
/*
 * JQuery webui78-commons.js
 * Description: 
 * Usage:  
 * Depends:jquery 1.7.X
 * Date: 2011-08-15 ~2016-01-19
 * Author: zhangchuansheng
 * Email: zchuansheng@163.com，zchuansheng@gmail.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */////////////////////////////////////////////////////////////////////////////////
(function($){
	$.webTipTool={
		s:{
			tip_div : "validator_msg_div",
			tip_top : "vmsg_tips_top",
			tip_btm : "vmsg_tips_bottom",
			displaySpeed:20,
			displayTime:2500
		},
		showTipInContent:function(obj,msg){
				if(msg !="" && obj.val()==""){
					obj.val(msg);
					obj.css("color","#999999");
				};
				obj.focus(function(){
					var val = obj.val();
					if(msg==val){
						this.value = "";
						$(this).css("color","#000000");
					}
				}).blur(function(){
					if(this.value == "" && msg != ""){this.value = msg}
					if(this.value == msg){$(this).css("color","#999999")}
				});
		},
		getTipTool:function(){
			if(this.tool!==undefined)  return this.tool;
			var tipdiv=$("#"+this.s.tip_div);
			if(tipdiv.length==0){//初始化放置提示信息的div
				tipdiv=$("<div id='"+this.s.tip_div+"' style='display:none;position:absolute;z-index:78000'></div>");
				var tipTool = $("<span class='vmsg_tips' style='display:block'></span>")
				tipTool.append( $("<span class='vmsg_tips_top'  style='display:block'></span>"));
				tipTool.append($("<b class='vmsg_tips_bottom' style='display:block' />"));
				tipTool.css({"filter":"alpha(opacity:90)","KHTMLOpacity":"0.90","MozOpacity":"0.90","opacity":"0.90"});
				tipdiv.append(tipTool);
				$("body").append(tipdiv);
			}
			this.tool=tipdiv;
			return this.tool;
		},
		setTipMessage: function(tipmsg,iclass){
			var tipTool=this.getTipTool();
			var c=tipmsg;
			if(iclass!==undefined && ($.trim(iclass)!="")) {
				c='<div class="'+iclass+'">&nbsp;&nbsp;&nbsp;&nbsp;</div>&nbsp;&nbsp;'+c;
			}
			$("."+this.s.tip_top,tipTool).html(c);
		},
		moveTipTool: function(posX,posY){
			var tipTool=this.getTipTool();
			tipTool.css({"top":(posY+2)+"px","left":(posX-40)+"px"});
		},
		bindShowMessage:function(obj,msg,classType){
				var t=$.webTipTool;
				obj.bind({
				mouseover : function(e){
					t.getTipTool().show();
					t.setTipMessage(msg,classType?classType:"icon_warning");
					var pos=$.webValidator.getMousePosition(e);
					t.moveTipTool(pos.x,pos.y);
				},
				mouseout : function(){
					$.webTipTool.getTipTool().hide();
				},
				mousemove: function(e){
					var t=$.webTipTool;
					t.getTipTool().show();
					t.setTipMessage(msg,classType?classType:"icon_warning");
					var pos=$.webValidator.getMousePosition(e);
					t.moveTipTool(pos.x,pos.y);
				}
			});
		},
		showMessage:function(obj,msg,ic){
			var t=$.webValidator.tipTool;
			var o=$(obj);
			var isVisible=o.is(':visible')
			if(!isVisible){
				var gd=o.closest(".datagrid_gridtb");
				if(gd!=null&& gd[0].grid!=null &&gd[0].grid.page!=null){
					 var indexOfPage=gd[0].grid.page.indexofPage(o);
					 if(indexOfPage>0 && indexOfPage<=gd[0].grid.page.op.totalPages)
						 gd[0].grid.page.showPage(indexOfPage);
				}
			}
	
			var tdiv=t.getTipTool();
			var to=o;
			if(!isVisible){to=o.closest(":visible");}
			var dialog=o.closest(".webdialog_body");
			if(dialog.length>0  ){//针对在dialog中提示的处理
				if($("#"+this.s.tip_div,dialog).length>0) return ;
				dialog.append(t.tool);
				t.moveTipTool(to.position().left+to.width()/2,to.position().top+to.height()/2);//positon是按照绝对定位计算
			}else
				t.moveTipTool(to.offset().left+to.width()/2,to.offset().top+to.height()/2);//相对偏移量
			var zindex=parseInt( new Date().getTime()/1000 );
			tdiv.css({"z-index":zindex});
			t.setTipMessage(msg,ic);
			tdiv.show();
			tdiv.fadeIn(this.s.displaySpeed).delay(this.s.displayTime);
			tdiv.fadeOut(this.s.displaySpeed,function(){tdiv.hide();if(dialog.length>0){$('body').append(t.tool)};});
	
			o.focus();
	
		},
		showTipMessage:function(op){//obj,msg,ic
			var op=$.extend({target:null,msg:'',icon:'no',container:'body'},op);
			var t=$.webTipTool;
			var o=$(obj);
			if(!o.is(':visible')){
				var gd=o.closest(".datagrid_gridtb");
				if(gd!=null&& gd[0].grid!=null &&gd[0].grid.page!=null){
					 var indexOfPage=gd[0].grid.page.indexofPage(o);
					 if(indexOfPage>0 && indexOfPage<=gd[0].grid.page.op.totalPages)
						 gd[0].grid.page.showPage(indexOfPage);
				}
			}
			var tdiv=t.getTipTool();
			//alert('o.position().left+o.width()/2==='+(o.position().left+o.width()/2)+',,,o.position().top+o.height()/2==='+(o.position().top+o.height()/2));
			//o.after(t.tool);
			if(op.container!=null) $(op.container).append(t.tool);
			t.moveTipTool(o.position().left+o.width()/2,o.position().top+o.height()/2);
			t.setTipMessage(msg,ic);
			t.getTipTool().show();
			tdiv.fadeIn(this.s.displaySpeed).delay(this.s.displayTime);
			tdiv.fadeOut(this.s.displaySpeed,function(){t.getTipTool().hide();});
	
			o.focus();
	
		}
	}
	$.fn.setTipMessage = function(msg,classType)
	{
		return this.each(function()
		{
			var jqobj = $(this);
			this.tipmsg=msg;
			$.webTipTool.bindShowMessage(jqobj,this.tipmsg,classType);
		});
	}
 
})(jQuery);
/////////////////////////////////////////////
/*遮罩效果，加载前遮罩、提交时遮罩 */
(function($){

	$.fn.setmask = function(options){
			var defaults={
				msg:null,
				zindex:parseInt( new Date().getTime()/1000 )
			}
		$(this).each(function() {
				var op = $.extend({},defaults, options);
				var el=$(this); 

				if(el.isMasked()) {
					return;
				}
				el.addClass("ismasked");
				el.data("ismasked",true);
				var maskDiv = $('<div class="ui-mask"></div>');
				var tag = el[0].tagName!=null? el[0].tagName.toLowerCase():null;
				//var maskHeight=$(document).height();
//					alert("tag="+tag);
				if(tag!=null){
					var maskHeight=el.height()+$.webUtil.getElCss(el,"padding-top")+$.webUtil.getElCss(el,"padding-bottom")
//					alert("maskHeight111="+maskHeight);
					maskDiv.css({height:maskHeight,width:el.width(),top:el.offset().top,left:el.offset().left,"z-index":op.zindex});
 				}
				//
				var c=$('body');
				if(c.length==0){
//					console.log("no body!");
					return ;
				}
			//	alert(c.length);
//				if(c.length<1){
//					document.write("<div tabindex='-1' class='ui-mask' ></div><div class='ui-mask-msg'  ><div style='z-index: 100;'>' +op. msg + '</div></div>");
//					return;
//				}
				c.append(maskDiv);
				if(op.msg!=null) {
					var msgDiv = $('<div tabindex="-1" class="ui-mask-msg" style="display:none;"><div>' +op. msg + '</div></div>');
					c.append(msgDiv);
					msgDiv.show();
					msgDiv.focus();
					var y=op.caller!=null?$(op.caller).offset().top:maskDiv.height()/2-msgDiv.height()/2;
					var x=op.caller!=null?$(op.caller).offset().left:maskDiv.width()/2-msgDiv.width()/2;
					msgDiv.css({top:maskDiv.offset().top+y,left:maskDiv.offset().left+x,"z-index":op.zindex});
		//alert("ddd");
				}
				el.data("ui_mask_div",maskDiv);
				el.data("ui-mask-msg_div",msgDiv);
		});
	};
	$.fn.unmask = function(id){
		$(this).each(function() {
			var el=$(this);
			if(id!=null){
				el.find("#ui-mask_"+id).remove();
				el.find("#ui-mask-msg_"+id).remove();
			}
			var maskdiv=el.data("ui_mask_div");//查找遮罩层			
			if(maskdiv==null) {maskdiv=el.find(".ui-mask");}
			maskdiv.remove();//移除遮罩层
			var msgdiv=el.data("ui-mask-msg_div");
			if(msgdiv==null) msgdiv=el.find(".ui-mask-msg");
			msgdiv.remove();
			el.removeClass('masked-relative');
			el.removeClass('ismasked');
			el.data("ismasked",false);
		});
	};
	$.fn.isMasked = function(){
		return this.data("ismasked");
	};

})(jQuery);
////////////////////////////////////////////////////////////////////////////////

/*增加自动传递表单标题功能*/
$(document.body).ready(function(){
	if($.webUtil.setting.navTitleParamName!=null){
		var tt=$.webUtil.setting.navTitleParamName;
		var ph=$(".headline:first");
		if(ph!=null&& $("#"+tt).length==0) 
		$("form:first").append("<input type='hidden' id ='"+tt+"' name='"+tt+"' value='"+$.trim(ph.text())+"' >");
		
	}
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////