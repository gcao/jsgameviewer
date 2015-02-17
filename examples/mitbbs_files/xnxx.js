/*功能: 显示已装配物品列表
  参数: equip_str-配置码字符串
  返回: 无
*/
function show_equip_list(equip_str, divid, style_set)
{
	var obj = document.getElementById("left_xfph2");
	var loopnum, pic_small, flag;
	var tmp_split;
	
	
	inner_str = "<TABLE id=\"xfph_contact2\" cellSpacing=1 cellPadding=0 width=185  border=0 bgcolor=\"#DCDCDC\">";
	showlayers = equip_str.split(">"); 
	oneline_num = 4;
	
	loopnum = 1;
	for (j = 0; j < showlayers.length; j++)
	{
		if (j == 2)
			continue;
		
		if (showlayers[j] != '')	
			tmp_split = showlayers[j].split(",");
		else
			continue;
			
		if ( (j == 0) || (j == 1) ||(j == showlayers.length-1)||(j == showlayers.length-2) )
		{
			pic_base = tmp_split[1];
			flag = parseInt(tmp_split[2]);
		}
		else
		{
			pic_base = tmp_split[2];
			flag = parseInt(tmp_split[3]);
		}
			
		if (pic_base == '')
			continue;
			
		//判是否为系统默认的图片
		if (flag == 1)
			continue;
			
		if (j == 0) //背景
		{
			pic_type = 3;
			pic_posno = 0;
		}
		else if (j == 1) //系列
		{
			pic_type = 2;
			pic_posno = 0;
		}
		else if(j == showlayers.length-2) //礼品
		{
			pic_type = 4;
			pic_posno = 0;	
		}else if(j == showlayers.length-1) //蛋糕
		{
			pic_type = 4;
			pic_posno = 1;	
		}
		else
		{
			pic_type = 1;
			tmp_posno_explit = tmp_split[1].split('-');
			pic_posno = parseInt(tmp_posno_explit[0]);
		}
			
		if (((loopnum-1) % oneline_num ) == 0)
			inner_str += "<TR bgcolor=\"#FFFFFF\">";

		pic_small = '';
		pic_small += ("sl_" + pic_base);
		inner_str += "<TD align=\"center\" width=\"45\" height=\"40\"><a href=\"javascript:undressit(" + pic_type + ", " + pic_posno + ", '" + divid + "', '" + style_set + "')\">" + "<img src=\"/vshape_pic/" + pic_small + "\" width=\"40\" height=\"40\"></a></TD>";
		
		if ((loopnum % oneline_num) == 0)
			inner_str += "</TR>";
			
		loopnum++;
	}
	
	if ((loopnum % oneline_num) != 0)
		inner_str += "</TR>";

	inner_str += "</TABLE>";
	obj.innerHTML = inner_str; 
}

/*这个函数由配置码为参数，显示虚拟形象(试穿, 装配时用)
  参数: equip-配置码(字符串格式: id,背景文件名,flag>id,系列文件名,flag>
					id,模板图文件名,flag>id,单品1位置序号,单品1文件名,flag/
					id,套装1位置序号,套装1文件名,flag>...>id,单品n位置序号,单品n文件名,flag/
					id,套装n位置序号,套装n文件名,flag>id,礼品文件名,flag>id,蛋糕文件名,flag
					其中, 套装的位置序号格式为:p1-p2-p3
					id,flag: flag=1  系统默认物品, 此时id为merchandise_id
							  flag=2  本站未购商品, 此时id为merchandise_id
							  flag=3  二手未购商品, 此时id为sale_id
							  flag=4  已购商品, 此时id为save_id
							  flag=5  选择的模板, 此时id为模板id: 1-男模板; 2-女模板
					)
		divid-显示用的区块id
		style_set-显示用的 style 
		pic_width-宽
		pic_height-高
		lowie_flag-低版本IE(5.5-6.9)标志
*/
function showit(equip, divid, style_set, pic_width, pic_height, lowie_flag)
{
	var str = "";
	var obj = document.getElementById(divid);
	var zindex = 0;
	var tmp_split = "";


	/*由于使用png-24的图片, 而低版本的IE(5.5-6.9)不支持其透明效果, 
	  因此必须加上AlphaImageLoader滤镜来解决该问题.
	  注意: IE7.0开始支持png-24图片的透明效果
	*/
	showlayers = equip.split(">"); 
	
	//显示背景图
	if (showlayers[0] != '')
	{
		tmp_split = showlayers[0].split(",");
		
		if (tmp_split[1] != '')
		{
			if ( (pic_width == 0) && (pic_height == 0) )
				str += "<img src='/vshape_pic/" + tmp_split[1] + "' style='" + style_set + "z-index:" + zindex + ";'>";
			else 
				str += "<img src='/vshape_pic/" + tmp_split[1] + "' width='" + pic_width + "' height='" + pic_height + "' style='" + style_set + "z-index:" + zindex + ";'>";
			zindex++;
		}
	}
	
	//显示系列图
	if (showlayers[1] != '')
	{
		tmp_split = showlayers[1].split(",");
		
		if (tmp_split[1] != '')
		{
			if (lowie_flag <= 0)
			{
				if ( (pic_width == 0) && (pic_height == 0) )
					str += "<img src='/vshape_pic/" + tmp_split[1] + "' style='" + style_set + "z-index:" + zindex + ";'>";
				else
					str += "<img src='/vshape_pic/" + tmp_split[1] + "' width='" + pic_width + "' height='" + pic_height + "' style='" + style_set + "z-index:" + zindex + ";'>";
			}
			else
			{
				if ( (pic_width == 0) && (pic_height == 0) )
					str += "<div style=\"filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/vshape_pic/" + tmp_split[1] + "', sizingMethod='scale'); width:120px; height:250px; " + style_set + "z-index:" + zindex + ";\"></div>";
				else
					str += "<div style=\"filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/vshape_pic/" + tmp_split[1] + "', sizingMethod='scale'); width:" + pic_width + "px; height:" + pic_height + "px; " + style_set + "z-index:" + zindex + ";\"></div>";
			}

			zindex++;
		}
	}

	//显示模板图
	if (showlayers[2] != '')
	{
		tmp_split = showlayers[2].split(",");
		
		if (tmp_split[1] != '')
		{
			if (lowie_flag <= 0)
			{
				if ( (pic_width == 0) && (pic_height == 0) )
					str += "<img src='/virtual_shape/images/" + tmp_split[1] + "' style='" + style_set + "z-index:" + zindex + ";'>";
				else
					str += "<img src='/virtual_shape/images/" + tmp_split[1] + "' width='" + pic_width + "' height='" + pic_height + "' style='" + style_set + "z-index:" + zindex + ";'>";
			}
			else
			{
				if ( (pic_width == 0) && (pic_height == 0) )
					str += "<div style=\"filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/virtual_shape/images/" + tmp_split[1] + "', sizingMethod='scale'); width:120px; height:250px; " + style_set + "z-index:" + zindex + ";\"></div>";
				else
					str += "<div style=\"filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/virtual_shape/images/" + tmp_split[1] + "', sizingMethod='scale'); width:" + pic_width + "px; height:" + pic_height + "px; " + style_set + "z-index:" + zindex + ";\"></div>";
			}
				
			zindex++;
		}
	}

	//以“>”为分隔符，分配各层图片名到一个数组 showlayers[]
	for(i=3; i<showlayers.length-2; i++)
	{
		tmp_split = showlayers[i].split(',');
	
		if(tmp_split[2] != '')
		{
			if (lowie_flag <= 0)
			{
				if ( (pic_width == 0) && (pic_height == 0) )
					str += "<img src='/vshape_pic/" + tmp_split[2] + "' style='" + style_set + "z-index:" + zindex + ";'>";
				else
					str += "<img src='/vshape_pic/" + tmp_split[2] + "' width='" + pic_width + "' height='" + pic_height + "' style='" + style_set + "z-index:" + zindex + ";'>";
			}
			else
			{
				if ( (pic_width == 0) && (pic_height == 0) )
					str += "<div style=\"filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/vshape_pic/" + tmp_split[2] + "', sizingMethod='scale'); width:120px; height:250px; " + style_set + "z-index:" + zindex + ";\"></div>";
				else
					str += "<div style=\"filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/vshape_pic/" + tmp_split[2] + "', sizingMethod='scale'); width:" + pic_width + "px; height:" + pic_height + "px; " + style_set + "z-index:" + zindex + ";\"></div>";
			}
			
			zindex++;
		}
	}
	
	//显示礼品图
	if (showlayers[showlayers.length-2] != '')
	{
		tmp_split = showlayers[showlayers.length-2].split(",");
		
		if (tmp_split[1] != '')
		{
			if (lowie_flag <= 0)
			{
				if ( (pic_width == 0) && (pic_height == 0) )
					str += "<img src='/vshape_pic/" + tmp_split[1] + "' style='" + style_set + "z-index:" + zindex + ";'>";
				else 
					str += "<img src='/vshape_pic/" + tmp_split[1] + "' width='" + pic_width + "' height='" + pic_height + "' style='" + style_set + "z-index:" + zindex + ";'>";
			}else
			{
				if ( (pic_width == 0) && (pic_height == 0) )
					str += "<div style=\"filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/vshape_pic/" + tmp_split[1] + "', sizingMethod='scale'); width:120px; height:250px; " + style_set + "z-index:" + zindex + ";\"></div>";
				else
					str += "<div style=\"filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/vshape_pic/" + tmp_split[1] + "', sizingMethod='scale'); width:" + pic_width + "px; height:" + pic_height + "px; " + style_set + "z-index:" + zindex + ";\"></div>";
			}
			zindex++;
		}
	}

	//显示蛋糕图
	if (showlayers[showlayers.length-1] != '')
	{
		tmp_split = showlayers[showlayers.length-1].split(",");
		
		if (tmp_split[1] != '')
		{
			if (lowie_flag <= 0)
			{
				if ( (pic_width == 0) && (pic_height == 0) )
					str += "<img src='/vshape_pic/" + tmp_split[1] + "' style='" + style_set + "z-index:" + zindex + ";'>";
				else 
					str += "<img src='/vshape_pic/" + tmp_split[1] + "' width='" + pic_width + "' height='" + pic_height + "' style='" + style_set + "z-index:" + zindex + ";'>";
			}else
			{
				if ( (pic_width == 0) && (pic_height == 0) )
					str += "<div style=\"filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/vshape_pic/" + tmp_split[1] + "', sizingMethod='scale'); width:120px; height:250px; " + style_set + "z-index:" + zindex + ";\"></div>";
				else
					str += "<div style=\"filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/vshape_pic/" + tmp_split[1] + "', sizingMethod='scale'); width:" + pic_width + "px; height:" + pic_height + "px; " + style_set + "z-index:" + zindex + ";\"></div>";
			}
			zindex++;
		}
	}
	//最后在最上一层覆盖一幅完全透明的图片，这样用户在上面右链>另存为也只能保存这幅图了：
	if ( (pic_width == 0) && (pic_height == 0) )
		str += "<img src='/virtual_shape/images/blank.png' style='" + style_set + "z-index:" + zindex + ";'>";
	else
		str += "<img src='/virtual_shape/images/blank.png' width='" + pic_width + "' height='" + pic_height + "' style='" + style_set + "z-index:" + zindex + ";'>";

	//显示各层图片。
	obj.innerHTML = str; 
}

