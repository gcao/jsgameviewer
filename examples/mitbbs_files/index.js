function menuclick(submenu, cell)
{
   e0 = document.getElementById(submenu);
   e1 = document.getElementById(cell);
   if(e0.style.display == 'none')
   {
	e0.style.display = 'block';
	e1.src = "/newindex/images/jian_ico.gif";
   }
   else
   {
	e0.style.display = 'none';
	e1.src = "/newindex/images/jia_ico.gif";
   }
}
	
function setTabSyn(i)
{
    selectTabSyn(i);
}
function selectTabSyn(i)
{
    for(j = 1; j <= 4; j++)
    {
	if( i == j)
	{
	    document.getElementById("bg"+j+"1").style.background='url(/newindex/yellowimages/index_r64_c7.jpg)';
	    document.getElementById("bg"+j+"2").style.background='url(/newindex/yellowimages/index_r64_c8.jpg)';
	    document.getElementById("bg"+j+"3").style.background='url(/newindex/yellowimages/index_r64_c11.jpg)';
	}
	else
	{
	    document.getElementById("bg"+j+"1").style.background="";
	    document.getElementById("bg"+j+"2").style.background="";
	    document.getElementById("bg"+j+"3").style.background="";
	}
    }
}

function cleartxt()
{
	if (document.searchform.phrase.value=="本站搜索")
		document.searchform.phrase.value="";
}

function cleartxt1()
{
	if (document.googleform.q.value=="本站搜索")
		document.googleform.q.value="";
}

function cleartxt2()
{
	if (document.searchform_brd.board.value=="版面搜索")
		document.searchform_brd.board.value="";
}

function cleartxt3()
{
	if (document.friendform.userid.value=="查寻网友")
		document.friendform.userid.value="";
}

function check_exrate()
{
   if(document.currcalc.amount.value=="")
   {
      alert("兑换数量不能为空, 请确认...");
      document.currcalc.amount.focus();
      return false;
   }
   else if(isNaN(document.currcalc.amount.value) || document.currcalc.amount.value <= 0)
   {
      alert("对不起,您输入的数值不符合要求...");
      document.currcalc.amount.value="";
      document.currcalc.amount.focus();
      return false;
   }
   if(document.currcalc.from_tkc.value=="")
   {
      alert("请选择初始货币...");
      document.currcalc.from_tkc.focus();
      return false;
   }
   if(document.currcalc.to_tkc.value=="")
   {
      alert("请选择兑换货币...");
      document.currcalc.to_tkc.focus();
      return false;
   }  
   if(document.currcalc.to_tkc.value==document.currcalc.from_tkc.value)
   {
      alert("对不起, 同一币种间不能进行兑换...");
      return false;
   }
   
   if (parseInt(document.currcalc.amount.value) > 1000000)
   {
		alert("对不起, 您的兑换数量太大(1--1000000)...");
		return false;
   }
    
   return true;
}

function CheckAll(form) 
{
  for(var i=0;i<form.elements.length;i++)
  {
    var e=form.elements[i];
    if(e.type=="checkbox")//判断对象类型是否为复选框
    {
       e.checked=true;	
    }		
  }
}
function CheckNone(form) 
{
  for(var i=0;i<form.elements.length;i++)
  {
    var e=form.elements[i];
    if(e.type=="checkbox")//判断对象类型是否为复选框
    {
	e.checked=false;
    }		
  }
}

//翻页输入框检查函数 
function checkpage()
{
    if(isNaN(document.pageform1.page.value) || parseFloat(document.pageform1.page.value)<=0 || document.pageform1.page.value.indexOf('.')!=-1)
    {
       alert("对不起,只能输入正整数!");
       document.pageform1.page.value="";
       document.pageform1.page.focus();
       return false;
    }     
    else if(isNaN(document.pageform2.page.value) || parseFloat(document.pageform2.page.value)<=0 || document.pageform2.page.value.indexOf('.')!=-1)
    {
       alert("对不起,只能输入正整数!");
       document.pageform2.page.value="";
       document.pageform2.page.focus();
       return false;
    }    
    return true;
}

function skip_invite(type)
{   
   if(parseInt(type)==1)
   {
      window.location.href='/mitbbs_friend_invite0.php';
      return;
   }
   CheckNone(document.friend);
   document.friend.submit();
}

function check_msn()
{
   var e=document.msnform.msn_account;
   if(e.value=="")
   {
      alert("MSN帐号不能为空, 请确认...");
      e.focus();
      return false;
   }
   else if(e.value.indexOf('@')==-1 || 
	e.value.indexOf('.')==-1 || 
	e.value.charAt(0)=='.' || 
	e.value.charAt(0)=='@' || 
	e.value.lastIndexOf(".")==e.value.length-1 ||
	e.value.lastIndexOf("@")==e.value.length-1)
   {
	alert("MSN帐号格式有误, 请确认...");
        e.focus();
        return false;
   }
   if(document.msnform.msn_passwd.value=="")
   {
      alert("MSN密码不能为空, 请确认...");
      document.msnform.msn_passwd.focus();
      return false;
   }
   return true;
}

