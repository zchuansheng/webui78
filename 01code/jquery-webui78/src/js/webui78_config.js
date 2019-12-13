////////////////////////////////////////////////////////////////////////////////
/*
* JQuery webui78_config.js
* Description:本文件是webui78组件的配置文件，用于在文档加载时，执行相关的全局配置
*	1.此文件必须在web-ui.js加载后加载，加载仅限于当前页面。如果要全局有效，需要在所有页面加载此文件
*	2.此文件可以放置在项目的任意目录。
* Usage: $(document).ready(function(){		$("#yourID").webButton(); });
* Depends:jquery 1.7.X
* Date: 2013-07-13 ~2016-01-19
* Author: zhangchuansheng
* Email: zchuansheng@163.com，zchuansheng@gmail.com
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/ 
$.webUtil.setting.msgboxtype=null;//若设置$.webUtil.setting.msgboxtype='custom'表示启用自定义对话框
$.webUtil.version='1.10.022';//version number
$.webUtil.setting.navTitleParamName=null;//页面标题导航传递参数的名字（面包屑导航的效果）如果不为空，则自动生成一个名为navTitleParamName的隐藏域用于将页面标题成为下一个的标题的一部分
//$.webUtil.setting.messageOnLoading="数据加载中，请等待.....";//数据加载时显示的消息信息
$.webDataGrid.defConfig.thresPage=1000;//全局设置分页阀值
$.webDataGrid.defConfig.defSizePage=20;//全局设置每页显示记录数
//表格分页配置信息
$.gridPaginate.defaults=$.extend($.gridPaginate.defaults,{
sizeofPage : 20,//默认分页大小，如果后端分页，则以后台缺省配置为准
sizesofPage : [5,10,25,50,100,500,1000],//此参数为可以选择的每页大小，设置为空，表示则前端页面不允许更改每页大小
});
//配置表单验证的正则表达式 
$.webValidator.dataType.mobile.regex="^13[0-9]{9}|15[012356789][0-9]{8}|18[01256789][0-9]{8}|147[0-9]{8}$";
//设置日历框的年数范围
$.fn.webDatepicker.defaults.downYears=20;//当前日期向前的年数
$.fn.webDatepicker.defaults.upYears=20;//当前日期向后的年数
//设置按钮是否启用图标
$.fn.PicButton.defaults.enableIcon=true;
//按钮按下时，显示凹陷的效果
$.fn.PicButton.defaults.enableActiveClass=true;
//关闭webDailog的缺省的动画效果（非缺省的不起作用）
////////////////////////////////////////////////////////////////////////////////
/*
* JQuery webui78_config.js
* Description:本文件是webui78组件的配置文件，用于在文档加载时，执行相关的全局配置
*	1.此文件必须在web-ui.js加载后加载，加载仅限于当前页面。如果要全局有效，需要在所有页面加载此文件
*	2.此文件可以放置在项目的任意目录。
* Usage: $(document).ready(function(){		$("#yourID").webButton(); });
* Depends:jquery 1.7.X
* Date: 2013-07-13 ~2016-01-19
* Author: zhangchuansheng
* Email: zchuansheng@163.com，zchuansheng@gmail.com
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/ 
$.webUtil.setting.msgboxtype=null;//若设置$.webUtil.setting.msgboxtype='custom'表示启用自定义对话框
$.webUtil.version='1.10.022';//version number
$.webUtil.setting.navTitleParamName=null;//页面标题导航传递参数的名字（面包屑导航的效果）如果不为空，则自动生成一个名为navTitleParamName的隐藏域用于将页面标题成为下一个的标题的一部分
//$.webUtil.setting.messageOnLoading="数据加载中，请等待.....";//数据加载时显示的消息信息
$.webDataGrid.defConfig.thresPage=1000;//全局设置分页阀值
$.webDataGrid.defConfig.defSizePage=20;//全局设置每页显示记录数
//表格分页配置信息
$.gridPaginate.defaults=$.extend($.gridPaginate.defaults,{
sizeofPage : 20,//默认分页大小，如果后端分页，则以后台缺省配置为准
sizesofPage : [5,10,25,50,100,500,1000],//此参数为可以选择的每页大小，设置为空，表示则前端页面不允许更改每页大小
});
//配置表单验证的正则表达式 
$.webValidator.dataType.mobile.regex="^13[0-9]{9}|15[012356789][0-9]{8}|18[01256789][0-9]{8}|147[0-9]{8}$";
//设置日历框的年数范围
$.fn.webDatepicker.defaults.downYears=20;//当前日期向前的年数
$.fn.webDatepicker.defaults.upYears=20;//当前日期向后的年数
//设置按钮是否启用图标
$.fn.PicButton.defaults.enableIcon=true;
//按钮按下时，显示凹陷的效果
$.fn.PicButton.defaults.enableActiveClass=true;
//关闭webDailog的缺省的动画效果（非缺省的不起作用）
$.webDialogUtil.defaults.animate=10;
//页面加载前等待效果
document.write("<div class='ui-mask' id='ui-mask_load' ></div><div class='ui-mask-msg' id='ui-mask-msg_load'  ><div style='z-index: 100;'>页面正在加载......</div></div>");
$(window).bind("load",function(){
$(document).unmask("load");
})
if($.browser==null) {
$.browser={};
$.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
}
if ($.browser.msie) {
window.onbeforeprint=function(){$(document).unmask("load");};
}
////在提交表单时进行全局检查session是否有效，需要提供检查的jquery对象名称
//global_saved_sessionid的名称可以自定义，必须放置本js文件可以获取的页面中保存登录时的sessionid
//例如：
$.webUtil.setting.ischecksession=false;
$.webUtil.setting.sessionidName="JSESSIONID";
$.webUtil.setting.elmentOfSesssion=$('#global_saved_sessionid', parent.document);
//配置按钮图标的显示 
$.webUtil.setting.btn_icons={
'新增':'add1',
'增加':'add1',
'插入':'add1',
'删除':'del1',
'添加':'add2',
'移除':'del2',
'编辑':'edit1',
'查询':'search',
'查看':'info',
'撤销':'cancel',
'提交':'ok',
'保存':'save1',
'选择':'browser',
'下一':'next',
'下载':'down2',
'上传':'up2',
'关闭':'close1',
'审核':'redo',
'退回':'undo',
'打印':'print',
'返回':'back',
'剪切':'cut',
'帮助':'help',
'加载':'reload',
'设置':'set',
'导出':'excel',
'汇总':'sum',
'预览':'view'};
