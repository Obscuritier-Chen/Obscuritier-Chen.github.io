var gameType=0;//教程或是正常游玩
//producing
var popSpeed=1000,proSpeed=2000,eventSpeed=5000;
var popUpdating;
var population=3,popLimit=20;
var production={product1Num:10,product2Num:1,product3Num:0,product4Num:0,jobless:0};
var specialResident={//特殊人口
	researcherLv1:2,
	researcherLv2:0,
	researcherLv3:1
}
var proDisplay={product1Num:1,product2Num:1,product3Num:0,product4Num:0};
var popNeed={product1Num:-0.1,product2Num:0,product3Num:0,product4Num:0};
var item={item1Num:0,item2Num:0};//物品
var elementBtnAdd={worker1:document.getElementById('btn1ProAdd'),
				   worker2:'xzx',
				   worker3:'xzx'};
var elementBtnSub={worker1:document.getElementById('btn1ProSub'),
				   worker2:'xzx',
				   worker3:'xzx'};
var elementPro={product1Num:document.getElementById('product1Num'),//在字典里就获取element,但此时body未加载
				product2Num:document.getElementById('product2Num'),
				product3Num:'xzx',
				product4Num:'xzx',
			 	jobless:document.getElementById('jobless')};
var worker={worker1:0,worker2:0,worker3:0,builder:0};
var actualWrkNum={worker1:0,worker2:0,worker3:0};
var workingBuilder=0;
var workerEfficient={builder:100,worker1:100,worker2:100,worker3:100};//产出加权
var produceResult={product1Num:0,product2Num:0,product3Num:0,product4Num:0}
var elementWorkNum={builder:document.getElementById('builder'),
					worker1:document.getElementById('worker1'),
				    worker2:'xzx',
				    worker3:'xzx'};//有xzx的都是之后创建的元素，需要创建时赋值
var bld2Num={building1:'worker2',
			 building2:'worker3'};
var num2WkrName={building1:'worker2Num',
			 	building2:'worker3Num'};
