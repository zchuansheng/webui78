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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * JQuery webui78-webUtil.js
 * Description: 
 * usage:  
 * Depends:jquery 1.7.X
 * Date: 2011-09-11~2016-01-19
 * Author: zhangchuansheng
 * Email: zchuansheng@163.com，zchuansheng@gmail.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */////////////////////////////////////////////////////////////////////////////////

/**webutil页面常用工具集合*/
(function($){
	$.webUtil={
		submitByButton:function(options){
			var def={
				button:null,//通过那个按钮提交
				target:null,//提交时的target
				url:null//提交的URL，如果为空，则用按钮的URL
			}
			var ops = $.extend(def, options);
			var bs=ops.button.data("btn_setting");
			var tipmsg="您确定要'"+ops.button.text()+"'吗？";
			//var targ=bs.popup==true?"_blank":null;
			var op={
				url:ops.url,
				frm:bs.formobj,
				tipmsg:bs.istip?tipmsg:null,
				ismask:bs.ismask,
				mask:bs.maskobj,
				btn:ops.button,
				trgt:ops.target,
				ischeck:bs.ischeck};
			$.webUtil.submit(op.url,op);
		},
		checkSession:function(){			
			if(!$.webUtil.setting.ischecksession) return true;				 
			if($.webUtil.setting.sessionidName==null) $.webUtil.setting.sessionidName="JSESSIONID";
			if(document.cookie.length<=0) return true;		   
			var istart=document.cookie.indexOf($.webUtil.setting.sessionidName + "=") ;
			if(istart<0) return false				  
			istart=istart + $.webUtil.setting.sessionidName.length+1   
			iend=document.cookie.indexOf(";",istart)  
			if(iend==-1) iend=document.cookie.length  
 			var currID=unescape(document.cookie.substring(istart,iend));
			var savedID=$($.webUtil.setting.elmentOfSesssion).val()||$($.webUtil.setting.elmentOfSesssion).text(); 
				 
			if(savedID!=null && savedID.length>0 && savedID.indexOf(currID)<0) {//仅在取得savedID时才进行有效判断
				alert("会话已经失效或变更，当前页面无效请刷新页面或重新登录！");
				return false; 
			}else return true;
		},
		submitOnBtn:function(url,btn,trgt){
			var bs=btn.data("btn_setting");
			var tipmsg="您确定要'"+btn.text()+"'吗？";
			//var targ=bs.popup==true?"_blank":null;
			var op={frm:bs.formobj,tipmsg:bs.istip?tipmsg:null,ismask:bs.ismask,mask:bs.maskobj,btn:btn,trgt:trgt,ischeck:bs.ischeck};
			$.webUtil.submit(url,op);
		},
		ajaxSubmit:function(op){
			if(op.btn){
				var bs= op.btn.data("btn_setting");
				var tipmsg="您确定要'"+op.btn.text()+"'吗？";
				var p={frm:bs.formobj,tipmsg:bs.istip?tipmsg:null,mask:bs.maskobj,btn:op.btn,trgt:op.trgt,ajax:op};
				$.webUtil.submit(op.url,p);
			}else{
				var ajxop=$.extend({ajax:op}, op);
				$.webUtil.submit(op.url,ajxop);
		}
		},
		submit:function(url,op){
			if(!this.checkSession()) return false;//检查session是否有效
			op = $.extend({ischeck:true,ismask:true}, op);
			//alert("mask------:"+op.mask);
			op.mask=(op.mask==null)?$(document):op.mask;//如果op.mask为空，则设置遮罩整个文档对象
			var frm1=(op.frm==null)?$("[name='form1']"):op.frm;
			if(op.isformdata==true){
				if(frm1.length==0) {alert('找不到表单对象！请检查代码是否正确！'); return;};
				if(frm1.attr("method")==null) frm1.attr("method","POST");
			}
			var sbFlag=$(document.body).data("submitting");
			if(sbFlag==true)  return ;//如果正在提交中，则直接返回
			if(op.ismask) $(op.mask).setmask({msg:$.webUtil.setting.messageOnLoading,caller:op.btn});
			if(op.async==false) $.webUtil.toSubmit(frm1,url,op);//提交表单
			else{
				var tm=setTimeout (function (){
					$.webUtil.toSubmit(frm1,url,op);//提交表单
					tm=null;
				},50);
			}
//			var tm=setTimeout (function (){
//				$.webUtil.toSubmit(frm1,url,op);//提交表单
//				tm=null;
//			},50);

		},
		toSubmit:function(frm1,url,op){
			
			if($(document.body).data("submitting")) return false;//如果正在提交标识为true，则直接返回
			$(document.body).data("submitting",true);//否则，设置正在提交标识为true
			var maskobj=$(op.mask);
			if(op.ismask) {//如果需要遮罩则，设置遮罩效果
				maskobj.setmask({msg:$.webUtil.setting.messageOnLoading,caller:op.btn});
			}
			if(op.ischeck && op.isformdata &&(!frm1.formIsValid())) {//如果需要检查表单，且检查失败 取消遮罩，提交标识
				$(document.body).data("submitting",false);
				//alert("op.ismask==="+op.ismask);
				if(op.ismask) maskobj.unmask();
				return false;
			}
			function cancel(){
				$(document.body).data("submitting",false);
					if(op.ismask) maskobj.unmask();
					return false;
			};
			function ok(){
				if(op.trgt!=null && frm1!=null) frm1.attr("target",op.trgt);
				if(op.trgt!=null &&  op.trgt!=""){//如果指定了trgt则，取消遮罩，取消提交标识
					$(document.body).data("submitting",false);
					 if(op.ismask) maskobj.unmask();
				}
				if(op.ajax==null && op.isformdata){//如果非ajax提交，则调用表单的submit
					frm1.attr("action",url);
					frm1.submit();
				  //frm1.data("submitting",false);
				  //if(op.ismask) maskobj.unmask();
				}else{//如果是ajax方式提交
					if(op.ajax.url==null) op.ajax.url=url;
					var ss=op.ajax.success;
					op.ajax.success=function(data){
						$(document.body).data("submitting",false);
					 	if (jQuery.isFunction(ss)){
					 		ss.call($,data);
					 	}
						if(op.ismask) maskobj.unmask();
					}
					var cc=op.ajax.complete;
					op.ajax.complete=function(request, status){
						$(document.body).data("submitting",false);
					 	if (jQuery.isFunction(cc)){
					 		cc.call($, request, status);
					 	}
						if(op.ismask) maskobj.unmask();//提交完成后，取消遮罩
					}
					$.webUtil.submitByAjax(op.ajax);
					if(op.async==false && op.ismask )  maskobj.unmask();
				}
				return true;
			};
			if(op.tipmsg!=null){//如需要提示确认消息，则提示确认
				if($.webUtil.setting.msgboxtype=='custom') { $.webUtil.confirm(op.tipmsg,function(){ ok();},function(){ cancel();});}
				else if(!confirm(op.tipmsg)) cancel();	else ok();//如果确认为取消，则取消遮罩，提交标识
			}else ok();
		},
		submitByAjax:function(op){
			var frm1=(op.frm==null)?$("[name='form1']"):op.frm;
			var method = frm1.attr('method');
			var action = frm1.attr('action');
			var url = (typeof action === 'string') ? $.trim(action) : '';
			url = url || window.location.href || '';
			if (url) {
				//格式化URL
				url = (url.match(/^([^#]+)/)||[])[1];
			}
			if (typeof op == 'function') {op = { success: op };}
			op = $.extend(true, {
				url:  url,
				success: $.ajaxSettings.success,
				error:function(r,s,e){alert(s+':['+this.url+']'+e.message);},
				type: method || 'POST',
				iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
			}, op);
			var sbmt_data=(op.data==null)?null:op.data;////sbmt_data放入非表单数据,如果没有非表单数据则为空，
			var frmdata = null;//frmdada存放表单数据。
			if(op.isformdata==null|| op.isformdata==true) {
				frmdata=frm1.serialize();//如果要提交表单，则格式化表单数据，默认提交表单数据
			}
			if(sbmt_data!=null &&frmdata!=null ){//如果表单与非表单数据都不为空
				sbmt_data=frmdata+'&' + jQuery.param(sbmt_data) ;
			}else {//两者有一个为空
				sbmt_data=(sbmt_data==null)?frmdata:sbmt_data;
			}
			if (op.type.toUpperCase() == 'GET') {
				op.url += (op.url.indexOf('?') >= 0 ? '&' : '?') +  jQuery.param(sbmt_data);
				op.data = null;  // data is null for 'get'
			}
			else {
				op.data = sbmt_data; // 附加的参数数据
			}

			if(this.ajaxObj!=null) this.ajaxObj(op);
			else $.ajax(op);
		},
		gotoPage:function(url){
			window.location.href=url;
		},
		defaultSuccess:function(r){
			if(r.code != 0){ alert('缺省提示：'+r.msg);}
		},
		appendCssFile:function(sHref,after,typ){
			var hd=$("head");
			$("link[href='"+sHref+"']",hd).remove();//先删除已有的css文件
			
			var af =hd.children("#autoAppend:last");
			var css =$("<link>");
			if(af.length>0) {//如果已经自动追加过
				af.after(css);
			}else {//第一次追加
				var af=$("#"+after);
				if(af.length>0){
					af.after(css);
				}else hd.append(css);
				
			}			
			
			css.attr({rel: typ=="image/x-icon" ? "shortcut icon":"stylesheet", id:"autoAppend",type: typ==null?"text/css":typ, href: sHref });
		},
		removeCssFile:function(sHref){
			var hd=$("head");
			$("link[href='"+sHref+"']",hd).remove();
		},
		open:function (url,op){
			op = $.extend({}, op);
			var widths=op.widths, heights=op.heights,tops=op.tops,lefts=op.lefts;
			var popup=op.popup;
			if (widths==null ||""==widths) widths = "800";
			if (heights==null||""==heights) heights = "680"; 
			if (tops==null ||""==tops) tops = (window.screen.availHeight - 30 - heights) / 2;
			if (lefts==null||""==lefts) lefts = (window.screen.availWidth - 10 - widths) / 2;
			var windowArgs = "height=" + heights + ", width=" +widths +",top=" + tops + ",left=" + lefts+",toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, status=yes";
			if(op.option!=null) windowArgs=op.option;
			window.open(url, (op.name==null)?"":op.name, windowArgs).focus();
		},
		openWindow:function (op){
			$("body").webDialog(op);
		},
		alert:function (msg,funOK,btn){
			var alertOK=function(e){
				$(".header .closer",e.data.target).trigger('click');
				if(funOK!=null) funOK();
			}
			var msgdiv=$('<div  tabindex="-1" class="webdialog_message"></div>').append(msg);
			
			var btnName=null;
			var btns=[{btn:'<button>'+(btnName==null?'确定':btnName)+'</button>',onclick:alertOK}	];
			if(btn!=null  && btn.length>0) btns[0].btn=btn[0];
 			$.webUtil.openWindow({title:"消息提示",width:300,height:150,content:msgdiv,ismodel:true,buttons:btns});
 		 
 			msgdiv.focus();
		},
		confirm:function (msg,funOk,funNo,btns){
			var confirmOK=function(e){
				$(e.data.target).closeWebDialog();
				if(typeof(funOk) === "function") funOk();
			}
			var confirmNo=function(e){
				$(e.data.target).closeWebDialog();
				if(typeof(funNo) === "function")  funNo();
			}
			var msgdiv=$('<div  tabindex="-1" class="webdialog_message"></div>').append(msg);
			var vBtns=[{btn:'<button>确认</button>',onclick:confirmOK},{btn:'<button >取消</button>',onclick:confirmNo}	];
			if(btns!=null  && btns.length>1) {
				vBtns[0].btn=btns[0];
				vBtns[1].btn=btns[1];
			} 
			$.webUtil.openWindow(
			{title:"确认提示",width:300,height:170,content:msgdiv,ismodel:true,buttons:vBtns} );
			msgdiv.focus();
 			
		},
		onKeyDownEnter:function(source,target,event){ //当source被点击时触发target的event事件
			if(event==null) event="click";
			source.each(function(){
				$(this).bind("keydown",function(e){
					var keyCode = e.which ? e.which : e.keyCode;
					if(keyCode==13)	target.trigger(event);
				});
			});
			return false;
		},
		bindKeyDownEnter:function(source,func){ //当source被点击时触发target的event事件
			source.each(function(){
				$(this).bind("keydown",function(e){
					var keyCode = e.which ? e.which : e.keyCode;
					if(keyCode==13)	func(e.target);
				});
			});
			return false;
		},
		getElCss:function (obj,css) {
			var val = parseInt(obj.css(css));
			return isNaN(val)?0:val;
		},
		check_against:function(boxClass,callback){
			$.each($(':checkbox.'+boxClass),function(){
				this.checked = !this.checked;
				if(callback!=undefined) callback($(this));
			});
		},
		//idep可以为空,如果第idep行/列相同才合并第idx行/列，否则不合并
		tableSpanSame:function(t,idx,span,idep){
						var tb=$(t);
						var lastCell = null,t1,t2;
						var sameCount = 1,l_idx=0; //内容相同的TD个数
						//查找列内需要合并的单元格
						var cells=null,dep=null;
						if(span=="rowspan"){
							cells=tb.find(">tbody>tr td:nth-child("+idx+")");
							if(idep!=null) dep=tb.find(">tbody>tr td:nth-child("+idep+")");
						}else {
							cells=tb.find(">tbody>tr:nth-child("+idx+") >td ");
							if(idep!=null) dep=tb.find(">tbody>tr:nth-child("+idep+") >td ");
						}

						cells.each(function(index){
							var aCell=$(this);
							if(index==0) { lastCell=aCell;return;}//如果是首行，则继续
							t1=aCell.text();
							t2=lastCell.text();
							if(dep!=null) {
								 t1=dep.eq(index).text()+t1;
								 t2=dep.eq(l_idx).text()+t2;
							}
					 		if(t1==t2){aCell.hide();	sameCount++;}//如果内容相同，则隐藏
					 		else {//如果不相同则重新记录合并信息
					 			if(sameCount>1) lastCell.attr(span,sameCount);//如果存在相同的单元格，则设置合并信息
					 			lastCell=aCell;
					 			l_idx=index;
					 			sameCount=1;
					 		}
						});
					 	if(sameCount>1) lastCell.attr(span,sameCount);//将设置最后一个合并信息
		},
		setting:{
			msgboxtype:null,//对话框的类型
			btn_icons:{'新增':'add1','删除':'del1', '编辑':'edit1','查询':'search','提交':'ok','保存':'save1','打印':'print','返回':'back'},
			navTitleParamName:null,//页面标题导航传递参数的名字（面包屑导航的效果）如果不为空，则自动生成一个名为navTitleParamName的隐藏域用于将页面标题成为下一个的标题的一部分
			messageOnLoading:"数据加载中，请等待....."
		},
		version:'1.5.015'
	}
})(jQuery);
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/*
 * JQuery webui78-datagrid.js
 * Description: 
 * Usage:  $(document).ready(function(){		$("#yourID").datagrid(); });
 * Depends:webui78-commons.js,jquery 1.7.X
 * Date: 2011-06-20~2016-01-19 
 * Author: zhangchuansheng
 * Email: zchuansheng@163.com，zchuansheng@gmail.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */////////////////////////////////////////////////////////////////////////////////

(function ($) {
	$.webDataGrid={
			defConfig:{ //apply default properties
				width: '100%', //自动宽度
				height:500,
				striped: true, //是否使用奇偶行条纹
				defaultSel:true,//是否缺省选择第一行
				trselect: true,//trselect=false时onSelect，toolbar均无效
				onSelect: false,
				onAddRow: false,
				toolbar:null,//有无工具条
				btnCondClass:'btn_condition',
				fixhead:false,
				hashead:true,
				sortable:false,
				filterable:false,
				idCol:null,//标识列编号,base:1
				idStart:1,//标识列的起始行号base:1
				print:"print",//null;preview;print;
				headclass:"gridheadclass",
				trclass:null,
				tdclass:null,
				thresPage:1000,//分页阀值
				defSizePage:15,//分页大小
				colspan:null,
				span_dep:null,
				rowspan:null,
				nowrap: true //内容不换行
			},
			create:function (t, p) {
				if (t.grid) { return false;} //return if already exist
				p = $.extend({},this.defConfig,p);
		
				if(p.print=="preview") {
					p.fixhead=false;
					p.trselect=false;
					p.onSelect=false;
					p.striped=false;
					p.headclass="gridheadclassprint";
					$(t).addClass("print_class");
					$('>tbody>tr',t).each(function(){
						$(this).addClass(p.trclass==null? "print_tr_class":p.trclass);
					  $('>td',$(this)).addClass(p.tdclass==null? "print_td_class":p.tdclass);
		
					});
					$('>thead>tr',t).each(function(){
						$(this).addClass(p.trclass==null? "print_tr_class":p.trclass);
					  $('>td,>th',$(this)).addClass(p.tdclass==null? "print_td_class":p.tdclass);
		
					});
		
				}else if(p.print=="preview"){
					p.fixhead=false;
		
				}
	
				var g = {
					initHead: function (t) {
						var gh=$('>thead ',t);
						var tr1=$('tr:first', t);
						if(gh.length==0) {//不存在表头元素
							gh=$('<thead></thead>');
							gh.append(tr1);
							$(t).prepend(gh);
						}
						var ghth=$('>tr th',gh);
						if(ghth.length<=0){
								//var htr=$('tr:first td', t);
								$('>td',tr1).each(function () {//从第一行生成表头
									 var th= document.createElement('th');
									 th.innerHTML= this.innerHTML;
									 $(th).attr('width',$(this).attr('width'));
									 $(th).attr('class',$(this).attr('class'));
									 $(th).attr('rowspan',$(this).attr('rowspan'));
									 $(th).attr('sortable',$(this).attr('sortable'));
									 $(th).attr('filterable',$(this).attr('filterable'));
									 $(th).attr('colspan',$(this).attr('colspan'));
									 $(th).attr('name_map',$(this).attr('name_map'));
									 $(th).addClass(p.headclass);
									 $(this).replaceWith(th); //包裹td中的内容
								});
								//gh.append(htr);
						}else {
							ghth.each(function () {ghth.addClass(p.headclass);});
						}
						if(typeof($(t).attr('width'))=="undefined"){
							$(t).attr('width',p.width);
						}						
		
					},
					setBar: function (bar) {
						p.toolbar=bar;
						$('>tbody tr:first',t).trigger('click');
					},
					initBody: function (t) {
						//alert($('tbody ',t).length);
						//alert($(t).html());
						var tbody=$('>tbody ',t);
						if(tbody.length>0){//存在表体元素
						}else {//不存在表体元素
								var tbody= document.createElement('tbody');
								$('tr ', t).each(function () {//
								 $(tbody).append(this);
							});
						}
		
					},
					addcol: function(el,op){//添加新列，el新列元素，op选项
								op=$.extend({ipos:null,width:null,title:null,isappend:true}, op);
								var trH=$('thead>tr',g.top);
								if(op.ipos==null) op.ipos=$('>th,>td',trH).length-1;
								trH.each(function(){
									var tds=$('>td:eq('+op.ipos+'),>th:eq('+op.ipos+')',this);
									var newtd=$('<th class="'+p.headclass+'" >'+(op.title==null?'新增':op.title)+'</th>');
									if(op.width!=null) newtd.attr('width',op.width);
									if(op.isappend) tds.after(newtd);
									else  tds.before(newtd);
								});
								var trs=$('>tbody>tr',g.top);
								trs.each(function(){
										var tds=$('>td:eq('+op.ipos+')',this);
									if(op.isappend) tds.after($('<td></td>').append(el));
									else tds.before($('<td></td>').append(el));
								});
								if(p.fixhead) 	g.fixhead.adjustWidth();
					},
					appendElements : function(el,op){
							if(op==null) op={};
							var hasR=(op.irow!=null&& (/^\d+$/.test(op.irow)) );
							var rSel=(op.tohead==true )? (hasR? 'thead.hashead>tr:eq('+op.irow+')':'thead.hashead>tr'):(hasR?'>tbody>tr:eq('+op.irow+')':'>tbody>tr');
							var cSel=(op.icol!=null && (/^\d+$/.test(op.icol)))?'>td:eq('+op.icol+'),>th:eq('+op.icol+')':' >td, >th';
							var trs= $(rSel,g.top);
							trs.each(function (){
								var tds=$(cSel,this);
								var val=null;
								if(op.linkid!=null){
									if(/^\d+$/.test(op.linkid))
										val=$('>td:eq('+op.linkid+')',this).text();
									else 	val=$('#'+op.linkid,this).text();
								}
								var jobj=$(el);
								if(val!=null) jobj.val(val);
								if(op.clear==true) tds.empty();
								tds.append(jobj);
							});
							if(p.fixhead) 	g.fixhead.adjustWidth();
					},
					formatgrid:function(t,rowfilter){
						var trs=(rowfilter==null)?$('>tbody>tr ', t):$(rowfilter, t);//取得表格的所有行
						trs.each(function(index,e){
							var trObj=$(this);
							if(p.idCol!=null){
								if((index>=(p.idStart-1)))//当前行是要求自动排号的行号
									if(!isNaN(p.idCol) && p.idCol>0 ){//是数值
										$('>td:eq('+(p.idCol-1)+')',trObj).text((index+1-p.idStart)+1);
									}else {//如果标识列不是数字，则按照类标识去查找设置
										$('.'+p.idCol,trObj).text((index+1-p.idStart)+1);
									}
							}
							if(p.trselect){//如果设定了可以选择行效果
								trObj.unbind('click').click(function(){//绑定单击此行时的动作
									$('.trSelected',t).removeClass('trSelected');
									trObj.toggleClass('trSelected');
									var id=$(this).attr('btn_condition');
									if(id==null) id=$('td:first',this).attr('btn_condition');
									if(p.toolbar!=null)  p.toolbar.refreshbyName(id);//如果有绑定按钮工具条，则更新工具条状态
									g.currIndex=index;
									g.selrow=trObj;
									if(p.onSelect){//如果设置了选择行回调函数，则调用此函数
										p.onSelect(g.currIndex,this);
									}
								});
		
							}
							if (p.striped) {//如果需要条纹效果（隔行变色），则设置条纹效果
								if(index%2!=0) trObj.removeClass("erow").addClass("orow");
								else trObj.removeClass("orow").addClass("erow");
							}
						});
						//
						if(p.trselect){
								$(t).bind("keydown",{target:g},function(e){//响应keydown事件
										var currTr=e.data.target.selrow;
										//alert("e.keyCode=="+e.keyCode+",html====="+currTr.html());
										if(e.keyCode==38 ){//向上方向键
											currTr.prev().trigger('click');
											return false;
										}else if(e.keyCode==40){//向下方向键
											currTr.next().trigger('click');
											return false;
										};
		
								});
						}
		
					},//formatgrid结束
					setSortable:function(t){
						var sall=null;
						if(p.sortable)  {
							sall=$('>thead th.'+p.headclass,t);
							sall.attr('sortable');
						}else
							sall= $('>thead th.'+p.headclass+'[sortable]',t);
						sall.each(function(){
							var th=$(this);
							th.append($('<div class="sortby" title="双击排序"></div>'));
							 var sby="sasc,sdesc".split(",");
							th.hover(////设置当鼠标已过时，显示排序按钮
								function(){
									var slf=$(this);
									var sdiv=$('div.sortby',slf);
									///查询保存鼠标移过前的排序规则
									var sorted=sdiv.data("sortedby");
									slf.addClass("thOver");
									var newby=(sorted==sby[0])?sby[1]:(sorted==sby[1]?sby[0]:sby[0]);
									sdiv.removeClass(sby[0]).removeClass(sby[1]).addClass(newby);//如果升序则显示降序样式否则显示升序
									sdiv.css({left:slf.offset().left,bottom:slf.offset().bottom,width:slf.width()});
									//sdiv.show();
								}
								,
								function(){
									var slf=$(this);
									var sdiv=$('div.sortby',slf);
									var lastSortby=sdiv.data("sortedby");
									slf.removeClass("thOver");
									sdiv.removeClass(sby[0]).removeClass(sby[1]).addClass(lastSortby);
		
								}
							).dblclick(
									function(){
											var slf=$(this);
											var sdiv=$('div.sortby',slf);
											var by=sdiv.data("sortedby")==sby[0]?sby[1]:sby[0];
											g.updateSortHeadCss(slf,by,sby);
											g.startSort(t,slf.index(),by);
									}
							);
							//th.addClass("sorted");
						});
					},//setSortable结束
					startSort:function(t,idxCol,by){
						var trs=$(">tbody>tr",t)
		
						var tds=$('>tbody>tr>td:nth-child('+(idxCol+1)+')',t);
						var isdigt=true;
						tds.each(function(){
							 var s=tds.text();
							 isdigt= /^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g, '')));
							 if(isdigt==false ) return false;
						});
		
						//alert("ffff="+tds.html());
						trs.sort(function(a,b){
							//alert($(a).html());
							var aval=$('td:eq('+idxCol+')',a).text();
							var bval=$('td:eq('+idxCol+')',b).text();
							if(isdigt==true){
								return by=="sasc"?aval-bval:bval-aval;
							}else {
								return by=="sasc"?aval.localeCompare(bval):-(aval.localeCompare(bval));
							}
		
						});
						//alert(trs.length);
						var bd=$(">tbody",t)[0];
						trs.each(function(){
							bd.appendChild(this);
						});
		
					},
					updateSortHeadCss:function(th,by,sby){
							var slf=th;
							var sdiv=$('div.sortby',slf);
							sdiv.data("sortedby",by);
							slf.addClass("sorted");
							if(by==sby[1]) sdiv.addClass(sby[1]).removeClass(sby[0]);
							else sdiv.addClass(sby[0]).removeClass(sby[1]);
							//清除其他列的排序效果
							var oh=slf.siblings(".sorted");
							oh.removeClass("sorted");
							$('div.sortby',oh).removeClass(sby[0]).removeClass(sby[1]).data("sortedby",null);
					},
					setFilterable:function(t){
							var sall=null;
							if(p.filterable)  {
								sall=$('>thead>tr>th.'+p.headclass,t);
								sall.attr('filterable');
							}else
								sall= $('>thead>tr>th.'+p.headclass+'[filterable]',t);
		
		
		//					var ths=$('>thead th.'+p.headclass,t);
						//	sall.append(fdiv);
							sall.each(function(){// 对每个标题头列设置可过滤
								var th=$(this);
								var fdiv=$('<div class="filterdiv nofiltered" style="display:none;" title="设置条件过滤"><div></div></div>');
								var flts=$('<div class="filters"  style="display:none;"></div>');
								var fltb=$('<div class="filtertb" cellspacing="0" cellpadding="0"></div>');
								th.append(fdiv);//添加过滤按钮
								th.append(flts);//添加过滤条件div放到filterdiv
								flts.append(fltb);//将过滤条件集合filters放入filterdiv
								//var fltb=$(divtb);
								//alert(th.index());
								var fops=[];
								$('>tbody>tr>td:nth-child('+(th.index()+1)+')',t).each(function(){
									fops.push($.trim($(this).text()));
								});
								fops=$.unique(fops);
								fops.sort(function(a,b){return a.localeCompare(b)});
								//alert(tds.join(",").toString());
								var divops=[];
								$.each(fops,function(){
									 divops.push('<div class="afilter">');
									 divops.push('<div class="divkey"><input type="checkbox"   checked="checked" value="');
									 divops.push(this);
									 divops.push('"  ></div> <div class="divval">');
									 divops.push(this);
									 divops.push('</div></div>');
								});
								fltb.append(divops.join("").toString());
								$(':checkbox',fltb).bind("click",{colid:th.index()},function(e){
									var box=$(this);
									//g.setRowDisplay(t,{index:e.data.colid,text:box.val(),tohide:!box.is(':checked')});
									$(t).setGridDisplayRow({index:e.data.colid,text:box.val(),rowfilter:null,tohide:!box.is(':checked')});
									if($(':checkbox:not(:checked)',fltb).length>0){
										fdiv.removeClass("nofiltered").addClass("filtered");
									}else fdiv.removeClass("filtered").addClass("nofiltered");
								}).dblclick(function(){return false;});
								$('div',fltb).dblclick(function(){return false;});
		
		
								//----------------
								th.hover(//设置当鼠标已过时，显示过滤按钮
										function(){
											var slf=$(this);
											var fdiv=$('>div.filterdiv',slf);
											fdiv.css({left:slf.offset().left,top:slf.offset().top});
											fdiv.show();
											$('>div.filterdiv',slf.siblings(".thOver")).hide().siblings('.filters').hide();
										},
										function(){
											var slf=$(this);
											var fdiv=$('>div.filterdiv',slf);
											fdiv.hide().siblings('.filters').hide();
											$('>div.filterdiv.filtered',slf).show();
		
										}
								);//设置鼠标已过效果结束
		
								//var fdiv=$('>div.filterdiv',th);
								fdiv.click(//点击时显示或隐藏过滤选项div
									function(){
										var slf=$(this);
										var fs=slf.siblings('.filters');
										if(fs.is(':hidden')){
											fs.css({left:slf.offset().left,top:slf.offset().bottom}).show();
										} else {
											fs.hide();
										}
										return false;
									}
								);//.siblings('div.filters').click(function(){return false;}).hover(function(){return false;},function(){return false;});
								//----------------
		
							});//对每个表头设置过滤器完毕
					}//setFilterable结束
		
		
				}//g对象定义结束
	
				$(t).hide();
	
				var to=$(t);
		 		to.addClass('datagrid_gridtb');
		 		if(to.attr("id")==null) {
		 			to.attr("id",'datagrid_gridtb_'+($('table.datagrid_gridtb').length+1));
		 		}
		 		g.top=to;//将table对象作为grid顶级元素保存在top变量中
		 		if(p.hashead)		g.initHead(t);
				$('thead',to).addClass(p.hashead?'hashead':'nohead');
				g.initBody(t);
				if(to.attr("tabindex")==undefined) to.attr("tabindex",1) //让表格响应keydown事件
		 		if($(">tbody>tr",t).length>=p.thresPage)	{
		 			g.page=$.gridPaginate(t,{sizeofPage:p.defSizePage,tip_message:p.page_message});//设置分页效果
		 			g.page.initPage();
		 		}
		  	g.formatgrid(t);//格式化表格条纹、选择行效果
		 		to.show().attr({cellPadding: 0,cellSpacing: 0,border: 0});//开始显示
		 		t.p = p;//将参数给t,可以在外部访问
				t.grid = g;//将建立的表格给t.grid,可以在外部访问
				if(p.hashead&& p.fixhead ) {
					g.fixhead=$.gridFixedHead(t);
					g.top=g.fixhead.tdiv;//如果固定表头的，将固定表头的外层div作为grid的顶级元素存放于top变量中
				}
				if(p.defaultSel) $('>tbody tr:first',t).trigger('click');
				to.bind("onAddRow",function(e,tr){
					g.formatgrid(this);
			//		alert('ddd');
					if($(">tbody>tr",t).length>=p.thresPage)
						g.page=$.gridPaginate(t,{sizeofPage:p.defSizePage,tip_message:p.page_message});//设置分页效果
					if(g.page!=null) g.page.initPage();
					if(t.p.onAddRow)  t.p.onAddRow(tr);
				});
				to.bind("onDelRow",function(tr){
					g.formatgrid(this);
				});
				to.bind("onReFormat",function(e,rowfilter){
					g.formatgrid(this,rowfilter);
				});
				g.setSortable(t);//设置可排序的表头
				g.setFilterable(t);//设置可过滤的表头
				if(p.colspan){
					$.each(p.colspan,function(){
						$.webUtil.tableSpanSame(t,this,"colspan",p.span_dep);
					});
				}
				if(p.rowspan){
					$.each(p.rowspan,function(){
						$.webUtil.tableSpanSame(t,this,"rowspan",p.span_dep);
					});
				}
				return t;
			}//create函数定义结束
	};//
	//插件构造函数
	$.fn.datagrid = function (p) {
		return this.each(function () {
				$.webDataGrid.create(this, p);
		});
	};
	$.fn.setGridDisplayRow=function(where){
			var def = {//行筛选条件
					index : -1,
					text: null,
					rowfilter:null,
					btn_condition:null,
					tohide:true
			};
			if(where==null) return ;
			where = $.extend(def, where);
			var trs=$(">tbody>tr",this)
			if(where.index>=0){
				var tds=$('>tbody>tr>td:nth-child('+(where.index+1)+')',this);
				tds.each(function(idx){
					var atd=$(this);
					//alert('atd.text('+idx+')=='+atd.text()+'======='+where.text+",tttt="+where.tohide);
					if($.trim(atd.text())==where.text){
						var atr=$(trs[idx]);
						 where.tohide?atr.hide():atr.show();
					}
				});
			}else if(where.rowfilter!=null){
				//alert(where.rowfilter);
				var trs=$(where.rowfilter,this);
				where.tohide?trs.hide():trs.show();
			}else if(where.btn_condition!=null){
				var alltr=$('>tbody>tr',this);
				if(where.btn_condition=="") {
					alltr.show();
				}else {
					alltr.hide();
					var btn_td=$('>tbody>tr>td[btn_condition="'+where.btn_condition+'"]',this);
					//alert(btn_td.length);
					btn_td.each(function(){
						var atr=$(this).closest("tr");
					 	atr.show();
					});
				}
			}
			$(this).trigger('onReFormat',">tbody>tr:visible");
			//this.grid.formatgrid(this,);
	};//设置数据行显示或隐藏结束
	$.fn.loadData=function(op){//从URLJSON中加载数据到表格中
			var $grid=$(this);
			var op2 = $.extend({},op);
			$grid.find("tbody>tr").remove();
			var nMap=[];
			$grid.find("thead>tr>th").each(function(){
				var n=$(this).attr("name_map");
				nMap.push($.trim(n));
			});
			var tr=[];
			var tm=setTimeout(function (){
				try{
						tr=[];
						var ss=op.success;
					//$.getJSON(url,data,function(jsdata){
						var getfun=function(jsdata){
							if (jQuery.isFunction(ss)){ ss.call($,jsdata); }
							
							if(op.onPreLoad!=null) op.onPreLoad(jsdata,op);

							var rs=jsdata.result;
							if(op.resultName!=undefined){//判断是否设置了结果集名称
								try{rs = eval("jsdata."+op.resultName);}catch(e){rs=null;};
							}
							$.each(rs, function(key, val) {
								tr.push("<tr>");
								$.each(nMap,function(n,v){
									 	tr.push("<td>");
									 	if(v!=null) {//如果对应名字字符串不为空，则设置该值
									 		//v.replace(new RegExp("("+rr+")", 'g'), "123");
									 		var rval=val[v];
									 		if(op.setCellVal) rval=op.setCellVal(n,v,val);//参数(n,v,val)分别为：序号，字段映射名称，当前行的各字段值数组
									 		tr.push(rval);
									 	}
									 	tr.push("</td>");
								});
								tr.push("</tr>");
						 	});
						 	$grid.addrow(tr.join("").toString(),null,null);
							var pi=jsdata.pageInfo;
							if(op.pageInfoName!=undefined){//判断是否设置了结果集分页信息名称
								try{pi = eval("jsdata."+op.pageInfoName);}catch(e){pi=null;};
							}
							if(pi!=null) {//判断是否存在分页信息，如果存在，则初试化分页导航信息
								var page=$.gridPaginate($grid,{tip_message:""});//设置分页效果
								page.initPage({totalSize:pi.totalSize,sizeofPage:pi.pageSize,currPage:pi.currPage,applyTo:op.applyTo,showFirst:false});
								page.showPage=function(n){	
									if(n > this.op.totalPages) {n=this.op.totalPages;}	
									this.setRequestPage(n);	
  							//var dt={HTML_CURR_PAGE_NAME:n,HTML_PAGE_SIZE_NAME:this.op.sizeofPage,HTML_PAGE_FLIP_FLAG:'HTML_PAGE_FLIP_FLAG'};	
								//	op2.data=dt;
									$grid.loadData(op2);
								}
								page.genNav(page.op.currPage);
								$grid[0].page=page;
							}
						 	if(op.loadFinish) op.loadFinish(jsdata,op);
					};
					op = $.extend({type:"POST",dataType:"json",cache:false,success:getfun}, op);
 					op.success=getfun;
					$.webUtil.submitByAjax(op);//$.ajax(op);
				}catch(e){
					alert('数据加载异常！'+e);
				}finally{
					$grid.unmask();
				}
				tm=null;
			},50);
			$grid.setmask({msg:$.webUtil.setting.messageOnLoading});
	}
	$.fn.addrow = function(tr,ipos,ideps,ref){
		return this.each(function() {
			//alert($(this).html());
				var bdy=$('>tbody',this);
				var depsrow=$('>tr:last',bdy);
				if(ideps!=null){
					depsrow=$('>tr:eq('+(ideps-1)+')',bdy);
				}
				var newtr=(tr!=null)? tr:$('<tr>'+depsrow.html()+'</tr>');
				if(ipos!=undefined)	$('>tr:eq('+(ipos-1)+')',bdy).after(newtr);
				else bdy.append(newtr);
				if(ref!=false)	$(this).trigger('onAddRow',newtr);

		});
	};
	$.fn.delrow = function(idel){
		return this.each(function() {
				//alert($('tbody>tr:visible',this).length);
				if($('>tbody>tr:visible',this).length<1) return ;
				var row=$('>tbody>tr:last',this);
				if(idel!=null){
					row=$('>tbody>tr:eq('+(idel-1)+')',this);
				}
				 row.remove();
				//alert(depsrow.html());
				$(this).trigger('onDelRow');

		});
	};
	$.fn.delrow = function(idel,retentionRows){
		return this.each(function() {
				//alert($('tbody>tr:visible',this).length);
				if($('>tbody>tr:visible',this).length<(retentionRows+1)) return ;
				var row=$('>tbody>tr:last',this);
				if(idel!=null){
					row=$('>tbody>tr:eq('+(idel-1)+')',this);
				}
				 row.remove();
				//alert(depsrow.html());
				$(this).trigger('onDelRow');

		});
	};

	$.fn.getCurrIndex = function(){
			if($(this).get(0).grid==null) return undefined;
			return $(this).get(0).grid.currIndex;
	};
	$.fn.addcol = function(el,op){
		return this.each(function() {
				$(this).get(0).grid.addcol(el,op);
		});
	};
//	$.fn.appendElements = function(el,irow,icol,op.linkname,op.clear,op.tohead){
	$.fn.appendElements = function(el,op){
		if(op==null) op={};
		return this.each(function() {
			$(this).get(0).grid.appendElements(el,op);
		});
	};
	$.fn.gridRowspan=function(column,idep){
		$.webUtil.tableSpanSame(this,column,"rowspan",idep);
	}

	$.fn.gridColspan=function(rownum,idep){
		 $.webUtil.tableSpanSame(this,rownum,"colspan",idep);
	}

	//create by zhangcs @2012-7-31
	$.gridPaginate =function (t,opt){//分页插件
		var pfix="gridPaginate_";
		var id_pg=pfix+"navigator";
		var id_info=pfix+"paging_info";
		var id_f=pfix+"firstpage";
		var id_p=pfix+"prevpage";
		var id_n=pfix+"nextpage";
		var id_e=pfix+"endpage";
		var id_s=pfix+"sizePerPage";
		var id_j=pfix+"jumper";
		//var defaults =
		opt = $.extend(true,{totalSize :0,currPage:1,totalPages:0},$.gridPaginate.defaults, opt);
		var pg={//分页控制类
			op:opt,			
			tb:t,
			eid:$(t).attr("id"),
			divNav:null,
			allRows:null,
			initPage :function(iop){//分页效果的初始化函数iop{totalSize:xxx,sizeofPage:xxx,currPage:xxx,applyTo:xxx,showFirst:xxx}
			
				//this.tb=t;this.op=p;
				if(iop==null) iop={};
				this.divNav=$("<div id='"+id_pg+this.eid+"' class='"+id_pg+"' align='right' ></div>");
				if(iop.totalSize==null){//没有给定总记录数，则分页信息直接从table中读取
					this.allRows=$(">tbody > tr",this.tb);
					this.op.totalSize=this.allRows.length;
				}else {//若给定参数，则直接使用给出的参数
					this.op.totalSize=iop.totalSize;
				}
				if(iop.applyTo==null) {
					$(this.tb).next("#"+id_pg+this.eid).remove();
					$(this.tb).after(this.divNav);					
				}else {
					$("#"+id_pg+this.eid,iop.applyTo).remove();
					iop.applyTo.append(this.divNav);
				}
				if(iop.sizeofPage!=null) this.op.sizeofPage=iop.sizeofPage;
  			//根据总记录数，每页大小，计算总页数
				var prePages = Math.round(this.op.totalSize / this.op.sizeofPage);
				var tPages = (prePages * this.op.sizeofPage < this.op.totalSize) ? prePages + 1 : prePages;
				this.op.totalPages=tPages;
				if(iop.currPage!=null) this.op.currPage=iop.currPage;
		 		if(iop.showFirst==null|| iop.showFirst==true) this.showPage(1);
			},
			showPage :function(n) {//显示第n页的函数
				if(n > this.op.totalPages) {n=this.op.totalPages;}
				if (n==0 )
				  return;
				var startIndex = (n - 1) * this.op.sizeofPage;//计算当前页起始行号
				var endIndex = (startIndex + this.op.sizeofPage - 1);//计算当前页结束行号
				for (var i=0;i<this.allRows.length;i++) {//设置属于本页的记录显示，其他行隐藏
				  if (i >= startIndex &&  i <= endIndex) {
					$(this.allRows[i]).show();
				  }else $(this.allRows[i]).hide();
				}
				this.divNav.empty();
				var div=this.getNavigationHtml(n);//首先生成分页导航信息栏
				this.divNav.append(div);
				this.op.currPage=n;
			},
			genNav:function(n) {//生成分页导航信息的函数
				if(n > this.totalPages) {n=this.totalPages;}
				var div=this.getNavigationHtml(n,true);//生成分页导航信息栏
				this.divNav.empty();
				this.divNav.append(div);
			},
			setRequestPage:function(ind,sizeofP){//设置当前页面
				if(this.op.inputName!=null){
					this.divNav.find("input[name='"+this.op.inputName.currPageName+"'").val(ind);
					if(sizeofP!=null) this.op.sizeofPage=sizeofP;
 					this.divNav.find("input[name='"+this.op.inputName.sizeOfPageName+"'").val(this.op.sizeofPage);
 				}	
			},
			indexofPage:function(obj){//查询某个对象obj所处的页号码
				var rIndex=obj.closest("tr").index()+1;
				var i1 = Math.round(rIndex / this.op.sizeofPage);
				var indexOf = (i1 * this.op.sizeofPage < rIndex) ? i1 + 1 : i1;
				return indexOf;

			},
			getNavigationHtml:function (curr,isinput) {//取得分页导航信息的html,curr当前页码
				var rSum=this.op.totalSize;
				if(curr>this.op.totalPages) {curr=this.op.totalPages;}
				var nav = [];
				nav.push("<div>");
				nav.push("<span id='"+id_info+this.eid+"'>");
				if(this.op.totalPages>1) nav.push(this.op.tip_message);//如果总页数大于1，提示存在未显示数据
				nav.push("第"+curr+"页/共"+this.op.totalPages+"页&nbsp;&nbsp;总计"+rSum+"条记录&nbsp;&nbsp;");
				nav.push("</span>");
				nav.push("<span >");
				nav.push("每页大小:");
				if(this.op.sizesofPage!=null){
					nav.push("<select id='"+id_s+this.eid+"'>");
					if($.inArray(this.op.sizeofPage,this.op.sizesofPage)<0){//将默认页大小添加到下拉框中
						this.op.sizesofPage.push(this.op.sizeofPage);
						this.op.sizesofPage.sort(function (a,b){return a - b;});
					}
					for(var i=0;i<this.op.sizesofPage.length;i++){//组合页大小设置框
						var sel=(this.op.sizeofPage==this.op.sizesofPage[i])?"selected":"";
						nav.push("<option value='"+this.op.sizesofPage[i]+"' "+sel+">"+this.op.sizesofPage[i]+"</option>");
					}
					nav.push("</select>");
				}else {
					nav.push(this.op.sizeofPage+"&nbsp;&nbsp;&nbsp;&nbsp;");
				}
				nav.push("</span>");
				nav.push("<span class='gridPaginate_navigate'>");
				nav.push("<a id='"+id_f+this.eid+"' href='#'>首页</a>&nbsp;");
				if(curr<=1) 	nav.push("上一页&nbsp;");
				else nav.push("<a id='"+id_p+this.eid+"'  href='#'>上一页</a>&nbsp;");
				if(curr>=this.op.totalPages) 	nav.push("下一页&nbsp;");
				else nav.push("<a id='"+id_n+this.eid+"'  href='#'>下一页</a>&nbsp;");
				nav.push("<a id='"+id_e+this.eid+"'  href='#'>末页</a>&nbsp;");
				nav.push("</span>");
				if(this.op.totalPages>2){
					nav.push("跳至:<input type='text' id='"+id_j+this.eid+"' name='"+id_j+this.eid+"' size='3' value='"+curr+"'/> ");
				}
				if(isinput&& this.op.inputName!=null){//生成分页所需的隐藏域
					nav.push("<input type='hidden' name='");
					nav.push(this.op.inputName.currPageName);
					nav.push("' value='");
					nav.push(curr);
					nav.push("' />\n");
					nav.push("<input type='hidden' name='");
					nav.push(this.op.inputName.sizeOfPageName);
					nav.push("' value='");
					nav.push(this.op.sizeofPage);
					nav.push("' />\n");
					nav.push("<input type='hidden' name='");
					nav.push(this.op.inputName.isFlipName);
					nav.push("' value='");
					nav.push(this.op.inputName.isFlipName);
					nav.push("' />\n");

				}
				nav.push("</div>");
				var divN= $(nav.join("").toString());
				var sId="#";
				$(sId+id_f+this.eid,divN).click(function(){  pg.showPage(1) });
				$(sId+id_p+this.eid,divN).click(function(){ pg.showPage(parseInt(pg.op.currPage) - 1) });
				$(sId+id_n+this.eid,divN).click(function(){  
					pg.showPage(parseInt(pg.op.currPage) + 1)  
					});
				$(sId+id_e+this.eid,divN).click(function(){  pg.showPage(pg.op.totalPages)  });
				$(sId+id_s+this.eid,divN).change(function(){ 
					pg.op.sizeofPage=parseInt($(this).val());
					var prePages = Math.round(pg.op.totalSize / pg.op.sizeofPage);
					var tPages = (prePages * pg.op.sizeofPage < pg.op.totalSize) ? prePages + 1 : prePages;
					pg.op.totalPages=tPages;
					pg.showPage(pg.op.currPage); 
				});
				$(sId+id_j+this.eid,divN).keydown(function(e){
					var keyCode = e.which ? e.which : e.keyCode;
					if(e.keyCode==13){
						var topage=parseInt($(this).val());
						pg.showPage(topage);
					}
				});
				return divN;
			}
		}
		//pg.initPage(t,opt);//初始化分页效果

		return pg;


	};
	$.gridPaginate.defaults={ //分页缺省配置
			sizeofPage : 20,//默认分页大小，如果后端分页，则以后台缺省配置为准
			sizesofPage : [5,10,25,50,100,500,1000],//此参数为可以选择的每页大小，设置为空，表示则前端页面不允许更改每页大小
			tip_message:"存在未显示的数据... ...&nbsp;&nbsp;",
			ignoreRows : [],
			inputName:{//配置分页信息的隐藏域名称
				currPageName:"HTML_CURR_PAGE_NAME",
				sizeOfPageName:"HTML_PAGE_SIZE_NAME",
				isFlipName:"HTML_PAGE_FLIP_FLAG"
			}
		};
	//固定表头的表格效果，表格数量量超过500行时，可能存在效率问题
	$.gridFixedHead =function (t){
	var fh_cl="fixhead_hdiv";
	var fb_cl="fixhead_bdiv";
	var ht_cl="fixhead_headtb";
	var bt_cl="fixhead_bodytb";
	var grid_cl="datagrid_gridtb";
	var fhead={
		tb:null,//要固定的表格引用
		tdiv:null,//整个div
		hdiv:null,//头部div
		bdiv:null,//表体div
		fixhead:function(tbl,h){//初始化固定表头效果的方法
			this.tb=$(tbl);
			this.tdiv=$("<div class='"+grid_cl+"'><div class='"+fh_cl+"'></div><div class='"+fb_cl+"'></div></div>");
			this.hdiv=$("."+fh_cl,this.tdiv);
			this.bdiv=$("."+fb_cl,this.tdiv);
			this.tb.before(this.tdiv);//将tdiv插入到tb的前面
			var hTable=document.createElement('table');	//创建存放表头的table,将原表内第一行放置于此
			$(hTable).addClass(ht_cl).attr('width','100%').attr({cellPadding: 0,cellSpacing: 0,border: 0});
			var oldhead=$('thead:first',this.tb);
			this.hdiv.append($(hTable).append(oldhead));
			this.tb.removeClass(grid_cl).addClass(bt_cl).attr({width: '100%'});
			this.bdiv.append(this.tb);//将原表放置到表体div内部。
			this.bdiv.css({
				height : $(this.tb).attr('height')!=null?this.tb.attr('height'):this.tb[0].p.height,
				'overflow-x': 'hidden',
				'overflow-y' : 'auto'
			}).hover(function(){
				fhead.adjustWidth();
			});//设置表体div的滚动样式
			this.tb.removeAttr('height');
			$(window).resize(function(){this.adjustWidth();});//当窗口调整大小时，重新调整表格的对齐
			this.adjustWidth();
		},
		adjustWidth:function(){//对固定表头的表格调整宽度
			if(!this.tb[0].p.fixhead )return;
			var gd=this.tdiv;
			var p=this.tb[0].p;
			var hsum=0;
			var hbd=0;
			var s_cl=".";
			var bdiv=$(s_cl+fb_cl,gd).get(0);
			var iw=parseInt($(bdiv).css('borderLeftWidth'));//计算border
			var iwidth= (isNaN(iw) ? 0 : iw);
			iw=parseInt($(bdiv).css('borderRightWidth'));
			iwidth+=(isNaN(iw) ? 0 : iw);
			var scrWidth=bdiv.offsetWidth-iwidth-bdiv.clientWidth;//计算滚动条
			if ($.browser.msie && $.browser.version <= 7.0) {
				scrWidth=0;
			}
			var hed=$(s_cl+fb_cl+' tbody:first tr:first td', gd);//取得表体的第一行td
			hed.each(function (index,e) {//根据表头宽度，调整每一列的宽度
				var pth = $(s_cl+fh_cl+' thead:first tr .'+p.headclass+':eq(' +index + ')', gd).get(0);//获取对应表头的宽度
				if (pth != null) {
					var hW=parseInt(pth.clientWidth);
					if(index<hed.length-1) $(this).attr('width',hW);
					else{
						$(this).attr('width',hW-scrWidth);
					}
					hsum+=hW;
					hbd+=parseInt($(pth).css('borderWidth'));
				}
			});
			if ($.browser.msie && $.browser.version <= 7.0)
				$(s_cl+fb_cl,gd).css('width',hsum+hbd+scrWidth);
		}

	}//------fhead函数定义结束
	fhead.fixhead(t);//调用格式效果的方法。
	return fhead;
	};

})(jQuery);
////////////////////////////////////////////////////////////////////////////////
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
				webTabpanel:function(options){
						var s ={
							onChanged:null,
							tabpath:"/div/div div",//tab最外层为div，每个tab的格式为：<div><div>标题</div><div>内容</div>
							ttCls:"webtab_title_container/webtab_titles_panel/webtab_titles/webtab_atitle/webtab_title",
							ccCls:"webtab_acontent/webtab_content"
						};
						if(options) {	jQuery.extend(s, options); };
						$(this).each(function(){
							var tabpath=s.tabpath.split("/");
							var tabClass=s.ttCls.split("/");
							var ccClass=s.ccCls.split("/");
							$(tabpath).each(function (index){tabpath[index]=this.split(/\s+/);});
							var aTab=1;//标题使用的标签位于tabpath的位置
							var tabObj = $(this);
							tabObj.addClass("webtabpanel");
							if(s.width!=null)	tabObj.width(s.width);//如果给出宽度，在此设置宽度
							if(s.height!=null)	tabObj.height(s.height);//如果给出高度，在此设置高度
							var h1=tabObj.find(">"+tabpath[aTab][0]);//在webtabpanel的div下查找第一层tab标签
		    			h1.hide();//先将所有tab内容隐藏
							//h1.addClass(tabClass[aTab][0]);
							//查找所有标题div，并添加
		    			var titles=h1.find(">"+tabpath[aTab+1][0]+":eq(0)").addClass(tabClass[4]);
		    			var divContent=h1.find(">"+tabpath[aTab+1][1]+":eq(1)").addClass(ccClass[1]);
		    			var tctn=$("<div ></div>").addClass(tabClass[0]);  //tabClass[0]='webtab_title_container'>
		    			var da_cnt="tab_content";
		    			var tab = {
		    				/*显示第index个tab标签*/
		    				showTab:function(index){
		    					var lastA=tctn.find(".active");
		    					if(lastA.length>0){//查找是否存在上一个活动标签，如果存在则隐藏它
			    					lastA.removeClass("active");
			    					lastA.data(da_cnt).parent().hide();
		    					}
		    					//显示当前标签
		    					var curr=tctn.find("."+tabClass[3]+":eq("+index+")");//tabClass[3]=webtab_atitle
		    					curr.addClass("active");
		    					var currCont=curr.data(da_cnt);
		    					currCont.parent().show();
		    					tab.currActived=index;

		    				},
		    				initTitle:function(divTitles){//初始化化标题，美化tab标题
		    					var tpanel=$("<div ></div>").addClass(tabClass[1]); // tabClass[2]='webtab_titles_panel'
		    					var tit=$("<ul ></ul>").addClass(tabClass[2]);//tabClass[2]class='webtab_titles'
		    					var ac=0;
		    					divTitles.each(function(ind) {/*对每个标题建立结构：<li><div>标题</div><li>*/
		    						var lo=$("<li></li>").addClass(tabClass[3]);//class='webtab_atitle'
		    						lo.append($(this));
		    						tit.append(lo);
		    						//将内容绑定到标题上
		    						lo.data(da_cnt,$(divContent[ind]));
		    						if($(this).attr("actived")!=null){
		    							ac=ind;
		    						}
		    					});
		    					tpanel.append(tit);//追加所有的标题<ul>到标题板上
		    					//增加标题与内容的分隔线
		    					tctn.append(tpanel).append("<div class='cleanfloat'></div><div class='webtab_spacer '></div>");
		    					tabObj.prepend(tctn);//将标题放置在内容的最前面
		    					h1.addClass(ccClass[0]); // ccCls[0]='webtab_acontent'//将所有标签标记为标签内容样式
		    					tab.showTab(ac);//显示第1个tab标签页
		    					//委托标题容器，单击时，调用显示标签
		    					tctn.delegate("."+tabClass[3],"click",function(){//webtab_atitle
		    						var ind=$(this).index();
		    						var oind=tab.currActived;
		    						tab.showTab(ind);
		    						if(s.onChanged!=null) {
		    							s.onChanged(oind,ind);
		    						}
		    					});
		    				}//initTitle结束
		    			}//tab对象结束
		    			tab.initTitle(titles);
		    			$(this).data("tab",tab);
		    		});
		    		return $(this);
			}
		});		
		$.fn.setActiveTab=function(index){
			var tab= $(this).data("tab");
			if(tab!=null) tab.showTab(index);
		}
		$.fn.getActiveTab=function(){
			var tab= $(this).data("tab");
			if(tab!=null) return tab.currActived;
		}
		
})(jQuery);
////////////////////////////////////////////////////////////////////////////////




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




