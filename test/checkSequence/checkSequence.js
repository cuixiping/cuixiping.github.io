function checkSequence(cards){ //入口,传入牌值数组,0表示A,15表示小王,16表示大王,2~13表示2~K
    var total = cards.length, count=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	if(total>14 || total<2 || (/\b([2-9]|1[0-3]),.*\b\1\b|\b0,.*\b0,.*\b0\b/).test(cards.join(','))){
		return false; //牌数太多、太少，或有3个以上A，或2~K有重复
	}
	for(var i=0; i<total; i++){
		count[cards[i]]++;
    }
	if(count[0]==2){ //2个A，换算成1,14
		count[1] = count[14] = (count[0]=0)+1;
	}
	if(count[15]+count[1]+count[2]+count[3]+count[4]+count[5]>5){ //5以内超过5个
		return false;
	}
	if(count[0] && count[15]+count[2]+count[3]+count[4]+count[5]==5){ //有A且只能作14
		count[14] = count[0]--;
	}
	return check(count[15] ? checkWithXW : checkWithoutXW, count);
}
function checkWithoutXW(count){ //检测不含小王的情况
	return (count.slice(1,15).join(',').replace(/^(0,)+|(,0)+$/g,'').match(/\b0\b/g)||'').length <= count[16];
}
function checkWithXW(count){ //检测含小王的情况
	if(count.slice(1,6).indexOf(1)<0){ //没有1~5的牌，从5开始填小王
		for(var i=0,j=5;i<count[15];i++){
			count[15] -= count[j--]=1;
		}
	}else{ //补缺 >> 补大 >> 补小
		for(i=count.indexOf(1,1)+1,j=count.lastIndexOf(1,5); count[15] && i<j; i++){
			if(!count[i]){
				count[15] -= count[i]=1;
			}
		}
		for(i=count.lastIndexOf(1,5)+1; count[15] && i<=5; i++){
			count[15] -= count[i]=1;
		}
		for(i=count.lastIndexOf(1,1)-1; count[15] && i>=1; i--){
			count[15] -= count[i]=1;
		}
	}
	return check(checkWithoutXW, count);
}
function check(fn,count){ //A的情况分别检测
	if(count[0]){
		var c1 = count.slice(0), c2 = count.slice(0);
		c1[1] = c1[0]--;
		c2[14] = c2[0]--;
		return fn(c1) || fn(c2);
	}
	return fn(count);
}

//以下是测试用途

//大城小胖的2参数形式
function checkSequence_wzj(cards1,cards2){
	return checkSequence(cards1.concat(cards2));
}


function cards2str(cards){
	return cards.join(',').replace(/\d+/g, function (d){
		return value2str[d];
	});
}
function rndCards(){ //随机5到14张牌，成一条龙的几率极小
	//先取5张不重复的2~K的牌，再随机加入A和王
	//[2,3,4,5,6,7,8,9,10,11,12,13,0,0,15,15,15,16,16,16]
	var ns = [7, 15, 16, 2, 13, 16, 5, 15, 0, 10, 11, 9, 4, 6, 12, 8, 16, 0, 3, 15].sort(function(){return 1-(Math.random()<=.5)*2});
	return ns.slice(ns[0] % (ns.length-5), ns[0] % (ns.length-5) + 6);
}
function rndTest(){
	for(var i=10;i--;){
		traceCards(rndCards());
	}
}
function traceCards(cards){
	trace(checkSequence(cards) +'\t'+ cards2str(cards));
}
function clear(){
	traceOutput.innerHTML='';
}
function trace(s){
	traceOutput.innerHTML += s+'\n';
}
function $(id){return document.getElementById(id);}

var value2str = {0:'A',1:'A',14:'A',15:'小王',16:'大王', 2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',10:'10',11:'J',12:'Q',13:'K'};
var str2value = {J:11,Q:12,K:13,'A':0,'小王':15,'大王':16,'BLACK_JOKER':15,'RED_JOKER':16, 2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10};

var traceOutput = $('traceOutput');
$('btnRnd').onclick = function (){
	clear();
	rndTest();
};
$('btnCheck').onclick = function (e){
	var cards = stringToCards($('cards').value);
	$('ckResult').innerHTML = checkSequence(cards) +' &nbsp; '+ cards2str(cards);
};
$('cards').onkeypress = function (e){
	if(e.keyCode==13){
		var cards = stringToCards($('cards').value);
		$('ckResult').innerHTML = checkSequence(cards) +' &nbsp; '+ cards2str(cards);
	}
};
function stringToCards(s){
	var matches = s.toUpperCase().match(/(\b[1-9JQKA]\b|\b10\b|小王|大王|RED_JOKER|BLACK_JOKER)/g);
	if(!matches){
		return [];
	}
	var cards = [];
	for(var i=0,n=matches.length;i<n;i++){
		cards[i] = str2value[matches[i]];
	}
	console.log(s, cards);
	return cards;
}

traceCards(stringToCards('2, 9, A, 大王, 小王, 大王, 小王, 3,8')); //应该返回true
//traceCards(stringToCards('[2, 9, "A", "RED_JOKER", "BLACK_JOKER"], ["RED_JOKER", "BLACK_JOKER", 3,8]'));
traceCards(stringToCards('小王 小王 大王 大王 8 9 10 J Q A')); //应该返回false
//traceCards(stringToCards('["BLACK_JOKER", "BLACK_JOKER"], ["RED_JOKER", "RED_JOKER", 8, 9,10,"J","Q","A"]'));

rndTest();
