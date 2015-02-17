//对一篇文章进行顶踩
function reportError1(){}
function load_dingcai(pars)
{
	var url = "/mitbbs_dingcai.php";			
	var myAjax = new Ajax.Request(url, 
              {method: 'post',parameters: pars,onComplete:showdingcai,onFailure: reportError1});
}

//得到顶踩数量
function get_dingcainum(pars)
{
	var url = "/servicedata/getdingcainum.php";			
	var myAjax = new Ajax.Request(url, 
               {method: 'get',parameters: pars,onComplete:showdingcai,onFailure: reportError1});

	
}

//显示顶踩的数量
function showdingcai(response){
	var returnVal = response.responseXML;	
    
	var rootNode=returnVal.documentElement;
	
	var errorNode=rootNode.getElementsByTagName("error");
	if(errorNode.length!=0)  //有错误
	{
		if(errorNode[0].firstChild.data==2)
			alert("你还没有登录,不能对此文顶踩");
		else if(errorNode[0].firstChild.data==1)
			alert("你已对此文评价过,不能重复评价");
		return;
	}
	
	var articles=rootNode.getElementsByTagName("article");
	
	for(var i=0;i<articles.length;i++){
		
		var id=articles[i].getElementsByTagName('id')[0].firstChild.data;
		var dingnum=articles[i].getElementsByTagName('dingnum')[0].firstChild.data;
		var cainum=articles[i].getElementsByTagName('cainum')[0].firstChild.data;
		
		document.getElementById("ding_"+id).innerHTML=dingnum;
		document.getElementById("cai_"+id).innerHTML=cainum;
		
	}
}

//得到登录的一些信息,参数为回调函数
function get_allinfo(doact)
{
	var url="/servicedata/getmyinfo.php";
	var pars="";
	
	if (arguments[1])
		pars = "brdnum=" + arguments[1];

	var myAjax = new Ajax.Request(url, 
               {method: 'get', parameters: pars, onComplete:doact,onFailure: reportError1});
}

//文章页处理函数
function allinfo_response1(response)
{
	var returnVal=response.responseXML;
	var rootNode=returnVal.documentElement;
	var myinfo=rootNode.getElementsByTagName("myinfo");
	var iflogin=myinfo[0].getElementsByTagName("iflogin")[0].firstChild.data;
	var securitykey=myinfo[0].getElementsByTagName("securityKey")[0].firstChild.data;		
	show_leftnav(iflogin);	
	show_loginform(iflogin,securitykey);	
	show_onlinefriend(iflogin);
	if(iflogin==1)   //已登录
	{	var curr_userid=myinfo[0].getElementsByTagName("userid")[0].firstChild.data;
		var ifnewmail=myinfo[0].getElementsByTagName("ifnewmail")[0].firstChild.data;
		var ifnewmessage=myinfo[0].getElementsByTagName("ifnewmessage")[0].firstChild.data; 
		show_newemailmsg(ifnewmail,ifnewmessage);	
		var myboard=myinfo[0].getElementsByTagName("myboard")[0];
		show_myboard(myboard);
		show_menu_homepage(iflogin,ifnewmail,ifnewmessage);
		var ifvalidcode=myinfo[0].getElementsByTagName("ifvalidcode")[0].firstChild.data; 
		show_validcode_article(ifvalidcode);
		
		//added by zcf 2013.08.02
		var is_curr_brd_bm=myinfo[0].getElementsByTagName("iscurrbrdbm")[0].firstChild.data;
		if (is_curr_brd_bm == 1)
			show_bm_deny();
		//end

	}else{	 
		show_validcode_article(1);
	}
	
	
	var onlinenum=rootNode.getElementsByTagName("onlinenum")[0].firstChild.data;
	show_onlinenum(onlinenum);
}

//显示左上导航条
function show_leftnav(iflogin)
{
	if(iflogin==1)
		var inhtml='<a href="javascript:openChatToolWin()" >聊天</a>&nbsp;  <a href=/newindex/kjjy.php class=a2>家页</a>';
	else
		var inhtml='<a href="/newindex/index.php" class=a2>首页</a>';	
		
	if(document.getElementById("left_navigation")!=undefined)
		document.getElementById("left_navigation").innerHTML=inhtml;
}