////////////////////////////////////////////////////////////////////////////////
/*
 * JQuery webui78-AccordionMuti.js
 * Description: 
 * Usage: $(document).ready(function(){		$("#yourID").AccordionMuti(); });
 * Depends:jquery 1.7.X
 * Date: 2011-06-10 ~2016-01-19
 * Author: zhangchuansheng
 * Email: zchuansheng@163.com，zchuansheng@gmail.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */////////////////////////////////////////////////////////////////////////////////
 
(function($){
		$.fn.extend({
				AccordionMuti:function(options){
						var s ={
							hpath:"/h3 div/h3 div/p",
							hClass : "/multi-accordion-head1 multi-accordion-level1/multi-accordion-head2  multi-accordion-level2/multi-accordion-head3",
							pClass : "/multi-accordion-padding1/multi-accordion-padding2/multi-accordion-padding3",
							aClass : "/multi-accordion-active/multi-accordion-active/multi-accordion-active3",
							target: "_blank",
							icons : {
									header: "multi-accordion-icon-circle-arrow-e",
									headerSelected: "multi-accordion-icon-circle-arrow-s"
							}

						};
	//					alert(s.icons.header);
						if(options) {
							jQuery.extend(s, options);
						};
						var hpath=s.hpath.split("/");
						var pClass=s.pClass.split("/");
						var hClass=s.hClass.split("/");
						var aClass=s.aClass.split("/");
						$(hpath).each(function (index){hpath[index]=this.split(/\s+/);});
						$(hClass).each(function (index){hClass[index]=this.split(/\s+/);});
						var self = $(this);
						self.addClass("multi-accordion");
						var parent=self;
						var level=hpath.length;
						function  onm_over(event){  	$(this).removeClass(hClass[event.data.level][0]).addClass("multi-accordion-active");   }
						function  onm_out(event){ 		$(this).removeClass("multi-accordion-active").addClass(hClass[event.data.level][0]);    }
						for(var i=1; i<level;i++){
							var h1=parent.find(">"+hpath[i][0]);
							h1.addClass(hClass[i][0]);
		    			h1.bind("mouseover",{level:i},onm_over);
		    			h1.bind("mouseout",{level:i},onm_out);
		    			h1.addClass(pClass[i]);
		    		//	h1.click(function(){$(this).children( ".multi-accordion-icon" ).toggleClass(s.icons.headerSelected);});
							if(i+1<level){
								var c1=parent.find(">"+hpath[i][1]);
								c1.addClass(hClass[i][1]);
								c1.hide();

				 		 	  _toggle(h1,hpath[i][1]);
								_createIcons(h1);
		 		 	  		parent=c1;

							}else {
								var ref=h1.find(" > a").attr("target",s.target);
								h1.click(function(){
									 $(this).siblings("."+aClass[3]).removeClass(aClass[3]);
									 $(this).addClass(aClass[3]);
								});

							};
						};
						var frm=self.closest("form");
						if(frm.length>0){
							$("p",self).click(function(){
				    		 var url=$('a',$(this)).attr('href');
				    		 frm.attr("target",s.target);
							   frm.attr("action",url);
							   frm.submit();
				    		 return false;
	    				});
    				}
    				var def_expand=$("[def_expanded]",self);
    				def_expand.closest(hpath[1][1]).prev(hpath[1][0]).trigger("click");
		 		 	  def_expand.trigger("click");
						function _toggle(obj,sel){
							obj.click(function(){
							var ind=($(this).next(sel).index())-1;
							$(this).siblings(sel+":not(:eq("+ind+"))").slideUp();
							$(this).siblings().children( "."+s.icons.headerSelected ).removeClass(s.icons.headerSelected);
								var nxt=$(this).next();
								nxt.slideToggle(300);
								$(this).children( ".multi-accordion-icon" ).toggleClass(s.icons.headerSelected);
							 });

		   			}
		   			function _createIcons(headers) {
		   				//alert(this.s.icons.header);
									var options = s;
									if ( options.icons ) {
										$( "<span>&nbsp;&nbsp;&nbsp;</span>" )
											.addClass( "multi-accordion-icon " + options.icons.header )
											.prependTo( headers );
									}
						}
		   //	return this;
			}
		});
})(jQuery);

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/*
 * JQuery webui78-webValidator.js
 * Description: 
 * Usage:  
 * Depends:webui78-commons.js,jquery 1.7.X
 * Date: 2011-08-15~2016-01-19
 * Author: zhangchuansheng
 * Email: zchuansheng@163.com，zchuansheng@gmail.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */////////////////////////////////////////////////////////////////////////////////
 
