import { Test } from './big5.js';


//initialize test
const test = new Test();
const testElement = document.getElementById('test');
test.render(testElement);

//initialize scores, name, and type
let score = {};
let name = '';
let type = '';
let answers = {};




//elements and event listeners
const scoresElement = document.getElementById('score-wrapper');
const big5label = document.getElementById('big5label');
const keyElement = document.getElementById("key");
const descriptionElement = document.getElementById("descriptions");

const nameElement = document.getElementById('name');
nameElement.addEventListener('input', () => {
    console.log("reached");
    nameButton.hidden = false;
});

const nameButton = document.getElementById('enterName');
nameButton.addEventListener('click', () => {
    typeOptionsElement.hidden = false;
    for (let i = 0; i < typeElements.length; ++i) {
        typeElements[i].hidden = false;
        big5label.hidden = false;
    }
    saveState();
    
});

const typeOptionsElement = document.getElementById('options');
const typeElements = document.getElementsByName('type');
for (let i = 0; i < typeElements.length; ++i) {
    typeElements[i].addEventListener('input', () => {
        keyElement.hidden = false;
        testElement.hidden = false;
        calcButton.hidden = false;
        scoresElement.hidden = false;
        descriptionElement.hidden = false;
        saveState();
    });
}

const calcButton = document.getElementById('calculate');
//calculates score, outputs score
calcButton.addEventListener("click", () => {
    saveState();
    scoresElement.innerHTML = '';
    let traits = {
        "E": "extraversion", 
        "A": "agreeableness", 
        "C": "conscientiousness", 
        "N": "neuroticism", 
        "O": "openness"
    };

    for (let trait in score) {
        const scoreElement = document.createElement('p');
        scoreElement.textContent = `${traits[trait]}: ${score[trait]}`; 
        scoresElement.appendChild(scoreElement);
    }
    saveScoreButton.hidden = false;
    delPlayerButton.hidden = false;
    saveState();


});


const saveScoreButton = document.getElementById('save');
saveScoreButton.addEventListener("click", async() => {
    console.log(name);
    console.log(score);
    try {
        const url = `/player/update?name=${name}&score=${JSON.stringify(score)}`;
        const response = await fetch(url, {
            method: 'GET',
        });

        if (response.ok) {
            console.log('Score saved successfully');
            let save = document.getElementById("saved");
            save.innerText = 'Score saved successfully!';
        }
        else {
            console.log('failed to save score');
            let save = document.getElementById("saved");
            save.innerText = 'Failed to save score :(';
        }
    } catch (error) {
        console.error('error saving personality score:', error);
    }


});

const delPlayerButton = document.getElementById('del');
delPlayerButton.addEventListener("click", async() => {

    try {
        const url = `/player/delete?name=${name}`;
        const response = await fetch(url, {
            method: 'GET',
        });

        if (response.ok) {
            console.log('Player deleted successfully');
            let save = document.getElementById("saved");
            save.innerText = 'Scores deleted successfully!';

        }
        else {
            console.log('failed to delete player');
            let save = document.getElementById("saved");
            save.innerText = 'Scores failed to delete :(';

        }
    } catch (error) {
        console.error('error deleting player:', error);
    }


});





const resetButton = document.getElementById('reset');
//event listener to reset local storage and HTML
resetButton.addEventListener("click", () => {
    resetState();
    window.location.reload();
});

let choiceElements = [];
for (let i = 0; i < test.questions.length; ++i) {
    let questionElements = document.getElementsByName('question ' + i.toString());
    choiceElements.push(questionElements);
    for (let j = 0; j < questionElements.length; ++j) {
        questionElements[j].addEventListener('input', () => {
            saveState();
        });
    }
}



const compareDiv = document.getElementById("compare");
const player1Element = document.getElementById("player1");
const player2Element = document.getElementById("player2");
const calcCompButton = document.getElementById("calcComp");
const resultsElement = document.getElementById("results");
const compButton = document.getElementById("comp");
compButton.addEventListener("click", ()=> {
    compareDiv.hidden = false;
});

