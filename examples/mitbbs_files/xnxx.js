/*����: ��ʾ��װ����Ʒ�б�
  ����: equip_str-�������ַ���
  ����: ��
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
			
		//���Ƿ�ΪϵͳĬ�ϵ�ͼƬ
		if (flag == 1)
			continue;
			
		if (j == 0) //����
		{
			pic_type = 3;
			pic_posno = 0;
		}
		else if (j == 1) //ϵ��
		{
			pic_type = 2;
			pic_posno = 0;
		}
		else if(j == showlayers.length-2) //��Ʒ
		{
			pic_type = 4;
			pic_posno = 0;	
		}else if(j == showlayers.length-1) //����
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

/*���������������Ϊ��������ʾ��������(�Դ�, װ��ʱ��)
  ����: equip-������(�ַ�����ʽ: id,�����ļ���,flag>id,ϵ���ļ���,flag>
					id,ģ��ͼ�ļ���,flag>id,��Ʒ1λ�����,��Ʒ1�ļ���,flag/
					id,��װ1λ�����,��װ1�ļ���,flag>...>id,��Ʒnλ�����,��Ʒn�ļ���,flag/
					id,��װnλ�����,��װn�ļ���,flag>id,��Ʒ�ļ���,flag>id,�����ļ���,flag
					����, ��װ��λ����Ÿ�ʽΪ:p1-p2-p3
					id,flag: flag=1  ϵͳĬ����Ʒ, ��ʱidΪmerchandise_id
							  flag=2  ��վδ����Ʒ, ��ʱidΪmerchandise_id
							  flag=3  ����δ����Ʒ, ��ʱidΪsale_id
							  flag=4  �ѹ���Ʒ, ��ʱidΪsave_id
							  flag=5  ѡ���ģ��, ��ʱidΪģ��id: 1-��ģ��; 2-Ůģ��
					)
		divid-��ʾ�õ�����id
		style_set-��ʾ�õ� style 
		pic_width-��
		pic_height-��
		lowie_flag-�Ͱ汾IE(5.5-6.9)��־
*/
function showit(equip, divid, style_set, pic_width, pic_height, lowie_flag)
{
	var str = "";
	var obj = document.getElementById(divid);
	var zindex = 0;
	var tmp_split = "";


	/*����ʹ��png-24��ͼƬ, ���Ͱ汾��IE(5.5-6.9)��֧����͸��Ч��, 
	  ��˱������AlphaImageLoader�˾������������.
	  ע��: IE7.0��ʼ֧��png-24ͼƬ��͸��Ч��
	*/
	showlayers = equip.split(">"); 
	
	//��ʾ����ͼ
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
	
	//��ʾϵ��ͼ
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

	//��ʾģ��ͼ
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

	//�ԡ�>��Ϊ�ָ������������ͼƬ����һ������ showlayers[]
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
	
	//��ʾ��Ʒͼ
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

	//��ʾ����ͼ
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
	//���������һ�㸲��һ����ȫ͸����ͼƬ�������û�����������>���ΪҲֻ�ܱ������ͼ�ˣ�
	if ( (pic_width == 0) && (pic_height == 0) )
		str += "<img src='/virtual_shape/images/blank.png' style='" + style_set + "z-index:" + zindex + ";'>";
	else
		str += "<img src='/virtual_shape/images/blank.png' width='" + pic_width + "' height='" + pic_height + "' style='" + style_set + "z-index:" + zindex + ";'>";

	//��ʾ����ͼƬ��
	obj.innerHTML = str; 
}

