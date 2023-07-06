function productMsOn(num)
{
    if(document.getElementById('product'+num+'Detail')==null)
    {
        var rectangle = document.createElement('div');
        rectangle.className = 'rectangle';
        rectangle.setAttribute('id','product'+num+'Detail');
        for(var key in workersTable)
        {
            if(workersTable[key]['product'+num+'Num']!=0&&worker[key]!=0)
            {
                var produce=document.createElement('div');
                produce.innerText=worker[key]+'*'+key+':     '+worker[key]*workersTable[key]['product'+num+'Num'];
                rectangle.appendChild(produce);
                for(var keyb in produceBuffsEffect)
                {
                    //alert(produceBuffsEffect[keyb]['workerNum']+key);
                    if(produceBuffsEffect[keyb]['workerNum']==key&&document.getElementById('produceBuff'+keyb.replace('buff',''))!=null)
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
        document.getElementById('product'+num).appendChild(rectangle);
    }
}
function productMsOff(num)
{
    document.getElementById('product'+num+'Detail').remove();
}