calcCompButton.addEventListener("click", async() => {
    resultsElement.innerHTML = '';
    let player1 = player1Element.value;
    let player2 = player2Element.value;
    console.log(player1);
    console.log(player2);

    let player1Data;
    let player2Data;
    let fail = false;
    try {
        const url = `/player/read?name=${player1}`;
        const response1 = await fetch(url, {
            method: 'GET',
        });

        if (response1.ok) {
            console.log('Player read successfully');
            player1Data = await response1.json();
            console.log(player1Data);
        }
        else {
            console.log('failed to read player');
        }
    } catch (error) {
        console.error('error reading player:', error);
    }

    try {
        const url = `/player/read?name=${player2}`;
        const response2 = await fetch(url, {
            method: 'GET',
        });

        if (response2.ok) {
            console.log('Player read successfully');
            player2Data = await response2.json();
            console.log(player2Data);
        }
        else {
            console.log('failed to read player');

        }
    } catch (error) {
        console.error('error reading player:', error);
    }

    if (player1Data == null) {
        resultsElement.innerHTML = '';
        resultsElement.innerHTML = "your name does not exist in the database. Please enter a different user";
        return;
    }
    if (player2Data == null) {
        resultsElement.innerHTML = '';
        resultsElement.innerHTML = "your friend's name does not exist in the database. Please enter a different user";
        return;
    }

    let player1Score = JSON.parse(player1Data.scores[player1Data.scores.length - 1]);
    let player2Score = JSON.parse(player2Data.scores[player2Data.scores.length - 1]);
    console.log(player1Score);
    console.log(player2Score);

    const outputs = test.compareScores(player1Score, player2Score);
    for (let i = 0; i < outputs.length; ++i) {
        const outputElement = document.createElement('p');
        outputElement.textContent = outputs[i]; 
        resultsElement.appendChild(outputElement);
    }

});






//restore state if available
if (localStorage.getItem('name') != null) {
    restoreState();
}



function restoreState() {
    //retrieve all values from local storage
    name = localStorage.getItem('name');
    nameElement.value = name;
    type = localStorage.getItem('type');
    score = JSON.parse(localStorage.getItem('score'));
    answers = JSON.parse(localStorage.getItem('answers'));

    // Set the answer selections based on restored values
    for (let i = 0; i < choiceElements.length; ++i) {
        const selectedValue = answers['question ' + i.toString()];
        for (let j = 0; j < choiceElements[i].length; ++j) {
            if (choiceElements[i][j].value === selectedValue) {
                choiceElements[i][j].checked = true;
            }
        }
    }

    nameButton.hidden = stringToBool(localStorage.getItem('hiddenName'));
    typeOptionsElement.hidden = stringToBool(localStorage.getItem('hiddenType'));
    big5label.hidden = stringToBool(localStorage.getItem('hiddenLabel'));
    keyElement.hidden = stringToBool(localStorage.getItem('hiddenKey'));
    testElement.hidden = stringToBool(localStorage.getItem('hiddenTest'));
    calcButton.hidden = stringToBool(localStorage.getItem('hiddenCalc'));
    scoresElement.hidden = stringToBool(localStorage.getItem('hiddenScores'));
    saveScoreButton.hidden = stringToBool(localStorage.getItem('hiddenSave'));
    delPlayerButton.hidden = stringToBool(localStorage.getItem('hiddenDel'));
    descriptionElement.hidden = stringToBool(localStorage.getItem('descriptionDel'));
    for (let i = 0; i < typeElements.length; ++i) {
        typeElements[i].hidden = stringToBool(localStorage.getItem('hiddenTypeButton'));
        if (typeElements[i].value == type) {
            typeElements[i].checked = true;
        }
    }

    

}