/*功能: 在配置码中加入系统默认配置
  参数: equip_str-配置码字符串
  		sysdefault_str-系统默认配置字符串
  返回: 新配置码
*/
function equip_join_sysdefault(equip_str, sysdefault_str)
{
	var newequip="";
	var found_flag, tmppos;
	var tmp_explit_1="", tmp_explit_2="", tmp_explit_3="", tmp_explit_4="";	

	
	if (sysdefault_str)
	{
		tmp_explit_1 = sysdefault_str.split('>');
		tmp_explit_2 = equip_str.split('>');
		
		for(i=0; i<tmp_explit_1.length; i++)
		{
			found_flag = 0;
			tmp_explit_3 = tmp_explit_1[i].split(',');
			default_posno = parseInt(tmp_explit_3[1]);
			
			for(j=3; j<tmp_explit_2.length-2; j++)
			{
				tmp_explit_4 = tmp_explit_2[j].split(',');
				equip_posno = tmp_explit_4[1].split('-');
				for(k=0; k<equip_posno.length; k++)
				{
					if (default_posno == parseInt(equip_posno[k]))
					{
						found_flag = 1;
						break;
					}
				}
			}
			
			//系统默认位置是否已装配?
			if (found_flag == 0)
			{
				tmppos = parseInt(tmp_explit_3[1]) + 2;
				tmp_explit_2[tmppos] = tmp_explit_1[i];
			}
		}
		
		newequip = tmp_explit_2.join(">");
	}
	
	return newequip;
}

