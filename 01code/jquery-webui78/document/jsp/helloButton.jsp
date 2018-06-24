<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/jsp/commons/taglibs.jsp"%> 
<!DOCTYPE HTML>
<html>
<head>
<%@ include file="/jsp/commons/meta_include.jsp"%>
<script type="text/javascript">
$(document).ready(function(){
	//测试webui78的图片按钮组件如下：
	$('.btn').webButton();
});
</script>
</head>
  <body>
  <button class="btn" type="button">保存</button>&nbsp;
    <form name="form1" method="post" action="">  
    </form>
  </body>
</html> 




 