//显示登录框
function show_loginform(iflogin,skey)
{

	var inhtml ='<table width="100%"  cellpadding="3" cellspacing="0"  bgcolor="#CCCCCC">\
				<tbody>\
					<tr bgcolor="#e6e6e6">\
						<td width="118" height="25" align="right" class="line4">帐号：</td>\
	  					<td width="" align="left" class="line5"><input name="id" size="12" type="text"></td></tr>\
					<tr bgcolor="#e6e6e6">\
						<td height="25" align="right" class="line6">密码：</td>\
					  	<td align="left" class="line7"><input name="passwd" size="12" type="password"></td>\
					</tr>\
				</tbody>\
				</table>';
   if(iflogin!=1)
   {
   	if(document.getElementById("showloginform")!=undefined)
   		document.getElementById("showloginform").innerHTML=inhtml;
	
	if(document.postform!=undefined)
		document.postform.PREUTMPKEY.value="";
	if(document.delform!=undefined)
		document.delform.PREUTMPKEY.value="";
	if(document.datt!=undefined)
		document.datt.PREUTMPKEY.value="";

   }else{
	if(document.postform!=undefined)
		document.postform.PREUTMPKEY.value=skey;
	if(document.delform!=undefined)
		document.delform.PREUTMPKEY.value=skey;
	if(document.datt!=undefined)
		document.datt.PREUTMPKEY.value=skey;
	
  }

}

//显示在线好友链接
function show_onlinefriend(iflogin)
{
	if(iflogin==1)
		inhtml='◇<a href="/mitbbs_bbsfriend.php" class="a2">在线好友</a>';
	else
		inhtml='&nbsp;';

	if(document.getElementById("onlinefriend")!=undefined)
		document.getElementById("onlinefriend").innerHTML=inhtml;
}

//显示在线人数
function show_onlinenum(num)
{
	if(document.getElementById("onlinenum")!=undefined)
		document.getElementById("onlinenum").innerHTML='◇<a href="/mitbbs_bbsuser.php" class="a2">在线['+num+']</a>';

}

//显示家页[新邮件][新短信]   顶部
function show_newemailmsg(ifnewmail,ifnewmessage)
{
			
     var inhtml='<A class="a2" href="/newindex/kjjy.php"><u>家页</u></A>';
	
	if(ifnewmail==1)
		inhtml=inhtml+'[<a href="/mitbbs_mailbox.php?option=new" class="red3">新邮件</a>]';
	if(ifnewmessage==1)
		inhtml=inhtml+'[<a href="/mitbbs_bbsmsg.php" class="red3">新短信</a>]';
	
	if(document.getElementById("shownewemailmsg")!=undefined)
		document.getElementById("shownewemailmsg").innerHTML=inhtml;
		
}

function show_bm_deny()
{
	var i, obj_deny;
	var brd_userid_str;

	for (i=1; i<=20; i++)
	{
		obj_deny = document.getElementById("bm_deny_" + i);
		if (obj_deny != undefined)
		{
			brd_userid_str = obj_deny.innerHTML;
			obj_deny.innerHTML = "<a href=\"/mitbbs_add_deny_user.php?" + brd_userid_str + "&op_flag=0\" class=\"news\">[封本文作者]</a>";
			obj_deny.style.display = "block";
		}
	}
}

//显示我的讨论区
function show_myboard(myboard)
{
	var inhtml='<select onchange="top.location.replace(this.value)"><option selected>我的讨论区</option>';
	var boards=myboard.getElementsByTagName("board");
	var i=0;
	
	for(i=0;i<boards.length;i++)
	{
		var brd_link, is_board;

		is_board = boards[i].getElementsByTagName('isboard')[0].firstChild.data;
		if (is_board == 'Y') //board
			brd_link="/bbsdoc/"+boards[i].getElementsByTagName('boardname')[0].firstChild.data+".html";
		else if (is_board == 'C') //club
			brd_link="/club_bbsdoc/"+boards[i].getElementsByTagName('boardname')[0].firstChild.data+".html";

		inhtml=inhtml+'<option value="'+brd_link+'">'+boards[i].getElementsByTagName('desc')[0].firstChild.data+'</option>';
	}
	inhtml=inhtml+'</select>';
	if(document.getElementById("showmyboard")!=undefined)
		document.getElementById("showmyboard").innerHTML=inhtml;
	
}