function updateState(){
    //updates the values of scores, name, type, answers
    score = test.calculateScore();
    console.log(score);
    name = document.getElementById('name').value;

    for (let i = 0; i < typeElements.length; ++i) {
        if (typeElements[i].checked) {
            type = typeElements[i].value;
        }
    }

    for (let i = 0; i < choiceElements.length; ++i) {
        for (let j = 0; j < choiceElements[i].length; ++j) {
            if (choiceElements[i][j].checked) {
                console.log("yippee!!");
                answers['question ' + i.toString()] = choiceElements[i][j].value;
                break;
            }
        }
    }

}

function saveState() {
    updateState();
    localStorage.setItem("name", name);
    localStorage.setItem("type", type);
    localStorage.setItem("score", JSON.stringify(score));
    localStorage.setItem('answers', JSON.stringify(answers));
    localStorage.setItem('hiddenName', boolToString(nameButton.hidden));
    localStorage.setItem('hiddenType', boolToString(typeOptionsElement.hidden));
    localStorage.setItem('hiddenLabel', boolToString(big5label.hidden));
    localStorage.setItem('hiddenKey', boolToString(keyElement.hidden));
    localStorage.setItem('hiddenTest', boolToString(testElement.hidden));
    localStorage.setItem('hiddenCalc', boolToString(calcButton.hidden));
    localStorage.setItem('hiddenScores', boolToString(scoresElement.hidden));
    localStorage.setItem('hiddenSave', boolToString(saveScoreButton.hidden));
    localStorage.setItem('hiddenDel', boolToString(delPlayerButton.hidden));
    localStorage.setItem('descriptionDel', boolToString(descriptionElement.hidden));

    for (let i = 0; i < typeElements.length; ++i) {
        localStorage.setItem('hiddenTypeButton', boolToString(typeElements[i].hidden));
    }
}

function resetState() {
    name = '';
    type = '';
    score = {};
    answers = {};
    nameButton.hidden = true;
    typeOptionsElement.hidden = true;
    big5label.hidden = true;
    keyElement.hidden = true;
    testElement.hidden = true;
    calcButton.hidden = true;
    scoresElement.hidden = true;
    saveScoreButton.hidden = true;
    delPlayerButton.hidden = true;
    descriptionElement.hidden = true;


    localStorage.setItem("name", name);
    localStorage.setItem("type", type);
    localStorage.setItem("score", JSON.stringify(score));
    localStorage.setItem('answers', JSON.stringify(answers));
    localStorage.setItem('hiddenName', boolToString(nameButton.hidden));
    localStorage.setItem('hiddenType', boolToString(typeOptionsElement.hidden));
    localStorage.setItem('hiddenLabel', boolToString(big5label.hidden));
    localStorage.setItem('hiddenKey', boolToString(keyElement.hidden));
    localStorage.setItem('hiddenTest', boolToString(testElement.hidden));
    localStorage.setItem('hiddenCalc', boolToString(calcButton.hidden));
    localStorage.setItem('hiddenScores', boolToString(scoresElement.hidden));
    localStorage.setItem('hiddenSave', boolToString(saveScoreButton.hidden));
    localStorage.setItem('hiddenDel', boolToString(delPlayerButton.hidden));
    localStorage.setItem('descriptionDel', boolToString(descriptionElement.hidden));

    for (let i = 0; i < typeElements.length; ++i) {
        typeElements[i].hidden = true;
        localStorage.setItem('hiddenTypeButton', boolToString(typeElements[i].hidden));
    }

    nameElement.value = '';
    scoresElement.innerHTML = '';
    for (let i = 0; i < typeElements.length; ++i) {
        if (typeElements[i].checked) {
            typeElements[i].checked = false;
            typeElements[i].hidden = true;
        } 
    }

}


function boolToString(b) {
    if (b) {
        return "true";
    }
    else {
        return "false";
    }
}

function stringToBool(s) {
    if (s === "true") {
        return true;
    }
    else {
        return false;
    }
}
