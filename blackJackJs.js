let blackJackGame = {
    "you" : { "scoreSpan" : "#yourResult" , "div" : "#yourBox" , "score" : 0} ,

    "dealer" : { "scoreSpan" : "#dealerResult" , "div" : "#dealerBox" , "score" : 0 },

    "cards" : [ "2" , "3"  , "4" , "5" , "6" , "7" , "8" , "9" , "10" , "K" , "Q" ,"J" , "A"],
    "cardsMap" : { "2" : 2 , "3" :3 , "4" : 4 , "5" : 5 , "6" : 6, "7" : 7, "8" : 8 , "9" : 9, "10":10 , "K" : 10 , "Q" : 10,"J" : 10, "A" : [1 , 11]},
    "wins" : 0,
    "losses" : 0,
    "draws" : 0,
};

const YOU  = blackJackGame['you'];
const DEALER = blackJackGame['dealer'];
let hitPressed = false;
let standPressed = false;
const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const loseSound = new Audio('sounds/aww.mp3');

document.querySelector('#hit').addEventListener('click' , hitbtn); 
document.querySelector('#stand').addEventListener('click' , dealerLogic);
document.querySelector('#deal').addEventListener('click' , dealbtn);


function hitbtn() {
    if(!standPressed){
        hitPressed = true;
        let card = randomCard();
        showCard(YOU , card);
        updateScore(YOU , card);
    }
}

function dealerLogic() {
    if(hitPressed && !standPressed) {
        standPressed = true;
        let timer = setInterval(() => {
            let card = randomCard();
            showCard(DEALER , card);
            updateScore(DEALER  , card);
            
            if(DEALER['score'] > 16) {
                showResult(computWinner());
                clearInterval(timer);
            }
        }, 750);
    }
}

function dealbtn() {
    if(standPressed) {
        hitPressed = false;
        standPressed = false;
        
        let yourimages = document.querySelector('#yourBox').querySelectorAll('img');
        let dealerimages = document.querySelector('#dealerBox').querySelectorAll('img');
        
        for(let i=0 ; i < yourimages.length ; i++) yourimages[i].remove();
        for(i=0 ; i < dealerimages.length ; i++) dealerimages[i].remove();
        
        YOU['score'] = 0;
        DEALER['score'] = 0;
        
        document.querySelector('#yourResult').textContent = 0;
        document.querySelector('#yourResult').style.color = 'white';
        document.querySelector('#dealerResult').textContent = 0;
        document.querySelector('#dealerResult').style.color = 'white';
        
        document.querySelector('#status').textContent = "Let's Play !";
        document.querySelector('#status').style.color = 'black'
    }
    }

function showCard(activePlayer , card) {
    if(activePlayer['score'] <= 21) {
        hitSound.play();
        let cardImage = document.createElement('img');
        cardImage.src = `images/cardImages/${card}.png`;
        document.querySelector(activePlayer["div"]).appendChild(cardImage);
    }
    
}
function randomCard() {
    let randomNum = Math.floor(Math.random()*13);
    let card = blackJackGame["cards"];
    return card[randomNum];
}

function updateScore(activePlayer , card) {
    if(card == 'A') {
        if(activePlayer['score'] + blackJackGame['cardsMap'][card][1] < 21) activePlayer['score'] += 11;
        else activePlayer['score'] += 1;
    }
    else {
        activePlayer['score'] += blackJackGame['cardsMap'][card];
    }
    document.querySelector(activePlayer["scoreSpan"]).innerHTML = activePlayer['score'];
    if(activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color  = 'red';
    }
}






// compute the winner

function computWinner() {
    let winner;
    let y = YOU['score'];
    let d = DEALER['score'];
    if(y <= 21 ) {

        if(y > d || d > 21) {
            winner = YOU;
            blackJackGame['wins']++;
        }
        else if(y < d) {
            winner = DEALER;
            blackJackGame['losses']++;
        }
        else if( y === d) blackJackGame['draws']++;
    }
    else if(y > 21 && d <= 21) { 
        winner = DEALER;
        blackJackGame['losses']++;
    }
    else if(y > 21 && d > 21) blackJackGame['draws']++;

    return winner;
}

// Show result
 function showResult(winner) {
    if(winner === YOU) {
        message = 'You Won!';
        messageColor = 'green';
        winSound.play();
    }

    else if(winner === DEALER) {
        message = 'You Lost !';
        messageColor = 'red';
        loseSound.play();
    }
    else {
        message = 'You Drew';
        messageColor = 'black';
    }

    document.querySelector('#status').textContent = message;
    document.querySelector('#status').style.color = messageColor;

    document.querySelector('#wins').textContent = blackJackGame['wins'];
    document.querySelector('#losses').textContent = blackJackGame['losses'];
    document.querySelector('#draws').textContent = blackJackGame['draws'];
 }