var workersTable={// 注意此变量的一级下标worker1,worker2等等必须与worker完全相同
	builder:{//二级下标product1Num,product2Num等等必须与production完全相同
		product1Num:0,
		product2Num:0,
		product3Num:0,
		product4Num:0
	},
	worker1:{
		product1Num:5,
		product2Num:0,
		product3Num:0,
		product4Num:0
	},
	worker2:{
		product1Num:-1,
		product2Num:-1,
		product3Num:2,
		product4Num:0
	},
	worker3:{
		product1Num:0,
		product2Num:2,
		product3Num:0,
		product4Num:1
	}
};
var buildingAttribute={
	house:{
		type:1,
		display:1,
		num:0,
		need:{
			product1Num:0,
			product2Num:5,
			product3Num:0,
			product4Num:0
			},
		preResearch:null,
		builderNeed:1,
		limit:-1,
		time:60,
		text:'increasePopLimittestetstetstestetstest',
		consume:null,
		condition:0
	},
	building1:{
		type:2,
		display:0,
		num:0,
		need:{
			product1Num:0,
			product2Num:1,
			product3Num:0,
			product4Num:0
			},
		preResearch:['research1'],
		builderNeed:1,
		limit:1,
		time:30,
		text:'forWorker2',
		consume:null,
		condition:0
	},
	building2:{
		type:2,
		display:0,
		num:0,
		need:{
			product1Num:0,
			product2Num:1,
			product3Num:0,
			product4Num:0
			},
		preResearch:['research2'],
		builderNeed:0,
		limit:1,
		time:30,
		text:'forWorker3',
		consume:null,
		condition:0
	},
	building3:{
		type:2,
		display:0,
		num:0,
		need:{
			product1Num:0,
			product2Num:0,
			product3Num:0,
			product4Num:1
			},
		preResearch:['research2'],
		builderNeed:1,
		limit:1,
		time:30,
		text:'forWorker4',
		consume:null,
		condition:0
	},
	building4:{
		type:4,
		display:1,
		num:0,
		need:{
			product1Num:0,
			product2Num:1,
			product3Num:0,
			product4Num:0
			},
		preResearch:null,
		builderNeed:0,
		limit:1,
		time:30,
		text:'forpopIncrement',
		consume:{
			product2Num:-1
		},
		condition:0
	},
	building5:{
		type:3,
		display:0,
		num:0,
		need:{
			product1Num:5,
			product2Num:0,
			product3Num:0,
			product4Num:0
			},
		preResearch:null,
		builderNeed:0,
		limit:1,
		time:30,
		text:'add a buff',
		consume:{
			product2Num:-1
		},
		condition:0,
		buffName:'buff3'
	}
}
var popDecrementAttribute={
	dcr1:{
		name:'dcr1',
		times:3,
		cnt:[0,1,2,3]
	},
	dcr2:{
		name:'dcr2',
		times:5,
		cnt:[0,0.3,0.3,0.2,0.1,0.1]//记得数组第一个下标为0
	},
	dcr3:{
		name:'dcr3',
		times:-1,
		cnt:0.2
	}
}
//------------------------------------------------------------------------
//events
var inevitableEvents=[];//必然事件的堆栈
var inevitableEventsDelay=0,maxDelay=4;
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
var buffAttribute={
	buff1:
	{
		type:'event',
		content:'event1 pos increase',
		eventName:'event1',
		effect:10,
		duration:-1,
		condition:0,
		working:0
	},
	buff2:
	{
		type:'event',
		content:'event2 pos increase',
		eventName:'event2',
		effect:20,
		duration:5,
		condition:0,
		working:0
	},
	buff3:
	{
		type:'produce',
		content:'increase wrk1 efficient',
		workerName:'worker1',
		effect:150,
		duration:-1,
		condition:0,
		working:0
	},
	buff4:
	{
		type:'produce',
		content:'decrease wrk3 efficient',
		workerName:'worker3',
		effect:-100,
		duration:5,
		condition:0,
		working:0
	}
}
var infoPopupAttribute={
	info1:
	{
		type:'normal',
		title:'alert',
		content:'There is no food'
	},
	info2:
	{
		type:'normal',
		title:'alert',
		content:'product2 is not enough'
	},
	courseInfo1:
	{
		type:'course',
		title:'courseInfo1',
		content:'the game is started'
	},
	courseInfo2:
	{
		type:'course',
		title:'courseInfo2',
		content:'this is the inhabited land condition'
	},
	courseInfo3:
	{
		type:'course',
		title:'courseInfo3',
		content:'我们需要更多的人口建设聚居地，现在建造一个火堆以吸引流民'
	},
	courseInfo4:
	{
		type:'course',
		title:'courseInfo4',
		content:'popIncrease begin'
	}
}
//------------------------------------------------------------------------
//research
var researchProject={
	research1:
	{
		type:'science',
		time:10,
		pre:null,//前置
		display:1,
		condition:0,//是否完成
		text:'research1',
		consume:null,
		unlock:['research2','research3']//可解锁
	},
	research2:
	{
		type:'engineering',
		time:10,
		pre:['research1'],
		display:0,
		condition:0,
		text:'research2',
		consume:
		{
			product2Num:5
		},
		unlock:['research4']
	},
	research3:
	{
		type:'sociology',
		time:10,
		pre:['research1'],
		display:0,
		condition:0,
		text:'research3',
		consume:null,
		unlock:['research4']
	},
	research4:
	{
		type:'engineering',
		time:1000,
		pre:['research2','research3'],
		display:0,
		condition:0,
		text:'research4',
		consume:null,
		unlock:null
	}
}
var researchSpeed={
	researcherLv1:1,
	researcherLv2:3,
	researcherLv3:5
}
var scienceAttribute={
	condition:0,
	researcherLv1:0,
	researcherLv2:0,
	researcherLv3:0
}
var engineeringAttribute={
	condition:0,
	researcherLv1:0,
	researcherLv2:0,
	researcherLv3:0
}
var sociologyAttribute={
	condition:0,
	researcherLv1:0,
	researcherLv2:0,
	researcherLv3:0
}
var freeResearcher={
	researcherLv1:2,
	researcherLv2:0,
	researcherLv3:1
}
var researchDisplayQueue=[];