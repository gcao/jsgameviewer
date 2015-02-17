getChatRequest();
function myformLoad(){
	Interval_Obj=setInterval("getChatRequest()",3000); 
}

function getChatRequest(){
	if(GetCookie('UTMPUSERID')!='guest')
	{
		getMyChatRequest(GetCookie('UTMPUSERID')); 
	}
}