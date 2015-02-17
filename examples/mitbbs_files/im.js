/**
	获取好友列表,这里只是针对原有系统的好友,不包括圈子等
*/
function getFriendsList()
{
	var url = 'http://localhost/im/clienttest.php';
	var pars = 'someParameter=ABC';
	var myAjax = new Ajax.Request(url, 
               {method: 'get',parameters: pars,onComplete:updates,onFailure: reportError}
                    );
}

function inviteChat(userid,friendId){	
	
	
     //验证对方是不是已经存在聊天列表中
     	if (userid==friendId){
		alert(" 别开玩笑了,您怎么能跟自己聊天呢?想自言自语啊!");
		return;
	}
	if (inChatList(friendId)){
		alert("您已经在与"+friendId+"聊天,不能再次发送聊天请求");
		return;
	}
	
	var url = '/im/im_client.php';
	var pars = 'serviceType=inviteChat&inviteUser='+userid+'&receiver='+friendId;
	
	var myAjax = new Ajax.Request(url, 
               {method: 'get',parameters: pars,onComplete:inviteChatComplete,onFailure: reportError}
 );
}

function inviteChatComplete(response)
{
   var returnVal = response.responseText;
   if(-1==returnVal||"-1"==returnVal){
		alert("对不起,您没有登录或长时间休眠,不能聊天. 请重新登录");
		return;
	}

   if(0==returnVal||"0"==returnVal){
		alert("对不起,对方没有在线,您不能与其聊天");
		return;
	}
   if(-2==returnVal||"-2"==returnVal){
		alert("对不起,对方尚未处理您先前的聊天请求,您不能再次邀请其单独聊天");
		return;
	}
		
	var spliterPos = returnVal.indexOf (":");	
	var roomId=returnVal.substring(0,spliterPos);
	var invitedUserId=returnVal.substring(spliterPos+1);
    	openChatWin(roomId,invitedUserId);
} 

function inviteJoinChat(userid,friendId,roomId){	
	
	var url = '/im/im_client.php';
	var pars = 'serviceType=inviteJoinChat&inviteUser='+userid+'&receiver='+friendId+"&roomId="+roomId;
	var myAjax = new Ajax.Request(url, 
               {method: 'get',parameters: pars,onComplete:inviteJoinChatCoplete,onFailure: reportError}
 );
	
}

function inviteJoinChatCoplete(response)
{   	
   var returnVal = response.responseText;
   if	(-1==returnVal||"-1"==returnVal){
		alert("对不起,您没有登录或长时间休眠,不能聊天. 请重新登录");
		return;
	}

   if	(0==returnVal||"0"==returnVal){
		alert("对不起,对方没有在线,您不能与其聊天");
		return;
	}
}

function getMsg(userid,chatRoomId){	
		
	var url = '/im/im_client.php';
	var pars = 'serviceType=getMsg&userId='+userid+'&roomId='+chatRoomId;	
	var myAjax = new Ajax.Request(url, 
               {method: 'get',parameters: pars,asynchronous:true,onComplete:getMsgComplete,onFailure: reportError}
 );
}

function getMsgComplete(response)
{
   var returnVal = response.responseText;

   if	(-1==returnVal||"-1"==returnVal){
		//可以干脆什么也不做
		//alert("对不起,您没有登录或长时间休眠,不能聊天. 请重新登录");
		return;
    }
    document.getElementById("chatList").innerHTML=document.getElementById("chatList").innerHTML + decodeURIComponent(returnVal);
    document.getElementById("chatList").scrollTop=document.getElementById("chatList").scrollHeight+200;
}
function getAllFriends(userId){
	var url = '/im/im_client.php';
	var pars = 'serviceType=getFriendList&userId='+userId;	
	var myAjax = new Ajax.Request(url, 
               {method: 'get',parameters: pars,onComplete:getAllFriendsComplete,onFailure: reportError});
}

function getAllFriendsComplete(response)
{
   var returnVal = response.responseText;
   if	(-1==returnVal||"-1"==returnVal){
		//可以干脆什么也不做

		return;
     }    
     
    document.getElementById("friendsList").innerHTML=returnVal;
}


function getRoomMemberList(chatRoomId){       
	var url = '/im/im_client.php';
	var pars = 'serviceType=getRoomMemberList&roomId='+chatRoomId;	 
	var myAjax = new Ajax.Request(url, 
               {method: 'get',parameters: pars,onComplete:getRoomMemberListComplete,onFailure: reportError}
 );
}


function getRoomMemberListComplete(response){
	var returnVal = response.responseText;	
    if	(-1==returnVal||"-1"==returnVal){
		//可以干脆什么也不做
		//alert("对不起,您没有登录或长时间休眠,不能聊天. 请重新登录");
		return;
     } 
   document.getElementById("haoyoulist_lista1").innerHTML=response.responseText;

}

function sendchatMsg(userId,chatRoomId,msg){       
	var url = '/im/im_client.php';
	msg=encodeURIComponent(msg);	
	var pars = 'serviceType=sendMsg&userId='+userId+'&roomId='+chatRoomId+'&msg='+msg;	
	
	var myAjax = new Ajax.Request(url,
               {method: 'get',parameters: pars,onComplete:sendMsgComplete,onFailure: reportError}
 );
}


function sendMsgComplete(response){
	var returnVal = response.responseText;	
    if	(-1==returnVal||"-1"==returnVal){
		//可以干脆什么也不做
		//alert("对不起,您没有登录或长时间休眠,不能聊天. 请重新登录");
		return;
     }   
 
  document.getElementById("chatList").innerHTML=document.getElementById("chatList").innerHTML + response.responseText;
  document.getElementById("chatList").scrollTop=document.getElementById("chatList").scrollHeight+200;
 

}