/*这个函数用于更换配置
  参数: type-1:单品; 2:套装; 3:系列; 4:背景 5:礼品（layer 为1为蛋糕）
  		layer-更换图片所在的层数
		img-更换图片的图片名
		divid-显示用的区块id
		style_set-显示用的 style 
		id,op_flag-op_flag=1 本站商场更换, id为merchandise_id
					op_flag=2 二手商场更换, id为sale_id
					op_flag=3 我的物品更换, id为save_id
*/
function dressit(type, layer, img, divid, style_set, id, op_flag)
{ 
	var j,flag;
	var tmp_explit="", tmp_explit_2="", tmp_explit_3="";
	var min_pos = "";
	var myequip = document.equipform.userequip.value;
	var sys_default = document.equipform.sys_default.value;
	var newequip="";
	

	flag = 2;
	if (op_flag == 1)
		flag = 2;
	else if (op_flag == 2)
		flag = 3;
	else if (op_flag == 3)
		flag = 4;
	
	lowie_flag = parseInt(document.equipform.lowie_flag.value);
	showlayers = myequip.split('>');
	
	if (type == 3) //换系列?
	{
		tmp_explit = showlayers[1].split(',');	
		
		//判系列图片是否已存在?
		if ( (op_flag == 3) && (id) )
		{
			if (parseInt(tmp_explit[0]) == id)
			{
				undressit(2, 0, divid, style_set);
				return;
			}
		}
		else
		{
			if (tmp_explit[1] == img)
			{
				undressit(2, 0, divid, style_set);
				return;
			}
		}

		newequip += showlayers[0];
		newequip += (">" + id + "," + img + "," + flag + ">0,,0");
		for(i=3; i<showlayers.length-2; i++)
			newequip += ">0,,,0";

		newequip +=(">"+showlayers[showlayers.length-2]);
		newequip +=(">"+showlayers[showlayers.length-1]);
		//显示最新配置
		showit(newequip, divid, style_set, 0, 0, lowie_flag);
		
		//配置码保存
		document.equipform.userequip.value = newequip;
		
		//显示已装配物品列表
		show_equip_list(newequip, divid, style_set);
		
		return;
	}
	else if (type == 4) //换背景?
	{
		tmp_explit = showlayers[0].split(',');	
		
		//判背景图片是否已存在?
		if ( (op_flag == 3) && (id) )
		{
			if (parseInt(tmp_explit[0]) == id)
			{
				undressit(3, 0, divid, style_set);
				return;
			}
		}
		else
		{
			if (tmp_explit[1] == img)
			{
				undressit(3, 0, divid, style_set);
				return;
			}
		}
		
		newequip += (id + "," + img + "," + flag);
		newequip += (">" + showlayers[1]);
		newequip += (">" + showlayers[2]);
		
		for(i=3; i<showlayers.length; i++)
			newequip += ">" + showlayers[i]; //其他层图片不变
			
		//显示最新配置
		showit(newequip, divid, style_set, 0, 0, lowie_flag);
		
		//配置码保存
		document.equipform.userequip.value = newequip;
		
		//显示已装配物品列表
		show_equip_list(newequip, divid, style_set);
		return;
	}else if(type==5) //换礼品 或 换蛋糕(layer为1时为蛋糕)
	{
		if(layer!=1)
		{
			tmp_explit = showlayers[showlayers.length-2].split(',');	
		
			//判礼品图片是否已存在?
			if ( (op_flag == 3) && (id) )
			{
				if (parseInt(tmp_explit[0]) == id)
				{
					undressit(4, 0, divid, style_set);
					return;
				}
			}
			else
			{
				if (tmp_explit[1] == img)
				{
					undressit(4, 0, divid, style_set);
					return;
				}
			}
		
			newequip = showlayers[0];
		
			newequip += (">" + showlayers[1]);
			newequip += (">" + showlayers[2]);
		
			for(i=3; i<showlayers.length-2; i++)
				newequip += ">" + showlayers[i]; //其他层图片不变
		
			newequip += (">"+id + "," + img + "," + flag);	
			newequip += (">"+showlayers[showlayers.length-1]);
		}else
		{
			tmp_explit = showlayers[showlayers.length-1].split(',');	
		
			//判蛋糕图片是否已存在?
			if ( (op_flag == 3) && (id) )
			{
				if (parseInt(tmp_explit[0]) == id)
				{
					undressit(4, 1, divid, style_set);
					return;
				}
			}
			else
			{
				if (tmp_explit[1] == img)
				{
					undressit(4, 1, divid, style_set);
					return;
				}
			}
		
			newequip = showlayers[0];
		
			newequip += (">" + showlayers[1]);
			newequip += (">" + showlayers[2]);
		
			for(i=3; i<showlayers.length-1; i++)
				newequip += ">" + showlayers[i]; //其他层图片不变
		
			newequip += (">"+id + "," + img + "," + flag);	
		}
		//显示最新配置
		showit(newequip, divid, style_set, 0, 0, lowie_flag);
		
		//配置码保存
		document.equipform.userequip.value = newequip;
		
		//显示已装配物品列表
		show_equip_list(newequip, divid, style_set);
		return;
	}

	/*换单品/套装*/
	if (!layer)
		return;
		
	//判当前物品是否已配置?
	for(i=3; i<showlayers.length-2; i++)
	{
		tmp_explit = showlayers[i].split(',');
		if ( (op_flag == 3) && (id) )
		{
			if (parseInt(tmp_explit[0]) == id)
			{
				tmp_posno_explit = tmp_explit[1].split('-');
				undressit(1, parseInt(tmp_posno_explit[0]), divid, style_set);
				return;
			}
		}
		else
		{
			if (tmp_explit[2] == img)
			{
				tmp_posno_explit = tmp_explit[1].split('-');
				undressit(1, parseInt(tmp_posno_explit[0]), divid, style_set);
				return;
			}
		}
	}
	
	//背景
	newequip += showlayers[0];

	//系列文件名应为空
	newequip += ">0,,0";

	//模板图
	newequip += (">0,basepic_" + document.equipform.base_id.value + ".png" + ",0");

	//清除可能的冲突
	tmp_explit_2 = layer.split('-');
	for(i=0; i<tmp_explit_2.length; i++)
	{
		find_pos = parseInt(tmp_explit_2[i]);
	
		for(k=3; k<showlayers.length-2; k++)
		{
			tmp_explit_3 = showlayers[k].split(',')
			equip_posno = tmp_explit_3[1].split('-');
			for(m=0; m<equip_posno.length; m++)
			{
				if (find_pos == parseInt(equip_posno[m]))
				{
					showlayers[k] = "0,,,0";
					break;
				}
			}
		}
	}

	//开始装备
	j = 1;
	min_pos = parseInt(tmp_explit_2[0]);
	for(i=3; i<showlayers.length-2; i++)
	{
		if(j == min_pos)
			newequip += (">" + id + "," + layer + "," + img + "," + flag); //换为这幅图
		else 
		{
			found_flag = 0;
		
			//是套装的处理
			for(m=0; m<tmp_explit_2.length; m++)
			{
				if (j == parseInt(tmp_explit_2[m]))
				{
					found_flag = 1;
					break;
				}
			}
			
			if (found_flag > 0)
				newequip += (">0,,,0");
			else
				newequip += ">" + showlayers[i]; //其他层图片不变
		}
			
		j++;
	}
	newequip +=(">"+showlayers[showlayers.length-2]);
	newequip +=(">"+showlayers[showlayers.length-1]);

	//系统默认设置处理
	if (sys_default)
		newequip = equip_join_sysdefault(newequip, sys_default);

	//显示最新配置
	showit(newequip, divid, style_set, 0, 0, lowie_flag); 
	
	//配置码保存
	document.equipform.userequip.value = newequip;
	
	//显示已装配物品列表
	show_equip_list(newequip, divid, style_set);
}

/*这个函数用于脱衣服
  参数: type-1:部位; 2:系列; 3:背景 4:礼品（posno为1为蛋糕，其余为0）
  		posno-部位位置序号(type=2/3时为0)
		divid-显示用的区块id
		style_set-显示用的 style 
*/
function undressit(type, posno, divid, style_set)
{
	var newequip="";
	var myequip = document.equipform.userequip.value;
	var sys_default = document.equipform.sys_default.value;
	var tmp_explit="";
	
	
	lowie_flag = parseInt(document.equipform.lowie_flag.value);
	showlayers = myequip.split('>');
	
	if (type == 3) //脱背景
	{
		showlayers[0] = "0,,0";
		newequip = showlayers.join(">");
		
		//显示最新配置
		showit(newequip, divid, style_set, 0, 0, lowie_flag);
		
		//配置码保存
		document.equipform.userequip.value = newequip;
		
		//显示已装配物品列表
		show_equip_list(newequip, divid, style_set);
		return;
	}else if(type==4) //脱礼品
	{
		if(posno!=1) //为礼品
		{
			showlayers[showlayers.length-2] = "0,,0";
		}else
		{
			showlayers[showlayers.length-1] = "0,,0";
		}
			
		newequip = showlayers.join(">");
		
		//显示最新配置
		showit(newequip, divid, style_set, 0, 0, lowie_flag);
		
		//配置码保存
		document.equipform.userequip.value = newequip;
		
		//显示已装配物品列表
		show_equip_list(newequip, divid, style_set);
		return;
	}
	else if (type == 2) //脱系列
	{
		showlayers[1] = "0,,0";
		showlayers[2] = "0,basepic_" + document.equipform.base_id.value + ".png" + ",0";
	}
	else //脱部位
	{
		tmp_explit = showlayers[1].split(',');
		if (tmp_explit[1] != '')
			return;
		
		for(i=3; i<showlayers.length-2; i++)
		{
			tmp_explit = showlayers[i].split(',');
			equip_posno = tmp_explit[1].split('-');
			for(m=0; m<equip_posno.length; m++)
			{
				if (posno == parseInt(equip_posno[m]))
					showlayers[i] = "0,,,0";
			}
		}
	}
	
	newequip = showlayers.join(">");
	
	//系统默认设置处理
	if (sys_default)
		newequip = equip_join_sysdefault(newequip, sys_default);

	//显示最新配置
	showit(newequip, divid, style_set, 0, 0, lowie_flag);
	
	//配置码保存
	document.equipform.userequip.value = newequip;
	
	//显示已装配物品列表
	show_equip_list(newequip, divid, style_set);
}

// trim functions
function LTrim(str){
        var whitespace = new String(" \t\n\r");
        var s = new String(str);
        if (whitespace.indexOf(s.charAt(0)) != -1) {
                var j=0, i = s.length;
                while (j < i && whitespace.indexOf(s.charAt(j)) != -1)
                        j++;
                s = s.substring(j, i);
        }
        return s;
}

function RTrim(str){
        var whitespace = new String(" \t\n\r");
        var s = new String(str);
        if (whitespace.indexOf(s.charAt(s.length-1)) != -1) {
                var i = s.length - 1;       // Get length of string
                while (i >= 0 && whitespace.indexOf(s.charAt(i)) != -1)
                        i--;
                s = s.substring(0, i+1);
        }
        return s;
}

function Trim(str){
        return RTrim(LTrim(str));
}

//检查是否为正整数
function check_positive_int (f,msg)
{
     value = parseInt(f.value);
     if (f.value.indexOf('.') != -1 || isNaN(f.value) || value < 0)
     {
         alert(msg);
         f.focus();
         return false;
     }
     else
     {
         f.value = value;
         return true;
     }
}

