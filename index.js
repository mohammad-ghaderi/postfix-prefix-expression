const inp = document.getElementById("inp")
const output = document.getElementById("output")
const answerBtn = document.getElementById("answer-btn")
const infixBtn = document.getElementById("infix-btn")
const convertBtn = document.getElementById("convert-btn")
const stepByStepBtn = document.getElementById("step-btn")
const types = document.getElementsByClassName("types")
const butons = document.querySelectorAll(".btn")
const postfixBtn = document.querySelector("#postfix")
const prefixBtn = document.querySelector("#prefix")
let type = 'postfix' //default type
let expression = ""
let exp = null;

class Expression{
    stepNumber = 0
    list = []
    type = ''

    postfixSolver = (mylist,stack) => {}
    prefixSolver = (mylist,stack) => {}
    convertToPrefix = () => {}
    convertToPostfix = () => {}

    findAnswer = () => {
        let answer;
        try {
            if (type==='postfix')
                answer = this.postfixSolver([...this.list],[]) 
            else   
                answer = this.prefixSolver([...this.list],[])         
        } catch (error) {
            answer = 'the input was not correct'
        }
        return answer
    }
    
    isOperator = (element) => {
        if (element==='+' || element==='-' || element==='*' || element==='/' || element==='^')
            return true
        return false
    }

    checkInput = () => {
        this.list.forEach(element => {
            if (!this.isOperator(element) && isNaN(element)) return false
        });
        return true
    }
    
    printOutput = (text) => {output.innerText = text}

    convert = () => {
        if (this.type==='postfix')
            return this.convertToPrefix()
        else 
            return this.convertToPostfix()
    }

    convertToInfix = (mylist) => {
        let first,second,a,op;
        let stack = []
        for (let i = 0; i < mylist.length; i++) {
            if (this.isOperator(mylist[i])){
                op = mylist[i]
                first = stack.pop()
                second = stack.pop()
                if (op==='+' || op==='-' || op==='^'){
                    a = '('+second+op+first+')'
                }else{
                    a = second+op+first
                }
                stack.push(a)
            }else{
                stack.push(mylist[i])
            }
        }
        return stack.join('')
    }
}

class Postfix extends Expression{

    constructor(expression){
        super()
        this.list = expression.split(' ')
        this.type = 'postfix'
        if (!this.checkInput()) {
            this.printOutput('the input is not postfix')
            exp = null
            inp.value = ''
        }
    }

    postfixSolver = (mylist,stack) => {
        if (mylist.length === 0 && stack.length === 1){ return stack[0]}

        const element = mylist.shift()
        const len = stack.length
        switch (element) {
            case '+':
                stack[len-2] += stack[len-1]
                stack.pop()
                break;
            case '-':
                stack[len-2] -= stack[len-1]
                stack.pop()
                break;
            case '*':
                stack[len-2] *= stack[len-1]
                stack.pop()
                break;
            case '/':
                stack[len-2] /= stack[len-1]
                stack.pop()
                break;
            case '^':
                stack[len-2] = Math.pow(stack[len-2],stack[len-1])
                stack.pop()
                break;
            default:
                stack.push(parseFloat(element))
                break;
        }
        return this.postfixSolver(mylist,stack)   
    }

    stepByStep = () => {
        let newList = [...this.list]
        this.stepNumber++
        let step = this.stepNumber
        while (newList.length!==1 && step!==0){
            let first = parseFloat(newList[0])
            let second = parseFloat(newList[1])
            step--
            myloop: {
                for (let i = 2; i < newList.length; i++) {
                    switch (newList[i]) {
                        case '+':
                            newList[i] = first + second
                            newList.splice(i-2,2)
                            break myloop;
                        case '-':
                            newList[i] = first - second
                            newList.splice(i-2,2)
                            break myloop;
                        case '*':
                            newList[i] = first * second
                            newList.splice(i-2,2)
                            break myloop;
                        case '/':
                            newList[i] = first / second
                            newList.splice(i-2,2)
                            break myloop;
                        case '^':
                            newList[i] = Math.pow(first,second)
                            newList.splice(i-2,2)
                            break myloop;
                        default:
                            first = second
                            second = parseFloat(newList[i])
                            break;
                    }
                }
            }
        }
        return newList.join(' ')
    }

    convertToPrefix = () => {
        let mylist = this.list,first,second,a;
        let stack = []
        for (let i = 0; i < mylist.length; i++) {
            if (this.isOperator(mylist[i])){
                first = stack.pop()
                second = stack.pop()
                a = [mylist[i],second,first]
                stack.push(a.join(' '))
            }else{
                stack.push(mylist[i])
            }            
        }
        return stack.join(' ')
    }

