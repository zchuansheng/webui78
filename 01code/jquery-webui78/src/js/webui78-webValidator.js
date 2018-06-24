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