(function($){

$.webValidator={
	opName:"valid_options",
	defaults : {
				type:"text",					//数据类型
				empty:true,					//是否可以为空，默认可以为空
				min:0,								//最小值
				max:999999,						//最小值
				onErrMsg:"",//当验证出错时，提示信息的内容
				onShowMsg:"",//默认提示的内容
				regExp:"",
				group:null,
				ischeck:true,
				maincheck:true,
				linkbox:null,//关联的checkbox名称，当本行chechbox选中时检查此元素，否则不检查
				wideWord:true				//一个汉字2个
	},
   onError:function(e,tipMsg,op){
   	if(!e.is(':disabled')) e.focus();
   	var tit=e.attr("title");
   	var msg=op.onErrMsg==""?tipMsg:op.onErrMsg;
   	if(tit!=null)
   		msg="["+tit+"]&nbsp;"+msg;
   	$.webValidator.tipTool.showMessage(e,msg,"icon_no");	return false;
   },
   validSize:function(val,op){
    	if(typeof(op.min)!="undefined" && val.length < op.min) return false;
    	if(typeof(op.min)!="undefined" && val.length > op.max) return false;
    	return true;
   },
   validType:function(val,op){
			var dataType = $.webValidator.dataType[op.type];
			if(dataType==undefined) return false;
			var rExp=(dataType.regex==undefined ||dataType.regex=="") ? op.regExp : dataType.regex;
			if(rExp==undefined ||rExp=="") return false;
	 		return  (new RegExp(rExp, "i")).test(val);
    },
    validValue:function(val,op){
    	var sizeOk=true;
    	var type =op.type;
			switch(type)
			{
				case "date":
				case "datetime":
					sizeOk = $.webValidator.util.isDate(val);
					val = new Date(Date.parse(val.replace(/-/g,"/")));
					var mind=op.min,maxd=op.max;
					if(sizeOk&& $.webValidator.util.isDate(mind))	mind=new Date(Date.parse(mind.replace(/-/g,"/")));
					if(sizeOk&& $.webValidator.util.isDate(maxd))	maxd=new Date(Date.parse(maxd.replace(/-/g,"/")));
					if ((typeof(mind)=="object") &&  val < mind){
						sizeOk=false;
					}
					if((typeof(maxd)=="object" )&& val >maxd){
						sizeOk=false;
					}
					break;
				case "number":
					val = (new Number(val)).valueOf();
					sizeOk=!isNaN(val);
			}
			return sizeOk;
    },
    checkValid : function(obj){
		var op=$.webValidator.getOption(obj);
		if(op==null ) { alert("无法取得元素的验证配置信息！");return false;}
		return $.webValidator.checkValidBy(obj,op);
	},
    checkValidBy : function(obj,op){
				var e =obj[0];
				var sType = e.type;
				if(op.linkbox!=null) {//如果设置了linkbox
					var box=$(':checkbox[name="'+op.linkbox+'"]',obj.closest("tr"));//在本行内找到对应的checkbox，
					if(box!=null && box.length>0 ){//如果找到，则根据checkbox设置是否验证本元素
						op.ischeck=box[0].checked==true?true:false;
					}
				}
				var ischeck = op.ischeck;
				if(ischeck==false|| op.type==null|| op.type=="" ||op.maincheck==false ) return  true;
				var empty = op.empty;
				var val =(obj.val()==op.onShowMsg)?"":obj.val();
				var dataType = $.webValidator.dataType[op.type];
				if(dataType==undefined) {alert("not support datatype 不支持的数据类型检查,type="+op.type);return false;}
				var len=0;
				switch(sType)
				{
					case "text":
					case "hidden":
					case "password":
					case "textarea":
					case "file":
						if(empty&& (val==null||val=="")){
							if(obj.attr("value")==op.onShowMsg) obj.val("");
							return true;
						}
						if(!this.validSize(val,op) && dataType!="date") return this.onError(obj,"输入长度错误，有效长度:"+op.min+"～"+op.max,op);
						if(!this.validType(val,op)) return this.onError(obj,"输入内容类型错误，请输入:"+dataType.title,op);
						if(!this.validValue(val,op)) return this.onError(obj,"输入的值错误，正确的值为:"+op.min+"～"+op.max,op);
							break;
					case "checkbox":
					case "radio":
							//alert("obj=="+obj.index());
							if(empty) return true;
							//alert("maincheck=="+op.maincheck);
							if(op.maincheck==null||op.maincheck==false) return true;//maicheck只作用于radio，当一个radio验证完成后，其他raio的maicheck设置为fasle，不需要再检查。
							var wh=op.group!=null?"[v_group='"+op.group+"']":"[name='"+obj.attr("name")+"']:not('[v_group]')";
							$("input[type='"+sType+"']"+wh).each(function (i,e1){
								 if(e1!=e) $.webValidator.setOption($(this),{maincheck:false});
								if(e1.checked==true) len+=1;
							});
							if(len<op.min) return this.onError(obj,"请至少选择:"+op.min+"项",op);
							if(len>op.max) return this.onError(obj,"请最多选择:"+op.max+"项",op);
							break;
					case "select-one":
							if(empty) return true;
							//len = e.options ? e.options.selectedIndex : -1;
							//if(len<1 && empty==false) return this.onError(obj,"请至少选择1项",op);
							if(e.options[e.options.selectedIndex].value.length<1)
								return this.onError(obj,"请至少选择1项",op);
							break;
					case "select-multiple":
							if(empty) return true;
							len = $("select[name="+e.name+"] option:selected").length;
							if(len<op.min) return this.onError(obj,"请至少选择:"+op.min+"项",op);
							if(len>op.max) return this.onError(obj,"请最多选择:"+op.max+"项",op);
						break;
					default:  return this.onError(obj,"未取到元素类型，请检查元素标签",op);
				}
				return true;
		},
		setOption:function(obj,p){
				var op=$.webValidator.getOption(obj);
				if(op==null) return null;
				$.extend(op,p);
				if(op.empty!=null && op.empty==false&& op.min==0) op.min=1;//如果非空，则设置最小值为1
				obj.data($.webValidator.opName,op);
				var el= obj[0];
				var tag = el.tagName.toLowerCase();
				var showText = op.onShowMsg;
				if((showText!=null && showText!="")&&(tag == "input" || tag=="textarea")){
					$.webValidator.tipTool.showTipInContent(obj,showText);
				}
				if(op.type=='date') {
					obj.webDatepicker();
				}
				//$.webValidator.tipTool.bindShowMessage(obj,"name="+obj.attr("name")+",type="+op.type+",min="+op.min+",max="+op.max+",maincheck="+op.maincheck+",empty="+op.empty);
				return op;
		},
		getOption:function(obj){
			if(obj==null || obj.length==0) 	return null;
			var op=obj.data($.webValidator.opName);
			if(op==null) {//如果没有设置验证属性，则设置缺省验证配置。
				op={};$.extend(op,$.webValidator.defaults);
				var v_t1=obj.attr("v_type");if(v_t1!=null) op.type=v_t1;
				//如果是日期类型，设置默认的最大最小值为空
				if(op.type=="date") {op.min="不限";op.max="不限";}
				var v_i1=obj.attr('v_ischeck');	if(v_i1!=null) {op.ischeck=((v_i1=="0")?false:true);}
				var v_e1=obj.attr('v_empty');if(v_e1!=null) {op.empty=((v_e1=="1")?true:false)};
				var v_m1=obj.attr("v_min");	if(v_m1!=null) { op.min=v_m1;}
				var v_m2=obj.attr("v_max");	if(v_m2!=null) {op.max=v_m2;}
				var v_s1=obj.attr("v_onShowMsg");if(v_s1!=null) {op.onShowMsg=v_s1;}
				var v_e1=obj.attr("v_onErrMsg"); if(v_e1!=null) { op.onErrMsg=v_e1;}
				var v_g1=obj.attr("v_group"); if(v_g1!=null) {op.group=v_g1;}
				var v_r1=obj.attr("v_regExp"); if(v_r1!=null) {op.regExp=v_r1;}
				if(op.empty==false && op.min==0)	op.min=1;
				var v_l1=obj.attr("v_linkbox"); if(v_l1!=null) {op.linkbox=v_l1;}
			}

			return op;
		},
		getFormElements:function(frm){
			var eArr=null;
			var e1=frm.find(":checkbox");
			var e2=frm.find(":radio");
			var e3=frm.find(":text");
			var e4=frm.find(":password");
			var e5=frm.find(":file");
			var e6=frm.find("select");
			var e7=frm.find("textarea");
			if(e3.length<500&&e7.length<500){
				return frm.find(":text,:checkbox,:radio,:password,:file,select,textarea");
			}
			var eArr=$.merge(e1,e2);
			eArr=$.merge(eArr,e3);
			eArr=$.merge(eArr,e4);
			eArr=$.merge(eArr,e5);
			eArr=$.merge(eArr,e6);
			eArr=$.merge(eArr,e7);

			return eArr;
		},
		util:{
			aCity:{11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} ,
			isCardID:function (sId){
				var iSum=0 ;var info="" ;
				if(!/^\d{17}(\d|x)$/i.test(sId)) return "身份证长度或格式错误";
				sId=sId.replace(/x$/i,"a");
				if(this.aCity[parseInt(sId.substr(0,2))]==null) return "身份证地区非法";
				sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
				var d=new Date(sBirthday.replace(/-/g,"/")) ;
				if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return "身份证上的出生日期非法";
				for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
				if(iSum%11!=1) return "身份证号非法";
				return true;
			},
			/*时间(10:01:01)*/
			isTime:function (str){
				var a = str.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
				if (a == null) return false;
				if (a[1]>24 || a[3]>60 || a[4]>60) return false;
				return true;
			},
			/*日期(2011-09-05)*/
			isDate:function (str){
				if(typeof(str)!="string") return false;
				var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
				if(r==null)return false;
				var d= new Date(r[1], r[3]-1, r[4]);
				return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
			},
			/*日期时间(2011-09-05 10:01:01)*/
			isDateTime:function (str){
				var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
				var r = str.match(reg);
				if(r==null) return false;
				var d= new Date(r[1], r[3]-1,r[4],r[5],r[6],r[7]);
				return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]&&d.getSeconds()==r[7]);
			}
		}
 	}
