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
function initialization()//加载后运行
{
	document.getElementById('popNum').innerText=population;//初始化人口
	document.getElementById('maxPop').innerText=popLimit;
}
function produce()
{
	for(const keyw in workersTable)//遍历table的worker
	{
		for(var i=1;i<=worker[keyw];i++)//按每个worker判定是否资源足够
		{
			var enoughProJudge=true;
			for(const keyp in workersTable[keyw])//遍历所有种资源判断是否足够
			{
				if(production[keyp]+workersTable[keyw][keyp]<0)
					{enoughProJudge=false;break;}
			}
			if(enoughProJudge)
				for(const keyp in workersTable[keyw])
					production[keyp]+=workersTable[keyw][keyp]*workerEfficient[keyw]/100;
		}
	}//当初始worker!=0时可能会有bug?
	for(var key in production)//同时遍历production
	{
		elementPro[key].innerText=parseInt(production[key]);
	}
	//product1Num=Math.max(product1Num+count,0);
	return produce;
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
	return popUpdate;
}
function bldHouse()
{
	if(production['product2Num']>=5)
	{
		production['product2Num']-=5;//建房，扣资源，加人口限制
		elementPro['product2Num'].innerText=parseInt(production['product2Num']);
		popLimit+=5;
		document.getElementById('maxPop').innerText=popLimit;
	}
}
function productionVariation()//工人或buff  序号  工人数量
{
	for(var key in produceResult)
	{
		produceResult[key]=0;//预处理，清零
	}
	for(var keyw in workersTable)//计算生产量
	{
		for(var keyp in workersTable[keyw])
		{
			if(workersTable[keyw][keyp]>0)
				produceResult[keyp]+=worker[keyw]*workersTable[keyw][keyp]*workerEfficient[keyw]/100;
			else if(workersTable[keyw][keyp]<0)
			produceResult[keyp]+=worker[keyw]*workersTable[keyw][keyp];
		}
	}
	for(var key in produceResult)
	{
		document.getElementById(key).nextElementSibling.innerText='('+parseInt(produceResult[key])+')';//更新HTML
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
	for(var i=lastWorker;i>=1;i--)
	{
		workerName='worker'+i;//确定减少的工人
		var temp=Math.min(worker[workerName],reduction);
		worker[workerName]-=Math.min(worker[workerName],reduction);//减少该工人
		reduction-=temp;
		elementWorkNum[workerName].innerText=worker[workerName];
	}
}
function build(name)
{
	var enoughResources=true;
	if(!building[name])
	{
		for (var key in buildingsTable[name])//确认资源足够建造
		{
			if(buildingsTable[name][key]>production[key])
				{enoughResources=false;break;}
		}
		if(enoughResources)//cursor写的有些看不懂，呜呜呜
		{//创建新的worker元素
			var num=bld2Num[name];
			building[name]=true;
			var workerNum=0;
			var workerName=num2WkrName[name];
			var workerDiv=document.createElement('div');
			workerDiv.setAttribute('id','worker'+num+'s');
			workerDiv.innerHTML=workerName+//不要换行，有莫名其妙的bug。也不要改，调语法累死
								'： <button class="btnSubClass" onclick="WorkersAdd(-5,'+'\'worker'+num+'\')"><span class="sub"></span></button><button class="btnSubClass" onclick="WorkersAdd(-1,'+'\'worker'+num+'\')"><span class="sub"></span></button>\n<span id="worker'+num+'">'
								+workerNum+'</span>\n<button class="btnAddClass" onclick="WorkersAdd(1,'+'\'worker'+num+'\')"><span class="add"></span></button><button class="btnAddClass" onclick="WorkersAdd(5,'+'\'worker'+num+'\')"><span class="add"></span></button>';
			document.body.insertBefore(workerDiv,document.getElementById("workerLast"));/*在worker的最后
			有一个workerLast标签，标记了worker的底线，新的worker从此前插入*/
			elementWorkNum['worker'+num]=document.getElementById('worker'+num);
			/*elementBtnAdd['worker'+num]=document.getElementById('btn'+num+'ProAdd')
			elementBtnSub['worker'+num]=document.getElementById('btn'+num+'ProSub')//将id赋值给数组*/
		}
		if(enoughResources)//扣资源
			for (var key in buildingsTable[name])
				production[key]-=buildingsTable[name][key];
		for(var key in production)//建造完成后刷新资源显示
		{
			elementPro[key].innerText=parseInt(production[key]);
		}
	}
}
setInterval(produce(),proSpeed);//定期执行production
setInterval(popUpdate,popSpeed);