function show_menu_homepage(iflogin,ifnewmail,ifnewmessage)
{
	if(document.getElementById("menu_homepage")==undefined||iflogin==0)  //没有定义,或没登录
	{
		
		return;
	}
	var height=document.forms['menu_form'].menu_height.value;
	var width_spa1=document.forms['menu_form'].menu_width_spa1.value;
	var width_l=document.forms['menu_form'].menu_width_l.value;
	var is_pic=document.forms['menu_form'].menu_is_pic.value;
	var width_c=document.forms['menu_form'].menu_width_c.value;
	var width_spa2=document.forms['menu_form'].menu_width_spa2.value;
	var width_r=document.forms['menu_form'].menu_width_r.value;
	
	var inhtml='<table width="100%"  border="0" align="center" cellpadding="0" cellspacing="0"><tr>';
     
    if(width_spa1>0)
     	inhtml=inhtml+'<td width="'+width_spa1+'%">&nbsp;</td>';
       		
     inhtml=inhtml+'<td width="'+width_l+'%" align="center">&nbsp;</td>';
	     		
	 if(is_pic!=0)
	  {
	      inhtml=inhtml+'<td width="'+width_c+'%" align="right"><img src="/newindex/images/jy_ico.gif" width="20" height="19"></td>';
	  } 
	  if(width_spa2>0)
     	inhtml=inhtml+'<td width="'+width_spa2+'%">&nbsp;</td>';       		
	        
      inhtml=inhtml+'<td width='+width_r+'%" valign="bottom"><a href="/newindex/kjjy.php" class="a2"><strong>家页</strong></a>';

				
		if(ifnewmail==1)
		  inhtml=inhtml+'[<a href="/mitbbs_mailbox.php?option=new" class="red3">新邮件</a>]';
						
		if(ifnewmessage==1)
		  inhtml=inhtml+'[<a href="/mitbbs_bbsmsg.php" class="red3">新短信</a>]';
				

		inhtml=inhtml+'</td></tr></table>';

	document.getElementById("menu_homepage").parentNode.height=height;
	document.getElementById("menu_homepage").innerHTML=inhtml;
}




 //以下为新闻页用到
 function getnews(type,boardname)
 {	
 	var pars;
 	if(type==1)
 	{pars="type=1";
 	}else if(type==2)
 	{pars="type=2&boardname="+boardname;
 	}
 	var url="/servicedata/fornews.php";	
	var myAjax = new Ajax.Request(url, 
               {method: 'get',parameters: pars,onComplete:showfornews,onFailure: news_reportError});
 
 }
 
 function showfornews(response)
 {
 	 var returnVal=response.responseXML;
	var rootNode=returnVal.documentElement;
	var myinfo=rootNode.getElementsByTagName("myinfo");
	var iflogin=myinfo[0].getElementsByTagName("iflogin")[0].firstChild.data;
	var securitykey=myinfo[0].getElementsByTagName("securityKey")[0].firstChild.data;
	
	news_show_home(iflogin);
	
	 if(document.getElementById("othernews5_5")!=undefined)
	 {
	 var leftarticle=rootNode.getElementsByTagName("leftarticle")[0];
	 var rightarticle=rootNode.getElementsByTagName("rightarticle")[0];
	 news_showothernews5_5(leftarticle,rightarticle);
	 }
	
	if(document.getElementById("showlogin")!=undefined)
	{
		news_show_login(iflogin,securitykey);		
	}
	
	if(iflogin==1){
		var ifvalidcode=myinfo[0].getElementsByTagName("ifvalidcode")[0].firstChild.data; 
		show_validcode_article(ifvalidcode);	
	}else{
		show_validcode_article(1);
	}

	var nowtime=rootNode.getElementsByTagName("nowtime")[0];
	news_show_time(nowtime);
	var onlinenum=rootNode.getElementsByTagName("onlinenum")[0].firstChild.data;
	news_show_onlinenum(onlinenum);
 
 }
 
 function news_show_home(iflogin)
 {
 	var inhtml;
 	if(iflogin==1)
 	 inhtml='<A class="headlink" href="/newindex/kjjy.php">家页</A>';
 	else
 	 inhtml='<A class="headlink" href="/newindex/index.php">首页</A>';
 	 
 	document.getElementById("showhome").innerHTML=inhtml;
 }
 
 function news_show_onlinenum(onlinenum)
 {
 	document.getElementById("onlinenum").innerHTML="["+onlinenum+"]";
 }
 
 function news_reportError()
 {}
 
 function news_show_time(time)
 {
 	var mdtime=time.getElementsByTagName("mdtime")[0].firstChild.data;
 	var bjtime=time.getElementsByTagName("bjtime")[0].firstChild.data;
 	document.getElementById("mdtime").innerHTML=mdtime;
 	document.getElementById("bjtime").innerHTML=bjtime;
 }