$.fn.setValidator = function(op) {
	return this.each(function(e)	{
		var tag=$(this).get(0).tagName;
		var frm=null;
		if(tag=="FORM"){frm=$(this);} else {frm= $(this).closest('form');}
		if(frm==null) {alert("未找到对应的form对象");}
		if(tag=="FORM"){
			var eArr=$.webValidator.getFormElements(frm);
			$.each(eArr,function(){
				$.webValidator.setOption($(this),op);
			});
		}else {
			$.webValidator.setOption($(this),op);
		}
 	});
};
$.fn.formIsValid =function(){
    	var frm=$(this);
    	var isValid=true;
		var eArr=$.webValidator.getFormElements(frm);
		$.each(eArr,function(){//逐类元素进行验证
			var obj=$(this);
			var op =$.webValidator.getOption(obj);//取得当前元素的验证选项
			isValid=$.webValidator.checkValidBy(obj,op);
			return isValid;//如果某类元素中返回验证失败，则返回false，终止所有验证操作。
		});
		return isValid;
};
$.fn.checkDataValid =function(){
    	var container=$(this);
    	var isValid=true;
		var eArr=$.webValidator.getFormElements(container);
		$.each(eArr,function(){//逐类元素进行验证
			var obj=$(this);
			var op =$.webValidator.getOption(obj);//取得当前元素的验证选项
			isValid=$.webValidator.checkValidBy(obj,op);
			return isValid;//如果某类元素中返回验证失败，则返回false，终止所有验证操作。
		});
		return isValid;
};
$.webValidator.getMousePosition=function(e){
		e = e || window.event;
		var posx = e.pageX || (e.clientX ? e.clientX + document.body.scrollLeft : 0);
		var posy = e.pageY || (e.clientY ? e.clientY + document.body.scrollTop : 0);
		return { 'x': posx, 'y': posy };
}

})(jQuery);
$.webValidator.tipTool=$.webTipTool;