/*����: ���������м���ϵͳĬ������
  ����: equip_str-�������ַ���
  		sysdefault_str-ϵͳĬ�������ַ���
  ����: ��������
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
			
			//ϵͳĬ��λ���Ƿ���װ��?
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

/*����������ڸ�������
  ����: type-1:��Ʒ; 2:��װ; 3:ϵ��; 4:���� 5:��Ʒ��layer Ϊ1Ϊ���⣩
  		layer-����ͼƬ���ڵĲ���
		img-����ͼƬ��ͼƬ��
		divid-��ʾ�õ�����id
		style_set-��ʾ�õ� style 
		id,op_flag-op_flag=1 ��վ�̳�����, idΪmerchandise_id
					op_flag=2 �����̳�����, idΪsale_id
					op_flag=3 �ҵ���Ʒ����, idΪsave_id
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
	
	if (type == 3) //��ϵ��?
	{
		tmp_explit = showlayers[1].split(',');	
		
		//��ϵ��ͼƬ�Ƿ��Ѵ���?
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
		//��ʾ��������
		showit(newequip, divid, style_set, 0, 0, lowie_flag);
		
		//�����뱣��
		document.equipform.userequip.value = newequip;
		
		//��ʾ��װ����Ʒ�б�
		show_equip_list(newequip, divid, style_set);
		
		return;
	}
	else if (type == 4) //������?
	{
		tmp_explit = showlayers[0].split(',');	
		
		//�б���ͼƬ�Ƿ��Ѵ���?
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
			newequip += ">" + showlayers[i]; //������ͼƬ����
			
		//��ʾ��������
		showit(newequip, divid, style_set, 0, 0, lowie_flag);
		
		//�����뱣��
		document.equipform.userequip.value = newequip;
		
		//��ʾ��װ����Ʒ�б�
		show_equip_list(newequip, divid, style_set);
		return;
	}else if(type==5) //����Ʒ �� ������(layerΪ1ʱΪ����)
	{
		if(layer!=1)
		{
			tmp_explit = showlayers[showlayers.length-2].split(',');	
		
			//����ƷͼƬ�Ƿ��Ѵ���?
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
				newequip += ">" + showlayers[i]; //������ͼƬ����
		
			newequip += (">"+id + "," + img + "," + flag);	
			newequip += (">"+showlayers[showlayers.length-1]);
		}else
		{
			tmp_explit = showlayers[showlayers.length-1].split(',');	
		
			//�е���ͼƬ�Ƿ��Ѵ���?
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
				newequip += ">" + showlayers[i]; //������ͼƬ����
		
			newequip += (">"+id + "," + img + "," + flag);	
		}
		//��ʾ��������
		showit(newequip, divid, style_set, 0, 0, lowie_flag);
		
		//�����뱣��
		document.equipform.userequip.value = newequip;
		
		//��ʾ��װ����Ʒ�б�
		show_equip_list(newequip, divid, style_set);
		return;
	}

	/*����Ʒ/��װ*/
	if (!layer)
		return;
		
	//�е�ǰ��Ʒ�Ƿ�������?
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
	
	//����
	newequip += showlayers[0];

	//ϵ���ļ���ӦΪ��
	newequip += ">0,,0";

	//ģ��ͼ
	newequip += (">0,basepic_" + document.equipform.base_id.value + ".png" + ",0");

	//������ܵĳ�ͻ
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

	//��ʼװ��
	j = 1;
	min_pos = parseInt(tmp_explit_2[0]);
	for(i=3; i<showlayers.length-2; i++)
	{
		if(j == min_pos)
			newequip += (">" + id + "," + layer + "," + img + "," + flag); //��Ϊ���ͼ
		else 
		{
			found_flag = 0;
		
			//����װ�Ĵ���
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
				newequip += ">" + showlayers[i]; //������ͼƬ����
		}
			
		j++;
	}
	newequip +=(">"+showlayers[showlayers.length-2]);
	newequip +=(">"+showlayers[showlayers.length-1]);

	//ϵͳĬ�����ô���
	if (sys_default)
		newequip = equip_join_sysdefault(newequip, sys_default);

	//��ʾ��������
	showit(newequip, divid, style_set, 0, 0, lowie_flag); 
	
	//�����뱣��
	document.equipform.userequip.value = newequip;
	
	//��ʾ��װ����Ʒ�б�
	show_equip_list(newequip, divid, style_set);
}

