let _product1Num=production['product1Num'];
Object.defineProperty(production,'product1Num',//实时监测production['product1Num']值
{
    get()
    {
        return _product1Num;
    },
    set(value)
    {
        _product1Num=value;
        if(value===0)
        {
            if(document.getElementById('popDcrBuff3')==null)
            {
                infoPopup(1);//在HTML中提醒
                popDecrement(3);
            }
        }
    },
    enumerable: true,
    configurable: true
});