//验证类型
$.webValidator.dataType =
{
	text:{regex:"([\\s\\S]*)", title:"文本"},
	number:{regex:"^([+-]?)\\d*\\.?\\d+$", title:"数值"},
	integer0:{regex:"^-?[1-9]\\d*$",title:"整数"},
	integer1:{regex:"^[1-9]\\d*$",title:"正整数"},
	integer2:{regex:"^-[1-9]\\d*$",title:"负整数"},
	num:{regex:"^([+-]?)\\d*\\.?\\d+$",title:"数字"},
	num1:{regex:"^[1-9]\\d*$|0",title:"正数（正整数 + 0）"},
	num2:{regex:"^-[1-9]\\d*$|0",title:"负数（负整数 + 0）"},
	decimal1:{regex:"^([+-]?)\\d*\\.\\d+$",title:"浮点数"},
	decimal2:{regex:"^[0-9]\\d*\\.\\d{0,2}$", title:"两位小数的浮点数"},
	decimal3:{regex:"^(([0-9]+[\.]?[0-9]+)|[0-9])$",title:"非负浮点数或整数（正浮点数或整数 + 0）"},
	decimal4:{regex:"^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$", title:"负浮点数"},
	decimal5:{regex:"^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$", title:"浮点数"},
	decimal6:{regex:"^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$", title:"正浮点数"},
	decimal7:{regex:"^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$",title:"非正浮点数（负浮点数 + 0）"},
	email:{regex:"^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", title:"邮件"},
	color:{regex:"^[a-fA-F0-9]{6}$",title:"颜色"},
	url:{regex:"^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$",	title:"url"},
	chinese:{regex:"^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",title:"仅中文"},
	ascii:{regex:"^[\\x00-\\xFF]+$",title:"仅ACSII字符"},
	zipcode:{regex:"^\\d{6}$",title:"邮编"},
	mobile:{regex:"^13[0-9]{9}|15[012356789][0-9]{8}|18[0256789][0-9]{8}|147[0-9]{8}$",title:"手机"},
	ip4:{regex:"^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$",title:"ip地址"},
	notempty:{regex:"^\\S+$",title:"非空"},
	picture:{regex:"(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$",title:"图片"},
	rar:{regex:"(.*)\\.(rar|zip|7zip|tgz)$",title:"压缩文件"},
	date:{regex:"^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$",title:"日期"},
	qq:{regex:"^[1-9]*[1-9][0-9]*$",title:"QQ号码"},
	tel:{regex:"^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$",title:"电话号码"},
	username:{regex:"^\\w+$",title:"用户由数字、26个英文字母或者下划线组成的字符串"},
	letter:{regex:"^[A-Za-z]+$",title:"字母"},
	letter_u:{regex:"^[A-Z]+$",title:"大写字母"},
	letter_l:{regex:"^[a-z]+$",title:"小写字母"},
	idcard:{regex:"^[1-9]([0-9]{14}|[0-9]{17})$",title:"身份证"},
	custom:{regex:"",title:"自定义类型"}
};
////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////
/*
 * JQuery webui78-webDialog.js
 * Description: 
 * Usage: $(document).ready(function(){		$("#yourID").webDialog(); });
 * Depends:webui78-webButton.js,jquery 1.7.X
 * Date: 2011-9-11~2016-01-19
 * Author: zhangchuansheng
 * Email: zchuansheng@163.com，zchuansheng@gmail.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */////////////////////////////////////////////////////////////////////////////////
 
