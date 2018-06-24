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