//个人信息专用
function AddElement(curser, name_str)
{   
   document.getElementById(name_str+'_'+curser).style.display='block';
   document.getElementById('show_'+name_str+'_'+curser).style.display='none';
}

function DelElement(cursor, name_str)
{
   if(name_str=='company')
   {
       document.getElementsByName('company_name_'+cursor)[0].value="";
       //document.getElementsByName('description_'+cursor)[0].value="";
       document.getElementsByName('vacation_'+cursor)[0].value="";
       document.getElementsByName('posts_'+cursor)[0].value="";
       document.getElementsByName('start_year_'+cursor)[0].value="";
       document.getElementsByName('start_month_'+cursor)[0].value="";
       document.getElementsByName('leave_year_'+cursor)[0].value="";
       document.getElementsByName('leave_month_'+cursor)[0].value="";
   }
   else 
   {       
       document.getElementsByName('school_name_'+cursor)[0].value="";
       document.getElementsByName('entry_year_'+cursor)[0].value="";
       document.getElementsByName('graduate_year_'+cursor)[0].value="";
       document.getElementsByName('class_name_'+cursor)[0].value="";
       if(name_str=='univ')  
          document.getElementsByName('degree_'+cursor)[0].value="";
   }
   
   if(cursor>1 && cursor!=4 && name_str!='other')
   {
      //略过第一个大学或者高中
      document.getElementById(name_str+'_'+cursor).style.display='none';
      document.getElementById('show_'+name_str+'_'+cursor).style.display='block';
   }
  
   if(name_str=='company')
     document.occupationform.update.click();
   else
     document.educationform.update.click();   
}

function skip_to_next(cursor,user)
{
   if(++cursor==7)
   {
      document.location.href="/newindex/kjjy.php";
   }
   else
   {
      if(cursor==2 && user!="")
        document.location.href="/mitbbs_user_info"+cursor+".php?userid="+user;
      else
        document.location.href="/mitbbs_user_info"+cursor+".php";
   }
}

function check_intnum(element_name, alert_msg)
{
   if(isNaN(element_name.value) || parseFloat(element_name.value)<=0 || element_name.value.indexOf('.')!=-1)
   {
      alert(alert_msg);
      element_name.value="";
      element_name.focus();
      return false;
   }
   return true;
}

function check_null(element_name, alert_msg)
{
  if(element_name.value=="")
  {
     alert(alert_msg);
     element_name.focus();
     return false;
  }
  return true;
}

function check_email(element_name)
{
   if(element_name.value!="")
   {      
      //var rege= /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      var rege = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if(!element_name.value.match(rege))
      {
         alert("邮箱地址格式有误,请参照如下格式!\nid@mitbbs.com , cs@mitbbs.com");
         element_name.focus();
         return false;
      }
   }
   return true;
}

function check_telphone(element_name, type)
{   
   if(element_name.value!="")
   {
      var No="0123456789-+ ";
      for(i=0;i<element_name.value.length;i++)
      {
         var Checkstr=element_name.value.charAt(i);
	 if(No.indexOf(Checkstr)==-1)
	 {
	    if(parseInt(type)==1)
	       alert("传真格式不正确，请确认！");
	    else
	       alert("电话号码格式不正确，请确认！");
	    element_name.focus();
	    return false;
	 }
      }
   }
   return true;
}

function check_cellphone(element_name)
{
    if(element_name.value!="")
    {
       var No="0123456789+";
       for(i=0;i<element_name.value.length;i++)
       {
          var Checkstr=element_name.value.charAt(i);
	  if(No.indexOf(Checkstr)==-1 || element_name.value.charAt(0)==0)
	  {
	     alert("手机号码格式不正确，请确认！");
	     element_name.focus();
	     return false;
	  }
       }
    }
    return true;
}

function check_qqnum(element_name)
{
   if(element_name.value!="")
   {
      var No="0123456789";
      for(i=0;i<element_name.value.length;i++)
      {
         var Checkstr=element_name.value.charAt(i);
	 if(No.indexOf(Checkstr)==-1 || element_name.value.charAt(0)==0)
	 {
	    alert("QQ帐号为非正常帐号，请确认！");
	    element_name.focus();
	    return false;
	 }
      }
   }
   return true;
}

function check_webaddr(element_name)
{
    if(element_name.value!="")
    {
       if(element_name.value.lastIndexOf(".")==element_name.value.length-1 || element_name.value.charAt(0)=="." || element_name.value.indexOf('.')==-1)
       {
	  alert("网址格式有误,请参照如下格式!\n例如:http://news.sina.com.cn , www.126.com");
	  element_name.focus();
	  return false;
       }
    }
    return true;
}

