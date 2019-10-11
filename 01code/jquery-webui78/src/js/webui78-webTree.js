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
			name_map:{id:"id",name:"name",isleaf:"isleaf",url:"url",parent_id:"parent_id",param:"param",check_status:"check_status",whereParentId:"whereParentId"},//此参数仅用于存放默认值，初始化时设置无效
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
					var pName=root.options.name_map.whereParentId;
					if(node.isRoot()) {//如果加载的是根节点，则设置whereParentId为rootId
						//设置查询的parentId为rootId
						pName=pName||root.options.name_map.id;
						var dt={};
						dt[pName]=op.rootId||root.options.rootId||0;
						op.data=$.extend(dt,op.data||{});
					}else if(pName!=null){
						op.data[pName]=op.data[root.options.name_map.id];
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
