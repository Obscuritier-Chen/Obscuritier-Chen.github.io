function miuGenerate(x)//根据最大人口与当前人口差值生成μ
{
	var ans;
	if(x>=1&&x<=15) ans=x-4.5;
	else if(x>15) ans=10.5;
	return ans;
}
function nd(x,miu)//正态分布函数，x为自变量，miu为μ(平均数)，即该曲线对称轴的位置
{
	var e=2.71828,sigma=3,y,sqrt2Pie=2.50663,index;//sigma标准差，e自然常数，index e的指数
	index=-((x-miu)**2)/(2*(sigma**2));
	y=(1/(sigma*sqrt2Pie))*e**index;
	return y;
}
function proVariationMonitor()
{
	for(var key in proDisplay)//新的product被生产出 则在HTML中添加此product
	{
		if(production[key]>0&&proDisplay[key]==0)
		{
			proDisplay[key]=1;
			var product=document.createElement('div');
			product.setAttribute('id',key.replace(/Num/g, ''));
			product.setAttribute('onmouseover','productMsOn(\''+key.replace(/Num/g,'')+'\')');
			product.setAttribute('onmouseout','productMsOff(\''+key.replace(/Num/g,'')+'\')');
			product.innerHTML=key.replace(/Num/g, '')+'：<div class="objectNum"><span id="'+key+'">0</span><span class="objectVariation">(0)</span></div>'
			document.getElementById('production').insertBefore(product,document.getElementById('productLast'));
			elementPro[key]=document.getElementById(key);
		}
	}
	newBuilding();//更新可以新建的建筑
	if(production['product1Num']==0)
	{
		if(document.getElementById('popDcrBuff3')==null)
        {
            infoPopup(1);//在HTML中提醒
            popDecrement(3);
        }
	}
}
function produce()
{
	for(var key in popNeed)
	{
		production[key]+=population*popNeed[key];//计算人口需求
		production[key]=Math.max(0,production[key]);
	}
	for(var key in buildingAttribute)
	{
		if(buildingAttribute[key]['consume']!=null&&buildingAttribute[key]['num']>0)
		{
			var enoughProJudge=true;
			for(var keyp in buildingAttribute[key]['consume'])
			{
				if(production[keyp]+buildingAttribute[key]['consume'][keyp]<0)
					{enoughProJudge=false;break;}
			}
			if(enoughProJudge)
			{
				buildingAttribute[key]['condition']=1;
				for(var keyp in buildingAttribute[key]['consume'])
					production[keyp]+=buildingAttribute[key]['consume'][keyp];
			}
			else if(!enoughProJudge)
				buildingStopResult(key),buildingAttribute[key]['condition']=0;
		}
	}
	for(const keyw in workersTable)//遍历table的worker
	{
		for(var i=1;i<=worker[keyw];i++)//按每个worker判定是否资源足够
		{
			var enoughProJudge=true;
			for(const keyp in workersTable[keyw])//遍历所有种资源判断是否足够
			{
				if(production[keyp]+workersTable[keyw][keyp]<0)
					{enoughProJudge=false;actualWrkNum[keyw]=i-1;break;}
			}
			if(enoughProJudge)
				for(const keyp in workersTable[keyw])
					actualWrkNum[keyw]=worker[keyw],production[keyp]+=workersTable[keyw][keyp]*workerEfficient[keyw]/100;
		}
	}//当初始worker!=0时可能会有bug?
	for(var key in production)//同时遍历production
	{
		if(elementPro[key]=='xzx') continue;
		elementPro[key].innerText=parseInt(production[key]);
	}
	proVariationMonitor();
	return produce;
}
function caclActualWrkNum()//用相同的方式计算出实际工作的工人
{
	var tempPro=Object.assign({}, production);
	for(var key in actualWrkNum)
		actualWrkNum[key]=worker[key];//初始化，为取最小值做准备
	for(var key in popNeed)//product先被优先级更高的消耗
	{
		tempPro[key]+=population*popNeed[key];
		tempPro[key]=Math.max(0,tempPro[key]);
	}

	for(const keyw in workersTable)//遍历table的worker
	{
		for(var i=1;i<=worker[keyw];i++)//按每个worker判定是否资源足够
		{
			var enoughProJudge=true;
			for(const keyp in workersTable[keyw])//遍历所有种资源判断是否足够
			{
				if(tempPro[keyp]+workersTable[keyw][keyp]<0)
					{enoughProJudge=false;actualWrkNum[keyw]=Math.min(actualWrkNum[keyw],i-1);break;}
			}
			if(enoughProJudge)
				for(const keyp in workersTable[keyw])
					actualWrkNum[keyw]=worker[keyw],tempPro[keyp]+=workersTable[keyw][keyp]*workerEfficient[keyw]/100;
		}
	}
}
function popIncrement(differ)//计算人口增加量
{//这玩意参数还是要调一调sigma变为3 differ=1时 x=-3.5 differ=8时 x=3.5 differ=15时x=10.5
	var incrementPr=new Array(10);
	var prPrefixSum=new Array(10);//前缀和
	var incrementSum=0,coefficient,randomPr,increment;//coefficient系数，将概率之和转换为1的系数
	for(var i=0;i<=7;i++)
	{
		incrementPr[i]=nd(i,miuGenerate(differ));//计算各人口增长量的概率
		incrementPr[i]=incrementPr[i].toFixed(5);//只取小数点后5位
		incrementPr[i]=Number(incrementPr[i]);//将字符型转换为数字
		incrementSum=incrementPr[i]+incrementSum;
	}
	coefficient=1/incrementSum;//计算系数使总概率为1
	coefficient=coefficient.toFixed(5);
	coefficient=Number(coefficient);
	prPrefixSum[0]=incrementPr[0]*coefficient;
	for(var i=1;i<=7;i++)//计算前缀和
	{
		incrementPr[i]*=coefficient;
		prPrefixSum[i]=prPrefixSum[i-1]+incrementPr[i];
		prPrefixSum[i]=prPrefixSum[i].toFixed(5);
		prPrefixSum[i]=Number(prPrefixSum[i]);
	}//最终总概率为1(+/-)10^-5问题不大
	randomPr=Math.random();//随机生成0~1之间的数
	for(var i=0;i<=7;i++)
	{
		if(prPrefixSum[i]>=randomPr)
			{increment=i;break;}
	}
	return increment;
}
function popDcrStopCondition(num)
{
	switch (num) 
	{
		case 3:
			{
				if(production['product1Num']>0)
					return true;
				else 
					return false;
				break;
			}
		
	}
}
function popDecrement(num)//由于不同原因造成的人口减少
{
	clearInterval(popUpdating);//首先暂停人口增长
	var buffDiv=document.createElement('div');//创建新buff 元素
	buffDiv.setAttribute('id','popDcrBuff'+num);
	buffDiv.innerHTML=popDecrementAttribute['dcr'+num]['name'];
	document.getElementById("buffs").insertBefore(buffDiv,document.getElementById("buffLast"));
	if(popDecrementAttribute['dcr'+num]['times']!=-1)
	{
		setTimeout(function(num){
			document.getElementById('popDcrBuff'+num).remove();
			popUpdating = setInterval(popUpdate, popSpeed); 
		},popDecrementAttribute['dcr'+num]['times']*popSpeed,num);
		var h=Math.floor(popDecrementAttribute['dcr'+num]['times']*popSpeed/1000/60/60),m=Math.floor(popDecrementAttribute['dcr'+num]['times']*popSpeed/1000/60%60),s=popDecrementAttribute['dcr'+num]['times']*popSpeed/1000%60;
		buffDiv.innerHTML+=' <span class="timer">'+h+':'+m+':'+s+'</span>';
		//每轮间隔一个popSpeed
		totalPop=population;
		for(var i=1;i<=popDecrementAttribute['dcr'+num]['times'];i++)//每轮减少一定数量/比例的人口
		{
			//alert(i);
			if(popDecrementAttribute['dcr'+num]['cnt'][i]>=1)
				setTimeout(function(num,i){
					popSub(popDecrementAttribute['dcr'+num]['cnt'][i]);//差点忘了写了这个函数
				},popSpeed*i,num,i);
				
			else if(popDecrementAttribute['dcr'+num]['cnt'][i]<1)
				setTimeout(function(num,i){
					popSub(Math.ceil(totalPop*popDecrementAttribute['dcr'+num]['cnt'][i]));
				},popSpeed*i,num,i);
		}
	}
	else if(popDecrementAttribute['dcr'+num]['times']==-1)//有条件解除型
	{
		var totalPop=population;
		var buffDiv=document.createElement('div');//创建新buff 元素
		buffDiv.setAttribute('id','popDcrBuff'+num);
		buffDiv.innerHTML=popDecrementAttribute['dcr'+num]['name'];
		window['popDcr'+num]=setInterval(function(num,totalPop){
			if(popDcrStopCondition(num))
				clearInterval(window['popDcr'+num]),document.getElementById('popDcrBuff'+num).remove(),popUpdating = setInterval(popUpdate, popSpeed);
			if(popDecrementAttribute['dcr'+num]['cnt']>=1)
				popSub(popDecrementAttribute['dcr'+num]['cnt']);
			else if(popDecrementAttribute['dcr'+num]['cnt']<1)
				popSub(Math.ceil(totalPop*popDecrementAttribute['dcr'+num]['cnt']));
		},popSpeed,num,totalPop);
	}
}
function popUpdate()
{
	var deltapop=0;//现在人口增长速度看起来可能很怪，不必惊慌只是函数算出来增加量是0
	if(popLimit-population>0)//否则有可能有奇怪的bug,直接限制比较方便
	{
		deltapop=popIncrement(popLimit-population);
		deltapop=Math.min(popLimit-population,deltapop);//保证人口数量不超过人口限制
	}
	population+=deltapop;//计算人口量结果
	production['jobless']+=deltapop;
	document.getElementById('popNum').innerText=population;
	elementPro['jobless'].innerText=production['jobless'];
	productionVariation();
	return popUpdate;
}
function productionVariation()//工人或buff  序号  工人数量
{
	caclActualWrkNum();
	for(var key in produceResult)
	{
		produceResult[key]=0;//预处理，清零
	}
	for(var key in popNeed)
	{
		produceResult[key]+=popNeed[key]*population;
	}
	for(var key in buildingAttribute)
	{
		if(buildingAttribute[key]['consume']!=null&&buildingAttribute[key]['num']>0)
		{
			for(var keyp in buildingAttribute[key]['consume'])
				produceResult[keyp]+=buildingAttribute[key]['consume'][keyp];
		}
	}
	for(var keyw in workersTable)//计算生产量
	{
		for(var keyp in workersTable[keyw])
		{
			if(workersTable[keyw][keyp]>0)
				produceResult[keyp]+=actualWrkNum[keyw]*workersTable[keyw][keyp]*workerEfficient[keyw]/100;
			else if(workersTable[keyw][keyp]<0)
				produceResult[keyp]+=actualWrkNum[keyw]*workersTable[keyw][keyp];
		}
	}
	for(var key in produceResult)
	{
		if(document.getElementById(key)==null) continue;
		if(Number(produceResult[key])!=Math.round(produceResult[key]))//若为小数
			document.getElementById(key).nextElementSibling.innerText='('+produceResult[key].toFixed(1)+')';//更新HTML
		else if(Number(produceResult[key])==Math.round(produceResult[key]))//整数
			document.getElementById(key).nextElementSibling.innerText='('+produceResult[key]+')';
	}
}
function WorkersAdd(AddorSub,name)
{
	//工人+1 +5 -1 -5的情况
	if(AddorSub==1)
	{
		if(production['jobless']>0)
			worker[name]++,production['jobless']--;
	}
	else if(AddorSub==5)
	{
		worker[name]+=Math.min(production['jobless'],5),production['jobless']-=Math.min(production['jobless'],5);
	}
	else if(AddorSub==-1)
	{
		if(worker[name]>0)
			worker[name]--,production['jobless']++;
	}
	else if(AddorSub==-5)
	{
		production['jobless']+=Math.min(worker[name],5),worker[name]-=Math.min(worker[name],5);
	}
	productionVariation();//更新生产量显示
	elementPro['jobless'].innerText=production['jobless'];
	worker[name]=Math.max(worker[name],0);//似乎没用
	elementWorkNum[name].innerText=worker[name];
}
function popSub(reduction)
{
	reduction=Math.min(population,reduction);
	population-=reduction;//减少总人口
	document.getElementById('popNum').innerText=population;
	var temp=Math.min(production['jobless'],reduction);
	production['jobless']-=Math.min(production['jobless'],reduction);//优先减无业者
	reduction-=temp;//计算新的减少量
	elementPro['jobless'].innerText=production['jobless'];
	for(var key in worker)//减少工人
	{
		var temp=Math.min(worker[key],reduction);
		worker[key]-=Math.min(worker[key],reduction);//减少该工人
		reduction-=temp;
		elementWorkNum[key].innerText=worker[key];
	}
	for(var key in specialResident)//特殊人口优先级最低
	{
		var temp=Math.min(specialResident[key],reduction);
		specialResident[key]-=Math.min(specialResident[key],reduction);
		reduction-=temp;
		document.getElementById(key+'Num').innerText=specialResident[key];
	}
	productionVariation();
}