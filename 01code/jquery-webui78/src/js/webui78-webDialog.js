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
					opacity:0.5,//拖动、改变大小时的透明度
					minWidth:50,//最小宽度
					maxWidth:1024,
					minHeight:50,
					maxHeight:768,//最大高度
					animate:300,//动画时间，如果<1则无动画效果
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
								var picBtn=btn.webButton();//格式化按钮效果
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