function news_show_login(iflogin,skey)	
{
	var inhtml='<table  width="100%"  border="0" cellspacing="0" cellpadding="2">\
					<tbody>\
						<tr>\
							<td width="9%" align="right">帐号:</td>\
							<td width="91%"><input name="id" class="kuang_green" size="13" type="text"></td>\
						</tr>\
						<tr>\
							<td width="9%" align="right">密码:</td>\
							<td width="91%"><input name="passwd" class="kuang_green" size="13" type="password"></td>\
						<input  type="hidden" name="kick_multi" value="1" >\
						</tr></tbody></table>';
   		
	if(iflogin!=1)
	{
		if(document.getElementById("showlogin")!=undefined)
			document.getElementById("showlogin").innerHTML=inhtml;
		
		if(document.postform!=undefined)
			document.postform.PREUTMPKEY.value="";
		if(document.delform!=undefined)
			document.delform.PREUTMPKEY.value="";
	
	}else{
		if(document.postform!=undefined)
			document.postform.PREUTMPKEY.value=skey;
		if(document.delform!=undefined)
			document.delform.PREUTMPKEY.value=skey;
		
	}	
		
}


function news_showothernews5_5(leftarticle,rightarticle)
{	
	
	var leftnum=leftarticle.getElementsByTagName("num")[0].firstChild.data;
	var rightnum=rightarticle.getElementsByTagName("num")[0].firstChild.data;
	var inhtml='<table width=100% border=0>';
		
	if(leftnum>0)
	{
		var left_articles=leftarticle.getElementsByTagName("articles")[0];
	}
	if(rightnum>0)
	{
		var right_articles=rightarticle.getElementsByTagName("articles")[0];
	}

	var i=0;
	for(i=0;i<5;i++)
	{
		inhtml=inhtml+'<tr>';
		if(i+1<=leftnum)
		{	
			var tmp_title=left_articles.getElementsByTagName("article")[i].getElementsByTagName("title")[0].firstChild.data;
			var tmp_board=left_articles.getElementsByTagName("article")[i].getElementsByTagName("board")[0].firstChild.data;
			var tmp_articleid=left_articles.getElementsByTagName("article")[i].getElementsByTagName("articleid")[0].firstChild.data;
			inhtml=inhtml+'<td align="center" height="19" width="3%"><img src="/news/images/new_ico.jpg" height="6" width="6"></td><td align="left" height="19" width="47%">';
			inhtml=inhtml+'<a href="/news_wenzhang/'+tmp_board+'/'+tmp_articleid+'.html" class="a2">'+tmp_title+'</a></td>';
		}else
		{
			inhtml=inhtml+'<td colspan="2">&nbsp;</td>';
		}
		
		if(i+1<=rightnum)
		{	
			var tmp_title=right_articles.getElementsByTagName("article")[i].getElementsByTagName("title")[0].firstChild.data;
			var tmp_board=right_articles.getElementsByTagName("article")[i].getElementsByTagName("board")[0].firstChild.data;
			var tmp_articleid=right_articles.getElementsByTagName("article")[i].getElementsByTagName("articleid")[0].firstChild.data;
			
			inhtml=inhtml+'<td align="center" height="19" width="3%"><img src="/news/images/new_ico.jpg" height="6" width="6"></td><td align="left" height="19" width="47%">';
			inhtml=inhtml+'<a href="/news_wenzhang/'+tmp_board+'/'+tmp_articleid+'.html" class="a2">'+tmp_title+'</a></td>';
		}else
		{
			inhtml=inhtml+'<td colspan="2">&nbsp;</td>';
		}
		
	
		inhtml=inhtml+'</tr>';
	}
	inhtml=inhtml+'</table>';
	
	
	document.getElementById("othernews5_5").innerHTML=inhtml;

}

function show_ad_func(bid,flag)
{
   var url = "/servicedata/get_ad.php";
   var pars = "bid="+parseInt(bid)+"&flag="+parseInt(flag);
   if(parseInt(flag) == 2)
      var myAjax = new Ajax.Request(url, {method: 'get',parameters: pars,onComplete:showad2,onFailure: reportError1});
   else if(parseInt(flag) == 1)
      var myAjax = new Ajax.Request(url, {method: 'get',parameters: pars,onComplete:showad1,onFailure: reportError1});
   else
      var myAjax = new Ajax.Request(url, {method: 'get',parameters: pars,onComplete:showad,onFailure: reportError1});
}