function quitChat(userId,roomId){
	var url = '/im/im_client.php';			
	var pars = 'serviceType=quitChatRoom&userId='+userId+'&roomId='+roomId;		
	var myAjax = new Ajax.Request(url, 
               {method: 'get',parameters: pars,onComplete:quitChatOK,onFailure: reportError});

}

function quitChatOK(response){
    // do nothing
    // alert("成功退出");

}

function getMyChatRequest(userId){
	
	if(userId=='guest')
		return;
	var url = '/im/im_client.php';			
	var pars = 'serviceType=getMyChatRequest&userId='+userId;		
	
	var myAjax = new Ajax.Request(url, 
               {method: 'get',parameters: pars,onComplete:processMyCharRequest,onFailure: reportError});

}

function processMyCharRequest(response){	
	
	var reText=response.responseText;
	
	if(response.status!=200){
		return 0;
	}	
	
	if ("0"==reText){				
		return;

	}else{
		var spliterPos = reText.indexOf (":");
		//alert(reText);
		if (spliterPos<2)
			return ;		
		var roomId=reText.substring(0,spliterPos);
		var inviterUserId=reText.substring(spliterPos+1);
		if(isNaN(roomId)){			
			return;
		}else{
			//alert("222");		
		}
		
		if(inviterUserId.length>15){
			
			return;	
		}	
			
		var pars = 'serviceType=processChatRequest&inviterUserId='+inviterUserId+'&roomId='+roomId;
		
		var reVal=confirm(inviterUserId + " 邀请您聊天, 您同意么?");

		if (reVal==true){
			pars = pars+"&accept=Y";
			openChatWin(roomId,inviterUserId);
		}
		else{
			pars = pars+"&accept=N";
		}
		var url = '/im/im_client.php';
		var myAjax = new Ajax.Request(url, 
               {method: 'get',parameters: pars,onFailure: reportError});
	
	}
}

function reportError(request)
{
	
	//alert('对不起,目前不能与服务器取得联系!');
	// do nothing
}

//打开聊天窗口,chatRoomId,oppUserId 对方userId
function openChatWin(chatRoomId,oppUserId){
	var url="/im/chat.php?chatRoomId="+chatRoomId;
 	var opt="toolbar=no,location=no,directories=no,status=no,\
     menubar=no,scrollbars=no,resizable=no,width=485,height=400";	
 window.open( url,"chat_"+parseInt(chatRoomId)+"_user"+oppUserId,opt );
}

//打开聊天工具,chatRoomId,oppUserId 对方userId
function openChatToolWin(){
	var url="/im/mainim.php";
 	var opt="toolbar=no,location=no,directories=no,status=no,\
     menubar=no,scrollbars=no,resizable=no,width=500,height=400";	
     window.open(url,"unknown_chat",opt );
}

//判断对方是否已经在聊天列表当中,如果已经存在则返回真
function inChatList(friendId){
	return false;
}

function enterUserPage(userId){
	var url="/user_info/"+userId;
	var opt="toolbar=yes,location=yes,directories=no,status=yes,\
     menubar=yes,scrollbars=yes";	
      window.open( url,"未名空间---mitbbs.cn",opt );

}

function enterHomePage(){
	var url="/newindex/kjjy.php";
	var opt="";	
      window.open( url,"未名空间---mitbbs.cn",opt );

}




function chkSelUser(chkedUserId){

	var friends=document.getElementsByName("friendUserId");		
	for(var i=0;i<friends.length;i++){		
		if (chkedUserId==friends[i].value){		
			friends[i].checked=!friends[i].checked;
			return;
		}
	}
	
}

function getInvitor(type,clubid)
{
	var pars="serviceType=getInvitors";
	if (type==0){
		document.getElementById("clubList_ul").style.display="block";
		document.getElementById("hylist2").innerHTML='<ul><li></li></ul>';
		return;
	}else{
		if(type!=3)
		 	document.getElementById("clubList_ul").style.display="none";
	}	
	
	if(type==1)
	{
		pars=pars+"&invitortype=1";
	}else if(type==2)
	{
		pars=pars+"&invitortype=2";	
	}else if(type==3)
	{
		pars=pars+"&invitortype=3&club="+clubid;	
		
	}
	var url = '/im/im_client.php';
	var myAjax = new Ajax.Request(url, 
             {method: 'get',parameters: pars,onComplete:chargeGetInvitor,onFailure: reportError});
}

function chargeGetInvitor(response)
{
	 var returnVal = response.responseText;
	// alert(returnVal);
   if	(-1==returnVal||"-1"==returnVal){
		alert("对不起,您没有登录或长时间休眠,不能聊天. 请重新登录");
		return;
	}

	document.getElementById("hylist2").innerHTML=returnVal;

}

function getCookieVal(offset)
{
  	var endstr = document.cookie.indexOf (";", offset);
  	if (endstr == -1)
    	endstr = document.cookie.length;
  	return unescape(document.cookie.substring(offset, endstr));
}
function GetCookie (name) 
{
  var arg = name + "=";
  var alen = arg.length;
  var clen = document.cookie.length;
  var i = 0;
  while (i < clen) {
    var j = i + alen;
    if (document.cookie.substring(i, j) == arg)
      return getCookieVal(j);
    i = document.cookie.indexOf(" ", i) + 1;
    if (i == 0) break;
  }
  return null;
 }

function testcode(){
	alert("中华人民共和国万岁");
}