/*��������������·�
  ����: type-1:��λ; 2:ϵ��; 3:���� 4:��Ʒ��posnoΪ1Ϊ���⣬����Ϊ0��
  		posno-��λλ�����(type=2/3ʱΪ0)
		divid-��ʾ�õ�����id
		style_set-��ʾ�õ� style 
*/
function undressit(type, posno, divid, style_set)
{
	var newequip="";
	var myequip = document.equipform.userequip.value;
	var sys_default = document.equipform.sys_default.value;
	var tmp_explit="";
	
	
	lowie_flag = parseInt(document.equipform.lowie_flag.value);
	showlayers = myequip.split('>');
	
	if (type == 3) //�ѱ���
	{
		showlayers[0] = "0,,0";
		newequip = showlayers.join(">");
		
		//��ʾ��������
		showit(newequip, divid, style_set, 0, 0, lowie_flag);
		
		//�����뱣��
		document.equipform.userequip.value = newequip;
		
		//��ʾ��װ����Ʒ�б�
		show_equip_list(newequip, divid, style_set);
		return;
	}else if(type==4) //����Ʒ
	{
		if(posno!=1) //Ϊ��Ʒ
		{
			showlayers[showlayers.length-2] = "0,,0";
		}else
		{
			showlayers[showlayers.length-1] = "0,,0";
		}
			
		newequip = showlayers.join(">");
		
		//��ʾ��������
		showit(newequip, divid, style_set, 0, 0, lowie_flag);
		
		//�����뱣��
		document.equipform.userequip.value = newequip;
		
		//��ʾ��װ����Ʒ�б�
		show_equip_list(newequip, divid, style_set);
		return;
	}
	else if (type == 2) //��ϵ��
	{
		showlayers[1] = "0,,0";
		showlayers[2] = "0,basepic_" + document.equipform.base_id.value + ".png" + ",0";
	}
	else //�Ѳ�λ
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
	
	//ϵͳĬ�����ô���
	if (sys_default)
		newequip = equip_join_sysdefault(newequip, sys_default);

	//��ʾ��������
	showit(newequip, divid, style_set, 0, 0, lowie_flag);
	
	//�����뱣��
	document.equipform.userequip.value = newequip;
	
	//��ʾ��װ����Ʒ�б�
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

//����Ƿ�Ϊ������
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

//����Ƿ�Ϊ��0������
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

//����Ƿ�Ϊ���ı�
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

//���ڼ��(��)
function check_date_year(obj)
{
	if (!check_text(obj, "��ݲ���Ϊ��!"))
		return false;

	if (!check_positive_nonzero_int(obj, "���ӦΪ������!"))
		return false;
		
	if(parseInt(obj.value) < 2000)
	{
		alert("���������ݹ��ڳ¾�,��������д!");
		obj.focus();
		return false;
	}
	
	return true;
}

//���ڼ��(��)
function check_date_month(obj)
{
	if (!check_text(obj, "�·ݲ���Ϊ��!"))
		return false;
		
	if (!check_positive_nonzero_int(obj, "�·�ӦΪ������!"))
		return false;
		
	month = parseInt(obj.value);
	if (month < 1 || month > 12)
	{
		alert("�·���ֵӦ����1~12֮��!");
		obj.focus();
		return false;
	}
	
	return true;
}

//���ڼ��(��)
function check_date_day(obj, year, month)
{
	if (!check_text(obj, "����ֵ����Ϊ��!"))
		return false;
		
	if (!check_positive_nonzero_int(obj, "����ֵӦΪ������!"))
		return false;
		
	day = parseInt(obj.value);
	if (day < 1 || day > 31)
	{
		alert("����ֵӦ����1~31֮��!");
		obj.focus();
		return false;
	}
	
	if((month==4 || month==6 || month==9 || month==11) && (day==31))
	{
		alert("����ֵӦ����1~30֮��!");
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
				alert("����ֵӦ����1~29֮��!");
				obj.focus();
				return false;
			}
		}
		else
		{
			if (day > 28)
			{
				alert("����ֵӦ����1~28֮��!");
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

	if( !check_text(obj.part_name, "����д��λ����!") ) 
		return false;
		
	if( !check_positive_nonzero_int(obj.part_pos, "λ�ô���, ��������д!") ) 
		return false;
		
	document.form.submit();
}

function part_del(id)
{
	var obj = document.form;

	if (confirm('���Ƿ�ȷ��ɾ����ǰ��λ��')) 
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

	if( !check_text(obj.class_name, "����д��������!") ) 
		return false;
		
	document.form.submit();
}

function seriesclass_del(id)
{
	var obj = document.form;

	if (confirm('���Ƿ�ȷ��ɾ����ǰ���ࣿ')) 
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

//����-�����ﳵ
function buy_it_mitbbs(baseid, id, ptype)
{
	var gtype = 1;

	if (ptype)
		gtype = ptype;
	
	document.equipform.action = "/virtual_shape/mitbbs_vshape_buylist.php?id=" + id + "&baseid=" + baseid + "&type=" + gtype;
	document.equipform.submit();
	return;
}

//������Ʒ��������--�˶���ֻ�ǽ���Ʒ���빺�ﳵ
function buy_again(base_id, id)
{
    if(confirm("����Ʒ�ѹ���,�Ƿ���빺�ﳵ�ٴι���֮?"))
    {
       buy_it_mitbbs(base_id, id, 1);
    }
    return;    
}

//�Դ�����-�����ﳵ
function tryon_buy_mitbbs(baseid)
{
	var userequip_str = document.equipform.userequip.value;
	var pic_base;
	var have_flag, tmp_split;
	

	//�Դ���Ʒ���
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
			
		//���Ƿ�ΪϵͳĬ�ϵ�ͼƬ
		if (flag == 1)
			continue;
			
		have_flag = 1;
		break;
	}

	if (have_flag == 0)
	{
		alert("����ʧ��, ������û���Դ���Ʒ!!");
		return;
	}

	document.equipform.action = "/virtual_shape/mitbbs_vshape_buylist.php?id=0" + "&baseid=" + baseid + "&tryflag=1";
	document.equipform.submit();
	return;
}

//���ﳵ����
function buylist_paymoney()
{
	var obj = document.equipform;
	
	if (parseInt(obj.totalnum.value) <= 0)
	{
		alert("����ʧ��, ���Ĺ��ﳵ��û����Ʒ!!");
		return;
	}
	
	if ( parseFloat(obj.totalmoney.value) > parseFloat(obj.youcash.value) )
	{
		alert("����ʧ��, �����ֽ𲻹�!!");
		return;
	}
	
	if (confirm('        ����ȷ��\n\n'+'������Ʒ��'+obj.totalnum.value+' ��\n'+'�����'+obj.totalmoney.value+' α��'))
	{
		obj.action = "/virtual_shape/mitbbs_vshape_buy.php?mode=1";
		obj.submit();
	}
	
	return;
}

//����
function largess_it(id, type)
{
	var link_addr;
	
	link_addr = "/virtual_shape/mitbbs_vshape_largess.php?id=" + id + "&type=" + type;
	window.open(link_addr);
}

//��������ҳ���ݸ�������
function change_content_1(baseid, mode, mtype, id, sno, confid)
{
	obj = document.getElementById("config_name");
	document.equipform.conf_name_save.value = obj.value;
	document.equipform.action = "/virtual_shape/mitbbs_vshape_shapeset.php?base_id=" + baseid + "&confid=" + confid + "&mode=" + mode + "&type=" + mtype + "&id=" + id + "&sno=" + sno;
	document.equipform.submit();
}

//��Ʒ�б�ҳ���ݸ�������
function change_content_2(baseid, mode, id, sno)
{
	document.equipform.action = "/virtual_shape/mitbbs_vshape_merchandise_list.php?base_id=" + baseid + "&mode=" + mode + "&id=" + id + "&sno=" + sno;
	document.equipform.submit();
}

//��Ʒ�б�ҳ->��������ҳ����
function change_content_3(baseid)
{
	document.equipform.action = "/virtual_shape/mitbbs_vshape_index.php?base_id=" + baseid;
	document.equipform.submit();
}

//���ֽ����б�ҳ���ݸ�������
function change_content_4(baseid, mtype, partid, sno)
{
	document.equipform.action = "/virtual_shape/mitbbs_vshape_secondhand_list.php?base_id=" + baseid + "&type=" + mtype + "&part_id=" + partid + "&sno=" + sno;
	document.equipform.submit();
}

//�û��������ñ���
function save_conf()
{
	if (confirm('���Ƿ�ȷ�����浱ǰ���ã�'))
	{
		obj = document.getElementById("config_name");
		if (!check_text(obj, "����������Ϊ��!"))
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
		alert("��ѡ�����!!");
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

	if (confirm('���Ƿ�ȷ���ӹ��ﳵ��ɾ����ǰ��Ʒ��')) 
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

	if (confirm('���Ƿ�ȷ����չ��ﳵ��')) 
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
	alert('��Ǹ, ������װ�����Ʒ!!');
	return;
}

function undo_secondhand(save_id)
{
	var obj = document.equipform;

	if (confirm('���Ƿ�ȷ������ת����ǰ��Ʒ��')) 
	{
		obj.pflag.value = 1;
		obj.saveid.value = save_id;
		obj.action = document.location;
		obj.submit();
	}
	
	return;
}

//��Ϊ��ǰ����
function set_currconf(confid, opid)
{
	if (confirm('���Ƿ�Ҫ����������Ϊ��ǰ����?'))
	{
		link_addr = "/virtual_shape/mitbbs_vshape_conf_list.php?confid=" + confid + "&oflag=1&opid=" + opid;
		document.setdel_curr_form.action = link_addr;
		document.setdel_curr_form.submit();
	}
}

//ɾ����ѡ����
function del_currconf(confid, opid)
{
	if (confirm('���Ƿ�Ҫ��������ɾ��?'))
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
      alert("������ⲻ��Ϊ��,��ȷ��!");
      document.add_bulletin_form.bulletin_title.focus();
      return false;
   }
   if(document.add_bulletin_form.bulletin_content.value=="")
   {
      alert("�������ݲ���Ϊ��,��ȷ��!");
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
      alert("������������ⲻ��Ϊ��!");
      document.slide_notice.sn_title.focus();
      return false;
   }
   if(document.slide_notice.sn_content.value=="")
   {
      alert("�������������ݲ���Ϊ��!");
      document.slide_notice.sn_content.focus();
      return false;
   }
   if(document.slide_notice.start_year.value=="")
   {
      alert("��ʼ��ݲ���Ϊ��!");
      document.slide_notice.start_year.focus();
      return false;
   }
   else if(isNaN(document.slide_notice.start_year.value))
   {
      alert("�Բ���,ֻ����������!");
      document.slide_notice.start_year.value="";
      document.slide_notice.start_year.focus();
      return false;
   }     
   else if(parseFloat(document.slide_notice.start_year.value)<year)
   {
      alert("���������ݹ��ڳ¾�,��������д!");
      document.slide_notice.start_year.value="";
      document.slide_notice.start_year.focus();
      return false;
   }
   if(document.slide_notice.start_month.value=="")
   {
      alert("��ʼ�·ݲ���Ϊ��!");
      document.slide_notice.start_month.focus();
      return false;
   }
   else if(isNaN(document.slide_notice.start_month.value))
   {
      alert("�Բ���,ֻ����������!");
      document.slide_notice.start_month.value="";
      document.slide_notice.start_month.focus();
      return false;
   } 
   else if(document.slide_notice.start_month.value<=0 || document.slide_notice.start_month.value>12)
   {
      alert("�·���ֵӦ����1~12֮��!");
      document.slide_notice.start_month.value="";
      document.slide_notice.start_month.focus();
      return false;
   }    
   if(document.slide_notice.start_day.value=="")
   {
      alert("��ʼ�ղ���Ϊ��!");
      document.slide_notice.start_day.focus();
      return false;
   }
   else if(isNaN(document.slide_notice.start_day.value))
   {
      alert("�Բ���,ֻ����������!");
      document.slide_notice.start_day.value="";
      document.slide_notice.start_day.focus();
      return false;
   }    
   else if(document.slide_notice.start_day.value<=0 || document.slide_notice.start_day.value>31)
   {
      alert("������ֵӦ����1~31֮��!");
      document.slide_notice.start_day.value="";
      document.slide_notice.start_day.focus();
      return false;
   }   
   if(document.slide_notice.end_year.value=="")
   {
      alert("������ݲ���Ϊ��!");
      document.slide_notice.end_year.focus();
      return false;
   }
   else if(isNaN(document.slide_notice.end_year.value))
   {
      alert("�Բ���,ֻ����������!");
      document.slide_notice.end_year.value="";
      document.slide_notice.end_year.focus();
      return false;
   } 
   else if(parseFloat(document.slide_notice.end_year.value)<parseFloat(document.slide_notice.start_year.value)) 
   {
      alert("�����������Ӧ���ڵ�����ʼ���!");
      document.slide_notice.end_year.value="";
      document.slide_notice.end_year.focus();
      return false;
   }   
   if(document.slide_notice.end_month.value=="")
   {
      alert("�����·ݲ���Ϊ��!");
      document.slide_notice.end_month.focus();
      return false;
   }
   else if(isNaN(document.slide_notice.end_month.value))
   {
      alert("�Բ���,ֻ����������!");
      document.slide_notice.end_month.value="";
      document.slide_notice.end_month.focus();
      return false;
   } 
   else if(parseFloat(document.slide_notice.end_month.value)<=0 || parseFloat(document.slide_notice.end_month.value)>12)
   {
      alert("�·���ֵӦ����1~12֮��!");
      document.slide_notice.end_month.value="";
      document.slide_notice.end_month.focus();
      return false;
   }
   else if(parseFloat(document.slide_notice.end_year.value)==parseFloat(document.slide_notice.start_year.value) && parseFloat(document.slide_notice.end_month.value)<parseFloat(document.slide_notice.start_month.value))  
   {
      alert("���������·�Ӧ���ڵ�����ʼ�·�!");
      document.slide_notice.end_month.value="";
      document.slide_notice.end_month.focus();
      return false;
   }  
   if(document.slide_notice.end_day.value=="")
   {
      alert("�����ղ���Ϊ��!");
      document.slide_notice.end_day.focus();
      return false;
   }
   else if(isNaN(document.slide_notice.end_day.value))
   {
      alert("�Բ���,ֻ����������!");
      document.slide_notice.end_day.value="";
      document.slide_notice.end_day.focus();
      return false;
   }
   else if(parseFloat(document.slide_notice.end_day.value)<=0 || parseFloat(document.slide_notice.end_day.value)>31)
   {
      alert("������ֵӦ����1~31֮��!");
      document.slide_notice.end_day.value="";
      document.slide_notice.end_day.focus();
      return false;
   } 
   else if(parseFloat(document.slide_notice.end_month.value)==parseFloat(document.slide_notice.start_month.value) && parseFloat(document.slide_notice.end_day.value)<=parseFloat(document.slide_notice.start_day.value))  
   {
      alert("��������Ӧ������ʼ����!");
      document.slide_notice.end_day.value="";
      document.slide_notice.end_day.focus();
      return false;
   }    
   if(document.slide_notice.position.value=="")
   {
      alert("��ѡ�񹫸沥��λ��!");
      document.slide_notice.position.focus();
      return false;
   }
   return true;
}

//��ҳ������麯��   �޸����� 2007/8/21 09:31  
function checkpage()
{
    if(isNaN(document.pageform1.page.value) || parseFloat(document.pageform1.page.value)<=0 || document.pageform1.page.value.indexOf('.')!=-1)
    {
       alert("�Բ���,ֻ������������!");
       document.pageform1.page.value="";
       document.pageform1.page.focus();
       return false;
    }     
    else if(isNaN(document.pageform2.page.value) || parseFloat(document.pageform2.page.value)<=0 || document.pageform2.page.value.indexOf('.')!=-1)
    {
       alert("�Բ���,ֻ������������!");
       document.pageform2.page.value="";
       document.pageform2.page.focus();
       return false;
    }    
    return true;
}
//�ϴ�ͼƬ�İ��溯��
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
     alert("��ѡ�������Ա�!");
     document.SingleForm.vm_gender_single.focus();
     return false;
   }   
   if(document.SingleForm.vm_part.value=="")
   {
     alert("��ѡ��λ����!");
     document.SingleForm.vm_part.focus();
     return false;
   }     
   if(document.SingleForm.vm_name.value=="")
   {
     alert("ͼƬ���Ʋ���Ϊ��,��ȷ��!");
     document.SingleForm.vm_name.focus();
     return false;
   }   
   if(cb.checked==false)
   {
     if(document.SingleForm.vm_valid.value=="")
     {
       alert("ʹ�����޲���Ϊ��,��ȷ��!");
       document.SingleForm.vm_valid.focus();
       return false;
     }
     else if(isNaN(document.SingleForm.vm_valid.value) || parseFloat(document.SingleForm.vm_valid.value)<1 || document.SingleForm.vm_valid.value.indexOf('.')!=-1)
     {
       alert("ʹ������ӦΪ������,��ȷ��!");
       document.SingleForm.vm_valid.value="";
       document.SingleForm.vm_valid.focus();
       return false;
     }   
     if(document.SingleForm.vm_price.value=="")
     {
       alert("��ͨ�۸���Ϊ��,��ȷ��!");
       document.SingleForm.vm_price.focus();
       return false;
     }
     else if(isNaN(document.SingleForm.vm_price.value) || parseFloat(document.SingleForm.vm_price.value)<0 || document.SingleForm.vm_price.value.indexOf('.')!=-1)
     {
       alert("��ͨ�۸�ӦΪ������,��ȷ��!");
       document.SingleForm.vm_price.value="";
       document.SingleForm.vm_price.focus();
       return false;
     }
     if(document.SingleForm.vm_sprice.value!="")
     {
        if(isNaN(document.SingleForm.vm_sprice.value) || parseFloat(document.SingleForm.vm_sprice.value)<0 || document.SingleForm.vm_sprice.value.indexOf('.')!=-1)
        {
          alert("�ؼ�ӦΪ������,��ȷ��!");
          document.SingleForm.vm_sprice.value="";
          document.SingleForm.vm_sprice.focus();
          return false;
        }
     }
	 
	 //��鷢������
	 if(obj.issue_num.value!="")
     {
		if (!check_positive_nonzero_int(obj.issue_num, "��������ӦΪ������,��ȷ��!"))
			return false;	 
     }
	 
	 //����ֹ����
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
        alert("�ϴ���ԭʼͼ�ͱ���ͼ·��������Ϊ��,��ȷ��!");
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
     alert("��ѡ�������Ա�!");
     document.SuiteForm.vm_gender_suite.focus();
     return false;
   }  
   if(document.SuiteForm.vm_name.value=="")
   {
     alert("ͼƬ���Ʋ���Ϊ��,��ȷ��!");
     document.SuiteForm.vm_name.focus();
     return false;
   }
   if(document.SuiteForm.vm_valid.value=="")
   {
     alert("ʹ�����޲���Ϊ��,��ȷ��!");
     document.SuiteForm.vm_valid.focus();
     return false;
   }
   else if(isNaN(document.SuiteForm.vm_valid.value) || parseFloat(document.SuiteForm.vm_valid.value)<1 || document.SuiteForm.vm_valid.value.indexOf('.')!=-1)
   {
     alert("ʹ������ӦΪ������,��ȷ��!");
     document.SuiteForm.vm_valid.value="";
     document.SuiteForm.vm_valid.focus();
     return false;
   }
   if(document.SuiteForm.vm_price.value=="")
   {
     alert("��ͨ�۸���Ϊ��,��ȷ��!");
     document.SuiteForm.vm_price.focus();
     return false;
   }
   else if(isNaN(document.SuiteForm.vm_price.value) || parseFloat(document.SuiteForm.vm_price.value)<0 || document.SuiteForm.vm_price.value.indexOf('.')!=-1)
   {
     alert("��ͨ�۸�ӦΪ������,��ȷ��!");
     document.SuiteForm.vm_price.value="";
     document.SuiteForm.vm_price.focus();
     return false;
   }
   if(document.SuiteForm.vm_sprice.value!="")
   {
      if(isNaN(document.SuiteForm.vm_sprice.value) || parseFloat(document.SuiteForm.vm_sprice.value)<0 || document.SuiteForm.vm_sprice.value.indexOf('.')!=-1)
      {
        alert("�ؼ�ӦΪ������,��ȷ��!");
        document.SuiteForm.vm_sprice.value="";
        document.SuiteForm.vm_sprice.focus();
        return false;
      } 
   }
   
	 //��鷢������
	 if(obj.issue_num.value!="")
     {
		if (!check_positive_nonzero_int(obj.issue_num, "��������ӦΪ������,��ȷ��!"))
			return false;	 
     }
	 
	 //����ֹ����
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
        alert("�ϴ���ԭʼͼ�ͱ���ͼ·��������Ϊ��,��ȷ��!");
        return false; 
      }
   }  
   if(document.SuiteForm.vm_part.options.length==0)
   {
      alert("��װ������λ�ò���Ϊ��,��ȷ��!");
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
     alert("��ѡ��ϵ�з���!");
     document.SeriesForm.vm_series.focus();
     return false;
   }   
   if(document.SeriesForm.vm_gender_series.value=="")
   {
     alert("��ѡ�������Ա�!");
     document.SeriesForm.vm_gender_series.focus();
     return false;
   }
   if(document.SeriesForm.vm_name.value=="")
   {
     alert("ͼƬ���Ʋ���Ϊ��,��ȷ��!");
     document.SeriesForm.vm_name.focus();
     return false;
   }
   if(document.SeriesForm.vm_valid.value=="")
   {
     alert("ʹ�����޲���Ϊ��,��ȷ��!");
     document.SeriesForm.vm_valid.focus();
     return false;
   }
   else if(isNaN(document.SeriesForm.vm_valid.value) || parseFloat(document.SeriesForm.vm_valid.value)<1 || document.SeriesForm.vm_valid.value.indexOf('.')!=-1)
   {
     alert("ʹ������ӦΪ������,��ȷ��!");
     document.SeriesForm.vm_valid.value="";
     document.SeriesForm.vm_valid.focus();
     return false;
   }
   if(document.SeriesForm.vm_price.value=="")
   {
     alert("��ͨ�۸���Ϊ��,��ȷ��!");
     document.SeriesForm.vm_price.focus();
     return false;
   }
   else if(isNaN(document.SeriesForm.vm_price.value) || parseFloat(document.SeriesForm.vm_price.value)<0 || document.SeriesForm.vm_price.value.indexOf('.')!=-1)
   {
     alert("��ͨ�۸�ӦΪ������,��ȷ��!");
     document.SeriesForm.vm_price.value="";
     document.SeriesForm.vm_price.focus();
     return false;
   }
   if(document.SeriesForm.vm_sprice.value!="")
   {
      if(isNaN(document.SeriesForm.vm_sprice.value) || parseFloat(document.SeriesForm.vm_sprice.value)<0 || document.SeriesForm.vm_sprice.value.indexOf('.')!=-1)
      {
        alert("�ؼ�ӦΪ������,��ȷ��!");
        document.SeriesForm.vm_sprice.value="";
        document.SeriesForm.vm_sprice.focus();
        return false;
      }    
   }
   
	 //��鷢������
	 if(obj.issue_num.value!="")
     {
		if (!check_positive_nonzero_int(obj.issue_num, "��������ӦΪ������,��ȷ��!"))
			return false;	 
     }
	 
	 //����ֹ����
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
        alert("�ϴ���ԭʼͼ�ͱ���ͼ·��������Ϊ��,��ȷ��!");
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
     alert("ͼƬ���Ʋ���Ϊ��,��ȷ��!");
     document.BackgroundForm.vm_name.focus();
     return false;
   }
   if(document.BackgroundForm.vm_valid.value=="")
   {
     alert("ʹ�����޲���Ϊ��,��ȷ��!");
     document.BackgroundForm.vm_valid.focus();
     return false;
   }
   else if(isNaN(document.BackgroundForm.vm_valid.value) || parseFloat(document.BackgroundForm.vm_valid.value)<1 || document.BackgroundForm.vm_valid.value.indexOf('.')!=-1)
   {
     alert("ʹ������ӦΪ������,��ȷ��!");
     document.BackgroundForm.vm_valid.value="";
     document.BackgroundForm.vm_valid.focus();
     return false;
   }
   if(document.BackgroundForm.vm_price.value=="")
   {
     alert("��ͨ�۸���Ϊ��,��ȷ��!");
     document.BackgroundForm.vm_price.focus();
     return false;
   }
   else if(isNaN(document.BackgroundForm.vm_price.value) || parseFloat(document.BackgroundForm.vm_price.value)<0 || document.BackgroundForm.vm_price.value.indexOf('.')!=-1)
   {
     alert("��ͨ�۸�ӦΪ������,��ȷ��!");
     document.BackgroundForm.vm_price.value="";
     document.BackgroundForm.vm_price.focus();
     return false;
   }
   if(document.BackgroundForm.vm_sprice.value!="")
   {
      if(isNaN(document.BackgroundForm.vm_sprice.value) || parseFloat(document.BackgroundForm.vm_sprice.value)<0 || document.BackgroundForm.vm_sprice.value.indexOf('.')!=-1)
      {
        alert("�ؼ�ӦΪ������,��ȷ��!");
        document.BackgroundForm.vm_sprice.value="";
        document.BackgroundForm.vm_sprice.focus();
        return false;
      }
   }
   
     //��鷢������
	 if(obj.issue_num.value!="")
     {
		if (!check_positive_nonzero_int(obj.issue_num, "��������ӦΪ������,��ȷ��!"))
			return false;	 
     }
	 
	 //����ֹ����
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
        alert("�ϴ���ԭʼͼ�ͱ���ͼ·��������Ϊ��,��ȷ��!");
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
     alert("ͼƬ���Ʋ���Ϊ��,��ȷ��!");
     document.gift.vm_name.focus();
     return false;
   }
   if(document.giftForm.vm_valid.value=="")
   {
     alert("ʹ�����޲���Ϊ��,��ȷ��!");
     document.giftForm.vm_valid.focus();
     return false;
   }
   else if(isNaN(document.giftForm.vm_valid.value) || parseFloat(document.giftForm.vm_valid.value)<1 || document.giftForm.vm_valid.value.indexOf('.')!=-1)
   {
     alert("ʹ������ӦΪ������,��ȷ��!");
     document.giftForm.vm_valid.value="";
     document.giftForm.vm_valid.focus();
     return false;
   }
   if(document.giftForm.vm_price.value=="")
   {
     alert("��ͨ�۸���Ϊ��,��ȷ��!");
     document.giftForm.vm_price.focus();
     return false;
   }
   else if(isNaN(document.giftForm.vm_price.value) || parseFloat(document.giftForm.vm_price.value)<0 || document.giftForm.vm_price.value.indexOf('.')!=-1)
   {
     alert("��ͨ�۸�ӦΪ������,��ȷ��!");
     document.giftForm.vm_price.value="";
     document.giftForm.vm_price.focus();
     return false;
   }
   if(document.giftForm.vm_sprice.value!="")
   {
      if(isNaN(document.giftForm.vm_sprice.value) || parseFloat(document.giftForm.vm_sprice.value)<0 || document.giftForm.vm_sprice.value.indexOf('.')!=-1)
      {
        alert("�ؼ�ӦΪ������,��ȷ��!");
        document.giftForm.vm_sprice.value="";
        document.giftForm.vm_sprice.focus();
        return false;
      }
   }
   
     //��鷢������
	 if(obj.issue_num.value!="")
     {
		if (!check_positive_nonzero_int(obj.issue_num, "��������ӦΪ������,��ȷ��!"))
			return false;	 
     }
	 
	 //����ֹ����
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
        alert("�ϴ���ԭʼͼ�ͱ���ͼ·��������Ϊ��,��ȷ��!");
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
		alert("�۸���Ϊ��!!");
		document.add_form.sale_price.focus();
		return false;
	}
	else if(isNaN(document.add_form.sale_price.value) || parseFloat(document.add_form.sale_price.value)<0 || document.add_form.sale_price.value.indexOf('.')!=-1)
	{
		alert("�۸�ӦΪ������!!");
		document.add_form.sale_price.value = "";
		document.add_form.sale_price.focus();
		return false;
	}

	if (document.add_form.title.value == "")
	{
		alert("���ⲻ��Ϊ��!!");
		document.add_form.title.focus();
		return false;
	}
		
	return;
}

/*���Ѿ�����������û��л�����ǰ����
	my_equip: ��ǰ���õ����ô�
	my_base_id: ��ǰ���õ�base_id
	style_set: ��ǰ��ʾ�������
	lowie_flag: �Ͱ汾IE��־
	base_id:	��ǰ������base_id
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