//检查是否为非0正整数
function check_positive_nonzero_int (f,msg)
{
	 if (f.value == '')
	 {
         alert(msg);
         f.focus();
         return false;
     }	

     value = parseInt(f.value);
     if (f.value.indexOf('.') != -1 || isNaN(f.value) || value <= 0)
     {
         alert(msg);
         f.focus();
         return false;
     }
     else
     {
         f.value = value;
         return true;
     }
}

//检查是否为空文本
function check_text(f, msg){
        if(Trim(f.value)==""){
                alert(msg);
                f.value="";
                f.focus();
                return false;
        }else{
                return true;
        }
}

//日期检查(年)
function check_date_year(obj)
{
	if (!check_text(obj, "年份不能为空!"))
		return false;

	if (!check_positive_nonzero_int(obj, "年份应为正整数!"))
		return false;
		
	if(parseInt(obj.value) < 2000)
	{
		alert("您输入的年份过于陈旧,请重新填写!");
		obj.focus();
		return false;
	}
	
	return true;
}

//日期检查(月)
function check_date_month(obj)
{
	if (!check_text(obj, "月份不能为空!"))
		return false;
		
	if (!check_positive_nonzero_int(obj, "月份应为正整数!"))
		return false;
		
	month = parseInt(obj.value);
	if (month < 1 || month > 12)
	{
		alert("月份数值应该在1~12之间!");
		obj.focus();
		return false;
	}
	
	return true;
}

//日期检查(日)
function check_date_day(obj, year, month)
{
	if (!check_text(obj, "日数值不能为空!"))
		return false;
		
	if (!check_positive_nonzero_int(obj, "日数值应为正整数!"))
		return false;
		
	day = parseInt(obj.value);
	if (day < 1 || day > 31)
	{
		alert("日数值应该在1~31之间!");
		obj.focus();
		return false;
	}
	
	if((month==4 || month==6 || month==9 || month==11) && (day==31))
	{
		alert("日数值应该在1~30之间!");
		obj.focus();
		return false;
	}
	
	// february, leap year
	if (month == 2)
	{
		tmp_value = year % 4;
		if (tmp_value == 0)
		{
			if (day > 29)
			{
				alert("日数值应该在1~29之间!");
				obj.focus();
				return false;
			}
		}
		else
		{
			if (day > 28)
			{
				alert("日数值应该在1~28之间!");
				obj.focus();
				return false;
			}
		}
	}
	
	return true;
}

function setpart_check()
{
	var obj = document.form;

	if( !check_text(obj.part_name, "请填写部位名称!") ) 
		return false;
		
	if( !check_positive_nonzero_int(obj.part_pos, "位置错误, 请重新填写!") ) 
		return false;
		
	document.form.submit();
}

function part_del(id)
{
	var obj = document.form;

	if (confirm('您是否确定删除当前部位？')) 
	{
		obj.mode.value = 3; 
		obj.part_id.value = id;
		obj.submit();
	}
	else
		return;
}

function seriesclass_check()
{
	var obj = document.form;

	if( !check_text(obj.class_name, "请填写分类名称!") ) 
		return false;
		
	document.form.submit();
}

function seriesclass_del(id)
{
	var obj = document.form;

	if (confirm('您是否确定删除当前分类？')) 
	{
		obj.mode.value = 3; 
		obj.class_id.value = id;
		obj.submit();
	}
	else
		return;
}

function change_show(show_id, all_id)
{
	var obj = "";
	var tmp_split = "";
	var div_id = "";

	
	if (show_id == -1)
		div_id = "new_commend_block";
	else if (show_id == -2)
		div_id = "suit_block";
	else if (show_id == -3)
		div_id = "backgroup_block";
	else
		div_id = "part" + show_id + "_block";

	obj = document.getElementById(div_id);
	obj.style.display = 'block';

	tmp_split = all_id.split('?');
	for(i=0; i<tmp_split.length; i++)
	{
		if (tmp_split[i] != show_id)
		{
			if (tmp_split[i] == -1)
				div_id = "new_commend_block";
			else if (tmp_split[i] == -2)
				div_id = "suit_block";
			else if (tmp_split[i] == -3)
				div_id = "backgroup_block";
			else
				div_id = "part" + tmp_split[i] + "_block";

			obj = document.getElementById(div_id);
			obj.style.display = 'none';
		}
	}
	
}

function change_show_1(show_id, all_id)
{
	var obj = "";
	var tmp_split = "";
	var div_id = "";

	
	if (show_id == 0)
		div_id = "new_series_block";
	else
		div_id = "series" + show_id + "_block";

	obj = document.getElementById(div_id);
	obj.style.display = 'block';

	tmp_split = all_id.split('?');
	for(i=0; i<tmp_split.length; i++)
	{
		if (tmp_split[i] != show_id)
		{
			if (tmp_split[i] == 0)
				div_id = "new_series_block";
			else
				div_id = "series" + tmp_split[i] + "_block";

			obj = document.getElementById(div_id);
			obj.style.display = 'none';
		}
	}
}

//购买-进购物车
function buy_it_mitbbs(baseid, id, ptype)
{
	var gtype = 1;

	if (ptype)
		gtype = ptype;
	
	document.equipform.action = "/virtual_shape/mitbbs_vshape_buylist.php?id=" + id + "&baseid=" + baseid + "&type=" + gtype;
	document.equipform.submit();
	return;
}

//过期物品可以续买--此动作只是将物品放入购物车
function buy_again(base_id, id)
{
    if(confirm("此物品已过期,是否放入购物车再次购买之?"))
    {
       buy_it_mitbbs(base_id, id, 1);
    }
    return;    
}

//试穿购买-进购物车
function tryon_buy_mitbbs(baseid)
{
	var userequip_str = document.equipform.userequip.value;
	var pic_base;
	var have_flag, tmp_split;
	

	//试穿物品检查
	showlayers = userequip_str.split(">");
	have_flag = 0;
	for (j = 0; j < showlayers.length; j++)
	{
		if (j == 2)
			continue;
		
		if (showlayers[j] != '')	
			tmp_split = showlayers[j].split(",");
		else
			continue;
			
		if ( (j == 0) || (j == 1) )
		{
			pic_base = tmp_split[1];
			flag = parseInt(tmp_split[2]);
		}
		else
		{
			pic_base = tmp_split[2];
			flag = parseInt(tmp_split[3]);
		}
			
		if (pic_base == '')
			continue;
			
		//判是否为系统默认的图片
		if (flag == 1)
			continue;
			
		have_flag = 1;
		break;
	}

	if (have_flag == 0)
	{
		alert("购买失败, 您身上没有试穿商品!!");
		return;
	}

	document.equipform.action = "/virtual_shape/mitbbs_vshape_buylist.php?id=0" + "&baseid=" + baseid + "&tryflag=1";
	document.equipform.submit();
	return;
}

//购物车付款
function buylist_paymoney()
{
	var obj = document.equipform;
	
	if (parseInt(obj.totalnum.value) <= 0)
	{
		alert("购买失败, 您的购物车中没有商品!!");
		return;
	}
	
	if ( parseFloat(obj.totalmoney.value) > parseFloat(obj.youcash.value) )
	{
		alert("购买失败, 您的现金不够!!");
		return;
	}
	
	if (confirm('        购买确认\n\n'+'所购物品：'+obj.totalnum.value+' 件\n'+'所需金额：'+obj.totalmoney.value+' 伪币'))
	{
		obj.action = "/virtual_shape/mitbbs_vshape_buy.php?mode=1";
		obj.submit();
	}
	
	return;
}

//赠送
function largess_it(id, type)
{
	var link_addr;
	
	link_addr = "/virtual_shape/mitbbs_vshape_largess.php?id=" + id + "&type=" + type;
	window.open(link_addr);
}

//形象配置页内容更换处理
function change_content_1(baseid, mode, mtype, id, sno, confid)
{
	obj = document.getElementById("config_name");
	document.equipform.conf_name_save.value = obj.value;
	document.equipform.action = "/virtual_shape/mitbbs_vshape_shapeset.php?base_id=" + baseid + "&confid=" + confid + "&mode=" + mode + "&type=" + mtype + "&id=" + id + "&sno=" + sno;
	document.equipform.submit();
}