function showad(response)
{
    var rootNode=response.responseXML.documentElement;          
    var all_boards_right_1 = rootNode.getElementsByTagName('all_boards_right_1')[0].firstChild.data;
	var all_boards_right_2 = rootNode.getElementsByTagName('all_boards_right_2')[0].firstChild.data;

    document.getElementById("all_boards_right_1").innerHTML = all_boards_right_1;
	document.getElementById("all_boards_right_2").innerHTML = all_boards_right_2;
}

function showad1(response)
{
    var rootNode=response.responseXML.documentElement;
    
    //var all_boards_thread_=rootNode.getElementsByTagName('all_boards_thread_')[0].firstChild.data;
    var b_and_a_pic_banner_right_=rootNode.getElementsByTagName('b_and_a_pic_banner_right_')[0].firstChild.data;
    var article_title_left_=rootNode.getElementsByTagName('article_title_left_')[0].firstChild.data; 
    var article_t_embed_text_=rootNode.getElementsByTagName('article_t_embed_text_')[0].firstChild.data;
	var article_t_embed_pic_=rootNode.getElementsByTagName('article_t_embed_pic_')[0].firstChild.data;
    var all_boards_right_1 = rootNode.getElementsByTagName('all_boards_right_1')[0].firstChild.data;
	var all_boards_right_2 = rootNode.getElementsByTagName('all_boards_right_2')[0].firstChild.data;
	var all_boards_thread_below_ = rootNode.getElementsByTagName('all_boards_thread_below_')[0].firstChild.data;

    //document.getElementById("all_boards_thread_").innerHTML=all_boards_thread_;
    document.getElementById("b_and_a_pic_banner_right_").innerHTML=b_and_a_pic_banner_right_;
    document.getElementById("article_title_left_").innerHTML=article_title_left_;
    document.getElementById("article_t_embed_text_").innerHTML=article_t_embed_text_;
	document.getElementById("article_t_embed_pic_").innerHTML=article_t_embed_pic_;
    document.getElementById("all_boards_right_1").innerHTML = all_boards_right_1;
	document.getElementById("all_boards_right_2").innerHTML = all_boards_right_2;
	document.getElementById("all_boards_thread_below_").innerHTML = all_boards_thread_below_;
}

function showad2(response)
{
    var rootNode=response.responseXML.documentElement;
    
    var news_wenzhang_banner_=rootNode.getElementsByTagName('news_wenzhang_banner_')[0].firstChild.data;
    //var news_article_embed_=rootNode.getElementsByTagName('news_article_embed_')[0].firstChild.data;
    var news_article_bottom_=rootNode.getElementsByTagName('news_article_bottom_')[0].firstChild.data;

    //detele by baibing at 20140514 for detele news_article_top_
//	var news_article_top_=rootNode.getElementsByTagName('news_article_top_')[0].firstChild.data;
    //end detele by baibing at 20140514 for detele news_article_top_

    var all_boards_right_1 = rootNode.getElementsByTagName('all_boards_right_1')[0].firstChild.data;
	var all_boards_right_2 = rootNode.getElementsByTagName('all_boards_right_2')[0].firstChild.data;

    document.getElementById("news_wenzhang_banner_").innerHTML=news_wenzhang_banner_;
    //document.getElementById("news_article_embed_").innerHTML=news_article_embed_;
    document.getElementById("news_article_bottom_").innerHTML=news_article_bottom_;

    //detele by baibing at 20140514 for detele news_article_top_
//	document.getElementById("news_article_top_").innerHTML=news_article_top_;
    //end detele by baibing at 20140514 for detele news_article_top_
    
    document.getElementById("all_boards_right_1").innerHTML = all_boards_right_1;
	document.getElementById("all_boards_right_2").innerHTML = all_boards_right_2;
}

//For users' Education info Add by Harry Zhang 2009.04.12
//Show Countrys' Provinces
function changeCountry(cid)
{
    if(parseInt(cid) <= 0)
    {
        document.getElementById("popup-province").innerHTML='';
	document.getElementById("popup-unis").innerHTML='<li><a href="javascript:void(0)" onclick=showSchool(0,"其他(Other)","univ")>其他(Other)</a></li>';
    }
    else
    {
        var url="/servicedata/get_school.php";
        var pars="cid="+parseInt(cid);
        var myAjax = new Ajax.Request(url, {method: 'get',parameters: pars,onComplete:showProvince,onFailure: reportError1});
    }
}

