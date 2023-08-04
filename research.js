function researchResult(name)
{
    window[researchProject[name]['type']+'Attribute']['condition']=0;
    document.getElementById(name).remove();
}
function research(name)
{
    var enoughProJudge=true;
    if(researchProject[name]['consume']!=null)
    {
        for(var key in researchProject[name]['consume'])
        {
            if(production[key]-researchProject[name]['consume'][key]<0)
                {enoughProJudge=false;break;}
        }
    }
    if(enoughProJudge&&window[researchProject[name]['type']+'Attribute']['condition']==0)
    {
        window[researchProject[name]['type']+'Attribute']['condition']=1;
        for(var key in researchProject[name]['consume'])
        {
            production[key]-=researchProject[name]['consume'][key];
        }
        for(var key in production)//同时遍历production
        {
            if(elementPro[key]=='xzx') continue;
            elementPro[key].innerText=parseInt(production[key]);
        }
        proVariationMonitor();
        productionVariation();
        document.getElementById(name).setAttribute('disabled',true);
        var rsrTimer=document.createElement('span');
		rsrTimer.setAttribute('class','rsrTimer');
		rsrTimer.setAttribute('id',name+'Timer');
		rsrTimer.style.marginLeft='5px';
		rsrTimer.style.color='black'
		var h=Math.floor(researchProject[name]['time']/60/60),m=Math.floor(researchProject[name]['time']/60%60),s=researchProject[name]['time']%60;
		rsrTimer.innerText=h+':'+m+':'+s;
		document.getElementById(name).appendChild(rsrTimer);
    }
}
function createAllotPanel(type)
{
    var rectangle=document.createElement('div');
    rectangle.setAttribute('id',type+'AllotPanel');
    rectangle.style.position='absolute';
    rectangle.style.top='-2px';
    rectangle.style.backgroundColor='white';
    rectangle.style.border='1px solid black';
    rectangle.style.display='inline-block';
    rectangle.style.fontSize='16px';
    rectangle.style.marginLeft='15px';
    rectangle.style.padding='5px';
    rectangle.style.zIndex=999;
    document.getElementById(type+'Allot').appendChild(rectangle);

    var researcherLv1=document.createElement('div');
    researcherLv1.innerText='researcherLv1';
    rectangle.appendChild(researcherLv1);
    var researcherLv2=document.createElement('div');
    researcherLv2.innerText='researcherLv2';
    rectangle.appendChild(researcherLv2);
    var researcherLv3=document.createElement('div');
    researcherLv3.innerText='researcherLv3';
    rectangle.appendChild(researcherLv3);

    var confirmButton = document.createElement('button');
    confirmButton.style.padding='5px';
	confirmButton.style.background = 'none'; // 删除按钮背景
    confirmButton.style.border='1px solid black';
    confirmButton.style.float='right';
	confirmButton.innerText = "confirm";
    confirmButton.addEventListener('click', function() {
        var tmpType=type;
        document.getElementById(tmpType+'AllotPanel').remove();
    });
	//confirmButton.setAttribute('onclick','')
    rectangle.appendChild(confirmButton);

    
}