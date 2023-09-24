function newResearchProjectDisplay(name)
{//创建新研究HTML
    var newResearch=document.createElement('button');
    newResearch.setAttribute('id',name);
    newResearch.setAttribute('class','normalButton');
    newResearch.setAttribute('onclick',`research('${name}')`);
    newResearch.setAttribute('onmouseover',`researchMsOn('${name}')`);
    newResearch.setAttribute('onmouseout',`researchMsOff('${name}')`);
    newResearch.innerText=name;
    document.getElementById(researchProject[name]['type']).insertBefore(newResearch,document.getElementById(researchProject[name]['type']+'Allot'));
}
function newResearchProject(possibleProject)
{
    if(researchDisplayQueue.length!=0)
    {
        for(var i=0;i<researchDisplayQueue.length;i++)
        {
            if(document.getElementById(researchProject[researchDisplayQueue[i]]['type']).childElementCount<8)//若现有项目小于6个
            {
                newResearchProjectDisplay(researchDisplayQueue[i]);
                researchDisplayQueue[i]=0;
            }
        }
        researchDisplayQueue=researchDisplayQueue.filter(function(element){//过滤所有0
            return element!==0;
        });
    }
    for(var i=0;i<possibleProject.length;i++)//查看完成的研究是否解锁新研究
    {
        var tempflag=true;
        for(var j=0;j<researchProject[possibleProject[i]]['pre'].length;j++)
        {
            if(researchProject[researchProject[possibleProject[i]]['pre'][j]]['condition']==0)
                {tempflag=false;break;}
        }
        if(tempflag&&researchProject[possibleProject[i]]['condition']==0&&document.getElementById(researchProject[possibleProject[i]]['type']).childElementCount<8)
            researchProject[possibleProject[i]]['display']=1,newResearchProjectDisplay(possibleProject[i]);
        else if(tempflag&&researchProject[possibleProject[i]]['condition']==0&&document.getElementById(researchProject[possibleProject[i]]['type']).childElementCount>=8)//若已满
            researchDisplayQueue.push(possibleProject[i]);//扔进预备队列
    }
}
function researchResult(name)
{
    window[researchProject[name]['type']+'Attribute']['condition']=0;
    document.getElementById(name).remove();
    researchProject[name]['condition']=1;
    newBuilding();
    newResearchProject(researchProject[name]['unlock']);
}
function research(name)
{
    var enoughProJudge=true;
    if(researchProject[name]['consume']!=null)//资源判定
    {
        for(var key in researchProject[name]['consume'])
        {
            if(production[key]-researchProject[name]['consume'][key]<0)
                {enoughProJudge=false;break;}
        }
    }
    if(enoughProJudge&&window[researchProject[name]['type']+'Attribute']['condition']==0)//进行研究
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
        document.getElementById(name+'Detail').remove();
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
function allotResearcher(type,name,num)
{
    if(num==1&&freeResearcher[name]>=1)
    {
        freeResearcher[name]--,
        window[type+'Attribute'][name]++,
        document.getElementById(type+name.replace(/researcher/gi, "Researcher")+'Num').innerText=window[type+'Attribute'][name];
    }
    else if(num==-1&&window[type+'Attribute'][name]>=1)
    {
        freeResearcher[name]++,
        window[type+'Attribute'][name]--,
        document.getElementById(type+name.replace(/researcher/gi, "Researcher")+'Num').innerText=window[type+'Attribute'][name];
    }
}
function createAllotPanel(type)
{
    var rectangle=document.createElement('div');
    rectangle.setAttribute('id',type+'AllotPanel');
    rectangle.style.position='absolute';
    rectangle.style.left=document.getElementById(type+'Allot').getBoundingClientRect().left+35+'px';
    rectangle.style.top=document.getElementById(type+'Allot').getBoundingClientRect().top+'px';
    rectangle.style.backgroundColor='white';
    rectangle.style.border='1px solid black';
    rectangle.style.fontSize='16px';
    rectangle.style.marginLeft='15px';
    rectangle.style.padding='5px';
    rectangle.style.zIndex=100;
    
    var researcherLv1=document.createElement('div');
    researcherLv1.innerText='researcherLv1';
    rectangle.appendChild(researcherLv1);

    var add=document.createElement('button');
    var sub=document.createElement('button');
    add.setAttribute('onclick','allotResearcher(\''+type+'\',\'researcherLv1\','+1+')');
    sub.setAttribute('onclick','allotResearcher(\''+type+'\',\'researcherLv1\','+-1+')');
    add.style.backgroundColor='white';
    add.style.border='none';
    sub.style.backgroundColor='white';
    sub.style.border='none';
    var addSpan=document.createElement('span');
    addSpan.setAttribute('class','add');
    addSpan.style.top='-5px';
    add.appendChild(addSpan);
    var subSpan=document.createElement('span');
    subSpan.setAttribute('class','sub');
    subSpan.style.top='-5px';
    sub.appendChild(subSpan);
    var num=document.createElement('span');
    num.setAttribute('id',type+'ResearcherLv1Num');
    num.innerText=window[type+'Attribute']['researcherLv1'];
    researcherLv1.appendChild(sub);
    researcherLv1.appendChild(num);
    researcherLv1.appendChild(add);

    var researcherLv2=document.createElement('div');
    researcherLv2.innerText='researcherLv2';
    rectangle.appendChild(researcherLv2);

    var add=document.createElement('button');
    var sub=document.createElement('button');
    add.setAttribute('onclick','allotResearcher(\''+type+'\',\'researcherLv2\','+1+')');
    sub.setAttribute('onclick','allotResearcher(\''+type+'\',\'researcherLv2\','+-1+')');
    add.style.backgroundColor='white';
    add.style.border='none';
    sub.style.backgroundColor='white';
    sub.style.border='none';
    var addSpan=document.createElement('span');
    addSpan.setAttribute('class','add');
    addSpan.style.top='-5px';
    add.appendChild(addSpan);
    var subSpan=document.createElement('span');
    subSpan.setAttribute('class','sub');
    subSpan.style.top='-5px';
    sub.appendChild(subSpan);
    var num=document.createElement('span');
    num.setAttribute('id',type+'ResearcherLv2Num');
    num.innerText=window[type+'Attribute']['researcherLv2'];
    researcherLv2.appendChild(sub);
    researcherLv2.appendChild(num);
    researcherLv2.appendChild(add);

    var researcherLv3=document.createElement('div');
    researcherLv3.innerText='researcherLv3';
    rectangle.appendChild(researcherLv3);

    var add=document.createElement('button');
    var sub=document.createElement('button');
    add.setAttribute('onclick','allotResearcher(\''+type+'\',\'researcherLv3\','+1+')');
    sub.setAttribute('onclick','allotResearcher(\''+type+'\',\'researcherLv3\','+-1+')');
    add.style.backgroundColor='white';
    add.style.border='none';
    sub.style.backgroundColor='white';
    sub.style.border='none';
    var addSpan=document.createElement('span');
    addSpan.setAttribute('class','add');
    addSpan.style.top='-5px';
    add.appendChild(addSpan);
    var subSpan=document.createElement('span');
    subSpan.setAttribute('class','sub');
    subSpan.style.top='-5px';
    sub.appendChild(subSpan);
    var num=document.createElement('span');
    num.setAttribute('id',type+'ResearcherLv3Num');
    num.innerText=window[type+'Attribute']['researcherLv3'];
    researcherLv3.appendChild(sub);
    researcherLv3.appendChild(num);
    researcherLv3.appendChild(add);

    var confirmButton = document.createElement('button');
    confirmButton.style.padding='2px';
	confirmButton.style.background = 'none'; // 删除按钮背景
    confirmButton.style.border='1px solid black';
    confirmButton.style.float='right';
    confirmButton.style.marginTop='5px';
	confirmButton.innerText = "confirm";
    confirmButton.addEventListener('click', function() {
        rectangle.remove();
    });
    rectangle.appendChild(confirmButton);
    document.body.appendChild(rectangle);
}