//Show Provinces' County or District
function changeProvince(pid)
{
    if(parseInt(pid) <= 0)
    {
	document.getElementById("popup-province-hs").innerHTML='';
	document.getElementById("popup-unis-hs").innerHTML='<li><a href="javascript:void(0)" onclick=showSchool(0,"其他","hs")>其他</a></li>';
    }
    else
    {
        var url="/servicedata/get_school.php";
        var pars="pid="+pid;
        var myAjax = new Ajax.Request(url, {method: 'get',parameters: pars,onComplete:showCounty,onFailure: reportError1});
    }
}

//Show University of Province in China
function changeUnivs(uid)
{
    if(parseInt(uid) <= 0)
    {
        document.getElementById("popup-unis").innerHTML='<li><a href="javascript:void(0)" onclick=showSchool(0,"其他(Other)","univ")>其他(Other)</a></li>'; 
    }
    else
    { 
        var url="/servicedata/get_school.php";
        var pars="uid="+parseInt(uid);
        var myAjax = new Ajax.Request(url, {method: 'get',parameters: pars,onComplete:showUniversity,onFailure: reportError1});
    }
}

//Show HighSchools of County or District
function changeHschs(did)
{
    if(parseInt(did) <= 0)
    {
        document.getElementById("popup-unis-hs").innerHTML='<li><a href="javascript:void(0)" onclick=showSchool(0,"其他","hs")>其他</a></li>'; 
    }
    else
    { 
        var url="/servicedata/get_school.php";
       var pars="did="+parseInt(did);
       var myAjax = new Ajax.Request(url, {method: 'get',parameters: pars,onComplete:showHighSchool,onFailure: reportError1});
    }
}

//Show Province List in Page
function showProvince(response)
{
    var rootNode=response.responseXML.documentElement;
    var province_list_=rootNode.getElementsByTagName('province_list_')[0].firstChild.data;
    var unis_list_=rootNode.getElementsByTagName('univ_list_')[0].firstChild.data;
    document.getElementById("popup-province").innerHTML=province_list_;
    document.getElementById("popup-unis").innerHTML=unis_list_;
}

//Show County in Page
function showCounty(response)
{
    var rootNode=response.responseXML.documentElement;
    var province_county_=rootNode.getElementsByTagName('county_list_')[0].firstChild.data;
    document.getElementById("popup-province-hs").innerHTML=province_county_;
    document.getElementById("popup-unis-hs").innerHTML="";
}

//Show University in Page
function showUniversity(response)
{    
    var rootNode=response.responseXML.documentElement;
    var university_list_=rootNode.getElementsByTagName('univ_list_')[0].firstChild.data;
    document.getElementById("popup-unis").innerHTML=university_list_;
}

//Show HighSchool in Page
function showHighSchool(response)
{
    var rootNode=response.responseXML.documentElement;
    var high_school_list_=rootNode.getElementsByTagName('uni_hs_list_')[0].firstChild.data;
    document.getElementById("popup-unis-hs").innerHTML=high_school_list_;
}
//Add End
//帐号邮箱检查
function chkValid(e,type)
{
    
    if(e=="")
    {
	alert("此项不能为空，请认真填写...");
	return;
    }
    else
    {   if(parseInt(type) == 1)
	{
	   var rege = /^(?:\w+\.?)*\w+@(?:\w+\.?)*\w+$/;
	   //var rege = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
	   if(!e.match(rege))
           {
               alert("邮箱地址格式有误,请参照如下格式!\nid@mitbbs.com , cs@mitbbs.com");
               return;
           } 
	}
	else
	{
	   var regu = /^[A-Za-z]{1}[A-Za-z0-9]{2,11}$/;
	   if(!regu.exec(e)) 
   	   {
               alert("帐号必须由英文字母或数字组成，并且第一个字符必须是英文字母,数字必须置后!");
               return;
   	   }
	}
    }
    var url = "/servicedata/check_valid.php";
    var pars;
    if(parseInt(type) == 1)
	pars="e="+e;
    else
	pars="u="+e;
    var myAjax = new Ajax.Request(url, {method: 'get',parameters: pars,onComplete:showValidAlert,onFailure: reportError1});
}

function showValidAlert(response)
{
    var rootNode=response.responseXML.documentElement;
    var valid_info_=rootNode.getElementsByTagName('valid_info_')[0].firstChild.data;
    document.getElementById("chkinfo").innerHTML=valid_info_;
    document.getElementById("chkinfo").style.display="block";
} 


