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




