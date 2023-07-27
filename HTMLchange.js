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
                for(var keyb in produceBuffsEffect)
                {
                    //alert(produceBuffsEffect[keyb]['workerNum']+key);
                    if(produceBuffsEffect[keyb]['workerNum']==key&&document.getElementById('produceBuff'+keyb.replace('buff',''))!=null&&workersTable[key][name+'Num']>0)
                    {
                        var buff=document.createElement('div');
                        buff.style.marginLeft='15px';
                        if(produceBuffsEffect[keyb]['effect']<0)
                            buff.innerText='    '+produceBuffsContent[keyb]+':     '+produceBuffsEffect[keyb]['effect']+'%';
                        else if(produceBuffsEffect[keyb]['effect']>0)
                            buff.innerText='    '+produceBuffsContent[keyb]+':     +'+produceBuffsEffect[keyb]['effect']+'%';
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
function buildingMsOn(name)
{
	if(document.getElementById(name+'Detail')==null)
	{
		var rectangle = document.createElement('div');
        rectangle.className = 'rectangle';
        rectangle.setAttribute('id',name+'Detail');
		var text=document.createElement('div');
		text.style.maxWidth='150px';
		text.style.overflowWrap='break-word';
		text.innerText=buildingText[name];
		rectangle.appendChild(text);
		document.getElementById(name).appendChild(rectangle);
		for(var key in buildingsTable[name])
		{
			var need=document.createElement('div');
			need.style.whiteSpace='nowrap';//禁止换行 虽然不到为啥它会换行
			need.innerText=key+':  '+buildingsTable[name][key];
			rectangle.appendChild(need);
		}
		var builder=document.createElement('div');
		builder.innerText='builderNeed:  '+builderNeed[name];
		rectangle.appendChild(builder);
		var time=document.createElement('div');
		time.innerText='Take time:  '+buildTime[name]+'s';
		rectangle.appendChild(time);
	}
}
function buildingMsOff(name)
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
		need+=builderNeed[timer.getAttribute('id').replace(/Timer/g, '')];
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
                    if(timer.getAttribute('id')=='houseTimer')
                        bldResult(1,null);
					else if(bld2Num[timer.getAttribute('id').replace(/Timer/g, '')]!=null)
						bldResult(2,bld2Num[timer.getAttribute('id').replace(/Timer/g, '')]);
                    workingBuilder-=builderNeed[timer.getAttribute('id').replace(/Timer/g, '')];
					timer.parentNode.removeChild(timer);
					continue;
				}
			}
		}
		timer.textContent = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
    }
  }, 1000);