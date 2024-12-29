// Game logic for Yazy Two-Player Game
const player1Dice = document.getElementById('player1Dice');
const player2Dice = document.getElementById('player2Dice');
const player1Roll = document.getElementById('player1Roll');
const player2Roll = document.getElementById('player2Roll');
const player1EndTurn = document.getElementById('player1EndTurn');
const player2EndTurn = document.getElementById('player2EndTurn');
const player1Scores = document.getElementById('player1Scores');
const player2Scores = document.getElementById('player2Scores');

let player1DiceValues = [null, null, null, null, null];
let player2DiceValues = [null, null, null, null, null];
let player1RollsLeft = 3;
let player2RollsLeft = 3;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
const rules = [
    { rule: "Three of a kind", points: 24 },
    { rule: "Four of a kind", points: 30 },
    { rule: "Full House (AAABB)", points: 25 },
    { rule: "Small Straight (1-4)", points: 30 },
    { rule: "Large Straight (1-5)", points: 40 },
    { rule: "Yahtzee (5 of a kind)", points: 50 },
    { rule: "Chance (any combination)", points: "Sum of dice" },
];
const numberRules = [1, 2, 3, 4, 5, 6];

// Helper function to roll dice
function rollDice(diceValues) {
    return diceValues.map(value => Math.floor(Math.random() * 6) + 1);
}

// Render dice values
function renderDice(container, diceValues) {
    container.innerHTML = '';
    diceValues.forEach((value, index) => {
        const dice = document.createElement('div');
        dice.classList.add('dice');
        dice.textContent = value === null ? '?' : value;
        dice.onclick = () => toggleDiceSelection(container, index);
        container.appendChild(dice);
    });
}

// Toggle dice selection
function toggleDiceSelection(container, index) {
    const dice = container.children[index];
    dice.classList.toggle('selected');
}

// Handle roll button
function handleRoll(player) {
    if (player === 1) {
        player1DiceValues = rollDice(player1DiceValues);
        renderDice(player1Dice, player1DiceValues);
        player1RollsLeft--;
        if (player1RollsLeft === 0) player1Roll.disabled = true;
        player1EndTurn.disabled = false;
    } else {
        player2DiceValues = rollDice(player2DiceValues);
        renderDice(player2Dice, player2DiceValues);
        player2RollsLeft--;
        if (player2RollsLeft === 0) player2Roll.disabled = true;
        player2EndTurn.disabled = false;
    }
}

// Handle end turn
function handleEndTurn(player) {
    if (player === 1) {
        player1Roll.disabled = true;
        player1EndTurn.disabled = true;
        player2Roll.disabled = false;
        player2RollsLeft = 3;
        currentPlayer = 2;
    } else {
        player2Roll.disabled = true;
        player2EndTurn.disabled = true;
        player1Roll.disabled = false;
        player1RollsLeft = 3;
        currentPlayer = 1;
    }
}

// Render scoring table
function renderScoreTable(playerScores, tableElement, playerDiceValues) {
    tableElement.innerHTML = '';

    // Add number rules
    numberRules.forEach(number => {
        const row = document.createElement('tr');

        const ruleCell = document.createElement('td');
        ruleCell.textContent = `Score for ${number}s`;

        const pointsCell = document.createElement('td');
        const matchingDice = playerDiceValues.filter(value => value === number);
        const points = matchingDice.length * number;
        const button = document.createElement('button');
        button.textContent = points;
        button.disabled = playerScores[number] !== undefined;
        button.onclick = () => assignNumberScore(playerScores, number, points, tableElement);

        pointsCell.appendChild(button);
        row.appendChild(ruleCell);
        row.appendChild(pointsCell);
        tableElement.appendChild(row);
    });

    // Add special rules
    rules.forEach(rule => {
        const row = document.createElement('tr');

        const ruleCell = document.createElement('td');
        ruleCell.textContent = rule.rule;

        const pointsCell = document.createElement('td');
        const button = document.createElement('button');
        button.textContent = rule.points;
        button.disabled = playerScores[rule.rule] !== undefined;
        button.onclick = () => assignSpecialScore(playerScores, rule.rule, rule.points, tableElement);

        pointsCell.appendChild(button);
        row.appendChild(ruleCell);
        row.appendChild(pointsCell);
        tableElement.appendChild(row);
    });
}

// Assign score for numbers
function assignNumberScore(playerScores, number, points, tableElement) {
    if (currentPlayer === 1) {
        player1Score += points;
        playerScores[number] = points;
        renderScoreTable(player1Scores, tableElement, player1DiceValues);
    } else {
        player2Score += points;
        playerScores[number] = points;
        renderScoreTable(player2Scores, tableElement, player2DiceValues);
    }
}

// Assign score for special rules
function assignSpecialScore(playerScores, rule, points, tableElement) {
    if (currentPlayer === 1) {
        player1Score += typeof points === 'number' ? points : player1DiceValues.reduce((a, b) => a + b, 0);
        playerScores[rule] = points;
        renderScoreTable(player1Scores, tableElement, player1DiceValues);
    } else {
        player2Score += typeof points === 'number' ? points : player2DiceValues.reduce((a, b) => a + b, 0);
        playerScores[rule] = points;
        renderScoreTable(player2Scores, tableElement, player2DiceValues);
    }
}

// Initialize game
function initializeGame() {
    renderDice(player1Dice, player1DiceValues);
    renderDice(player2Dice, player2DiceValues);
    renderScoreTable(player1Scores, player1Scores, player1DiceValues);
    renderScoreTable(player2Scores, player2Scores, player2DiceValues);
    player1Roll.onclick = () => handleRoll(1);
    player2Roll.onclick = () => handleRoll(2);
    player1EndTurn.onclick = () => handleEndTurn(1);
    player2EndTurn.onclick = () => handleEndTurn(2);
}

initializeGame();