//商品列表页内容更换处理
function change_content_2(baseid, mode, id, sno)
{
	document.equipform.action = "/virtual_shape/mitbbs_vshape_merchandise_list.php?base_id=" + baseid + "&mode=" + mode + "&id=" + id + "&sno=" + sno;
	document.equipform.submit();
}

//商品列表页->形象秀首页处理
function change_content_3(baseid)
{
	document.equipform.action = "/virtual_shape/mitbbs_vshape_index.php?base_id=" + baseid;
	document.equipform.submit();
}

//二手交易列表页内容更换处理
function change_content_4(baseid, mtype, partid, sno)
{
	document.equipform.action = "/virtual_shape/mitbbs_vshape_secondhand_list.php?base_id=" + baseid + "&type=" + mtype + "&part_id=" + partid + "&sno=" + sno;
	document.equipform.submit();
}

//用户形象配置保存
function save_conf()
{
	if (confirm('您是否确定保存当前配置？'))
	{
		obj = document.getElementById("config_name");
		if (!check_text(obj, "配置名不能为空!"))
			return false;
		
		document.equipform.conf_name_save.value = obj.value;
		document.equipform.action = "/virtual_shape/mitbbs_vshape_save_conf.php";
		document.equipform.submit();
	}
}

function my_score(numid, no, boardname, gid, opflag, aid)
{
	var score;
	var link_addr;


	score = eval("document.scoreform.select_" + no + ".value");
	if (score <= 0)
	{
		alert("请选择分数!!");
		return;
	}
	
	link_addr = "/virtual_shape/mitbbs_vshape_score.php?numid=" + numid + "&score=" + score;
	if (typeof(boardname) != 'undefined' && typeof(gid) != 'undefined' && typeof(opflag) != 'undefined' && typeof(aid) != 'undefined')
		link_addr += "&bname=" + boardname + "&gid=" + gid + "&opflag=" + opflag + "&aid=" + aid;

	window.location.href = link_addr;
	return;
}

function buylist_del(id)
{
	var obj = document.equipform;

	if (confirm('您是否确定从购物车中删除当前商品？')) 
	{
		obj.mode.value = 2; 
		obj.cart_id.value = id;
		obj.action = "mitbbs_vshape_buylist.php?baseid=" + obj.base_id.value;
		obj.submit();
	}
	else
		return;
}

function buylist_clear()
{
	var obj = document.equipform;

	if (confirm('您是否确定清空购物车？')) 
	{
		obj.mode.value = 3; 
		obj.action = "mitbbs_vshape_buylist.php?baseid=" + obj.base_id.value;
		obj.submit();
	}
	else
		return;
}

function buylist_changenum(id)
{
	var obj = document.equipform;
	
	obj.mode.value = 1; 
	obj.cart_id.value = id;
	obj.action = "mitbbs_vshape_buylist.php?baseid=" + obj.base_id.value;
	obj.submit();
}

function equip_error()
{
	alert('抱歉, 您不能装配该物品!!');
	return;
}

function undo_secondhand(save_id)
{
	var obj = document.equipform;

	if (confirm('您是否确定撤消转卖当前物品？')) 
	{
		obj.pflag.value = 1;
		obj.saveid.value = save_id;
		obj.action = document.location;
		obj.submit();
	}
	
	return;
}

//设为当前配置
function set_currconf(confid, opid)
{
	if (confirm('您是否要将该配置设为当前配置?'))
	{
		link_addr = "/virtual_shape/mitbbs_vshape_conf_list.php?confid=" + confid + "&oflag=1&opid=" + opid;
		document.setdel_curr_form.action = link_addr;
		document.setdel_curr_form.submit();
	}
}

//删除所选配置
function del_currconf(confid, opid)
{
	if (confirm('您是否要将该配置删除?'))
	{
		link_addr = "/virtual_shape/mitbbs_vshape_conf_list.php?confid=" + confid + "&oflag=2&opid=" + opid;
		document.setdel_curr_form.action = link_addr;
		document.setdel_curr_form.submit();
	}
}

//check for add_bulletin
function check_bulletin()
{
   if(document.add_bulletin_form.bulletin_title.value=="")
   {
      alert("公告标题不能为空,请确认!");
      document.add_bulletin_form.bulletin_title.focus();
      return false;
   }
   if(document.add_bulletin_form.bulletin_content.value=="")
   {
      alert("公告内容不能为空,请确认!");
      document.add_bulletin_form.bulletin_content.focus();
      return false;
   }
   return true;
}

//check for add_slide_notice
function check_slide_notice()
{
   var today = new Date();
   var year = today.getFullYear();      
   //alert(today+"Hello:"+year); //for test
    
   if(document.slide_notice.sn_title.value=="")
   {
      alert("跑马条公告标题不能为空!");
      document.slide_notice.sn_title.focus();
      return false;
   }
   if(document.slide_notice.sn_content.value=="")
   {
      alert("跑马条公告内容不能为空!");
      document.slide_notice.sn_content.focus();
      return false;
   }
   if(document.slide_notice.start_year.value=="")
   {
      alert("起始年份不能为空!");
      document.slide_notice.start_year.focus();
      return false;
   }
   else if(isNaN(document.slide_notice.start_year.value))
   {
      alert("对不起,只能输入数字!");
      document.slide_notice.start_year.value="";
      document.slide_notice.start_year.focus();
      return false;
   }     
   else if(parseFloat(document.slide_notice.start_year.value)<year)
   {
      alert("您输入的年份过于陈旧,请重新填写!");
      document.slide_notice.start_year.value="";
      document.slide_notice.start_year.focus();
      return false;
   }
   if(document.slide_notice.start_month.value=="")
   {
      alert("起始月份不能为空!");
      document.slide_notice.start_month.focus();
      return false;
   }
   else if(isNaN(document.slide_notice.start_month.value))
   {
      alert("对不起,只能输入数字!");
      document.slide_notice.start_month.value="";
      document.slide_notice.start_month.focus();
      return false;
   } 
   else if(document.slide_notice.start_month.value<=0 || document.slide_notice.start_month.value>12)
   {
      alert("月份数值应该在1~12之间!");
      document.slide_notice.start_month.value="";
      document.slide_notice.start_month.focus();
      return false;
   }    
   if(document.slide_notice.start_day.value=="")
   {
      alert("起始日不能为空!");
      document.slide_notice.start_day.focus();
      return false;
   }
   else if(isNaN(document.slide_notice.start_day.value))
   {
      alert("对不起,只能输入数字!");
      document.slide_notice.start_day.value="";
      document.slide_notice.start_day.focus();
      return false;
   }    
   else if(document.slide_notice.start_day.value<=0 || document.slide_notice.start_day.value>31)
   {
      alert("所填数值应该在1~31之间!");
      document.slide_notice.start_day.value="";
      document.slide_notice.start_day.focus();
      return false;
   }   
   if(document.slide_notice.end_year.value=="")
   {
      alert("结束年份不能为空!");
      document.slide_notice.end_year.focus();
      return false;
   }
   else if(isNaN(document.slide_notice.end_year.value))
   {
      alert("对不起,只能输入数字!");
      document.slide_notice.end_year.value="";
      document.slide_notice.end_year.focus();
      return false;
   } 
   else if(parseFloat(document.slide_notice.end_year.value)<parseFloat(document.slide_notice.start_year.value)) 
   {
      alert("结束日期年份应大于等于起始年份!");
      document.slide_notice.end_year.value="";
      document.slide_notice.end_year.focus();
      return false;
   }   
   if(document.slide_notice.end_month.value=="")
   {
      alert("结束月份不能为空!");
      document.slide_notice.end_month.focus();
      return false;
   }
   else if(isNaN(document.slide_notice.end_month.value))
   {
      alert("对不起,只能输入数字!");
      document.slide_notice.end_month.value="";
      document.slide_notice.end_month.focus();
      return false;
   } 
   else if(parseFloat(document.slide_notice.end_month.value)<=0 || parseFloat(document.slide_notice.end_month.value)>12)
   {
      alert("月份数值应该在1~12之间!");
      document.slide_notice.end_month.value="";
      document.slide_notice.end_month.focus();
      return false;
   }
   else if(parseFloat(document.slide_notice.end_year.value)==parseFloat(document.slide_notice.start_year.value) && parseFloat(document.slide_notice.end_month.value)<parseFloat(document.slide_notice.start_month.value))  
   {
      alert("结束日期月份应大于等于起始月份!");
      document.slide_notice.end_month.value="";
      document.slide_notice.end_month.focus();
      return false;
   }  
   if(document.slide_notice.end_day.value=="")
   {
      alert("结束日不能为空!");
      document.slide_notice.end_day.focus();
      return false;
   }
   else if(isNaN(document.slide_notice.end_day.value))
   {
      alert("对不起,只能输入数字!");
      document.slide_notice.end_day.value="";
      document.slide_notice.end_day.focus();
      return false;
   }
   else if(parseFloat(document.slide_notice.end_day.value)<=0 || parseFloat(document.slide_notice.end_day.value)>31)
   {
      alert("所填数值应该在1~31之间!");
      document.slide_notice.end_day.value="";
      document.slide_notice.end_day.focus();
      return false;
   } 
   else if(parseFloat(document.slide_notice.end_month.value)==parseFloat(document.slide_notice.start_month.value) && parseFloat(document.slide_notice.end_day.value)<=parseFloat(document.slide_notice.start_day.value))  
   {
      alert("结束日期应大于起始日期!");
      document.slide_notice.end_day.value="";
      document.slide_notice.end_day.focus();
      return false;
   }    
   if(document.slide_notice.position.value=="")
   {
      alert("请选择公告播放位置!");
      document.slide_notice.position.focus();
      return false;
   }
   return true;
}

