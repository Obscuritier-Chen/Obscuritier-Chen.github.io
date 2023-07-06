//producing
var popSpeed=1000,proSpeed=2000,eventSpeed=5000;
var population=0,popLimit=20,lastWorker=3;
var production={product1Num:10,product2Num:20,product3Num:20,jobless:0};
var item={item1Num:0,item2Num:0};//物品
var building={building1:false,building2:false};
var elementBtnAdd={worker1:document.getElementById('btn1ProAdd'),
				   worker2:'xzx',
				   worker3:'xzx'};
var elementBtnSub={worker1:document.getElementById('btn1ProSub'),
				   worker2:'xzx',
				   worker3:'xzx'};
var elementPro={product1Num:document.getElementById('product1Num'),//在字典里就获取element,但此时body未加载
				product2Num:document.getElementById('product2Num'),
				product3Num:document.getElementById('product3Num'),
			 	jobless:document.getElementById('jobless')};
var worker={worker1:0,worker2:0,worker3:0};
var workerEfficient={worker1:100,worker2:100,worker3:100};//产出加权
var produceResult={product1Num:0,product2Num:0,product3Num:0}
var elementWorkNum={worker1:document.getElementById('worker1'),
				    worker2:'xzx',
				    worker3:'xzx'};//有xzx的都是之后创建的元素，需要创建时赋值
var bld2Num={building1:2,
			 building2:3};
var num2WkrName={building1:'worker2Num',
			 	building2:'worker3Num'};
var workersTable={// 注意此变量的一级下标worker1,worker2等等必须与worker完全相同
	worker1:{//二级下标product1Num,product2Num等等必须与production完全相同
		product1Num:5,
		product2Num:0,
		product3Num:0
	},
	worker2:{
		product1Num:0,
		product2Num:2,
		product3Num:0
	},
	worker3:{
		product1Num:0,
		product2Num:-1,
		product3Num:2
	}
};
var buildingsTable={
	building1:{
		product1Num:0,
		product2Num:5,
		product3Num:0
	},
	building2:{
		product1Num:0,
		product2Num:1,
		product3Num:5
	}
};
//---------------------------------------
//events
var inevitableEvents=[];//必然事件的堆栈
var randomEventsPr={event1:10,	
                    event2:10,
                    event3:10};
var randomEventsAttribute={
    event1:
    {//事件标题 内容 类型
        title:'event1',
        content:'population-5',
        type:1
    },
    event2:
    {
        title:'event2',
        content:'product1+5',
        type:1
    },
    event3:
    {
        title:'event3',
        content:'test3',
        type:2
    },
	event4:
    {
        title:'event4',
        content:'test4',
        type:2
    },
	event5:
	{
		title:'event5',
		content:'tradement',
		type:3
	}
};
var seletiveEventsSeletion={
	event3:
	{
		num:2,
		btn1:'btn1',
		btn2:'btn2'
	},
	event4:
	{
		num:3,
		btn1:'btn1',
		btn2:'btn2',
		btn3:'btn3'
	}
}
var tradeEventsGoods={
	event5:
	{
		num:3,
		goods1Content:'goods1',
		goods1Type:1,
		goods1:'product1Num',
		goods2Content:'goods2',
		goods2Type:2,
		goods2:'item1Num',
		goods3Content:'goods3',
		goods3Type:1,
		goods3:'product3Num'
	}
}
var goodsCost={//目前的交易只能消耗产品 未来可以给消耗品一个标记/使用if来判断消耗的是什么
	event5:
	{
		goods1:
		{
			product2Num:2,
			product3Num:2
		},
		goods2:
		{
			product1Num:1,
			product2Num:1,
			product3Num:1
		},
		goods3:
		{
			product1Num:10,
			product2Num:10
		}
	}
}
var eventsBuff={//事件发生概率加权，0.01为单位
                event1:0,
                event2:0,
                event3:0};
var eventsBuffsContent={
				 buff1:'eventsbuff1',
				 buff2:'eventsbuff2'
}
var produceBuffsContent={
	buff1:'producebuff1',
	buff2:'producebuff2'
}
var eventsBuffsEffect={//改变事件发生概率的buff的效果
	buff1:
	{
		eventNum:'event1',
		effect:10,
		duration:-1//持续时间 -1是无限时间，以分钟为单位
	},
	buff2:
	{
		eventNum:'event2',
		effect:20,
		duration:1
	}
}
var produceBuffsEffect={
	buff1:
	{
		workerNum:'worker1',
		effect:150,
		duration:-1//持续时间 -1是无限时间，以分钟为单位
	},
	buff2:
	{
		workerNum:'worker1',
		effect:-100,
		duration:5
	}
}