(function($){

	$.webDropdragUtil={
			startMove:false,
			updatePosition:function(e) {
				var mi = e.data;//移动信息参数
				var obj= $(mi.target);
				var pos = $.webValidator.getMousePosition(e);
				var newX =mi.oldLeft+(pos.x - mi.oldMouseX);
				var newY = mi.oldTop+(pos.y - mi.oldMouseY);
				if((newX<0)||(newY<0)) return;
				obj.css("top",  newY);
				obj.css("left", newX);
				//调用回调函数
			//	$(".webdialog_body",obj).html("webDropdrag::updatePosition="+newY+",x="+newX);

				if(mi.ops.onMove!=null)  mi.ops.onMove(obj);
			},
			mouseDown:function(e){
				return false;
			},
			mouseMove:function(e){
				if(e.data.target!=null)
				if($.webDropdragUtil.startMove ){
					$.webDropdragUtil.updatePosition(e);
				}
				return false;
			},
			mouseUp:function(e){
				$.webDropdragUtil.startMove = false;
				$(e.data.target).fadeTo(0,1);
				$(document).unbind('.webdropdrag');
				e.data.handler.css('cursor','');
				return false;
			},
			mouseLeave:function(e){
				$.webDropdragUtil.startMove = false;
				$(e.data.target).fadeTo(0,1);
				$(document).unbind('.webdropdrag');
				e.data.handler.css('cursor','');
				return false;
			}
	}
	$.fn.webDropdrag = function(options){
				var def={
				handler:null,//按住拖动的把柄对象
				onMove:null,//当移动时，回调函数
				opacity:0.5//拖动时的透明度
			};
		return this.each(function(){
			var op = $.extend(def, options);
			// 绑定鼠标按下事件
			var obj=$(this);
			var hasf=obj.find("iframe").length>0;//用来判断是否增加leave事件，对于包含iframe的窗口，鼠标移到iframe时，无法捕获鼠标事件，用leave事件处理鼠标离开动作
			if(obj.hasClass("webDropdrag")) return ;
			else obj.addClass("webDropdrag");
			var handler=$(op.handler,obj);//查找handle如果没找到则设置本身
			if(handler.length<1) handler=obj;
			handler.bind('mousedown.webdropdrag', {target:this}, function(e){//当开始鼠标点击
				// 拖动开始！设置鼠标为拖动指针
					$(this).css('cursor','move');
					// 设置拖动元素为为可拖动样式// 更新其显示层次
					obj.css("position", "absolute").css("z-index", parseInt( new Date().getTime()/1000 ));
					//初始化鼠标位置及元素位置
					var pos    = $.webValidator.getMousePosition(e);
					var moveInfo = {//记录对象的起始大小信息
						target: e.data.target,
						handler:handler,
						ops:op,//设置选项
						oldMouseX:pos.x,
						oldMouseY:pos.y,
						oldTop:e.data.target.offsetTop,
						oldLeft:e.data.target.offsetLeft
					};
					$.webDropdragUtil.startMove = true;
					$(e.data.target).fadeTo(0,op.opacity);
					if(moveInfo.handler!=null) moveInfo.handler.css('cursor','move');
					$(document).bind('mousedown.webdropdrag', moveInfo, $.webDropdragUtil.mouseDown);
					$(document).bind('mousemove.webdropdrag', moveInfo, $.webDropdragUtil.mouseMove);
					$(document).bind('mouseup.webdropdrag', moveInfo, $.webDropdragUtil.mouseUp);
					$(document).bind('mouseleave.webdropdrag', moveInfo, $.webDropdragUtil.mouseUp);
			}).bind('mousemove.webdropdrag', {target:this}, function(e){//当鼠标移动时
				if(!$.webDropdragUtil.startMove ) return ;
			}).bind('mouseup.webdropdrag', {target:this}, function(e){//停止移动时
					$.webDropdragUtil.startMove = false;
					$(e.data.target).fadeTo(0,1);
					$(document).unbind('.webdropdrag');
					$(this).css("cursor", "");
			});
			if(hasf) handler.bind('mouseleave.webdropdrag', {target:this}, $.webDropdragUtil.mouseUp);
		});
	};
///////////////////////

	$.webResizableUtil={
			modifySize:function(e){
					var si = e.data;
					var minWidth=si.ops.minWidth;
					var maxWidth=si.ops.maxWidth;
					var minHeight=si.ops.minHeight;
					var maxHeight=si.ops.maxHeight;
					var lastLeft,lastTop,lastWidth,lastHeight;
					var newtLeft,newTop,newWidth,newHeight;
					lastLeft=si.startLeft;
					lastTop=si.startTop;
					lastWidth=si.startWidth;
					lastHeight=si.startHeight;
					var lastPageX= si.startX;
					var lastPageY= si.startY;
					var obj= $(si.target);
					var mm=si.moveMode;

					//var options = $.data(resizeData.target, 'resizable').options;
					if (mm.indexOf('e')!= -1) {//向右偏移
						//如当前宽度小于设置的最小宽度，则取设置的最小宽度，如果当前宽度大于设置的最大宽度，则去设置的最大宽度
						newWidth = Math.min(Math.max((lastWidth + e.pageX - lastPageX),minWidth),maxWidth);
					}
					if (mm.indexOf('s')!= -1) {//向下偏移
					//如当前宽度小于设置的最小高度，则取设置的最小高度，如果当前高度大于设置的最大高度，则去设置的最大高度
						newHeight = Math.min(Math.max((lastHeight + e.pageY - lastPageY), minHeight),maxHeight	);
					}
					if (mm.indexOf('w')!= -1) {//项左偏移
						newWidth = lastWidth - e.pageX + lastPageX;
						if(newWidth<=maxWidth&& newWidth>=minWidth){//如果在允许的最大最小范围内，则修改起始位置
							newtLeft = lastLeft + e.pageX - lastPageX;
						}
					}
					if (mm.indexOf('n')!= -1) {//向上偏移
						newHeight = lastHeight - e.pageY + lastPageY;
						if (newHeight<=maxHeight && newHeight>= minHeight) {//如果在允许的最大最小范围内，则修改起始位置
							newTop = lastTop + e.pageY - lastPageY;
						}
					}
					//设置被调整对象的大小
				if(newWidth<=maxWidth&& newWidth>=minWidth){
					obj.css({left: newtLeft});
					obj.width(newWidth);
				}
				if (newHeight<=maxHeight && newHeight>= minHeight){
					obj.css({top: newTop});
					obj.height(newHeight);
					//调用回调函数
				}
				if(si.ops.onResize!=null)  si.ops.onResize(obj);

			},
			mouseDown:function(e){
				return false;
			},
			mouseMove:function(e){
				if($.webResizableUtil.startResize){
					$.webResizableUtil.modifySize(e);
				}
	 			return false;
			},
 			mouseUp:function(e){
	 			$(document).unbind('.webresizable');
				$.webResizableUtil.startResize = false;
				$(e.data.target).fadeTo(0,1);
				//$.webResizableUtil.modifySize(e);
				$('body').css('cursor','');
				return false;
			},
			mModes:'n, e, s, w, ne, se, sw, nw, all'.split(','),
			startResize : false,
			getMoveMode:function (e) {//取得鼠标所在位置时的移动模式
				var tt = $(e.data.target);
				var offset = tt.offset();
				var width = tt.outerWidth();
				var height = tt.outerHeight();
				var edge = 7;
				var mm = '';
				if (e.pageY > offset.top && e.pageY < offset.top + edge) {mm += 'n';}
				else if (e.pageY < offset.top + height && e.pageY > offset.top + height - edge) {	mm += 's';}
				if (e.pageX > offset.left && e.pageX < offset.left + edge) {	mm += 'w';}
				else if (e.pageX < offset.left + width && e.pageX > offset.left + width - edge) {	mm += 'e';}
				for(var i=0; i<this.mModes.length; i++) {
					var md = this.mModes[i].replace(/(^\s*)|(\s*$)/g, '');
					if (md == 'all' || md == mm) {return mm;}
				}
				return '';
			},
			getElCss:function (obj,css) {
					var val = parseInt(obj.css(css));
					return isNaN(val)?0:val;
			}

	}
	$.fn.webResizable = function(options){
			var def={
				onResize:null,//改变大小时的回调函数
				opacity:0.5,//改变大小时的透明度
				minWidth:50,//最小宽度
				maxWidth:800,//最大宽度
				minHeight:50,//最小高度
				maxHeight:600//最大高度
			};
			return this.each(function(){
			var op = $.extend(def, options);
			var jo=$(this);
			var hasf=jo.find("iframe").length>0;
			if(jo.hasClass("webResizable")) return ;
			else jo.addClass("webResizable");
			jo.bind('mousedown.webResizable', {target:this}, function(e){//当开始鼠标点击调整大小时调用
					var mm = $.webResizableUtil.getMoveMode(e);
					if (mm == '') return;
					//如果是可移动状态，在初始化移动所需事件绑定
					var obj=$(e.data.target);
					var sizeInfo = {//记录对象的起始大小信息
						target: e.data.target,
						ops:op,//设置选项
						moveMode:$.webResizableUtil.getMoveMode(e),
						startLeft: $.webResizableUtil.getElCss(obj,'left'),
						startTop: $.webResizableUtil.getElCss(obj,'top'),
						startX: e.pageX,
						startY: e.pageY,
						startWidth: obj.outerWidth(),
						startHeight: obj.outerHeight()
					};
					$.webResizableUtil.startResize = true;
					obj.fadeTo(0,op.opacity);
					$(document).bind('mousedown.webresizable', sizeInfo, $.webResizableUtil.mouseDown);
					$(document).bind('mousemove.webresizable', sizeInfo, $.webResizableUtil.mouseMove);
					$(document).bind('mouseup.webresizable', sizeInfo, $.webResizableUtil.mouseUp);
					$(document).bind('mouseleave.webresizable', sizeInfo, $.webResizableUtil.mouseUp);
					$('body').css('cursor', sizeInfo.moveMode+'-resize');
			}).bind('mousemove.webresizable', {target:this}, function(e){//当鼠标移动时
					if ($.webResizableUtil.startResize) return;
					var mm = $.webResizableUtil.getMoveMode(e);
					if (mm == '') {$(e.data.target).css('cursor', '');}
					else {$(e.data.target).css('cursor', mm + '-resize');	}
			}).bind('mouseleave.webresizable', {target:this}, function(e){//当鼠标离开变更区时，设置鼠标
					$(e.data.target).fadeTo(0,1);
					$(e.data.target).css('cursor', '');
			});
			// 绑定鼠标按下事件
		});

	};


////////////////////////
})(jQuery);

/**
	窗体组件
 *创建时间: 2011-9-15
 *by 张传生
 *版权保留
**/
 (function($){
 		$.webDialogUtil={
 			defaults:{//缺省配置信息
					onResize:null,//当改变大小时的回调函数
					onClose:null,//当关闭窗口时的回调函数
					name:null,//用于打开窗口名称，可以凭此名称关闭窗口
					width:400,
					height:170,
					top:0,
					left:0,
					title:"&nbsp;",//标题
					ismodel:false,//是否是模态对话框
					url:null,//要打开的URL
					handle:null,//对话框html所在的管理对象,applyTo不为空时即applyTo，否则为执行WebDialog的对象
					applyTo:null,//将对话的内容对象
					checkOnClose:false,//当关闭时是否执行窗口内表单元素的验证
					content:null,//对话框内容
					opacity:1,//拖动、改变大小时的透明度
					minWidth:50,//最小宽度
					maxWidth:1024,
					minHeight:50,
					maxHeight:768,//最大高度
					animate:0,//动画时间，如果<1则无动画效果
					event:null,//触发打开窗口的事件对象
					startPos:{x:0,y:0}//窗口动画的起始位置
				},
			openedCount:0,
 			createDlg:function(op){
					var dialog=$("<div class='webdialog' style:'display:none'></div>");//窗口div
					if(op.name!=null ) dialog.attr("name",op.name);
					var header=$("<div class='header'></div>");//窗口头部
					var dtitle=$("<div class='title'></div");//窗口标题
					var tools=$("<div class='webdialog_tools'><a class='closer' href='javascript:void(0)' ></a></div");//窗口顶角工具栏
					var dbody=$("<div class='webdialog_body'></div>");//窗体
					dtitle.append(op.title);
					header.append(dtitle).append(tools);
					dialog.append(header).append(dbody);
					dbody.append(op.content);
					if(op.url!=null){
						var ifr=$('<iframe src="'+op.url+'" width="100%" height="100%" scrolling="auto" frameborder="2" marginheight="10" marginwidth="10" ></iframe>');
						dbody.append(ifr);
					}
					if(op.buttons!=null&&op.buttons.length>0){
						//dbody.append();
						var btnpanel=$('<div class="webdialog_buttons"></div>');
						for(var  i=0;i<op.buttons.length;i++){
							if(op.buttons[i].btn!=null){//如果btn不为空
								var btn=$(op.buttons[i].btn);
								var picBtn=op.isWebButton?btn.webButton():btn;//格式化按钮效果
								//如果配置了onclick回调函数，则进行绑定
								if(op.buttons[i].onclick!=null)	picBtn.bind("click",{target:dialog},op.buttons[i].onclick);
								btnpanel.append(picBtn);
							}else {//如果btn为空则直接将数组元素添加到对话框
								btnpanel.append(op.buttons[i]);
							}
						}
						dbody.append(btnpanel);
					}	
       		var toT=($(window).height()-parseInt(op.top))/2+$(document).scrollTop();
       		var toL=	($(window).width()-parseInt(op.left))/2+$(document).scrollLeft();
       		
					dialog.css({top:toT,left:toL,
					width:Math.min(Math.max(op.width,op.minWidth),op.maxWidth),height:Math.min(Math.max(op.height,op.minHeight),op.maxHeight)});

					return dialog;
			}
 		};
 		$.fn.webDialog = function(options){
	 			 	var defaults=$.webDialogUtil.defaults;
			return this.each(function(){
				var op = $.extend({},defaults, options);
				op.handle=$(this);
				var dialog={
					dlg:null,
					applyVisible:true,//记录applyTo原始的显示状态
					open:function(op){

						this.dlg=$.webDialogUtil.createDlg(op);
						if(op.applyTo!=null) {//如果appylTo不为空，在把窗口应用到applyTo上
							//判断是否已经应用过对话框，如果应用过，则直接返回，不再应用
							if(op.applyTo.hasClass("webDialog_apply")){this.dlg.empty(); return;}
							else op.applyTo.addClass("webDialog_apply");
							//op.isModelDlg=true;
							//将对话框的所需html放置在applyTo之后
							op.applyTo.after(this.dlg);
							//再将applyTo的内容追加到对话框内部
							$('.webdialog_body',this.dlg).append(op.applyTo);
							//显示applyTo的内容
							this.applyVisible=op.applyTo.is(":visible");
							//alert("appleyTo==="+
							if(!this.applyVisible) op.applyTo.show();
						}else {//如果没有applyTo的则将对话框的html代码放置在handle内部
							op.handle.append(this.dlg);
						}
						var header=$(".header",this.dlg);//取得窗口头部
						var headerHeight=header.outerHeight();//取得头部高度
						var dlgbody=$(".webdialog_body",this.dlg);
						var borderHeght= parseInt(dlgbody.css("padding-top")) + parseInt(dlgbody.css("padding-bottom"))+11;

						dlgbody.css("height",this.dlg.innerHeight()-headerHeight-borderHeght);//设置窗体部分的高度
						this.dlg.webDropdrag({handler:'.header',opacity:op.opacity});//设置可拖动效果
						var sizeop={onResize:function(obj){$(".webdialog_body",obj).css("height",obj.innerHeight()-headerHeight-borderHeght);}};
						op=$.extend(op, sizeop);
						this.dlg.webResizable(op);//设置可变更大小的效果
						$(".closer",header).bind("click",{target:this.dlg},function(e){//设置关闭时执行的动作。
							dialog.closeDlg(e);
						});
					},
					show:function(op){
						var zindex=parseInt( new Date().getTime()/1000 );
						if(op.ismodel) $("body").setmask({zindex:zindex});
						var toWidth=parseInt(this.dlg.width());
						var toHeight=parseInt(this.dlg.height())
						var toLeft=($(window).width()-toWidth)/2+$(document).scrollLeft();
						var toTop=($(window).height()-toHeight)/3+$.webDialogUtil.openedCount*30+$(document).scrollTop();
 

						if(toTop<5) toTop=5;
						//alert(op.applyTo.css('top'));
						var startTop=0;
						var startLeft=0;
						if(op.animate>=1){//如果动画时间>=1(需要动画效果)
							if(op.event!=null){
								var mPos=$.webValidator.getMousePosition(op.event);
								op.startPos=mPos;
								startTop=mPos.y;
								startLeft=mPos.x;
							}
							this.dlg.css({left:startLeft,top:startTop,width:0,height:0,opacity:0.5});//在IE9中width:0,height:0会导致提示兼容性问题
							this.dlg.animate({left:toLeft,top:toTop,width:toWidth,height:toHeight,opacity:1}, {duration: 300});
						}
 						this.dlg.css({left:toLeft ,top:toTop ,opacity:1,"z-index":zindex+1});
					},
					hide:function(){
						this.dlg.hide();
					},
					close:function(){
						$(".header .closer",this.dlg).trigger('click');
					},
					closeDlg:function(e){
							var toclose=true;
							var dlgObj=e.data.target;
							if(op.checkOnClose ){//如果配置要求关闭时，进行表单验证，则执行验证
								toclose=dlgObj.checkDataValid();
							}
							if(op.onClose!=null) {toclose=op.onClose(e,op);}//调用回调函数，如果返回false则不关闭窗口
							if(toclose==false) return;
							//alert($(".webdialog_body",this.dlg).html());
							if(op.applyTo!=null) {
								dlgObj.before(op.applyTo);
								if(!dialog.applyVisible) {op.applyTo.hide();}//如果applyTo原来是隐藏的，则再次隐藏它
								op.applyTo.removeClass("webDialog_apply");
							}
							if(op.animate>=1){//如果动画时间>=1
							 	dlgObj.animate({left:op.startPos.x,top:op.startPos.y,width:0,height:0}, {duration: op.animate,complete:function(){
							 		$(this).remove();	//删除对话框产生的html
							 	}});
							}else {
									dlgObj.remove();	//删除对话框产生的html
							}
							$.webDialogUtil.openedCount--;
							if(op.ismodel) $("body").unmask();
					}
				};
				dialog.open(op);
				dialog.show(op);
				$.webDialogUtil.openedCount++;
				this.dialog=dialog;
			});
 		}
 		$.fn.closeWebDialog = function(name){
	 
			if(name!=null){
  			var dg=$(document).find("div.webdialog[name='"+name+"']");
   			dg.find(".header .closer").trigger('click');
   			return;
 			}
 			return this.each(function(){
 				if(this.dlg!=null)
 					$(".header .closer",this.dlg).trigger('click');
 				else $(this).closest("div.webdialog").find(".header .closer").trigger('click');
 			});
 		}
 	////////////////////////
})(jQuery);
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/*
 * JQuery webui78-webTree.js
 * Description: 
 * Usage: $(document).ready(function(){		$("#yourID").WebTabpanel(); });
 * Depends:webui78-commons.js,jquery 1.7.X
 * Date: 2013-03-22 ~ 2016-01-19
 * Author: zhangchuansheng
 * Email: zchuansheng@163.com，zchuansheng@gmail.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */////////////////////////////////////////////////////////////////////////////////
 