//	 广告统计
//	ad_id 广告Id
//	staticType 广告类型，统计类型  1：显示  2:点击
//
function staticAd(ad_id,staticType)
{

  if(parseInt(ad_id) <= 0||staticType<1||staticType>2)
    {
       return;
    }
    else
    {
        var url="/servicedata/static_ad.php";
        var pars="ad_id="+parseInt(ad_id)+"&staticType="+parseInt(staticType);	
        var myAjax = new Ajax.Request(url, {method: 'get',parameters: pars});
    }
}

function add_messageboard()
{	
	pars="userid="+document.messgeboard_form.userid.value+
		"&frompage="+document.messgeboard_form.frompage.value+"&act=add"+"&submit_add=留言"+"&content="+encodeURIComponent(document.messgeboard_form.content.value)+"&PREUTMPKEY="+document.messgeboard_form.PREUTMPKEY.value;
	if(document.messgeboard_form.validcode!=undefined)
	{
		pars=pars+"&validcode="+document.messgeboard_form.validcode.value;
	}
	document.getElementById("show_status").innerHTML="正在提交留言内容...";
	var url = "/mitbbs_message_board.php";			
	var myAjax = new Ajax.Request(url, 
              {method: 'post',parameters: pars,onComplete:show_messageboard,onFailure: reportError1});
	
}

//得到留言板内容
function get_messageboard(pars)
{	
	document.getElementById("show_status").innerHTML="正在加载留言内容...";
	var url = "/servicedata/message_board.php";			
	var myAjax = new Ajax.Request(url, 
               {method: 'get',parameters: pars,onComplete:show_messageboard,onFailure: reportError1});
}

//删除留言板内容
function del_messageboard(pars)
{
	if(!confirm("确定删除此留言吗?"))
		return false;

	document.getElementById("show_status").innerHTML="正在删除留言...";
	var url = "/mitbbs_message_board.php";			
	var myAjax = new Ajax.Request(url, 
              {method: 'post',parameters: pars,onComplete:show_messageboard,onFailure: reportError1});
	return true;
}

function show_messageboard(request)
{	 
	if(request.responseText.length==2||request.responseText.length==3)
	{
		if(request.responseText=="-1")
			document.getElementById("show_status").innerHTML="你还没有登录，请先<a href='/mitbbs_login.php' class=news>登录</a>..";
		else if(request.responseText=="-4")
			document.getElementById("show_status").innerHTML="对不起，不可以给自己留言..";
		else if(request.responseText=="-6")
			document.getElementById("show_status").innerHTML="留言内容不能为空..";
		else if(request.responseText=="-11")
			document.getElementById("show_status").innerHTML="验证码输入错误..";
		else if(request.responseText=="-12")
			document.getElementById("show_status").innerHTML="你在对方黑名单里，不能给对方留言..";
		else
			document.getElementById("show_status").innerHTML="留言出错..";		
	}else if(request.responseText.length==0||request.responseText.length==4)
	{
		document.getElementById("show_status").innerHTML="留言加载错误..";
	}else
	{
		if(document.getElementById('validimg')!=undefined)
		{
			document.getElementById('validimg').src='/img_rand/img_rand.php?a='+Date()+Math.random();
			document.messgeboard_form.validcode.value="";
		}
		document.getElementById("show_status").innerHTML="";
		document.getElementById("message_board").innerHTML=request.responseText;
		document.messgeboard_form.content.value="";
	}	
}

function show_menu_sub()
{
    if(document.getElementById('topmenu0').style.display == 'none')
    {
        var url = '/servicedata/get_menu_sub.php';
        var pars = '';
        var myAjax = new Ajax.Request(url,{method: 'get',parameters: pars,onComplete:show_menu_list,onFailure: reportError});	
    }
    menuclick('topmenu0','top0');
}

function show_menu_list(response)
{
    var returnVal = response.responseText;
    document.getElementById("topmenu0").innerHTML=returnVal;
}

function show_selected_block(offset)
{
    if(document.getElementById("mark").value != offset)
    {
	var url = '/servicedata/get_selected_block.php';
        var pars = 'offset='+parseInt(offset);
        var myAjax = new Ajax.Request(url,{method: 'get',parameters: pars,onComplete:show_block_content,onFailure: reportError});
	setTabSyn(offset);
        document.getElementById("mark").value=offset;
    }
}

function show_block_content(response)
{
    var returnVal = response.responseText;
    document.getElementById("blockcontent").innerHTML=returnVal;
}

