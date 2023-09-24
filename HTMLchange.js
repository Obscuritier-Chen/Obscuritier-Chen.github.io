function infoPopup(name)
{
	if(infoPopupAttribute[name]['type']=='course'&&gameType!='course')//若非教程要弹出教程内容
		return;
	if(document.getElementById(name)==null)
	{
		var popup = document.createElement('div');
		popup.setAttribute('id',name);
		popup.style.width = '250px';
		popup.style.border = '2px solid black';
		popup.style.padding = '20px';
		popup.style.overflowWrap = 'break-word';
		popup.style.position = 'fixed';
		popup.style.top = '50%';
		popup.style.left = '50%';
		popup.style.transform = 'translate(-50%, -50%)';
		popup.style.zIndex= 999;
		popup.style.backgroundColor= 'white';

		var title = document.createElement('div');
		title.style.textAlign = 'center';
		title.textContent = infoPopupAttribute[name]['title'];
		title.style.fontSize='20px';
		popup.appendChild(title);

		var content = document.createElement('div');
		content.style.marginTop = '10px';
		content.style.marginBottom='40px';
		content.style.fontSize = '15px';
		content.textContent = infoPopupAttribute[name]['content'];
		popup.appendChild(content);

		var confirmButton = document.createElement('button');
		confirmButton.setAttribute('id',name+'Button');
		confirmButton.style.position = 'absolute';
		confirmButton.style.background = 'none'; // 删除按钮背景
		confirmButton.style.right = '10px';
		confirmButton.style.bottom = '10px';
		confirmButton.innerText = "confirm";
		confirmButton.style.border = '1px solid black';  // Change the button border to 1px
		confirmButton.addEventListener('click', function() {
			popup.remove(); // 点击关闭按钮时移除popup
		});
		popup.appendChild(confirmButton);

		document.body.appendChild(popup);
	}
}
function productMsOn(name)
{
    productionVariation();//更新一下以防万一
    if(document.getElementById(name+'Detail')==null)
    {
        var rectangle = document.createElement('div');
        rectangle.className = 'rectangle';
        rectangle.setAttribute('id',name+'Detail');

        if(popNeed[name+'Num']!=0&&population!=0)//人口需求
        {
            var need=document.createElement('div');
            if(Number(population*popNeed[name+'Num'])!=Math.round(population*popNeed[name+'Num']))
                need.innerText=population+'*'+'population'+':     '+(population*popNeed[name+'Num']).toFixed(1);
            else if(Number(population*popNeed[name+'Num'])==Math.round(population*popNeed[name+'Num']))
                need.innerText=population+'*'+'population'+':     '+(population*popNeed[name+'Num']);
            rectangle.appendChild(need);
        }
		for(var key in buildingAttribute)//建筑消耗
		{
			if(buildingAttribute[key]['consume']!=null&&buildingAttribute[key]['num']>0)
			{
				for(var keyp in buildingAttribute[key]['consume'])
				{
					if(keyp.replace(/Num/g, '')==name)
					{
						var bld=document.createElement('div')
						bld.innerText=key+':     '+buildingAttribute[key]['consume'][keyp];
						rectangle.appendChild(bld);
					}
				}
			}
		}
        for(var key in workersTable)//工人生产
        {
            if(workersTable[key][name+'Num']!=0&&worker[key]!=0)
            {
                var produce=document.createElement('div');
                if(worker[key]==actualWrkNum[key])
                    produce.innerText=worker[key]+'*'+key+':     '+worker[key]*workersTable[key][name+'Num'];
                else if(worker[key]!=actualWrkNum[key])
                    produce.innerText=actualWrkNum[key]+'('+worker[key]+')*'+key+':     '+actualWrkNum[key]*workersTable[key][name+'Num'];
                rectangle.appendChild(produce);
                for(var keyb in buffAttribute)
                {
					if(buffAttribute[keyb]['type']!='produce')
						continue;
                    //alert(produceBuffsEffect[keyb]['workerNum']+key);
                    if(buffAttribute[keyb]['workerName']==key&&buffAttribute[keyb]['condition']==1&&workersTable[key][name+'Num']>0)
                    {
                        var buff=document.createElement('div');
                        buff.style.marginLeft='15px';
                        if(buffAttribute[keyb]['effect']<0)
                            buff.innerText='    '+keyb+':     '+buffAttribute[keyb]['effect']+'%';
                        else if(buffAttribute[keyb]['effect']>0)
                            buff.innerText='    '+keyb+':     +'+buffAttribute[keyb]['effect']+'%';
						if(buffAttribute[keyb]['working']==0)
							buff.style.color='red';
                        rectangle.appendChild(buff);
                    }
                }
            }
        }
		if(rectangle.childNodes.length>0)
        	document.getElementById(name).appendChild(rectangle);
    }
}
function productMsOff(name)
{
	if(document.getElementById(name+'Detail')!=null)
    	document.getElementById(name+'Detail').remove();
}
function workerMsOn(name)
{
	if(document.getElementById(name+'Detail')==null)
	{
		var rectangle = document.createElement('div');
        rectangle.className = 'rectangle';
        rectangle.setAttribute('id',name+'Detail');
		for(var key in workersTable[name])
		{
			var proVry=document.createElement('div');
			proVry.innerText=key+':  '+workersTable[name][key];
			rectangle.appendChild(proVry);
		}
		document.getElementById(name+'Name').appendChild(rectangle);
	}
}
function workerMsOff(name)
{
	if(document.getElementById(name+'Detail')!=null)
		document.getElementById(name+'Detail').remove();
}
function buildMsOn(name)
{
	if(document.getElementById(name+'Detail')==null)
	{
		var rectangle = document.createElement('div');
        rectangle.className = 'rectangle';
        rectangle.setAttribute('id',name+'Detail');
		var text=document.createElement('div');
		text.style.maxWidth='150px';
		text.style.overflowWrap='break-word';
		text.innerText=buildingAttribute[name]['text'];
		rectangle.appendChild(text);
		if(name=='house')
			document.getElementById('bldHouse').appendChild(rectangle);
		else
			document.getElementById(name.replace(/ing/g, "")).appendChild(rectangle);
		var consume=document.createElement('div');
		consume.style.whiteSpace='nowrap';
		consume.innerText='consume:';
		rectangle.appendChild(consume);
		for(var key in buildingAttribute[name]['need'])
		{
			if(buildingAttribute[name]['need'][key]>0)
			{
				var need=document.createElement('div');
				need.style.whiteSpace='nowrap';//禁止换行 虽然不到为啥它会换行
				need.style.marginLeft='15px';
				if(proDisplay[key]==0)
					need.style.color='red';
				if(production[key]>=buildingAttribute[name]['need'][key])
					need.innerText=key+':  '+buildingAttribute[name]['need'][key];
				else if(production[key]<buildingAttribute[name]['need'][key])
				{
					need.innerText=key+':  ';
					var needNum=document.createElement('span');
					need.style.color='red';
					needNum.innerText=buildingAttribute[name]['need'][key];
					need.appendChild(needNum);
				}
				consume.appendChild(need);
			}
		}

		var builder=document.createElement('div');
		if(buildingAttribute[name]['builderNeed']>worker['builder']-workingBuilder)	
			builder.style.color='red';
		builder.innerText='builderNeed:  '+buildingAttribute[name]['builderNeed'];
		rectangle.appendChild(builder);
		var time=document.createElement('div');
		time.innerText='Take time:  '+buildingAttribute[name]['time']+'s';
		rectangle.appendChild(time);
	}
}
function buildMsOff(name)
{
	if(document.getElementById(name+'Detail')!=null)
		document.getElementById(name+'Detail').remove();
}
function buildingMsOn(name)
{
	if(document.getElementById(name+'Detail')==null)
	{
		var rectangle = document.createElement('div');
        rectangle.className = 'rectangle';
        rectangle.setAttribute('id',name+'Detail');
		rectangle.style.maxWidth='150px';
		rectangle.style.overflowWrap='break-word';

		var content=document.createElement('div');
		content.innerText=buildingAttribute[name]['text'];
		rectangle.appendChild(content);
		if(buildingAttribute[name]['consume']!=null)
		{
			var consumeContainer=document.createElement('div');
			consumeContainer.innerText='consume:';
			for(var key in buildingAttribute[name]['consume'])
			{
				var consume=document.createElement('div');
				consume.style.marginLeft='15px';
				consume.innerText=key+':  '+buildingAttribute[name]['consume'][key];
				consumeContainer.appendChild(consume);
			}
			rectangle.appendChild(consumeContainer);
		}
		document.getElementById(name).appendChild(rectangle);
	}
}
function buildingMsOff(name)
{
	if(document.getElementById(name+'Detail')!=null)
		document.getElementById(name+'Detail').remove();
}
function researchMsOn(name)
{
	if(document.getElementById(name+'Detail')==null)
	{
		var rectangle=document.createElement('div');
		rectangle.className='rectangle';
		rectangle.setAttribute('id',name+'Detail');
		rectangle.style.whiteSpace='nowrap';

		var text=document.createElement('div');
		text.innerText=researchProject[name]['text'];
		rectangle.appendChild(text);

		var consume=document.createElement('div');
		consume.innerText='consume:';
		if(researchProject[name]['consume']==null)
			consume.innerText='consume:  null';
		for(var key in researchProject[name]['consume'])
		{
			var product=document.createElement('div');
			product.style.marginLeft='15px';
			product.innerText=key+':  '+researchProject[name]['consume'][key];
			consume.appendChild(product);
		}
		rectangle.appendChild(consume)

		var time=document.createElement('div');
		time.innerText='take time:  '+researchProject[name]['time'];
		rectangle.appendChild(time);

		document.getElementById(name).appendChild(rectangle);
	}
}
function researchMsOff(name)
{
	if(document.getElementById(name+'Detail')!=null)
		document.getElementById(name+'Detail').remove();
}
function buffMsOn(name)
{
	if(document.getElementById(name+'Detail')==null)
	{
		var rectangle=document.createElement('div');
		rectangle.className='rectangle';
		rectangle.setAttribute('id',name+'Detail');
		rectangle.style.whiteSpace='nowrap';

		if(buffAttribute[name]['working']==0)
		{
			var wrkCondition=document.createElement('div');
			wrkCondition.innerText='disabled';
			rectangle.appendChild(wrkCondition);
		}

		var type=document.createElement('div');
		type.innerText='type:  '+buffAttribute[name]['type'];
		rectangle.appendChild(type);

		var effect=document.createElement('div');
		effect.innerText='effect:';
		if(buffAttribute[name]['type']=='event')
		{
			var eventEffect=document.createElement('div');
			eventEffect.style.marginLeft='15px';
			eventEffect.innerText=buffAttribute[name]['eventName']+':  '+((buffAttribute[name]['effect']>0) ? '+'+buffAttribute[name]['effect'] : buffAttribute[name]['effect'])+'%';
			effect.appendChild(eventEffect);
		}
		else if(buffAttribute[name]['type']=='produce')
		{
			var produceEffect=document.createElement('div');
			produceEffect.style.marginLeft='15px';
			produceEffect.innerText=buffAttribute[name]['workerName']+':  '+((buffAttribute[name]['effect']>0) ? '+'+buffAttribute[name]['effect'] : buffAttribute[name]['effect'])+'%';
			effect.appendChild(produceEffect);
		}
		rectangle.appendChild(effect);

		var content=document.createElement('div');
		content.innerText='content:  '+buffAttribute[name]['content'];
		rectangle.appendChild(content);

		document.getElementById(buffAttribute[name]['type']+'Buff'+name.replace(/^\w/, c => c.toUpperCase())).appendChild(rectangle);
	}
}
function buffMsOff(name)
{
	if(document.getElementById(name+'Detail')!=null)
		document.getElementById(name+'Detail').remove();
}
setInterval(function(){   //所有class=timer的元素时间-1s
    var timers = document.querySelectorAll('.timer');
    for (var i = 0; i < timers.length; i++)
	{
    	var timer = timers[i];
		var time = timer.textContent.split(':');
		var hours = parseInt(time[0], 10);
		var minutes = parseInt(time[1], 10);
		var seconds = parseInt(time[2], 10);
		if (seconds > 0)
		{
			seconds--;
		} 
		else 
		{
			if (minutes > 0)
			{
				minutes--;
				seconds = 59;
			}
			else
			{
				if (hours > 0)
				{
					hours--;
					minutes = 59;
					seconds = 59;
				}
				else
				{
					timer.parentNode.removeChild(timer);
					continue; 
				}
			}
		}
		timer.textContent = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
    }
  }, 1000);
