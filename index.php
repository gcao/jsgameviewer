<?php 
$name = "���ߴ��׳���";
$version = "1.0a";
$longName = $name . $version;
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<link rel="stylesheet" href="/jsgameviewer/view/default.css"/>
<!-- <script language="JavaScript" type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js"></script> -->
<script language="JavaScript" type="text/javascript" src="/jsgameviewer/php/main.php"></script>
<title><?php echo $longName?></title>
<style type="text/css">
<!--
body {
	margin-left: 2px;
	margin-top: 2px;
}
.style1 {
	font-size: xx-large;
	font-weight: bold;
}
.style3 {
	font-size: x-large;
	font-weight: bold;
}
.style4 {
	font-size: large
}
.style5 {
	font-size: large;
	font-weight: bold;
}
-->
</style>
</head>
<body>
<p align="center"><span class="style1"><?php echo $longName?></span></p>
<p class="style3">���</p>
<p><?php echo $name?>��һ��������һ����ά�����������ߴ��׳��򡣸ó���ͬʱ֧��Χ���<a href="http://www.daoqigame.com/">����</a>���������ۣ�������㡣�ó�����ȫ��ѣ��޲�����ľ���û����谲װ�κβ������Χ�岩�ͻ���̳��������׳���</p>
<p class="style3"><a href="http://www.daoqigame.com/wiki-1.7.1/index.php?title=Jsgameviewer">�����˵��</a></p>
<p align="left" class="style3">��Ҫ����</p>
<ul>
	<li>֧��Χ�壬<a href="http://www.daoqigame.com">����</a>��</li>
	<li>֧�ּ��̺���������</li>
	<li>�������������ϵ������ļ���</li>
	<li>���£��仯ͼ�����</li>
	<li>...</li>
</ul>
<p align="left" class="style3">ʹ��˵��</p>
<p align="left" class="style5">������</p>
<p align="left" class="style5">���̲���</p>
<p align="left" class="style3">��ҳ����</p>
<?php 
$container = "gvcontainer1";
$scripts = array(
//	"new GameController().show();",
//	"new GameController().setGameType(DAOQI).load('/jsgameviewer/games/testmarks.sgf');",
	"new GameController().load('/jsgameviewer/games/danghu10.sgf');",
//	"new GameController().load('/jsgameviewer/php/proxy.php?charset=gb2312&url=http://weiqi.spbrts.tom.com/qipu/200712/20cn-ming-f-3sgf.htm').setObserverInterval(20).startUpdater().saveSession('/jsgameviewer/index.php',10);",
//	"new GameController().createDGSPlayer().setUsername('appoolloo').loadDGSGame(388918).setPlayerInterval(8).startUpdater();"
);
foreach($scripts as $script){
?>
<pre>
&lt;script language='JavaScript'&gt;<?php echo $script; ?>&lt;/script&gt;
</pre>
<div id="<?php echo $container;?>">
<script language='JavaScript'><?php echo $script; ?></script>
</div>
<?php } ?>
<p align="left">&nbsp;</p>
<p class="style3">��л</p>
<p align="left"><a href="http://www.jquery.orgt">jQuery</a>����С�������ֹ���ȫ���JavaScript����⡣<br>
	<a href="http://jquery.com/demo/thickbox/">ThickBox</a>: jQuery�����<br>
	<a href="http://rakaz.nl/">Niels Leenheer</a>��רҵͼ�κ���ҳ���Ա�������׳������������JavaScriptѹ�����롣<br>
	<a href="http://www.troywolf.com/articles">Troy Wolf</a>��class_php �� proxy.php
	������<br>
	<a href="http://www.getfirebug.com/">Firebug/Firebug Lite</a>����ҳ���Թ���<br>
	<a href="http://qgo.sourceforge.net/">qGo</a>�����Χ����ĺʹ��׳��򡣱����׳������������SGF���ʹ��롣<br>
</p>
</body>
</html>