//翻页输入框检查函数   修改日期 2007/8/21 09:31  
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
//上传图片四版面函数
function setUploadForm(str)
{
    selectUploadForm(str);
}
function selectUploadForm(str)
{
   switch(str)
  {
     case 'single':
        document.getElementById("vs_upload_single").style.display="block";
        document.getElementById("vs_upload_suite").style.display="none";
        document.getElementById("vs_upload_series").style.display="none";
        document.getElementById("vs_upload_background").style.display="none";
		document.getElementById("vs_upload_gift").style.display="none";
        break;
     case 'suite':
	document.getElementById("vs_upload_single").style.display="none";
	document.getElementById("vs_upload_suite").style.display="block";
	document.getElementById("vs_upload_series").style.display="none";
	document.getElementById("vs_upload_background").style.display="none";
	document.getElementById("vs_upload_gift").style.display="none";
	break;
     case 'series':
	document.getElementById("vs_upload_single").style.display="none";
	document.getElementById("vs_upload_suite").style.display="none";
	document.getElementById("vs_upload_series").style.display="block";
	document.getElementById("vs_upload_background").style.display="none";
	document.getElementById("vs_upload_gift").style.display="none";
	break;
     case 'background':
	document.getElementById("vs_upload_single").style.display="none";
	document.getElementById("vs_upload_suite").style.display="none";
	document.getElementById("vs_upload_series").style.display="none";
	document.getElementById("vs_upload_background").style.display="block";
	document.getElementById("vs_upload_gift").style.display="none";
	break;
	 case 'gift':
	document.getElementById("vs_upload_single").style.display="none";
	document.getElementById("vs_upload_suite").style.display="none";
	document.getElementById("vs_upload_series").style.display="none";
	document.getElementById("vs_upload_background").style.display="none";
	document.getElementById("vs_upload_gift").style.display="block";
	break;
   }
}

//function for Upload_Single
function check_upload_single()
{
   var cb=document.getElementById("checkbox1");
   var obj = document.SingleForm;   
   
   if(document.SingleForm.vm_gender_single.value=="")
   {
     alert("请选择适用性别!");
     document.SingleForm.vm_gender_single.focus();
     return false;
   }   
   if(document.SingleForm.vm_part.value=="")
   {
     alert("请选择部位分类!");
     document.SingleForm.vm_part.focus();
     return false;
   }     
   if(document.SingleForm.vm_name.value=="")
   {
     alert("图片名称不能为空,请确认!");
     document.SingleForm.vm_name.focus();
     return false;
   }   
   if(cb.checked==false)
   {
     if(document.SingleForm.vm_valid.value=="")
     {
       alert("使用期限不能为空,请确认!");
       document.SingleForm.vm_valid.focus();
       return false;
     }
     else if(isNaN(document.SingleForm.vm_valid.value) || parseFloat(document.SingleForm.vm_valid.value)<1 || document.SingleForm.vm_valid.value.indexOf('.')!=-1)
     {
       alert("使用期限应为正整数,请确认!");
       document.SingleForm.vm_valid.value="";
       document.SingleForm.vm_valid.focus();
       return false;
     }   
     if(document.SingleForm.vm_price.value=="")
     {
       alert("普通价格不能为空,请确认!");
       document.SingleForm.vm_price.focus();
       return false;
     }
     else if(isNaN(document.SingleForm.vm_price.value) || parseFloat(document.SingleForm.vm_price.value)<0 || document.SingleForm.vm_price.value.indexOf('.')!=-1)
     {
       alert("普通价格应为正整数,请确认!");
       document.SingleForm.vm_price.value="";
       document.SingleForm.vm_price.focus();
       return false;
     }
     if(document.SingleForm.vm_sprice.value!="")
     {
        if(isNaN(document.SingleForm.vm_sprice.value) || parseFloat(document.SingleForm.vm_sprice.value)<0 || document.SingleForm.vm_sprice.value.indexOf('.')!=-1)
        {
          alert("特价应为正整数,请确认!");
          document.SingleForm.vm_sprice.value="";
          document.SingleForm.vm_sprice.focus();
          return false;
        }
     }
	 
	 //检查发行数量
	 if(obj.issue_num.value!="")
     {
		if (!check_positive_nonzero_int(obj.issue_num, "发行数量应为正整数,请确认!"))
			return false;	 
     }
	 
	 //检查截止日期
	 if ( (obj.end_year.value != "") || (obj.end_month.value != "") || (obj.end_day.value != "") )
	 {
	 	if (!check_date_year(obj.end_year))
			return false;
			
		if (!check_date_month(obj.end_month))
			return false;
			
		if ( !check_date_day(obj.end_day, parseInt(obj.end_year.value), parseInt(obj.end_month.value)) )
			return false;
	 }
   }
   
   if(document.SingleForm.mode.value==0)
   { 
      if(document.SingleForm.vm_o_pic.value=="" || document.SingleForm.vm_v_pic.value=="")
      {
        alert("上传的原始图和表现图路径均不能为空,请确认!");
        return false; 
      }
   }     
   document.SingleForm.action="mitbbs_vshape_manapic.php";
   if(document.SingleForm.mode.value!=0)
   {   
     document.SingleForm.mode.value=1;
   }
   return true;
}