function show_validcode_article(ifvalidcode)
{
	var inhtml='验证码：<input type="text" name="validcode" size="10" maxlength="8">&nbsp;<br><img src="/img_rand/img_rand.php" width="200" height="80" border="0" id="validimg">&nbsp;&nbsp;<a href="javascript:void(0)" onclick="document.getElementById(\'validimg\').src=\'/img_rand/img_rand.php?a=\'+Date()+Math.random();return false;">[刷新]</a>(请输入验证码，看不清请刷新)';
   		
	if(ifvalidcode==1)
	{
		if(document.getElementById("validcode_span")!=undefined)
			document.getElementById("validcode_span").innerHTML=inhtml;
	}	
}

//显示弹出广告窗口--added by zcf 2013.10.30
function show_popup_ad()
{
	var url="/servicedata/popup_ad.php";
	var pars="";
	

	var myAjax = new Ajax.Request(url, 
               {method: 'get', parameters: pars, onComplete:popup_ad_handler,onFailure: reportError1});
}

function popup_ad_handler(response)
{
	var rootNode = response.responseXML.documentElement;
	var browse_flag = parseInt(rootNode.getElementsByTagName('browse_flag')[0].firstChild.data);


	if (browse_flag == 0)
	{
		var get_screen_width=screen.width;
		var ad_width=600;
		var ad_height=250;
		var ad_pos_top=205;

		//判断是否为 iphone/ipad/ipod ?
		if ((navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1))
			get_screen_width = screen.height;

		var ad_pos_left=parseInt((get_screen_width - 600)/2);
		var ad_content_str="<a href=\"http://www.dealmoon.com/mitblackfriday\" target=\"_blank\"><img src=\"/ad_file/popup_ad_1125.gif\" width=600 height=250></a>";
	
		showPopup("popupcontent", ad_width, ad_height, ad_pos_top, ad_pos_left, ad_content_str);
		setTimeout("hidePopup(\"popupcontent\")", 15000);
	}
}
//end

//验证weclbu用户是否存在--added by zcf 2013.12.06
function is_user_exist_weclub(pars)
{
	//使用 jquery 的JSONP 实现 ajax 跨域操作
	$.ajax({
			url: 'http://weclub.cc/club/weclub.php/user/isUserExist?' + pars,
			dataType: "jsonp",
			jsonp: "jsonpcallback",
			success: function (data) {
				is_user_exist_weclub_handler(data, pars);
			},
            error:function(XMLHttpRequest, textStatus, errorThrown){
                $("#item_dian_img").remove();
                $("#weclub_msg").remove();
            }
         });
}

function is_user_exist_weclub_handler(data, pars)
{
	var ins_str;

	//weclub存在此用户?
	if (parseInt(data.result) != 1)
	{
		//move <td>
		$("#item_dian_img").remove();
		$("#weclub_msg").remove();
	}
}
//end

//在版面/俱乐部显示weclub的二维码--added by zcf 2013.12.09
function get_weclub_erweima_boardorclub(brdorclub_name)
{
	//使用 jquery 的JSONP 实现 ajax 跨域操作
	$.ajax({
			url: 'http://weclub.cc/club/weclub.php/club/isClubExist?clubname=' + brdorclub_name,
			dataType: "jsonp",
			jsonp: "jsonpcallback",
			success: function (data) {
				get_weclub_erweima_boardorclub_handler(data, brdorclub_name);
			}
         });
}

function get_weclub_erweima_boardorclub_handler(data, brdorclub_name)
{
	//版面或者俱乐部存在?
	if (parseInt(data.result) == 1)
	{
		ins_str = '<img src="http://weclub.cc/club/weclub.php/mitbbs/qrcode/?id=' + brdorclub_name + '&type=1" width="110" border=0>';
		document.getElementById("weclub_erweima").innerHTML = ins_str;
	}
}
//end

//在个人信息页显示weclub的二维码--added by zcf 2013.12.09
function get_weclub_erweima_userinfo(user_name)
{
	//使用 jquery 的JSONP 实现 ajax 跨域操作
	$.ajax({
			url: 'http://weclub.cc/club/weclub.php/user/isUserExist?username=' + user_name,
			dataType: "jsonp",
			jsonp: "jsonpcallback",
			success: function (data) {
				get_weclub_erweima_userinfo_handler(data, user_name);
			}
         });
}

function get_weclub_erweima_userinfo_handler(data, user_name)
{
	//版面或者俱乐部存在?
	if (parseInt(data.result) == 1)
	{
		ins_str = '<img src="http://weclub.cc/club/weclub.php/mitbbs/qrcode/?id=' + user_name + '&type=2" width="110" border=0>';
		document.getElementById("weclub_erweima").innerHTML = ins_str;
	}
}
//end

