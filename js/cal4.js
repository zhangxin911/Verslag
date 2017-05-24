function isOperator(value) {
	var operatorString = "+-*/()";
	return operatorString.indexOf(value) > -1
}

function getPrioraty(value) {
	switch(value) {
		case '+':
		case '-':
			return 1;
		case '*':
		case '/':
			return 2;
		default:
			return 0;
	}
}

//判断加减乘除的优先级
function prioraty(o1, o2) {
	return getPrioraty(o1) <= getPrioraty(o2);
}

function dal2Rpn(exp) {
	//输入栈
	var inputStack = [];
	//输出栈
	var outputStack = [];
	//输出队列
	var outputQueue = [];

	for(var i = 0, len = exp.length; i < len; i++) {
		var cur = exp[i];
		if(cur != ' ') {
			inputStack.push(cur); //+-*/() 数字，逐个添加到末尾
		}
	}

	//处理字符和数字
	while(inputStack.length > 0) {

		//shift 顶部取得一项后移除，unshift 顶部推入
		cur = inputStack.shift();

		//如果是符号 -->  + - * / ( )
		if(isOperator(cur)) {
			if(cur == '(') {
				//push 从尾部推入一项
				outputStack.push(cur);
			} else if(cur == ')') {
				//pop 从尾部取得一项，之后移出
				var po = outputStack.pop();
				while(po != '(' && outputStack.length > 0) {
					outputQueue.push(po);
					po = outputStack.pop();
				}
				if(po != '(') {
					throw "错误：没有匹配";
				}
			} else { //符号时，处理 + - * /
				while(prioraty(cur, outputStack[outputStack.length - 1]) &&
					outputStack.length > 0) {
					outputQueue.push(outputStack.pop());
				}
				outputStack.push(cur);
			}
		} else { //是数字的时候，推入数字
			outputQueue.push(new Number(cur));
		}
	}

	if(outputStack.length > 0) {
		if(outputStack[outputStack.length - 1] == ')' ||
			outputStack[outputStack.length - 1] == '(') {
			throw "错误：没有匹配";
		}
		while(outputStack.length > 0) {
			outputQueue.push(outputStack.pop());
		}
	}
	return evalRpn(outputQueue);
}

function evalRpn(queue) {
	var outputStack = [];
	while(queue.length > 0) {
		var cur = queue.shift();

		if(!isOperator(cur)) {
			outputStack.push(cur);
		} else {
			//如果输出堆栈长度小于 2
			if(outputStack.length < 2) {
				throw "无效堆栈长度";
			}
			var second = outputStack.pop();
			var first = outputStack.pop();

			outputStack.push(getResult(first, second, cur));
		}
	}

	if(outputStack.length != 1) {
		throw "不正确的运算";
	} else {
		return outputStack[0];
	}
}

function getResult(first, second, operator) {
	var result = 0;
	switch(operator) {
		case '+':
			result = first + second;
			break;
		case '-':
			result = first - second;
			break;
		case '*':
			result = first * second;
			break;
		case '/':
			result = first / second;
			break;
		default:
			return 0;
	}

	//浮点数的小数位超过两位时，只保留两位小数点
	function formatFloat(f, digit) {
		//pow(10,n) 为 10 的 n 次方
		var m = Math.pow(10, digit);
		return parseInt(f * m, 10) / m;
	}
	return(formatFloat(result, 2));
}
 