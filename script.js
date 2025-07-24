let operand1 = 0, operand2;
const display = document.querySelector(".display");
const DISPLAY_LIMIT = 25;

let secondIsActive = false;
let equalsExecuted = false;

function add(a, b) {
    return a + b;
}

function substract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(num1, op, num2) {
    // console.log("From operate: " + op);

    let answer;

    switch(op) {
        case "+":
            answer = add(num1, num2);
            break;
        case "-":
            answer = substract(num1, num2);
            break;
        case "*":
            answer = multiply(num1, num2);
            break;
        case "/":
            if (num2 !== 0) {
                answer = divide(num1, num2);
            } else {
                alert("No, no, no... Don't be naughty!");
                answer = -9999;
            }
    }

    if (!Number.isInteger(answer)) {
        answer = Math.round(answer * 1000) / 1000;
    }
    if (`${answer}`.length > DISPLAY_LIMIT) {
        alert("Result exceeds display capacity.");
        answer = -9999;
    }

    return answer;
}

function handleClick(e) {
    // console.log(e.target.textContent);
    handlePressedButton(e.target.textContent);
}

function handlePressedButton(txt) {
    if (!equalsExecuted) {
        switch(txt) {
            case "+":
            case "-":
            case "*":
            case "/":
                if (display.textContent.length < DISPLAY_LIMIT - 2) {
                    addOperand(txt);
                }
                break;
            case "=":
                processOperation(txt);
                break;
            case ".":
                if (display.textContent.length < DISPLAY_LIMIT) {
                    addPointToDisplay();
                }
                break;
            case "<-":
                backspace();
                break;
            case "clear":
                reset();
                break;
            default: //digit
                if (display.textContent.length < DISPLAY_LIMIT) {
                    addDigitToDisplay(txt);
                }
        }
    } else {
        equalsExecuted = false;

        display.textContent = "0";

        if ("123456789".includes(txt)) {
            addDigitToDisplay(txt);
        }
    }
}

function addDigitToDisplay(txt) {
    if (display.textContent === "0") {
        display.textContent = txt;
    } else {
        display.textContent += txt;
    }

    defineData();
}

function reset() {
    display.textContent = "0";
    operand1 = 0;
    secondIsActive = false;
    equalsExecuted = false;
}

function backspace() {
    if (display.textContent !== "0") {
        if (display.textContent.length === 1) {
            display.textContent = "0";
        } else {
            if (display.textContent.at(-1) === " ") {
                display.textContent = display.textContent.slice(0, display.textContent.length - 3);
                secondIsActive = false;
            } else {
                display.textContent = display.textContent.slice(0, display.textContent.length - 1);
                if (display.textContent.at(-1) === " ") {
                    secondIsActive = false;
                }
            }
        }
    }

    defineData();
}

function addPointToDisplay() {
    if ( (!secondIsActive && !display.textContent.includes(".")) || (secondIsActive && !display.textContent.split(" ")[2].includes(".")) ) {
        display.textContent += ".";
    }
}

function addOperand(op) {
    if (!secondIsActive) {
        display.textContent += ` ${op} `;
        secondIsActive = true;
    } else {
        if (display.textContent.at(-1) !== " ") {
            processOperation("op");
            display.textContent += ` ${op} `;
            secondIsActive = true;
        } else {
            display.textContent = display.textContent.split(" ")[0] + ` ${op} `;
        }
    }
}

function defineData() {
    if (!secondIsActive) {
        if (display.textContent.at(-1) === " ") {
            operand1 = Number(display.textContent.slice(0, display.textContent.length - 3));
        } else {
            operand1 = Number(display.textContent);
        }
        // console.log(operand1);
    } else {
        operand2 = Number(display.textContent.split(" ")[2]);
        // console.log(operand1);
        // console.log(operand2);
    }
}

function processOperation(from) {
    if (secondIsActive) {
        if (display.textContent.at(-1) !== " ") {
            const result = operate(operand1, display.textContent.split(" ")[1], operand2);
            display.textContent = `${result}`;
            operand1 = result;
            secondIsActive = false;
            if (from === "=") {
                equalsExecuted = true;
            }
        }
    }
}

function processKeyboard(e) {
    // console.log(e.key);
    const normalkeys = "0123456789+-*/.";

    if (normalkeys.includes(e.key)) {
        handlePressedButton(e.key);
    } else {
        switch(e.key) {
            case "Backspace":
                handlePressedButton("<-");
                break;
            case "Enter":
                handlePressedButton("=");
                break;
            case "c":
            case "C":
                handlePressedButton("clear");
        }
    }

    toggleButtonActivation(e);
}

function toggleButtonActivation(e) {
    // console.log(e.key);
    const digits = "0123456789";
    const special = "+-*/.";

    if (digits.includes(e.key)) {
        document.querySelector(`#btn${e.key}`).classList.toggle("active-button");
    } else if (special.includes(e.key)) {
        switch(e.key) {
            case "+":
                document.querySelector("#addition").classList.toggle("active-button");
                break;
            case "-":
                document.querySelector("#substraction").classList.toggle("active-button");
                break;
            case "*":
                document.querySelector("#multiplication").classList.toggle("active-button");
                break;
            case "/":
                document.querySelector("#division").classList.toggle("active-button");
                break;
            default:
                document.querySelector("#period").classList.toggle("active-button");
        }
    } else {
        switch(e.key) {
            case "Backspace":
                document.querySelector("#backspace").classList.toggle("active-button");
                break;
            case "Enter":
                document.querySelector("#equal").classList.toggle("active-button");
                break;
            case "c":
            case "C":
                document.querySelector("#clear").classList.toggle("active-button");
        }
    }
}

const btns = Array.from( document.querySelectorAll("button") );
btns.forEach( item => { item.addEventListener("click", handleClick) } );

document.addEventListener("keydown", processKeyboard);
document.addEventListener("keyup", toggleButtonActivation);