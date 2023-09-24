function newBuilding()
{
	for(var key in buildingAttribute)
	{
		if(buildingAttribute[key]['display']==0)
		{
			var tempFlag=true;
			if(buildingAttribute[key]['preResearch']!=null)
			{
				for(var i=0;i<buildingAttribute[key]['preResearch'].length;i++)//前置科技是否满足
				{
					if(researchProject[buildingAttribute[key]['preResearch'][i]]['condition']==0)
						{tempFlag=false;break;}
				}
			}
			if(tempFlag)//创建新building
			{
				document.getElementById('build').insertBefore(document.createElement('br'),document.getElementById('buildLast'));
				buildingAttribute[key]['display']=1;
				var building=document.createElement('button');
				building.setAttribute('class','normalButton');
				building.setAttribute('id',key.replace(/ing/g, ""));
				building.setAttribute('onclick','build(\''+key+'\')');
				building.setAttribute('onmouseover','buildMsOn(\''+key+'\')');
				building.setAttribute('onmouseout','buildMsOff(\''+key+'\')');
				building.innerText=key;
				document.getElementById('build').insertBefore(building,document.getElementById('buildLast'));
			}
		}
	}
}
function buildingStopResult(name)
{
	if(buildingAttribute[name]['condition']==1)//若崭新停工
	{
		switch (name)
		{
			case 'building4':
				infoPopup('info2');
				break;
			case 'building5':
				buffDisable('buff3');
				break;
			default:
				break;
		}
	}
}
function buildingResume(name)//恢复工作
{
	buildingAttribute[name]['condition']=1;
	switch(name)
	{
		case 'building5':
			buffAble('buff3');
			break;
	}
}
function buildingDisplay(name)//将新的building显示到侧边栏
{
	if(buildingAttribute[name]['num']==0)
	{
		var building=document.createElement('div');
		building.setAttribute('id',name);
		building.setAttribute('onmouseover','buildingMsOn(\''+name+'\')');
		building.setAttribute('onmouseout','buildingMsOff(\''+name+'\')');
		building.innerText=name+'：';
		var num=document.createElement('span');
		num.setAttribute('class','objectNum');
		num.setAttribute('id',name+'Num');
		num.innerText=1;
		building.appendChild(num);
		document.getElementById('building').insertBefore(building,document.getElementById('buildingLast'));
	}
	else if(buildingAttribute[name]['num']>0)
	{
		document.getElementById(name+'Num').innerText=buildingAttribute[name]['num'];
	}
}
function specialBldResult(name)
{
	switch (name)
	{
		case 'building4':
			infoPopup('courseInfo4');
			popUpdating=setInterval(popUpdate,popSpeed);//进行人口增长
			break;
		
		default:
			break;
	}
}
function bldResult(type,name)
{
	buildingDisplay(name);
	buildingAttribute[name]['num']++;
	if(type==1)
	{
		buildingAttribute[name]['condition']=1;
		popLimit+=5;
		document.getElementById('maxPop').innerText=popLimit;
		document.getElementById('bldHouse').removeAttribute('disabled');
	}
	else if(type==2)
	{
		buildingAttribute[name]['condition']=1;
		if(buildingAttribute[name]['num']==buildingAttribute[name]['limit'])
			document.getElementById(name.replace(/ing/g, "")).nextElementSibling.remove(),document.getElementById(name.replace(/ing/g, "")).remove();//到最大建造次数的删除建筑按钮
		name=bld2Num[name];
		var workerNum=0;
		var workerName=name+'Num';
		var workerDiv=document.createElement('div');
		workerDiv.setAttribute('id',name+'s');
		workerDiv.style.marginBottom='10px';
		workerDiv.innerHTML='<span id="'+name+'Name" onmouseover="workerMsOn(\''+name+'\')" onmouseout="workerMsOff(\''+name+'\')">'+workerName+':  </span>'+//不要换行，有莫名其妙的bug。也不要改，调语法累死
							'<span class="wrkAddSub" style="position: relative;float: right;"><button class="btnSubClass" onclick="WorkersAdd(-5,'+'\''+name+'\')"><span class="bigSub"></span></button><button class="btnSubClass" onclick="WorkersAdd(-1,'+'\''+name+'\')"><span class="sub"></span></button>\n<span id="'+name+'">'
							+workerNum+'</span>\n<button class="btnAddClass" onclick="WorkersAdd(1,'+'\''+name+'\')"><span class="add"></span></button><button class="btnAddClass" onclick="WorkersAdd(5,'+'\''+name+'\')"><span class="bigAdd"></span></button></span>';
		document.getElementById('worker').insertBefore(workerDiv,document.getElementById("workerLast"));/*在worker的最后
		有一个workerLast标签，标记了worker的底线，新的worker从此前插入*/
		elementWorkNum[name]=document.getElementById(name);
	}
	else if(type==3)
	{
		buildingAttribute[name]['condition']=1;
		if(buildingAttribute[name]['num']==buildingAttribute[name]['limit'])
			document.getElementById(name.replace(/ing/g, "")).nextElementSibling.remove(),document.getElementById(name.replace(/ing/g, "")).remove();//到最大建造次数的删除建筑按钮
		addBuff(buildingAttribute[name]['buffName']);
	}
	else if(type==4)//特别建筑类型
	{
		buildingAttribute[name]['condition']=1;
		if(buildingAttribute[name]['num']==buildingAttribute[name]['limit'])
			document.getElementById(name.replace(/ing/g, "")).nextElementSibling.remove(),document.getElementById(name.replace(/ing/g, "")).remove();//到最大建造次数的删除建筑按钮
		specialBldResult(name);
	}
	proVariationMonitor();
}
function build(name)
{
	if(buildingAttribute[name]['type']==1)
	{
		var enoughResources=true;
		for (var key in buildingAttribute[name]['need'])//确认资源足够建造
		{
			if(buildingAttribute[name]['need'][key]>production[key])
				{enoughResources=false;break;}
		}
		if(enoughResources&&(worker['builder']-workingBuilder)>=buildingAttribute[name]['builderNeed'])
		{
			production['product2Num']-=5;//扣资源
			elementPro['product2Num'].innerText=parseInt(production['product2Num']);
			buildMsOff('house');
			workingBuilder+=buildingAttribute[name]['builderNeed'];
			document.getElementById('bldHouse').setAttribute('disabled','true');
			var bldTimer=document.createElement('span');
			bldTimer.setAttribute('class','bldTimer');
			bldTimer.setAttribute('id','houseTimer');
			bldTimer.style.marginLeft='5px';
			bldTimer.style.color='black'
			var h=Math.floor(buildingAttribute[name]['time']/60/60),m=Math.floor(buildingAttribute[name]['time']/60%60),s=buildingAttribute[name]['time']%60;
			bldTimer.innerText=h+':'+m+':'+s;
			document.getElementById('bldHouse').appendChild(bldTimer);
		}
	}
	else
	{
		var enoughResources=true;
		for (var key in buildingAttribute[name]['need'])//确认资源足够建造
		{
			if(buildingAttribute[name]['need'][key]>production[key])
				{enoughResources=false;break;}
		}
		if(enoughResources&&(worker['builder']-workingBuilder)>=buildingAttribute[name]['builderNeed'])
		{
			for (var key in buildingAttribute[name]['need'])
				production[key]-=buildingAttribute[name]['need'][key];
			for(var key in production)//扣资源
			{
				if(elementPro[key]=='xzx') continue;
				elementPro[key].innerText=parseInt(production[key]);
			}
			buildMsOff(name);//disable后mouseout失效需要手动删除
			workingBuilder+=buildingAttribute[name]['builderNeed'];
			document.getElementById(name.replace(/ing/g, "")).setAttribute('disabled','true');
			var bldTimer=document.createElement('span');//创建建造计时器
			bldTimer.setAttribute('class','bldTimer');
			bldTimer.setAttribute('id',name+'Timer');
			bldTimer.style.marginLeft='5px';
			bldTimer.style.color='black'
			var h=Math.floor(buildingAttribute[name]['time']/60/60),m=Math.floor(buildingAttribute[name]['time']/60%60),s=buildingAttribute[name]['time']%60;
			bldTimer.innerText=h+':'+m+':'+s;
			document.getElementById(name.replace(/ing/g, "")).appendChild(bldTimer);
		}
	}
}