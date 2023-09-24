function randomEvents()
{
	var prSum=0,coefficient,randomEventsNum;//randomEventsNum是随机事件编号
	var randomEventsLength=Object.keys(randomEventsPr).length;//获取字典的大小
	//prPrefixSum
	prPrefixSum=new Array(randomEventsLength+1);
	prPrefixSum[0]=0;
	var i=1;
	for(var key in randomEventsPr)//和人口增加的思路类似，但概率是预设的
	{
		prSum+=randomEventsPr[key]*(1+0.01*eventsBuff[key]);//原始概率+buff
		prPrefixSum[i]=Number(prPrefixSum[i-1]+randomEventsPr[key]*(1+0.01*eventsBuff[key]));
		i++;
	}
	coefficient=1/prSum;
	coefficient=coefficient.toFixed(7);
	coefficient=Number(coefficient);
	for(var i=1;i<=randomEventsLength;i++)
	{
		prPrefixSum[i]*=coefficient;
		prPrefixSum[i]=prPrefixSum[i].toFixed(7);
		prPrefixSum[i]=Number(prPrefixSum[i]);
	}
	randomPr=Math.random();//随机生成0~1之间的数
	for(var i=1;i<=randomEventsLength;i++)
	{
		if(prPrefixSum[i]>=randomPr)
			{randomEventsNum=i;break;}
	}
	return randomEventsNum;
}
function performConfirmEvents(randomEventsNum)
{
	switch (randomEventsNum)//根据时间编号产生事件效果
	{
		case 1:
			popSub(5);
			break;
		case 2:
			production['product1Num']+=5;
			elementPro['product1Num'].innerText=parseInt(production['product1Num']);
			break;
		default:
			break;
	}
	productionVariation();
	proVariationMonitor();
}
function performSeletiveEvents(eventNum,btnNum)
{
	switch (eventNum)//根据事件 和 选择产生效果
	{
		case 3://事件要用原本的事件号
			switch (btnNum)
			{
				case 1:
					inevitableEvents.push(1);//给预备序列里添加必然事件
					break;
				case 2:
					alert('12');
					break;
				default:
					break;
			}
			break;
		case 4:
			switch (btnNum)
			{
				case 1:
					alert('21');
					break;
				case 2:
					alert('22');
					break;
				case 3:
					alert('23');
					break;
				default:
					break;
			}
			break;
		default:
			break;
	}
	document.getElementById('eventsPopup').remove();//移除popup
	productionVariation();
	proVariationMonitor();
}
function performTradeEvents(eventNum,btnNum,goodsNum)//大胆一点，买buff/事件
{
	var tempFlag=true;
	for(var key in goodsCost['event'+eventNum]['goods'+btnNum])//判断资源是否足够
	{
		if(production[key]>=goodsCost['event'+eventNum]['goods'+btnNum][key]*goodsNum)
			continue
		else
			{tempFlag=false;break;}
	}
	if(tempFlag)
	{
		for(var key in goodsCost['event'+eventNum]['goods'+btnNum])
		{
			production[key]-=goodsCost['event'+eventNum]['goods'+btnNum][key]*goodsNum;//扣资源
		}
		if(tradeEventsGoods['event'+eventNum]['goods'+btnNum+'Type']==1)
		{
			production[tradeEventsGoods['event'+eventNum]['goods'+btnNum]]+=goodsNum;
		}
		else if(tradeEventsGoods['event'+eventNum]['goods'+btnNum+'Type']==2)
		{
			item[tradeEventsGoods['event'+eventNum]['goods'+btnNum]]+=goodsNum;//显示先不写
		}
		for(var key in production)//刷新production显示
		{
			if(elementPro[key]=='xzx') continue;
			elementPro[key].innerText=parseInt(production[key]);
		}
	}
	productionVariation();
	proVariationMonitor();
}
function eventsDisplay()
{
	if(document.getElementById('eventsPopup') == null)
	{
		var randomEventsNum=0;//产生时间编号
		if(inevitableEvents.length!=0)//必然事件
		{
			if(inevitableEventsDelay==0)
				inevitableEventsDelay=parseInt(Math.random()*10%maxDelay),randomEventsNum=inevitableEvents.shift();
			else if(inevitableEventsDelay>0)
				inevitableEventsDelay--,randomEventsNum=randomEvents();
		}
		else if(inevitableEvents.length==0)//随机事件
		{
			randomEventsNum=randomEvents();
		}
		if(randomEventsAttribute['event'+randomEventsNum]['type']==1)
		{
			performConfirmEvents(randomEventsNum);//confirm事件 的效果
			var popup = document.createElement('div');
    		popup.setAttribute('id', 'eventsPopup'); // 添加id
    		popup.style.position = 'fixed';
    		popup.style.top = '50%';
    		popup.style.left = '50%';
    		popup.style.transform = 'translate(-50%, -50%)';
    		popup.style.backgroundColor = 'white';
			popup.style.padding = '200px';
			popup.style.border = '1px solid black';
			popup.style.zIndex = '100';
			// create a new div element for the text
			var titleDiv = document.createElement('div');//标题
			titleDiv.innerText = randomEventsAttribute['event'+randomEventsNum]['title'];
			titleDiv.style.position = 'absolute';
			titleDiv.style.top = '10px';
			//titleDiv.style.left = '50px';
			titleDiv.style.fontSize = '22px';//字体大小
			titleDiv.style.left = '0';
			titleDiv.style.right = '0';
			titleDiv.style.textAlign = 'center';
			//titleDiv.style.wordWrap = 'break-word';//自动换行
			//titleDiv.style.maxWidth = 'calc(100% - 90px)';//难不成你个标题还换行？
			popup.appendChild(titleDiv);//将此文本加入到popup中
			//------------------------------------分割线----------------------------------------
			var contentDiv = document.createElement('div');//内容
			contentDiv.innerText = randomEventsAttribute['event'+randomEventsNum]['content'];
			contentDiv.style.position = 'absolute';
			contentDiv.style.top = '70px';
			contentDiv.style.left = '50px';
			contentDiv.style.fontSize = '17px';//字体大小
			contentDiv.style.wordWrap = 'break-word';//自动换行
			contentDiv.style.maxWidth = 'calc(100% - 100px)';//距离右边界n px时换行,n=-50时达到右边界，
			popup.appendChild(contentDiv);//将此文本加入到popup中
			//------------------------------------分割线----------------------------------------
			var confirmButton = document.createElement('button');
			confirmButton.style.position = 'absolute';
			confirmButton.style.bottom = '20px';
			confirmButton.style.right = '20px';
			confirmButton.style.background = 'none'; // 删除按钮背景
			confirmButton.style.fontSize = '1.5em';
			confirmButton.innerText = "confirm";
			confirmButton.addEventListener('click', function() {
				popup.remove(); // 点击关闭按钮时移除popup
			});
			popup.appendChild(confirmButton);
			// 将popup添加到body中
			document.body.appendChild(popup);
		}
		else if(randomEventsAttribute['event'+randomEventsNum]['type']==2)//选择性事件
		{
			var popup = document.createElement('div');
    		popup.setAttribute('id', 'eventsPopup'); // 添加id
    		popup.style.position = 'fixed';
    		popup.style.top = '50%';
    		popup.style.left = '50%';
    		popup.style.transform = 'translate(-50%, -50%)';
    		popup.style.backgroundColor = 'white';
			popup.style.padding = '200px';
			popup.style.border = '1px solid black';
			popup.style.zIndex = '100';
			// create a new div element for the text
			var titleDiv = document.createElement('div');//标题
			titleDiv.innerText = randomEventsAttribute['event'+randomEventsNum]['title'];
			titleDiv.style.position = 'absolute';
			titleDiv.style.top = '10px';
			//titleDiv.style.left = '50px';
			titleDiv.style.fontSize = '22px';//字体大小
			titleDiv.style.left = '0';
			titleDiv.style.right = '0';
			titleDiv.style.textAlign = 'center';
			popup.appendChild(titleDiv);//将此文本加入到popup中
			//------------------------------------分割线----------------------------------------
			var contentDiv = document.createElement('div');//内容
			contentDiv.innerText = randomEventsAttribute['event'+randomEventsNum]['content'];
			contentDiv.style.position = 'absolute';
			contentDiv.style.top = '70px';
			contentDiv.style.left = '50px';
			contentDiv.style.fontSize = '17px';//字体大小
			contentDiv.style.wordWrap = 'break-word';//自动换行
			contentDiv.style.maxWidth = 'calc(100% - 100px)';//距离右边界n px时换行,n=-50时达到右边界，
			popup.appendChild(contentDiv);//将此文本加入到popup中
			//------------------------------------分割线----------------------------------------
			var buttonCount = seletiveEventsSeletion['event'+randomEventsNum]['num']; // 按钮数量
			// 创建按钮容器
			var buttonContainer = document.createElement('div');
			buttonContainer.style.position = 'absolute';
			buttonContainer.style.bottom = '10px';
			buttonContainer.style.left = '0';
			buttonContainer.style.right = '0';
			buttonContainer.style.textAlign = 'center';

			// 创建按钮
			for (var i=1;i<=buttonCount;i++)
			{
				var button = document.createElement('button');
				button.innerText = seletiveEventsSeletion['event'+randomEventsNum]['btn'+i];
				button.style.height = '25px';
				button.style.marginTop='5px';
				button.style.background = 'none';
				button.style.border = '1px solid black';
				button.style.width = '280px';
				button.setAttribute('onclick','performSeletiveEvents('+randomEventsNum+','+i+')');//设置按钮触发后的效果
				buttonContainer.appendChild(button);
				buttonContainer.appendChild(document.createElement('br'));
			}

			popup.appendChild(buttonContainer);

			document.body.appendChild(popup);
		}
		else if(randomEventsAttribute['event'+randomEventsNum]['type']==3)//贸易事件
		{
			var popup = document.createElement('div');
    		popup.setAttribute('id', 'eventsPopup'); // 添加id
    		popup.style.position = 'fixed';
    		popup.style.top = '50%';
    		popup.style.left = '50%';
    		popup.style.transform = 'translate(-50%, -50%)';
    		popup.style.backgroundColor = 'white';
			popup.style.padding = '200px';
			popup.style.border = '1px solid black';
			popup.style.zIndex = '100';
			// create a new div element for the text
			var titleDiv = document.createElement('div');//标题
			titleDiv.innerText = randomEventsAttribute['event'+randomEventsNum]['title'];
			titleDiv.style.position = 'absolute';
			titleDiv.style.top = '10px';
			//titleDiv.style.left = '50px';
			titleDiv.style.fontSize = '22px';//字体大小
			titleDiv.style.left = '0';
			titleDiv.style.right = '0';
			titleDiv.style.textAlign = 'center';
			//titleDiv.style.wordWrap = 'break-word';//自动换行
			//titleDiv.style.maxWidth = 'calc(100% - 90px)';//难不成你个标题还换行？
			popup.appendChild(titleDiv);//将此文本加入到popup中
			//------------------------------------分割线----------------------------------------
			var contentDiv = document.createElement('div');//内容
			contentDiv.innerText = randomEventsAttribute['event'+randomEventsNum]['content'];
			contentDiv.style.position = 'absolute';
			contentDiv.style.top = '50px';
			contentDiv.style.left = '50px';
			contentDiv.style.fontSize = '17px';//字体大小
			contentDiv.style.wordWrap = 'break-word';//自动换行
			contentDiv.style.maxWidth = 'calc(100% - 100px)';//距离右边界n px时换行,n=-50时达到右边界，
			popup.appendChild(contentDiv);//将此文本加入到popup中
			//------------------------------------分割线----------------------------------------
			// 创建按钮容器
			var buttonCount = tradeEventsGoods['event'+randomEventsNum]['num'];//交易数
			var tradement=document.createElement('div');//交易的容器
			tradement.style.bottom = '30px';
			tradement.style.left = '50px';
			tradement.style.right = '0';
			tradement.style.position='absolute';
			for (var i=1;i<=buttonCount;i++)
			{
				var buttonContainer = document.createElement('div');//每个交易的容器
				buttonContainer.style.position = 'relative';
				buttonContainer.style.left = '0';
				buttonContainer.style.right = '0';
				//------------------------------------------------------------------------
				var goods=document.createElement('span')
				goods.innerText=tradeEventsGoods['event'+randomEventsNum]['goods'+i+'Content'];

				buttonContainer.appendChild(goods);
				var button1 = document.createElement('button');//1个
				button1.innerText = 1;
				button1.style.height = '30px';
				button1.style.width='30px';
				button1.style.marginLeft='20px';
				button1.style.marginTop='10px';
				button1.style.background = 'none';
				button1.style.border = '1px solid black';
				button1.setAttribute('onclick','performTradeEvents('+randomEventsNum+','+i+','+'1'+')');//设置按钮触发后的效果
				buttonContainer.appendChild(button1);
				var button5 = document.createElement('button');//5个
				button5.innerText = 5;
				button5.style.height = '30px';
				button5.style.width='30px';
				button5.style.marginLeft='20px';
				button5.style.marginTop='10px';
				button5.style.background = 'none';
				button5.style.border = '1px solid black';
				button5.setAttribute('onclick','performTradeEvents('+randomEventsNum+','+i+','+'5'+')');
				buttonContainer.appendChild(button5);
				var button10 = document.createElement('button');//10个
				button10.innerText = 10;
				button10.style.height = '30px';
				button10.style.width='30px';
				button10.style.marginLeft='20px';
				button10.style.marginTop='10px';
				button10.style.background = 'none';
				button10.style.border = '1px solid black';
				button10.setAttribute('onclick','performTradeEvents('+randomEventsNum+','+i+','+'10'+')');
				buttonContainer.appendChild(button10);
				tradement.appendChild(buttonContainer);
			}
			popup.appendChild(tradement);
			var confirmButton = document.createElement('button');
			confirmButton.style.position = 'absolute';
			confirmButton.style.bottom = '10px';
			confirmButton.style.right = '10px';
			confirmButton.style.border='1px solid black';
			confirmButton.style.background = 'none'; // 删除按钮背景
			confirmButton.style.fontSize = '1em';
			confirmButton.innerText = "confirm";
			confirmButton.addEventListener('click', function() {
				popup.remove(); // 点击关闭按钮时移除popup
			});
			popup.appendChild(confirmButton);
			//popup.appendChild(buttonContainer);
			document.body.appendChild(popup);
		}
	}
}