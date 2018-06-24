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