//function for Upload_Suite
function check_upload_suite()
{
	var obj = document.SuiteForm; 

   if(document.SuiteForm.vm_gender_suite.value=="")
   {
     alert("请选择适用性别!");
     document.SuiteForm.vm_gender_suite.focus();
     return false;
   }  
   if(document.SuiteForm.vm_name.value=="")
   {
     alert("图片名称不能为空,请确认!");
     document.SuiteForm.vm_name.focus();
     return false;
   }
   if(document.SuiteForm.vm_valid.value=="")
   {
     alert("使用期限不能为空,请确认!");
     document.SuiteForm.vm_valid.focus();
     return false;
   }
   else if(isNaN(document.SuiteForm.vm_valid.value) || parseFloat(document.SuiteForm.vm_valid.value)<1 || document.SuiteForm.vm_valid.value.indexOf('.')!=-1)
   {
     alert("使用期限应为正整数,请确认!");
     document.SuiteForm.vm_valid.value="";
     document.SuiteForm.vm_valid.focus();
     return false;
   }
   if(document.SuiteForm.vm_price.value=="")
   {
     alert("普通价格不能为空,请确认!");
     document.SuiteForm.vm_price.focus();
     return false;
   }
   else if(isNaN(document.SuiteForm.vm_price.value) || parseFloat(document.SuiteForm.vm_price.value)<0 || document.SuiteForm.vm_price.value.indexOf('.')!=-1)
   {
     alert("普通价格应为正整数,请确认!");
     document.SuiteForm.vm_price.value="";
     document.SuiteForm.vm_price.focus();
     return false;
   }
   if(document.SuiteForm.vm_sprice.value!="")
   {
      if(isNaN(document.SuiteForm.vm_sprice.value) || parseFloat(document.SuiteForm.vm_sprice.value)<0 || document.SuiteForm.vm_sprice.value.indexOf('.')!=-1)
      {
        alert("特价应为正整数,请确认!");
        document.SuiteForm.vm_sprice.value="";
        document.SuiteForm.vm_sprice.focus();
        return false;
      } 
   }
   
	 //检查发行数量
	 if(obj.issue_num.value!="")
     {
		if (!check_positive_nonzero_int(obj.issue_num, "发行数量应为正整数,请确认!"))
			return false;	 
     }
	 
	 //检查截止日期
	 if ( (obj.end_year.value != "") || (obj.end_month.value != "") || (obj.end_day.value != "") )
	 {
	 	if (!check_date_year(obj.end_year))
			return false;
			
		if (!check_date_month(obj.end_month))
			return false;
			
		if ( !check_date_day(obj.end_day, parseInt(obj.end_year.value), parseInt(obj.end_month.value)) )
			return false;
	 }
   
   if(document.SuiteForm.mode.value==0)
   { 
      if(document.SuiteForm.vm_o_pic.value=="" || document.SuiteForm.vm_v_pic.value=="")
      {
        alert("上传的原始图和表现图路径均不能为空,请确认!");
        return false; 
      }
   }  
   if(document.SuiteForm.vm_part.options.length==0)
   {
      alert("套装包含的位置不能为空,请确认!");
      document.SuiteForm.vm_part_all.focus();
      return false;
   }   
   document.SuiteForm.action="mitbbs_vshape_manapic.php"; 
   if(document.SuiteForm.mode.value!=0)
   {   
     document.SuiteForm.mode.value=1;
   }
   return true;
}

//function for Upload_series
function check_upload_series()
{
	var obj = document.SeriesForm; 	

   if(document.SeriesForm.vm_series.value=="")
   {
     alert("请选择系列分类!");
     document.SeriesForm.vm_series.focus();
     return false;
   }   
   if(document.SeriesForm.vm_gender_series.value=="")
   {
     alert("请选择适用性别!");
     document.SeriesForm.vm_gender_series.focus();
     return false;
   }
   if(document.SeriesForm.vm_name.value=="")
   {
     alert("图片名称不能为空,请确认!");
     document.SeriesForm.vm_name.focus();
     return false;
   }
   if(document.SeriesForm.vm_valid.value=="")
   {
     alert("使用期限不能为空,请确认!");
     document.SeriesForm.vm_valid.focus();
     return false;
   }
   else if(isNaN(document.SeriesForm.vm_valid.value) || parseFloat(document.SeriesForm.vm_valid.value)<1 || document.SeriesForm.vm_valid.value.indexOf('.')!=-1)
   {
     alert("使用期限应为正整数,请确认!");
     document.SeriesForm.vm_valid.value="";
     document.SeriesForm.vm_valid.focus();
     return false;
   }
   if(document.SeriesForm.vm_price.value=="")
   {
     alert("普通价格不能为空,请确认!");
     document.SeriesForm.vm_price.focus();
     return false;
   }
   else if(isNaN(document.SeriesForm.vm_price.value) || parseFloat(document.SeriesForm.vm_price.value)<0 || document.SeriesForm.vm_price.value.indexOf('.')!=-1)
   {
     alert("普通价格应为正整数,请确认!");
     document.SeriesForm.vm_price.value="";
     document.SeriesForm.vm_price.focus();
     return false;
   }
   if(document.SeriesForm.vm_sprice.value!="")
   {
      if(isNaN(document.SeriesForm.vm_sprice.value) || parseFloat(document.SeriesForm.vm_sprice.value)<0 || document.SeriesForm.vm_sprice.value.indexOf('.')!=-1)
      {
        alert("特价应为正整数,请确认!");
        document.SeriesForm.vm_sprice.value="";
        document.SeriesForm.vm_sprice.focus();
        return false;
      }    
   }
   
	 //检查发行数量
	 if(obj.issue_num.value!="")
     {
		if (!check_positive_nonzero_int(obj.issue_num, "发行数量应为正整数,请确认!"))
			return false;	 
     }
	 
	 //检查截止日期
	 if ( (obj.end_year.value != "") || (obj.end_month.value != "") || (obj.end_day.value != "") )
	 {
	 	if (!check_date_year(obj.end_year))
			return false;
			
		if (!check_date_month(obj.end_month))
			return false;
			
		if ( !check_date_day(obj.end_day, parseInt(obj.end_year.value), parseInt(obj.end_month.value)) )
			return false;
	 }
   
   if(document.SeriesForm.mode.value==0)
   { 
      if(document.SeriesForm.vm_o_pic.value=="" || document.SeriesForm.vm_v_pic.value=="")
      {
        alert("上传的原始图和表现图路径均不能为空,请确认!");
        return false; 
      }
   } 
   return true;
}

//function for Upload_Background
function check_upload_bg()
{
	var obj = document.BackgroundForm; 

   if(document.BackgroundForm.vm_name.value=="")
   {
     alert("图片名称不能为空,请确认!");
     document.BackgroundForm.vm_name.focus();
     return false;
   }
   if(document.BackgroundForm.vm_valid.value=="")
   {
     alert("使用期限不能为空,请确认!");
     document.BackgroundForm.vm_valid.focus();
     return false;
   }
   else if(isNaN(document.BackgroundForm.vm_valid.value) || parseFloat(document.BackgroundForm.vm_valid.value)<1 || document.BackgroundForm.vm_valid.value.indexOf('.')!=-1)
   {
     alert("使用期限应为正整数,请确认!");
     document.BackgroundForm.vm_valid.value="";
     document.BackgroundForm.vm_valid.focus();
     return false;
   }
   if(document.BackgroundForm.vm_price.value=="")
   {
     alert("普通价格不能为空,请确认!");
     document.BackgroundForm.vm_price.focus();
     return false;
   }
   else if(isNaN(document.BackgroundForm.vm_price.value) || parseFloat(document.BackgroundForm.vm_price.value)<0 || document.BackgroundForm.vm_price.value.indexOf('.')!=-1)
   {
     alert("普通价格应为正整数,请确认!");
     document.BackgroundForm.vm_price.value="";
     document.BackgroundForm.vm_price.focus();
     return false;
   }
   if(document.BackgroundForm.vm_sprice.value!="")
   {
      if(isNaN(document.BackgroundForm.vm_sprice.value) || parseFloat(document.BackgroundForm.vm_sprice.value)<0 || document.BackgroundForm.vm_sprice.value.indexOf('.')!=-1)
      {
        alert("特价应为正整数,请确认!");
        document.BackgroundForm.vm_sprice.value="";
        document.BackgroundForm.vm_sprice.focus();
        return false;
      }
   }
   
     //检查发行数量
	 if(obj.issue_num.value!="")
     {
		if (!check_positive_nonzero_int(obj.issue_num, "发行数量应为正整数,请确认!"))
			return false;	 
     }
	 
	 //检查截止日期
	 if ( (obj.end_year.value != "") || (obj.end_month.value != "") || (obj.end_day.value != "") )
	 {
	 	if (!check_date_year(obj.end_year))
			return false;
			
		if (!check_date_month(obj.end_month))
			return false;
			
		if ( !check_date_day(obj.end_day, parseInt(obj.end_year.value), parseInt(obj.end_month.value)) )
			return false;
	 }
   
   if(document.BackgroundForm.mode.value==0)
   { 
      if(document.BackgroundForm.vm_o_pic.value=="" || document.BackgroundForm.vm_v_pic.value=="")
      {
        alert("上传的原始图和表现图路径均不能为空,请确认!");
        return false; 
      }
   }     
   return true;
}