setInterval(function(){   //所有class=timer的元素时间-1s
    var timers = document.querySelectorAll('.bldTimer');
	var need=0;
    for (var i = 0; i < timers.length; i++)
	{
		var timer = timers[i];
		need+=buildingAttribute[timer.getAttribute('id').replace(/Timer/g, '')]['builderNeed'];
        if(need>worker['builder'])
            break;
		var time = timer.textContent.split(':');
		var hours = parseInt(time[0], 10);
		var minutes = parseInt(time[1], 10);
		var seconds = parseInt(time[2], 10);
		if (seconds > 0)
		{
			seconds--;
		} 
		else 
		{
			if (minutes > 0)
			{
				minutes--;
				seconds = 59;
			}
			else
			{
				if (hours > 0)
				{
					hours--;
					minutes = 59;
					seconds = 59;
				}
				else
				{
                    if(buildingAttribute[timer.getAttribute('id').replace(/Timer/g, '')]['type']==1)
                        bldResult(1,'house');
					else if(buildingAttribute[timer.getAttribute('id').replace(/Timer/g, '')]['type']==2)
						bldResult(2,timer.getAttribute('id').replace(/Timer/g, ''));
					else if(buildingAttribute[timer.getAttribute('id').replace(/Timer/g, '')]['type']==3)
						bldResult(3,timer.getAttribute('id').replace(/Timer/g, ''));
					else if(buildingAttribute[timer.getAttribute('id').replace(/Timer/g, '')]['type']==4)
						bldResult(4,timer.getAttribute('id').replace(/Timer/g, ''));
                    workingBuilder-=buildingAttribute[timer.getAttribute('id').replace(/Timer/g, '')]['builderNeed'];
					timer.parentNode.removeChild(timer);
					continue;
				}
			}
		}
		timer.textContent = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
    }
  }, 1000);
setInterval(function(){
    var timers = document.querySelectorAll('.rsrTimer');
    for (var i = 0; i < timers.length; i++)
	{
    	var timer = timers[i];
		var time = timer.textContent.split(':');
		var hours = parseInt(time[0], 10);
		var minutes = parseInt(time[1], 10);
		var seconds = parseInt(time[2], 10);
		var totalTime=hours*60*60+minutes*60+seconds;
		totalTime=totalTime-(window[timer.parentElement.parentElement.id+'Attribute']['researcherLv1']*researchSpeed['researcherLv1']+
							 window[timer.parentElement.parentElement.id+'Attribute']['researcherLv2']*researchSpeed['researcherLv2']+
							 window[timer.parentElement.parentElement.id+'Attribute']['researcherLv3']*researchSpeed['researcherLv3']);
		hours=parseInt(totalTime/60/60),minutes=parseInt(totalTime/60%60),seconds=totalTime%60;
		if(totalTime<=0)
		{
			hours=0,minutes=0,seconds=0;
			timer.parentNode.removeChild(timer);
			researchResult(timer.getAttribute('id').replace(/Timer/g, ''));
		}
		timer.textContent = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
    }
  }, 1000);