(function($){
 	var tcl = {
		open: "open",closed: "closed",
		plus_m: "plusm",plus_l: "plusl",minus_m: "minusm",	minus_l: "minusl",
		line_m: "linem",line_l: "linel",
		last: "last",		nolast: "nolast",
		hitbtn: "hitbtn",		icondiv: "icondiv",
		selected:"selected"
	};
	$.webTreeUtil={
		defaults : {
			target:"_blank",
			enableIcon:false,
			collapsed:true,
			expandOne:false,//同级节点仅仅允许一个节点处于展开
			enable_hitbtn:true,
			enable_selbtn:false,
			enable_href:false,
			selbtn:{type:'checkbox',name:null,link:null,iscascade:true,isthree:true},
			icons:{type:0,leaf:'leaficon2',open:'branch-o',closed:'branch-c',level:['icon_def','icon_1','icon_2','icon_3','icon_4']},
			itemClass:['item_def','item_1','item_2','item_3','item_4'],//设置每级item的样式['item_def','item_1','item_2','item_3'],
			loadOnExpand:false,//0：展开不加载子节点,1每次展开都重新加载子节点,2仅在没有子节点时加载
			loadUrl:null,
			name_map:{id:"id",name:"name",isleaf:"isleaf",url:"url",parent_id:"parent_id",param:"param",check_status:"check_status",
				//whereParentIdName用于请求后台使用的参数名称,
				//whereParentIdValue用于传递给后台查询使用的节点ID取值,
				whereParentIdValue:"id"	,whereParentIdName:"whereParentId"
			},//此参数仅用于存放默认值，初始化时设置无效
			resultName:null,
			form_used:false,//动态加载节点时，是否提交表单数据
			lockedOnLoad:false,//当动态加载节点时，是否遮罩整个树
			onPreLoad:null,
			onLoadFinished:false,//当节点加载完毕时调用，参数为node
			onCollapse: false,
			onExpand: false,
			onSelect: false,
			onCheckClick: false,
			isReload:false,
			rootId:0,//rootId同data中的parentId，但优先于data中的parentId
			check_status:{CHECK:'1',NOCHECK:'0',HALFCHECK:'2'}
		},
		getNodeLevel:function(node,t_id){
			var p=node;
			var isS=(Object.prototype.toString.call(t_id) === "[object String]")
			if(!isS) t_id=$(t_id).attr("id");
			var l=0;
			while( p.attr("id")!=t_id ) {   
    		p=p.parent();
    		var n=p.prop("tagName")
    		if( n=="UL") l++;
			}
			return l;
		},
		initNode:function(node,root){
 			//把所有分支的最后一个节点设置为结束样式
 			var op=root.options;
 			var tree_id=root.rootNode.attr("id");
 			var br1=node.find("li");
 			var pnid=node.attr("id");
 			br1.each(function(i){//循环对node下属的所有li节点进行初始化
				var $self=$(this);
				if($self.attr("id")==null ) $self.attr("id",tree_id+'_'+pnid+'_'+i);
				if($self.filter(":has(div.nodeitem)").length>0) return ;//判断如果已经初始化过，则进行下一个
				var nitem=$self.find(">div:first").addClass("nodeitem");//查找li标签下的第一个div作为节点的item
				var elA=nitem.find(">a");
				if( $("#form1").length>0) elA.bind( "click", function(event){ event.preventDefault(); });  //禁用此节点下的超级链接点击事件
				nitem.click(function(e){////设置节点item，被点击时显示选中效果
	 				if(root.currSelected) root.currSelected.find(".nodeitem").removeClass(tcl.selected);
	 				var nd=$(this);
	 				nd.toggleClass(tcl.selected);
	 				root.currSelected=nd.parent();
	 				//var elA=;
	 				var hrf=nd.find(">a").attr("href");
	 				//alert(e.target==elA[0]);
	 				if(hrf!=null) {
	 				  $("#form1").attr("target",op.target);
	 				  $("#form1").attr("action",hrf);
	 				  $("#form1").submit();
	 				}
	 				if(op.onSelect) op.onSelect(root.currSelected);
	 			}).find(">a:not([target])").attr("target",op.target);
				if(op.enableIcon)	nitem.prepend('<span class="icondiv"></span>');//如果启用显示图标功能，则在添加图标div
	 			if(op.itemClass!=null){
	 				var iCl=$.webTreeUtil.getNodeLevel(nitem,tree_id);////获取节点所处的级别（树深度）
	 				//var iCl=nitem.parents(":has(>div.nodeitem)").length;//获取节点所处的级别（树深度）
	 				nitem.addClass(op.itemClass[iCl]||op.itemClass[0]);// 
	 			}
				var btn=$('<div class="'+ tcl.hitbtn + '"></div>');//给节点增加折叠按钮div
				$self.prepend(btn);//在节点的li内的第一个位置添加折叠按钮
	 			if(!op.enable_hitbtn) {//如果禁用折叠按钮
	 				//if($self.find("ul")>0)
	 				 btn.hide();
	 			}
				var child=$self.find(">ul");//查询节点li是否存在子节点<ul>元素
				var enC=!$self.hasClass("open")&& !$self.is(":has(li.open)");//如果自身或子节点没有设置open样式，则是可以关闭该节点
 				if(op.collapsed&& enC) child.hide();//如果设置默认折叠树，则隐藏所有子节点
				$.webTreeUtil.formatNode($self,root);//格式化这个节点（设置折叠按钮、图标div等的样式）
	 			if(op.enable_selbtn){//若启用节点选择按钮，初始化选择按钮span，状态初始默认为未选中
	 				var icheck=$self.attr("check_status");
	 				icheck=((icheck==undefined)?op.check_status.NOCHECK:icheck);
	 				var selbtn=$('<span class="selbtn '+ op.selbtn.type +icheck+'" check_status="'+icheck+'"></span>');
	 				//alert(op.selbtn.name);
	 				var def_val=$self.attr("check_value");
	 				def_val=(def_val!==undefined?def_val:$self.attr("id"));
	 				if(op.selbtn.name!=null&&op.selbtn.name!='') selbtn.append('<input type="hidden" class="selbtn_inputhidden" name="'+op.selbtn.name+'" value="'+def_val+'" />');
	 				nitem.prepend(selbtn);//在折叠按钮后面插入选择按钮div
	 				$.webTreeUtil.updateCheckBtnStatus(selbtn,root,false);
	 				selbtn.click(function(){
	 					sbt=$(this);
	 					$.webTreeUtil.updateCheckBtnStatus(sbt,root);//当选择按钮被点击时，更新选择按钮的状态
	 					if(root.options.onCheckClick) root.options.onCheckClick(sbt.parent().parent(),sbt.attr("check_status"));
	 					return false;
	 				});
	 			}
			});
		},
		/**添加末节点样式、选中效果设置点击区样式、图标样式*/
		formatNode:function(node_li,root){
				var islast=node_li.is(":last-child");//判断此节点是否是分支中的最后一个节点
				if(islast) node_li.addClass(tcl.last)//如果是最后一个节点，则设置为末节点样式
				else node_li.removeClass(tcl.last);//若不是末节点，则清楚已有的末节点样式
				var op=root.options;
 				//var nitem=node_li.find(">div.nodeitem");
				var child=node_li.find(">ul");//取得本节点的子节点集合
				var isleaf=child.length>0?false:true;//判断是否是叶子节点
				if(!islast&& op.enable_hitbtn) child.addClass(tcl.nolast);//对非最后一个节点，设置背景连接线
	 			var nodeicon="leaf";//设置节点图标，默认设置为叶子图标
				var btn=node_li.find(">div."+tcl.hitbtn); //取得折叠按钮div
				btn.removeClass().addClass(tcl.hitbtn);//清除折叠按钮的原有状态样式，
				var icon=node_li.find(">div.nodeitem>span.icondiv"); //取得图标div
				icon.removeClass().addClass("icondiv");//清除图标div的原有状态样式，
				if(isleaf){//叶子节点
					if(islast) btn.addClass(tcl.last);//设置末节点样式
					btn.addClass(islast?tcl.line_l:tcl.line_m);//根据节点情况，重新设置叶子的连接线
					icon.addClass(this.getIcons(node_li,op));//重新设置图标div的样式
					node_li.find(">div.nodeitem").addClass('leafitem');
				}else {//分支节点
					var isC=child.css("display")=="none";//是否关闭状态
					if(islast) btn.addClass(tcl.last);//设置末节点样式
					btn.addClass(isC?tcl.closed:tcl.open);//设置折叠按钮的开关状态
					btn.addClass(isC?islast?tcl.plus_l:tcl.plus_m:islast?tcl.minus_l:tcl.minus_m);//根据节点情况，重新设置折叠按钮的样式
					icon.addClass(this.getIcons(node_li,op,!isC));//重新设置图标div的样式，
				}
				
		},
		getIcons:function(node_li,op,isopen){
			var ic="";
			var defico=(isopen==null)?"leaf":(isopen?"open":"closed");
		 	if(op.icons.type==0){
 				ic= op.icons[defico];
 			}else if(op.icons.type==1||op.icons.type==4){
 				//var iCl=node_li.parents(":has(>div.nodeitem)").length;//获取节点所处的级别（树深度）
 	 				var iCl=$.webTreeUtil.getNodeLevel(node_li,op.root.attr("id"));////获取节点所处的级别（树深度） 				
 				ic="icondiv1 "+ op.icons.level[iCl]||op.icons.level[0];
 				if(isopen==null && op.icons.type==4)//如果 op.icons.type==4表示叶子节点图标不随树的层级改变
 					ic=op.icons["leaf"]; 					
 			}else if(op.icons.type==2){
				var nd_json=node_li.data("node_data");
				var iType=node_li.attr("icon_type");
				if(nd_json!=null ){
					var iconTypeName=op.name_map["icon_type"];
					var tmp=nd_json[(iconTypeName!=null)?iconTypeName:"icon_type"]
					//console.log("iconTypeName==",iconTypeName,",tmp======",tmp,nd_json)
					if(tmp!=null ) iType=op.icons.type_map[tmp];
				}
				//console.log("itype======",iType)
 				ic= (iType!==undefined)?iType:op.icons[defico];
 				//alert("ic="+ic);
 			}
 			return ic;
		},
		expandNodes:function(node_li,op,isexp){
			var child=node_li.find("li:has(ul)");//取得节点的子节点集合
			child.each(function(){
				$.webTreeUtil.expandNode($(this),op,isexp);
			});
		},
		createNode:function(jsdata,mpName,op){
			if(mpName==null) mpName=$.webTreeUtil.defaults.name_map ;//如果为空采用默认配置
			var newN=$('<li/>',{"id":jsdata[mpName.id]});
			if(jsdata[mpName.check_status]=="1") newN.attr("check_status","1"); 
			var ht=jsdata[mpName.name];
			var url=jsdata[mpName.url];
			if(op.enable_href && url!=null && url.length>1){
				ht=$('<a/>',{href:url}).append(ht);
			}
			newN.append($('<div/>').append(ht));
			if((!jsdata[mpName.isleaf]) || (jsdata[mpName.isleaf]=="0") )  newN.append("<ul/>");
			newN.data("node_data",jsdata);
			if(jsdata[mpName.param]!=null ) newN.data("node_param",jsdata[mpName.param]);
			return newN;
		},
		createNodeHtml:function(jsdata,mpName){
			if(mpName==null) mpName=$.webTreeUtil.defaults.name_map ;//如果为空采用默认配置
			var html=[];
			html.push('<li id="');html.push(jsdata[mpName.id]);html.push('" ><div>');
			var ht=jsdata[mpName.name];
			var url=jsdata[mpName.url];
			if(url!=null && url.length>1){
				html.push('<a href="');html.push(url);html.push('">');
				html.push(ht);html.push('</a>');
			}else html.push(ht);
			html.push('</div>');
			if((!jsdata[mpName.isleaf]) || (jsdata[mpName.isleaf]=="0") ) html.push('<ul></ul>');
			html.push('</li>');
			return html.join("").toString();
			//return newN;
		},
		addNode:function(tree,newNode,posNode,ischild){
			if(ischild==null) ischild=true;
			if(posNode==null) posNode=tree;//如果插入的位置节点为空，则从根目录插入
			var isroot= posNode.data("root")==null?false:true;//如果是在根目录下添加
			var parentNode=ischild?posNode:isroot?posNode:posNode.parent().parent();//设置父节点
			var root=tree.data("root");
			if(root==null) return ;
			if(isroot) parentNode.append(newNode);//如果在根目录添加，则直接追加
			else{
				if(ischild==false) posNode.after(newNode);//如果是添加兄弟节点
				else {//如果是孩子节点
					var ul=posNode.find(">ul");
					if(ul.length==0){
						var child=$("<ul></ul>");
						if(root.options.collapsed) child.hide();
						posNode.append(child);
					}
					posNode.find(">ul").append(newNode);
				}
			}
			$.webTreeUtil.formatNode(newNode.prev("li"),root);
			tree.trigger('onAddNode',{node:newNode,parent:parentNode});
		},
		loadNode:function(tree,node,ops){
		  var root=tree.data("root");
 
			var exe=function (op){//为loadNode的自定义配置，不是树的options
				try{
					var ss=op.success;
					 
				 	var getfun=function(jsdata){
						if (jQuery.isFunction(ss)){
							ss.call($,jsdata); //如果设置了成功回调函数，则调用之
						} else {
							$.webUtil.defaultSuccess(jsdata);//否则调用缺省的提示;
						}
				 
						if(root.options.onPreLoad!=null) root.options.onPreLoad(jsdata,ops);
				 
						var dNode=jsdata.result;
						if(op.resultName!=undefined){
							try{dNode = eval("jsdata."+op.resultName);}catch(e){dNode=null;};
						}
						var mpName=$.extend(root.options.name_map,op.name_map||{});//设置json数据的名字对应关系
						var node_id=node.attr("id");
						var isLoadRoot=(tree.attr("id")==node_id);
						var pgp={};
						var gp_s=[];
						var l_pnode=null;
						var   lpnode;
						$.each(dNode, function(key, val) {
							var oNd=$("#"+val[mpName.id],tree);
							if(oNd.length>0 ) {
								if( op.isReload==true) tree.removeNode(oNd);
								else return ;
							}						
							 
							var $pid=val[mpName.parent_id];
							if( $pid==0 || $pid==""||($pid==null)) $pid=tree.attr("id");
 							if(!op.isfull && (!isLoadRoot && $pid!=node_id )) return;//如果不是全部加载，则判断是否属于当前节点
							var newN=$.webTreeUtil.createNode(val,mpName,op);
							if(pgp[$pid]==null){
								pgp[$pid]=[];//如果分组中没有此父类节点分组，测初始化
								gp_s.push($pid);
							}
							pgp[$pid].push(newN[0]);
						});//按照归属的父节点进行分组预处理完毕
						var pnode=null;
						$.each(gp_s, function(n, ap) {//按照父节点分组，逐个分组加载
								pnode=node;
								if(op.isfull||isLoadRoot) {//如果是全部加载，则将pid对应的节点赋予pnode，若pid为空，则pnode为树的根。
									pnode=(ap!=node_id)?$("#"+ap,tree):tree;//指定的父节点不是空，则查找，若为空，则父节点为根节点
									if(pnode.length<1) pnode=tree;
								}
								$.webTreeUtil.addNode(tree,$(pgp[ap]),pnode,true);
						});
 		 				if(root.options.onLoadFinished) root.options.onLoadFinished(jsdata,root.options,pnode||tree);
					};
					var pName=root.options.name_map.whereParentIdName;
					if(node.isRoot()) {//如果加载的是根节点，则设置whereParentIdValue为rootId
						//设置查询的parentId为rootId
						pName=pName||root.options.name_map.whereParentIdValue;
						var dt={};
						dt[pName]=op.rootId||root.options.rootId||0;
						op.data=$.extend(dt,op.data||{});
					}else if(pName!=null){
						op.data[pName]=op.data[root.options.name_map.whereParentIdValue];
					}
 					op = $.extend({type:"POST",url:op.url||root.options.loadUrl,dataType:"json",cache:false,success:getfun},root.options, op);
 					op.success=getfun;
 					op.isformdata=root.options.form_used;
 					//onPrePostLoad（请求选项，加载的节点，树的配置）
 					if(root.options.onPrePostLoad) op=root.options.onPrePostLoad(op,node,root.options);
					$.webUtil.submitByAjax(op);
				}catch(e){
					alert("节点加载异常！"+e);
				}finally{
 				}
 			};
 			var tl=root.options.lockedOnLoad?tree:node;
			var tm=setTimeout (function(){exe(ops||{});tm=null;tl.unmask();},50);
			tl.setmask({msg:$.webUtil.setting.messageOnLoading});

		},
		togglerNode:function(node_li,op){
			var btn=node_li.find(">div."+tcl.hitbtn); //取得折叠按钮div
			var isExp=(btn.hasClass(tcl.closed)?true:false);
			var isld=(op.loadOnExpand==true||op.loadOnExpand>0);
			if(isExp&&op.loadOnExpand==2){
				var emp=node_li.find(">ul").is(":empty");//判断是否有子节点
				if(!emp) isld=false;
			}
			if(isExp&& isld){//执行展开且需要加载数据
				var ndata=node_li.data("node_data");
				var  nparam=$.extend(node_li.data("node_param"),ndata||{});
				//alert("param.info_id="+nparam.info_id+",info_type="+nparam.info_type);
				this.loadNode(op.root,node_li,{url:ndata.url?ndata.url:op.loadUrl,data:nparam,isfull:false});
			}
			this.expandNode(node_li,op,isExp);

		},
		expandNode:function(node_li,op,isExp){
				var child=node_li.find(">ul");//取得节点的子节点集合
				if(child.length<1) return;
				var btn=node_li.find(">div."+tcl.hitbtn); //取得折叠按钮div
				var isO=btn.hasClass(tcl.closed)?false:true;
				if(isO&& isExp) return ;
				if(isExp!=null) isO=isExp?false:true;
				if(isO) child.slideUp(300);//执行展开或关闭动作
				else child.slideDown(300);//执行展开或关闭动作
				btn.removeClass(!isO?tcl.closed:tcl.open).addClass(isO?tcl.closed:tcl.open);//toggler翻转设置折叠按钮的开关状态
				var islast=btn.hasClass(tcl.last)?true:false;//判断是否是最后一个节点
				btn.removeClass(!isO?tcl.plus_m:tcl.minus_m).removeClass(tcl.plus_l).removeClass(tcl.minus_l);//设置开关线条样式
				btn.addClass(isO?islast?tcl.plus_l:tcl.plus_m:islast?tcl.minus_l:tcl.minus_m);//设置开关线条样式
				if(op.enableIcon&&op.icons.type==0){
					var icon=node_li.find(">div.nodeitem>span.icondiv");//取得图标div
					icon.removeClass(op.icons[!isO?"closed":"open"]);
					icon.addClass(op.icons[isO?"closed":"open"]); //设置图标的样式
				}
				if(op.onExpand && isExp ) op.onExpand(node_li)
				else if(op.onCollapse && !isExp ) op.onCollapse(node_li);
				
		},
		/**更新节点选择按钮的状态,isHit为是否执行点击时的行为：翻转选择按钮的状态（默认为执行翻转）*/
		updateCheckBtnStatus:function(box,root,isHit,nv){
			var op=root.options;
			var s=op.check_status;//选择按钮的状态值配置
	 		var node_li=box.parent().parent();//取的box所属节点
	 		if(isHit==null) isHit=true;//isHit为是否执行点击时的行为：翻转选择按钮的状态（默认为执行翻转）
	 		var curr=box.attr("check_status");//选择按钮的当前状态
			var newval=(isHit)?((curr==s.CHECK||curr==null)?s.NOCHECK:s.CHECK):curr;//如果点击行为，则新状态值为原状态的翻转，否则新状态值为当前状态
			if(op.selbtn.type=="radio" &&  curr==s.CHECK)  newval=curr;//如果是radiobox，且点击前是选中状态，则状态值不翻转
			if(nv!=null) newval=nv;
	 		box.updateCheckStatus(newval,op);//更新选择按钮的当前状态
			if(op.selbtn.type=="checkbox" ){//如果是复选框，并且级联状态，则刷新子节点、父节点的状态
				if(  op.selbtn.iscascade){
					//更新子节点状态
					if(isHit)		node_li.find('ul span.selbtn').updateCheckStatus(newval,op);//如果是点击动作，则更新子节点状态，否则不更新子节点
					//更新父节点状态
					var pbox=node_li.parents('li:has(span.selbtn)');//获取所有父节点
					if(!isHit) pbox=$.merge(node_li,pbox);//如果是刷新动作（不是点击），则需要对当前节点也进行刷新
					pbox.each(function(){
						var par=$(this);
						var p_selbtn=par.find('>div.nodeitem>span.selbtn');//取得本父节点的选择按钮
						var sBox=par.find('ul span.selbtn');
						var c_all=sBox.length;//取得所有子节点个数
						var c_ok=sBox.filter('.'+op.selbtn.type+s.CHECK).length;//取得所有选中的子节点个数
						if(c_all==0) return ;//如果没有子元素，则刷新下一个父节点
						var newv=(c_ok==0)?s.NOCHECK:(c_all==c_ok)?s.CHECK:s.HALFCHECK;//更新节点的状态
						p_selbtn.updateCheckStatus(newv,op);
					});
				}
			}else if(op.selbtn.type=="radio" ) {
				//如果节点box的值设置为选中，则清楚以前其他节点选中状态
				if(  newval== s.CHECK && root.currChecked!=null &&(node_li.attr("id")!=root.currChecked.attr("id"))) 
					root.currChecked.find(">div.nodeitem>span.selbtn").updateCheckStatus(s.NOCHECK,op);
				if(newval== s.CHECK ) root.currChecked=node_li;
			}
		}

	}

	$.fn.replaceClass = function(c1,c2){
		 var $this=$(this);
		 if($this.hasClass(c1))$this.removeClass(c1).addClass(c2);
		 return $this;
	}
	/*更新选择框的状态（根据其属性值check_status更新样式)*/
	$.fn.updateCheckStatus=function(newval,op){
			return this.each(function(){
				var box=$(this);
				var old=box.attr("check_status");//查询当前值
				if(op.selbtn.link!=null) $('>'+op.selbtn.link,box.parent()).val(newval);
				if(op.selbtn.name!=null&&op.selbtn.name!='') {
					box.find("input").attr('disabled',(newval==op.check_status.NOCHECK?true:false));
				}
				box.attr("check_status",newval);
				box.replaceClass(op.selbtn.type+old,op.selbtn.type+newval);
		});
	}
	/*设置树节点的checkbox为选中状态*/
	$.fn.setNodeCheckStatus=function(nodes,newval){
			var root=this.data("root");
			if(nodes!=null) {
				nodes.each(function(){
					var box=$(this).find(">div.nodeitem>span.selbtn");
					$.webTreeUtil.updateCheckBtnStatus(box,root,false,newval);
				});
			}else{
						var box=$(this).find("div.nodeitem>span.selbtn");
					$.webTreeUtil.updateCheckBtnStatus(box,root,false,newval);
			}
			return this;
	}
	$.fn.getCheckedNodeData=function(){
		var checkedNode=$("span.selbtn[check_status='1']",$(this)).parent().parent();
		var datas=[];
		checkedNode.each(function(){
			datas.push($(this).data("node_data"));
		});
	 	return datas;
	}
	$.fn.getCheckedNode=function(){
		var checkedNode=$("span.selbtn[check_status='1']",$(this)).parent().parent();
	 	return checkedNode;
	}
	$.fn.getChildNode=function(){
		return $(this).find(">ul>li");
	}
	$.fn.loadNode=function(op,node){
		if(node==null) node=this;
		var root=$(this);
		var tm=setTimeout (function(){
			$.webTreeUtil.loadNode(root,node,op);
			tm=null;
		},50);
	}
	$.fn.expand=function(node,toExp){
		if(node==null) node=this;
		var root=this.data("root");
		$.webTreeUtil.expandNodes(node,root.options,toExp);
		return this;
	}

	$.fn.addNode=function(newNode,posNode,ischild){
		 $.webTreeUtil.addNode($(this),newNode,posNode,ischild);
		 return this;
	}
	$.fn.setOption=function(ops){
		var rd=$(this).data("root");
		var newOp=$.extend(true,rd.options,ops);
		rd.options=newOp;
	}
	$.fn.isRoot=function(){return  $(this).data("root")==null?false:true;}
	$.fn.removeNode=function(node){
		if(node==null) return ;
		var parentNode=node.parent().parent();
		var root=this.data("root");
		if(node[0]===(root.currSelected||root.rootNode)[0]) root.currSelected=null;//如果删除的节点是当前选中节点，则清空当前选中节点
		var isroot= node.data("root")==null?false:true;//删除节点是否为根节点
		if(isroot) {node.remove(); return }//如果是根节点则直接删除整个树返回
		if(parentNode.find(">ul>li").length>1) {//还有子节点的情况
			var prevNode=node.prev("li");
			node.remove();
			$.webTreeUtil.formatNode(prevNode,root);
		}else {//移除后无子节点的情况
			node.remove();
		}
		$(this).trigger('onRemoveNode',{node:node,parent:parentNode});
	}
	$.fn.getSelectedNode=function(){
		var root= $(this).data("root");
		return root?(root.currSelected||root.rootNode):null;
	}

 
	$.fn.extend({
		webTree:function(ops){
			ops = $.extend(true,{},$.webTreeUtil.defaults, ops);
			var tree=this;
			if(tree.hasClass("webtree")) return tree;//已经初始化
			tree.addClass("webtree");
			ops.root=tree;
			var root={
				rootNode:tree,
				options:ops,
				currSelected:null,
				currChecked:null
			}

			tree.data("root",root);
//			tree.attr("id",0);
///////////////////////////////////
			function toggler(node_li){//点击某个节点时执行此函数
				$.webTreeUtil.togglerNode(node_li,ops);
				if(ops.expandOne) {
					node_li.siblings(":has(>ul:not(:hidden))").each(function(){
							$.webTreeUtil.expandNode($(this),ops,false);
					});
				}
 			}
			root.rootNode.bind("click",function(e){
				var tar = $(e.target);
				if(tar.is("div.hitbtn")){
					toggler(tar.parent("li")); return false;
				}else  if(tar.is(".nodeitem")){
					toggler(tar.parent("li"));
					return false;
				}else  if(tar.is(".icondiv")&&!ops.enable_hitbtn){ //如果点击图标时，并且禁用折叠按钮，则响应折叠动作
					toggler(tar.parent().parent());
					return false;
				}

			});
///////////////////////////////////
			$.webTreeUtil.initNode(tree,root);//初始化节点
			tree.bind("onAddNode",function(e,data){ //接收节点添加事件
				var root=$(this).data("root");
//				alert(data.node.text()+",check_status="+data.parent.attr("check_status")+",tag="+data.parent.html());
				$.webTreeUtil.initNode(data.parent,root);//初始化新增加的节点（添加折叠按钮div，图标div等)
				$.webTreeUtil.formatNode(data.parent,root);//对节点格式化
				$.webTreeUtil.updateCheckBtnStatus($('>span.selbtn',data.parent),root,false);
//				alert("gengxin");
			}).bind("onRemoveNode",function(e,data){  //接收节点删除事件
				var root=$(this).data("root");
				$.webTreeUtil.formatNode(data.parent,root);
				$.webTreeUtil.updateCheckBtnStatus($('>span.selbtn',data.parent),root,false);
			});
 	  	return tree;
		}
	});
})(jQuery);
////////////////////////////////////////////////////////////////////////////////
