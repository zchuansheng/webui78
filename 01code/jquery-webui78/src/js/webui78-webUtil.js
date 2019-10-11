////////////////////////////////////////////////////////////////////////////////
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
