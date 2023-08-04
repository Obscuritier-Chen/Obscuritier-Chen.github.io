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