function check_radio(element_name, msg)
{   
   var mark=0;
   for(var i=0;i<element_name.length;i++)
   {
      if(element_name[i].checked)  mark=1;
   }
   if(mark==0)
   {
     return confirm(msg);      
   }
   return true;
}

function check_form()
{
   if(!check_qqnum(document.contactform.qq) || !check_email(document.contactform.msn) || !check_email(document.contactform.yahoo) || !check_cellphone(document.contactform.cellphone) || !check_telphone(document.contactform.telephone, 0) || !check_webaddr(document.contactform.homepage))
   {     
      return false;
   }
   return true;
}

function check_uinfo_1()
{
   var maxelem=10; //设定兴趣爱好最大选项个数
   var e=document.hobbyform;
   var count=0;
   for(var i=0; i<e.elements.length; i++)
   {
      if(e.elements[i].type=='checkbox' && e.elements[i].checked==true)
         count++;
   }
   
   if(count>maxelem)
   {
      alert("兴趣爱好选项个数不能超过 "+maxelem+" 请确认...");
      return false;
   }
   return true;
}

//个人信息结束

function clear_ent_text1(address)
{
   switch(address){
       case "street":
          if(document.getElementsByName('ent_address_street')[0].value=="Street(街区)")
	  {
             document.getElementsByName('ent_address_street')[0].value="";
             document.getElementsByName('ent_address_street')[0].focus();
	  }
          break;       
       case "city":
          if(document.getElementsByName('ent_address_city')[0].value=="City(城市)")
	  {
             document.getElementsByName('ent_address_city')[0].value="";
             document.getElementsByName('ent_address_city')[0].focus();
	  }
          break;
       case "state":
          if(document.getElementsByName('ent_address_state')[0].value=="State(州/省)")
	  {
             document.getElementsByName('ent_address_state')[0].value="";
             document.getElementsByName('ent_address_state')[0].focus();
	  }
          break;
   }   
}

function check_user_id1(e)
{ 
   var regu = /^[A-Za-z]{1}[A-Za-z0-9]{2,11}$/;
   
   if(!check_null(e, "用户代号(ID)不能为空..."))
      return false;
      
   if(!regu.exec(e.value)) 
   {
      alert("非法的站内用户ID, 请确认!");
      e.value="";
      e.focus();
      return false;
   }
   return true;   
}

function check_email1(e)
{
   if(!check_null(e, "邮箱地址不能为空..."))
      return false;
      
   var rege = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
   if(!e.value.match(rege))
   {
      alert("邮箱地址格式有误,请参照如下格式!\nharry@mitbbs.com , cs@mitbbs.com");
      e.focus();
      return false;
   }
   return true;
}

function check_boardpara()
{
   var e=window.document.updatef;    
   if(isNaN(e.max_rewards.value) || parseFloat(e.max_rewards.value)< 0)
   {
      alert("您输入的数值无效, 请确认...");
      e.max_rewards.value="";
      e.max_rewards.focus();
      return false;
   }
   else if(parseFloat(e.max_rewards.value) > 5000 || parseFloat(e.max_rewards.value) < 100)
   {
      alert("版面日奖励金额数值超出规定范围...");
      e.max_rewards.focus();
      return false;
   }
   return true;
}

function noroute()
{
   window.location.href="http://www.mitbbs.cn/newindex/index.php?country=cn&r=noroute";
}

function check_info5()
{
   for(i=1; i<=7; i++)
   {
       e1=eval("document.educationform.entry_year_"+i);
       e2=eval("document.educationform.graduate_year_"+i);
       if(e1 && e2 && e1.value>e2.value)
       {
          alert("毕业年份应大于入学年份, 请确认!");
	  e2.focus();
	  return false;
       }
   }
   return true;
}

function check_info6()
{
   for(i=1; i<=3; i++)
   {
       y1=eval("document.occupationform.start_year_"+i);
       y2=eval("document.occupationform.leave_year_"+i);
       m1=eval("document.occupationform.start_month_"+i);
       m2=eval("document.occupationform.leave_month_"+i);
       v=eval("document.occupationform.vacation_"+i);
       subv=eval("document.occupationform.subvacation_"+i);
       p=eval("document.occupationform.posts_"+i);
       subp=eval("document.occupationform.subposts_"+i);
       ck=document.getElementById("showtoday"+i);
       
       if(v.value>0 && subv.value=="")
       {
           alert("请将行业信息补充完整...");
	   subv.focus();
	   return false;
       }
       
       if(p.value>0 && subp.value=="")
       {
           alert("请将职位信息补充完整...");
	   subp.focus();
	   return false;
       }
       
       if(y1 && y2 && (y1.value==y2.value && m1.value>m2.value || y1.value>y2.value) && ck.checked != true)
       {
           alert("起始时间不能大于结束时间, 请确认!");
	   m2.focus();
	   return false;
       }
   }
   return true;
}