//function for Upload_gift
function check_upload_gift()
{
	var obj = document.giftForm; 

   if(document.giftForm.vm_name.value=="")
   {
     alert("图片名称不能为空,请确认!");
     document.gift.vm_name.focus();
     return false;
   }
   if(document.giftForm.vm_valid.value=="")
   {
     alert("使用期限不能为空,请确认!");
     document.giftForm.vm_valid.focus();
     return false;
   }
   else if(isNaN(document.giftForm.vm_valid.value) || parseFloat(document.giftForm.vm_valid.value)<1 || document.giftForm.vm_valid.value.indexOf('.')!=-1)
   {
     alert("使用期限应为正整数,请确认!");
     document.giftForm.vm_valid.value="";
     document.giftForm.vm_valid.focus();
     return false;
   }
   if(document.giftForm.vm_price.value=="")
   {
     alert("普通价格不能为空,请确认!");
     document.giftForm.vm_price.focus();
     return false;
   }
   else if(isNaN(document.giftForm.vm_price.value) || parseFloat(document.giftForm.vm_price.value)<0 || document.giftForm.vm_price.value.indexOf('.')!=-1)
   {
     alert("普通价格应为正整数,请确认!");
     document.giftForm.vm_price.value="";
     document.giftForm.vm_price.focus();
     return false;
   }
   if(document.giftForm.vm_sprice.value!="")
   {
      if(isNaN(document.giftForm.vm_sprice.value) || parseFloat(document.giftForm.vm_sprice.value)<0 || document.giftForm.vm_sprice.value.indexOf('.')!=-1)
      {
        alert("特价应为正整数,请确认!");
        document.giftForm.vm_sprice.value="";
        document.giftForm.vm_sprice.focus();
        return false;
      }
   }
   
     //检查发行数量
	 if(obj.issue_num.value!="")
     {
		if (!check_positive_nonzero_int(obj.issue_num, "发行数量应为正整数,请确认!"))
			return false;	 
     }
	 
	 //检查截止日期
	 if ( (obj.end_year.value != "") || (obj.end_month.value != "") || (obj.end_day.value != "") )
	 {
	 	if (!check_date_year(obj.end_year))
			return false;
			
		if (!check_date_month(obj.end_month))
			return false;
			
		if ( !check_date_day(obj.end_day, parseInt(obj.end_year.value), parseInt(obj.end_month.value)) )
			return false;
	 }
   
   if(document.giftForm.mode.value==0)
   { 
      if(document.giftForm.vm_o_pic.value=="" || document.giftForm.vm_v_pic.value=="")
      {
        alert("上传的原始图和表现图路径均不能为空,请确认!");
        return false; 
      }
   }     
   return true;
}

// function for Upload--SuiteAbout
function move(fbox, tbox)
{
   var arrFbox = new Array();
   var arrTbox = new Array();
   var arrLookup = new Array();
   var i;
   for (i = 0; i < tbox.length; i++)
   {
      arrLookup[tbox.options[i].text] = tbox.options[i].value;
      arrTbox[i] = tbox.options[i].text;
   }
   var fLength = 0;
   var tLength = arrTbox.length;
   for(i = 0; i < fbox.options.length; i++)
   {
      arrLookup[fbox.options[i].text] = fbox.options[i].value;
      if (fbox.options[i].selected && fbox.options[i].value != "")
      {
         arrTbox[tLength] = fbox.options[i].text;
         tLength++;
      }
      else
      {
         arrFbox[fLength] = fbox.options[i].text;
         fLength++;
      }
   }
   arrFbox.sort();
   arrTbox.sort();
   fbox.length = 0;
   tbox.length = 0;
   var c;
   for(c = 0; c < arrFbox.length; c++)
   {
      var no = new Option();
      no.value = arrLookup[arrFbox[c]];
      no.text = arrFbox[c];
      fbox[c] = no;
   }
   for(c = 0; c < arrTbox.length; c++)
   {
      var no = new Option();
      no.value = arrLookup[arrTbox[c]];
      no.text = arrTbox[c];
      tbox[c] = no;
   }
}

function select_all()
{
   for(var i=0;i<document.SuiteForm.vm_part.options.length;i++)
   {
      
      if(document.SuiteForm.vm_part.options[i]!="")
      {
         document.SuiteForm.vm_part.options[i].selected=true;
      }      
   }
   document.SuiteForm.vm_part_all.name='vm_part_all[]';
   document.SuiteForm.vm_part.name='vm_part[]';
}

//Change readOnly Property Add by Harry Zhang
function changeRO_onLoad()
{
   var cb=document.getElementById("checkbox1");
   if(cb.checked==true)
   {
      document.SingleForm.vm_price.readOnly=true;
      document.SingleForm.vm_price.value=0;
      document.SingleForm.vm_sprice.readOnly=true;
      document.SingleForm.vm_sprice.value=0;      
      document.SingleForm.vm_valid.readOnly=true;
      document.SingleForm.vm_valid.value=0;
	  document.SingleForm.issue_num.readOnly=true;
      document.SingleForm.issue_num.value=0;
	  document.SingleForm.end_year.readOnly=true;
      document.SingleForm.end_year.value="0000";
	  document.SingleForm.end_month.readOnly=true;
      document.SingleForm.end_month.value="00";
	  document.SingleForm.end_day.readOnly=true;
      document.SingleForm.end_day.value="00";
   }
   else 
   {
      document.SingleForm.vm_price.readOnly=false;
      document.SingleForm.vm_sprice.readOnly=false;
      document.SingleForm.vm_valid.readOnly=false;
	  document.SingleForm.issue_num.readOnly=false;
	  document.SingleForm.end_year.readOnly=false;
	  document.SingleForm.end_month.readOnly=false;
	  document.SingleForm.end_day.readOnly=false;
   }
}

function changeRO()
{
   var cb=document.getElementById("checkbox1");
   if(cb.checked==true)
   {
      document.SingleForm.vm_price.readOnly=true;
      document.SingleForm.vm_price.value=0;
      document.SingleForm.vm_sprice.readOnly=true;
      document.SingleForm.vm_sprice.value=0;      
      document.SingleForm.vm_valid.readOnly=true;
      document.SingleForm.vm_valid.value=0;
	  document.SingleForm.issue_num.readOnly=true;
      document.SingleForm.issue_num.value=0;
	  document.SingleForm.end_year.readOnly=true;
      document.SingleForm.end_year.value="0000";
	  document.SingleForm.end_month.readOnly=true;
      document.SingleForm.end_month.value="00";
	  document.SingleForm.end_day.readOnly=true;
      document.SingleForm.end_day.value="00";
   }
   else 
   {
      document.SingleForm.vm_price.readOnly=false;
      document.SingleForm.vm_price.value="";
      document.SingleForm.vm_sprice.readOnly=false;
      document.SingleForm.vm_sprice.value="";
      document.SingleForm.vm_valid.readOnly=false;
      document.SingleForm.vm_valid.value="";
	  document.SingleForm.issue_num.readOnly=false;
      document.SingleForm.issue_num.value="";
	  document.SingleForm.end_year.readOnly=false;
      document.SingleForm.end_year.value="";
	  document.SingleForm.end_month.readOnly=false;
      document.SingleForm.end_month.value="";
	  document.SingleForm.end_day.readOnly=false;
      document.SingleForm.end_day.value="";
   }
}

function check_secondhand_trade()
{
	if(document.add_form.sale_price.value == "")
	{
		alert("价格不能为空!!");
		document.add_form.sale_price.focus();
		return false;
	}
	else if(isNaN(document.add_form.sale_price.value) || parseFloat(document.add_form.sale_price.value)<0 || document.add_form.sale_price.value.indexOf('.')!=-1)
	{
		alert("价格应为正整数!!");
		document.add_form.sale_price.value = "";
		document.add_form.sale_price.focus();
		return false;
	}

	if (document.add_form.title.value == "")
	{
		alert("标题不能为空!!");
		document.add_form.title.focus();
		return false;
	}
		
	return;
}

/*将已经配置形象的用户切换到当前配置
	my_equip: 当前配置的配置串
	my_base_id: 当前配置的base_id
	style_set: 当前显示风格设置
	lowie_flag: 低版本IE标志
	base_id:	当前操作的base_id
*/
function changeto_current_equip(my_equip, my_base_id, style_set, lowie_flag, base_id)
{
	if (my_base_id == base_id)
	{
		document.equipform.userequip.value = my_equip;
		showit(my_equip, 'bodyshow', style_set, 0, 0, lowie_flag); 
		show_equip_list(my_equip, 'bodyshow', style_set);
	}
	else
		window.location.href = '/virtual_shape/mitbbs_vshape_index.php?base_id=' + my_base_id;

	return;
}
