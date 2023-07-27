function initialization()//加载后运行
{
	//document.querySelectorAll('body *').forEach(element => element.classList.add('hidden'));
	document.getElementById('popNum').innerText=population;//初始化人口
	document.getElementById('maxPop').innerText=popLimit;
	inevitableEventsDelay=parseInt(Math.random()*10%maxDelay);
    var newGameBtn = document.createElement('button');
    newGameBtn.setAttribute('class','normalButton');
    newGameBtn.setAttribute('onclick','newGame()');
    newGameBtn.innerText = 'New Game';
    newGameBtn.style.background = 'none';
    newGameBtn.style.display = 'block';
    var importFileBtn = document.createElement('button');
    importFileBtn.setAttribute('class','normalButton');
    importFileBtn.innerText = 'Import File';
    importFileBtn.style.background = 'none';
    importFileBtn.style.display = 'block';
    importFileBtn.style.marginTop = '20px';
    var container = document.createElement('container');
    container.setAttribute('id','startGameBtn')
    container.style.position='absolute'; 
    container.style.left= '50%';
    container.style.top='50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.appendChild(newGameBtn);
    container.appendChild(document.createElement('br'));
    container.appendChild(importFileBtn);
    document.body.appendChild(container);
}
function newGame()
{
    document.getElementById('startGameBtn').remove();
    document.getElementById('all').setAttribute('class','');
    //setInterval(eventsDisplay,eventSpeed);
    setInterval(produce(),proSpeed);//定期执行production
    popUpdating=setInterval(popUpdate,popSpeed);
}