function show_today(e)
{
    if(document.getElementById("showtoday"+e).checked == true)
    {           
	document.getElementById("tody"+e).value="";
	document.getElementById("todm"+e).value="";
	document.getElementById("today"+e).style.display="none";
	document.getElementById("todaya"+e).style.display="block";
    }
    else
    {
       	document.getElementById("today"+e).style.display="block";
	document.getElementById("todaya"+e).style.display="none";
    }
}

function addCookie(objName,objValue,objHours)
{//添加cookie
    var str = objName + "=" + escape(objValue);
    if(objHours > 0)
    {//为0时不设定过期时间，浏览器关闭时cookie自动消失
       var date = new Date();
       var ms = objHours*3600*1000;
       date.setTime(date.getTime() + ms);
       str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
}

function noalert()
{
    addCookie("popupmsg", "noalert", 0);   
    document.getElementById("msg").style.display="none";  
}

function nomsg(id)
{    
    var p=parseInt(id);
    var pars="nomsgu="+p;
    var url = "/mitbbs_user_info3.php";
    var myAjax = new Ajax.Request(url, {method: 'post',parameters: pars, onComplete: noalert, onFailure: noalert});
}

function gotoinfo()
{
    noalert();
    window.location.href="/mitbbs_user_info3.php";
}

//For userinf_education Add by Harry Zhang 2009.04.12
function showWindow(name, show, n, m)
{
  var _div=document.getElementById(name);
  if(parseInt(n)==1)
	var _f=document.getElementById('frame1');
  else
	var _f=document.getElementById('frame2');

  if(parseInt(show)==1)
  {
	_div.style.display = "block";
	_f.style.width = _div.offsetWidth;
	_f.style.height = _div.offsetHeight;
	_f.style.left = _div.offsetLeft;
	_f.style.top = _div.offsetTop;
	_f.style.zIndex = _div.style.zIndex - 1;
	_f.style.display = "block";
	document.getElementById('school_name_'+parseInt(m)).disabled=true;
  }
  else
  {
	_div.style.display = "none";
	_f.style.display = "none";
	for(var i=1; i<=5; i++)
	  if(document.getElementById('school_name_'+i).disabled==true)
	      document.getElementById('school_name_'+i).disabled=false;
  }
}

function showSchool(id,name,type)
{
  var cursor=document.educationform.cursor1.value;
  document.getElementById("school_name_"+cursor).value=name;
  document.getElementById("school_id_"+cursor).value=id;
  if(type=='univ')
  {
    document.getElementById("univlist").style.display='none';
    showWindow('univlist', 0, 1, cursor);
  }
  else if(type='hs')
  {
    document.getElementById("hschoollist").style.display='none';
    showWindow('hschoollist', 0, 0, cursor);
  }
}

function showPopUp(cursor)
{
  document.educationform.cursor1.value=cursor;
  if(cursor==4 || cursor==5)
  {
     showWindow('hschoollist', 1, 0, cursor);
     document.getElementById('hschoollist').style.display='block';
  }
  else
  {
     showWindow('univlist', 1, 1, cursor);
     document.getElementById('univlist').style.display='block';
  }
}

function adjustimg(objimg){
	if(objimg.width>gjswidth) {
		//objimg.heigth=objimg.heigth*(gjswidth/objimg.width);
		objimg.width=gjswidth;
	}
}

//设置html对象的焦点
function set_foucs(obj)
{
	if(obj.setSelectionRange)
	{
		setTimeout(function()
		{
			obj.focus();
			obj.setSelectionRange(0,0);
		},100);
	}
	else
	{
		if(obj.createTextRange){
			var range=obj.createTextRange();
			range.collapse(true);
			range.moveEnd("character",0);
			range.moveStart("character",0);
			range.select();
		}
		try{obj.focus();}catch(e){}
	}
}
//Add End

//For Ad Popup Window--added by zcf 2013.10.29
function showPopup(id_name, w, h, pos_top, pos_left, show_content_str)
{
	var popUp = document.getElementById(id_name);


	popUp.style.width = w + "px";
	popUp.style.height = h + "px";
	popUp.style.top = pos_top + "px";
	popUp.style.left = pos_left + "px";

	popUp.innerHTML = show_content_str + "<div id=\"closeico\"><a href=\"javascript:;\" class=\"closeico_a\"><img onclick=\"hidePopup('" + id_name + "')\" src=\"/mitbbs_images/stop.png\"/></a></div>";

	popUp.style.visibility = "visible";
}

function hidePopup(id_name)
{
	var popUp = document.getElementById(id_name);
	popUp.style.visibility = "hidden";
}


//end