    toInfix = () =>{return this.convertToInfix(this.list)}
    
}

class Prefix extends Expression{

    constructor(expression){
        super()
        this.list = expression.split(' ')
        this.type = 'prefix'
        if (!this.checkInput()) {
            this.printOutput('the input is not prefix')
            exp = null
            inp.value = ''
        }
    }

    prefixSolver = (mylist,stack) => {
        if (mylist.length === 0 && stack.length === 1){ return stack[0]}
        const element = mylist.pop()
        switch (element) {
            case '+':
                stack[0] += stack[1]
                stack.splice(1,1)
                break;
            case '-':
                stack[0] -= stack[1]
                stack.splice(1,1)
                break;
            case '*':
                stack[0] *= stack[1]
                stack.splice(1,1)
                break;
            case '/':
                stack[0] /= stack[1]
                stack.splice(1,1)
                break;
            case '^':
                stack[0] = Math.pow(stack[0],stack[1])
                stack.splice(1,1)
                break;
            default:
                stack.unshift(parseFloat(element))
                break;
        }
        return this.prefixSolver(mylist,stack)   

    }

    stepByStep = () => {
        let newList = [...this.list]
        this.stepNumber++
        let step = this.stepNumber
        while (newList.length!==1 && step!==0){
            let first = parseFloat(newList[newList.length-1])
            let second = parseFloat(newList[newList.length-2])
            step--
            myloop: {
                for (let i = newList.length-3; i >= 0; i--) {
                    switch (newList[i]) {
                        case '+':
                            newList[i] = second + first
                            newList.splice(i+1,2)
                            break myloop;
                        case '-':
                            newList[i] = second - first
                            newList.splice(i+1,2)
                            break myloop;
                        case '*':
                            newList[i] = second * first
                            newList.splice(i+1,2)
                            break myloop;
                        case '/':
                            newList[i] = second / first
                            newList.splice(i+1,2)
                            break myloop;
                        case '^':
                            newList[i] = Math.pow(second,first)
                            newList.splice(i+1,2)
                            break myloop;
                        default:
                            first = second
                            second = parseFloat(newList[i])
                            break;
                    }
                }
            }
        }
        return newList.join(' ')
    }

    convertToPostfix = () => {
        let mylist = this.list,first,second,a;
        let stack = []
        for (let i = mylist.length-1 ; i >=0; i--) {
            if (this.isOperator(mylist[i])){
                first = stack.pop()
                second = stack.pop()
                a = [first,second,mylist[i]]
                stack.push(a.join(' '))
            }else{
                stack.push(mylist[i])
            }     
        }
        return stack.join(' ')
    }

    toInfix = () => {
        let newList = this.convertToPostfix().split(' ')
        return this.convertToInfix(newList)
    }
}

/////////////////////////////////////////
//            the events
//event for input
inp.addEventListener('input', (e) => {
    expression = e.target.value
    if (type==='postfix') {exp = new Postfix(expression)}
    else if(type==='prefix') {exp = new Prefix(expression)}
})

//event for click on postfix button
postfixBtn.addEventListener('click', (e) => {
    if (type==='postfix') return
    if (exp!==null)
        type = 'postfix'
        inp.value = expression
        exp = new Postfix(expression)
    type = 'postfix'
    convertBtn.innerText = 'Convert to prefix'
    postfixBtn.classList.add("active_button")
    prefixBtn.classList.remove("active_button")

})

//event for click on prefix button
prefixBtn.addEventListener('click', (e) => {
    if (type==='pretfix') return
    if (exp!==null)
        type = 'prefix'
        inp.value = expression
        exp = new Prefix(expression)
    type = 'prefix'
    convertBtn.innerText = `Convert to postfix`
    prefixBtn.classList.add("active_button")
    postfixBtn.classList.remove("active_button")
})

//event for click on answer button to solve the expression
answerBtn.addEventListener('click', (e) => {
    if (exp!==null){
        let answer = exp.findAnswer()
        exp.printOutput(answer)
    }
})

//event for click on step by step button to solve the expression step by step
stepByStepBtn.addEventListener('click', (e) => {
    if (exp!==null) {
        let ans = exp.stepByStep()
        exp.printOutput(ans)
    }
})

//event for click on covert to prefix or postfix button to find its expression
convertBtn.addEventListener('click', (e) => {
    if (exp!==null){
        let answer = exp.convert()
        exp.printOutput(answer)
    }
})

//event for click on infix button to find the infix expresion
infixBtn.addEventListener('click', (e) => {
    let answer;
    if (exp!==null)
        answer = exp.toInfix()
    else 
        answer = 'it is not correct'
    output.innerText = answer
})


