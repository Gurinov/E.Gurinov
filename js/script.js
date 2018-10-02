//alert("cyka,biliat!");

var socket = io();
let id;
let cards = [];
let myFaction;
let enemyFaction;
let moveThisUser = false;
let enemyEndRound = false;
socket.emit('new player');


// Получаем страницу с игровым полем от сервера
socket.on('startGame', function(page) {
    console.log(page);
    document.body.innerHTML = page;
    choiceDeck();
});

// Присваиваем ID текущему пользователю
socket.on('index', function(index) {
    console.log(index);
    id = index;
});

// Получаем случайные карты в "руку" из колоды
socket.on('sendStartCards', function(arr) {
    cards = arr;
    socket.emit('getFactionsAndFirstMovePlayers');
});

// Выбор игрока, который ходит первый
socket.on('choiceFirstMovePlayer', function(firstPlayerFaction,secondPlayerFaction,rund) {
    if(id === 1){
        myFaction = firstPlayerFaction;
        enemyFaction = secondPlayerFaction;
    }else {
        myFaction = secondPlayerFaction;
        enemyFaction = firstPlayerFaction;
    }

    if(rund === id) moveThisUser = true;

    let choiceDeck = document.getElementById('choiceDeck');
    let turns = 0.5 * rund + 1.5;
    choiceDeck.innerHTML = "<div class=\"animationFactionCards\" id=\"animationFactionCards\">\n" +
        "<div class=\"front\" id=\"front\" style=\"background: url('" + firstPlayerFaction + "') no-repeat; animation-iteration-count: " + turns + "; background-size: cover;\"></div>\n" +
        "<div class=\"back\" id=\"back\" style=\"background: url('" + secondPlayerFaction + "') no-repeat;  animation-iteration-count: " + turns + "; background-size: cover;\"></div>\n" +
        "</div>";

    let loserFaction;
    if(rund === 1) {
        loserFaction = 'back';
    } else  loserFaction = 'front';

    // Удаление анимации рандома первого хода
    function AnimationListener() {
        deleteElementById(loserFaction);
        displayFactionCard();
        setTimeout(deleteElementById,1000,'choiceDeck');
        displayCard(cards);
    }
    var anim = document.getElementById(loserFaction);
    anim.addEventListener("animationend", AnimationListener, false);

});

// Игрок отключился
window.onunload = function () {
    socket.emit('close', id);
};

// Выбор колоды
function choiceDeck() {
    let choice = document.getElementById("choiceDeck");
    choice.addEventListener('click', function(e) {
        let target = e.target;
        let myFaction;
        switch (target.id){
            case 'card1' :
                myFaction = "Cевер";
                break;
            case 'card2' :
                myFaction = "Белки";
                break;
            case 'card3' :
                myFaction = "Нильфгаард";
                break;
            case 'card4' :
                myFaction = "Чудовища";
                break;
        }

        deleteElementById('card1');
        deleteElementById('card2');
        deleteElementById('card3');
        deleteElementById('card4');

        socket.emit('choiceDeck', id, myFaction);
    });
}

// Прорисовка карт
function displayCard(arr) {
    for(let i=0; i<arr.length; i++){
        if(arr[i].type === "hand" && arr[i].element === null){
            var myCards = document.getElementById("myCards");
            let img = document.createElement("IMG");
            img.src = arr[i].image;
            img.setAttribute( "id", String(i));
            arr[i].element = img;
            myCards.appendChild(img);
        }
    }
    return myCards;
}

// Удаление элемента по ID
function deleteElementById(id) {
    let temp = document.getElementById(id);
    temp.parentNode.removeChild(temp);
}

// Отображение карты фракции игрока, который сейчас ходит
function displayFactionCard(){
    let element = document.getElementById('endOfRound');
    element.innerHTML = '';
    let img = document.createElement('IMG');
    img.setAttribute('class','card');
    if(moveThisUser || enemyEndRound){
        img.setAttribute('src',myFaction);
    }else {
        img.setAttribute('src',enemyFaction);
    }
    element.appendChild(img);
}

/*
function Card (name,power,row,image,myFaction,ability,isHero) {
    this.name = name;
    this.power = power;
    this.row = row;
    this.image = "img/card/" + myFaction + "/short/" + image + ".jpg";
    this.longImage = "img/card/" + myFaction + "/long/" + image + ".jpg";
    this.type = "deck"; //в колоде,на руках, на поле, в сбросе.
    this.element = null;
    this.ability = ability;
    this.isHero = isHero;
    this.bonusPower = 0;
    this.faction = myFaction;
}

var socket = io();

socket.emit('new player');
var enemyEndRound = false;
var endRound = false;
let round = 1;
var enemyCard = [];
var deck;
var arr;
var myCards;
var endOfRound =  document.getElementById("endOfRound");
var moveThisUser;
var power = [];
var enemyPower = [];
var enemyFaction;
var myWinPoint = 0;
var enemyWinPoint = 0;
var deletedCards=[];

function counting(nameRow,arr){
    let nameCount = nameRow + "Count";
    let count = 0;
    let left;

    let childList = document.getElementById(nameRow).childNodes;
    for(let i = 0; i < childList.length; i++){
        for(let j = 0; j < arr.length; j++){
            if(arr[j].element != null && arr[j].element.id === childList[i].id){
                count += arr[j].power + arr[j].bonusPower;
            }
        }
    }

    if(count < 10) left=45;
    else
    if (count < 100) left=40;
    else left=35;

    let qwe = document.getElementById(nameCount);
    qwe.innerHTML = "<img src=\"img/count.png\" alt=\"\">"+"<div style=\"left:"+ left +"%;position:absolute;top: 30%;color: black;font-size: 40px;\">"+ count +"</div>";
    return count;
}
function countingAll() {
    counting("enemyWarriors",enemyCard);
    counting("enemyArchers",enemyCard);
    counting("enemyArtillery",enemyCard);
    counting("myWarriors",deck);
    counting("myArchers",deck);
    counting("myArtillery",deck);
}
function countingPower(side,arr) {
    return counting(side + "Warriors",arr)+
    counting(side + "Archers",arr)+
    counting(side + "Artillery",arr);
}
function getRandomCards(deck,countCards) {
    let arr = [];
    while(arr.length < countCards){
        var rand = Math.floor(Math.random() * deck.length);
        if(deck[rand].type === "deck" ){
            deck[rand].type = "hand";
            arr[arr.length] = deck[rand];
        }else if(deck[rand].type === "delete" ){
            deck[rand].type = "board";
            arr[arr.length] = deck[rand];
            deletedCards.splice(rand,1);
        }
    }
    return arr;
}

function displayCard(arr) {
    for(let i=0; i<arr.length; i++){
        if(arr[i].type === "hand" && arr[i].element === null){
            var myCards = document.getElementById("myCards");
            let img = document.createElement("IMG");
            img.src = arr[i].image;
            img.setAttribute( "id", String(i));
            arr[i].element = img;
            myCards.appendChild(img);
        }
    }
    return myCards;
}

function deleteCards(arr) {
    for(let j = 0; j < arr.length; j++){
        if(arr[j].type === "board"){
            arr[j].type = "delete";
            arr[j].bonusPower = 0;
            if(arr[j].faction === myFaction || arr[j].faction === "Нейтральные") deletedCards[deletedCards.length] = arr[j];
            let element = document.getElementById(arr[j].element.id);
            if(element.id != null){
                element.parentNode.removeChild(element);
            }
        }
    }
}

function displayWinImg(div) {
    let menu = document.getElementById(div);
    let win = document.createElement('IMG');
    win.setAttribute('src','/img/win.png');
    win.setAttribute('class','win');
    menu.appendChild(win);
}

function endThisRound() {
    round++;
    power[power.length] = countingPower('my',deck);
    enemyPower[enemyPower.length] = countingPower('enemy',enemyCard);
    if(round === 2) arr = arr.concat(getRandomCards(deck,2));
    else
    if(round === 3) arr = arr.concat(getRandomCards(deck,1));
    myCards = displayCard(arr);
    deleteCards(arr);
    deleteCards(enemyCard);
    countingAll();
    endRound = false;
    enemyEndRound = false;
    socket.emit('endRound', endRound);
    let result = 'Конец ' + (round-1) + ' раунда. \n';
    if (power[power.length-1] > enemyPower[enemyPower.length-1]){
        displayWinImg('myFactionCard');
        myWinPoint++;
        result += 'Вы победили';
    }else if(power[power.length-1] < enemyPower[enemyPower.length-1]){
        enemyWinPoint++;
        displayWinImg('enemyFactionCard');
        result += 'Вы проиграли';
    }else{
        myWinPoint++;
        enemyWinPoint++;
        displayWinImg('myFactionCard');
        displayWinImg('enemyFactionCard');
        result += 'Ничья';
    }
    result += '\n' + power[power.length-1] + ':' + enemyPower[enemyPower.length-1];

    if((myWinPoint === 2 || enemyWinPoint === 2) && (myWinPoint !== enemyWinPoint) ){
        endThisGame();
    }else alert(result);
}

function endThisGame() {
    let result;
    if (myWinPoint > enemyWinPoint){
        result = 'img/Победа.jpg';
    }else if(myWinPoint < enemyWinPoint){
        result = 'img/Поражение.jpg';
    }else{
        result = 'img/Ничья.jpg';
    }
    for (let i=0; i<3; i++){
        if(!enemyPower[i]){enemyPower[i]=0;}
        if(!power[i]){power[i]=0;}
    }
    document.body.classList.remove('body');
    document.body.innerHTML = '<div class="gameOver">\n' +
        '    <div >\n' +
        '        <img src="' + result + '" alt="" class="resultImg">\n' +
        '        <table>\n' +
        '            <tr>\n' +
        '                <td>Игрок</td>\n' +
        '                <td>Раунд 1</td>\n' +
        '                <td>Раунд 2</td>\n' +
        '                <td>Раунд 3</td>\n' +
        '            </tr>\n' +
        '            <tr>\n' +
        '                <td>' + myFaction + '</td>\n' +
        '                <td>' + power[0] + '</td>\n' +
        '                <td>' + power[1] + '</td>\n' +
        '                <td>' + power[2] + '</td>\n' +
        '            </tr>\n' +
        '            <tr>\n' +
        '                <td>' + enemyFaction + '</td>\n' +
        '                <td>' + enemyPower[0] + '</td>\n' +
        '                <td>' + enemyPower[1] + '</td>\n' +
        '                <td>' + enemyPower[2] + '</td>\n' +
        '            </tr>\n' +
        '        </table>\n' +
        '    </div>\n' +
        '</div>';
}

function displayFactionCard(){
    let element = document.getElementById('endOfRound');
    element.innerHTML = '';
    let img = document.createElement('IMG');
    img.setAttribute('class','card');
    if(moveThisUser || enemyEndRound){
        img.setAttribute('src','/img/card/' + myFaction + '/1.jpg');
    }else {
        img.setAttribute('src','/img/card/' + enemyFaction + '/1.jpg');
    }
    element.appendChild(img);
}

var myFaction = "";
let choice = document.getElementById("choiceDeck");

function showInformationAboutCard(i) {
    let element = document.getElementById('cardsInfo');
    element.style.zIndex = '10';
    let img = document.createElement('IMG');
    img.id = 'bigCart';
    img.setAttribute('class','card');
    img.setAttribute('src',i.longImage);
    element.appendChild(img);
}
function searchForDuplicates(memory,card){
    let cardsWithBonus = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < memory.childNodes.length; j++) {
            if(memory.childNodes[j] === arr[i].element ){
                if(arr[i].name === card.name && arr[i] !== card && arr[i].type === "board"){
                    cardsWithBonus[cardsWithBonus.length] = arr[i];
                }
            }
        }
    }
    if(cardsWithBonus.length > 0){
        cardsWithBonus[cardsWithBonus.length] = card;
        for (let i = 0; i < cardsWithBonus.length; i++) {
            cardsWithBonus[i].bonusPower = (cardsWithBonus[i].power) * (cardsWithBonus.length-1);
        }
    }
}
function countingCardsInRow(memory,card){
    let cardsWithBonus = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < memory.childNodes.length; j++) {
            if(memory.childNodes[j] === arr[i].element ){
                if(arr[i] !== card && arr[i].type === "board"){
                    cardsWithBonus[cardsWithBonus.length] = arr[i];
                }
            }
        }
    }
    for (let i = 0; i < cardsWithBonus.length; i++) {
        cardsWithBonus[i].bonusPower += 1;
    }
}
function countingBonusCards(memory){
    let cardsWithBonus = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < memory.childNodes.length; j++) {
            if(memory.childNodes[j] === arr[i].element ){
                if(arr[i].ability === "Прилив сил"){
                    cardsWithBonus++;
                }
            }
        }
    }
    return cardsWithBonus;
}
function addCardWithAbility(card,img) {
    card.type === "board";
    card.bonusPower = countingBonusCards(document.getElementById("my"+card.row));
    switch (card.ability){
        case "Прочная связь":
            memory = document.getElementById("my"+card.row);
            memory.appendChild(img);
            searchForDuplicates(memory,card);
            counting("my"+card.row,deck);
            socket.emit('card', card);
            break;
        case "Медик":
            memory = document.getElementById("my"+card.row);
            memory.appendChild(img);
            counting("my"+card.row,deck);
            if(deletedCards.length > 0){
                socket.emit('card', card);
                let resetCard = getRandomCards(deletedCards,1);
                card = resetCard[0];
                img = document.createElement("IMG");
                img.src = card.image;
                img.setAttribute( "id", card.element.id);
                card.element = img;
                if(card.ability === "" || card.ability === "Двойник" || card.ability === "Прочная связь"){
                    memory = document.getElementById("my"+card.row);
                    card.bonusPower = countingBonusCards(memory);
                    memory.appendChild(img);
                    counting("my"+card.row,deck);
                }else{
                    addCardWithAbility(card,img);
                }
                socket.emit('card', card);
            }
            break;
        case "Шпион":
            memory = document.getElementById("enemy"+card.row);
            memory.appendChild(img);
            arr = arr.concat(getRandomCards(deck,2));
            myCards = displayCard(arr);
            enemyCard[enemyCard.length] = card;
            counting("enemy"+card.row,enemyCard);
            socket.emit('card', card);
            break;
        case "Двойник":
            let position;
            let bonusImg;
            if (card.type === "delete" || card.type === "board") break;
            for (let i=0; i<deck.length; i++){
                if(deck[i].name === card.name && deck[i].type !== "delete"){
                    deck[i].type = "board";
                    deck[i].bonusPower = countingBonusCards(document.getElementById("my" + deck[i].row));
                    if(deck[i].element === null){
                        position = document.getElementById("my" + deck[i].row);
                        bonusImg = document.createElement("IMG");
                        bonusImg.src = deck[i].image;
                        bonusImg.setAttribute( "id", "bonus" + i);
                        deck[i].element = bonusImg;
                        position.appendChild(bonusImg);
                    }else{
                        position = document.getElementById("my" + deck[i].row);
                        bonusImg = document.getElementById(deck[i].element.id);
                        position.appendChild(bonusImg);
                    }
                    arr = arr.concat(deck[i]);
                    socket.emit('card', deck[i]);
                }
            }
            countingAll();
            break;
        case "Проворство"://////////////////////////////////////////////////////////////////////////////////////////////
            memory = document.getElementById("my"+card.row);
            memory.appendChild(img);
            counting("my"+card.row,deck);
            socket.emit('card', card);
            break;
        case "Прилив сил":
            memory = document.getElementById("my"+card.row);
            memory.appendChild(img);
            countingCardsInRow(memory,card);
            counting("my"+card.row,deck);
            socket.emit('card', card);
            break;
    }
}

function game() {
    socket.emit('faction', myFaction);
    displayFactionCard();
    deck = choiceDeck();
    arr = getRandomCards(deck,10);
    myCards = displayCard(arr);
    myCards.addEventListener('click', function(e) {
        if(moveThisUser){
            if(!endRound){
                let target = e.target;
                let img1 = document.getElementById(target.id);
                let memory;

                for(let i=0; i<arr.length; i++){
                    if(arr[i].element.id === target.id){
                        var card = arr[i];
                        break;
                    }
                }
                if(card.ability === ""){
                    memory = document.getElementById("my"+card.row);
                    memory.appendChild(img1);
                    card.bonusPower = countingBonusCards(memory);
                    counting("my"+card.row,deck);
                    socket.emit('card', card);
                }else{
                   addCardWithAbility(card,img1);
                }
                card.type = "board";
            }
            socket.emit('endMove', true);
            moveThisUser = false;
            displayFactionCard();
        }
    }, false);
    endOfRound.addEventListener('click', function(e) {
        if(moveThisUser){
            endRound = true;
            if(endRound && enemyEndRound){
                if(round < 4){
                    endThisRound();
                }else{
                    endThisGame();
                }
            }
            socket.emit('endRound', true);
            socket.emit('endMove', true);
        }
    }, false);
    let card = document.getElementById('field');
    card.addEventListener('contextmenu', function(e) {
        let target = e.target;
        let element;
        element = document.getElementById(target.id);
        for(let i=0; i<deck.length; i++){
            if(deck[i].element != null && deck[i].element.id === target.id){
                showInformationAboutCard(deck[i]);
            }
        }
        for(let i=0; i<enemyCard.length; i++){
            if(enemyCard[i].element != null && enemyCard[i].element.id === target.id){
                showInformationAboutCard(enemyCard[i]);
            }
        }
    }, false);
    countingAll();
}
document.addEventListener('keyup', function(event) {
    if(event.keyCode === 27){
        let element = document.getElementById('cardsInfo');
        element.style.zIndex = '-10';
        element.removeChild(document.getElementById('bigCart'));
    }
});
choice.addEventListener('click', function(e) {
    let target = e.target;
    switch (target.id){
        case 'card1' :
            myFaction = "Cевер";
            break;
        case 'card2' :
            myFaction = "Белки";
            break;
        case 'card3' :
            myFaction = "Нильфгаард";
            break;
        case 'card4' :
            myFaction = "Чудовища";
            break;
    }

    let temp = document.getElementById('choiceDeck');
    temp.parentNode.removeChild(temp);
    game();
});

socket.on('move', function(move) {
    moveThisUser = move;
    displayFactionCard();
    if(enemyEndRound && !endRound) moveThisUser = true;
    console.log('Move is end');
});

socket.on('state', function(card) {
    card.type = "board";
    arr[arr.length] = card;
    card.bonusPower = 0;
    enemyCard[enemyCard.length] = card;
    let img = document.createElement("IMG");
    img.src = card.image;
    img.setAttribute( "id", "enemyCard" + enemyCard.length);
    enemyCard[enemyCard.length-1].element = img;
    let temp;
    if (card.ability === "Шпион"){
        temp = document.getElementById("my" + card.row);
        temp.appendChild(img);
        deck[deck.length] = card;
        counting("my"+card.row,deck);
    }else
        if (card.ability === "Прочная связь"){
            temp = document.getElementById("enemy" + card.row);
            temp.appendChild(img);
            searchForDuplicates(temp,card);
            counting("enemy"+card.row,enemyCard);
        }else{
            if (card.ability === "Прилив сил"){
                temp = document.getElementById("enemy" + card.row);
                temp.appendChild(img);
                countingCardsInRow(temp,card);
                counting("enemy"+card.row,enemyCard);
            }else{
                temp = document.getElementById("enemy" + card.row);
                temp.appendChild(img);
                counting("enemy"+card.row,enemyCard);
            }
        }
    card.bonusPower += countingBonusCards(temp);
});
socket.on('enemyEndRound', function(result) {
    enemyEndRound = result;
    if(endRound && enemyEndRound){
        if(round < 4){
            endThisRound();
        }else{
            endThisGame();
        }
    }
});
socket.on('enemyFaction', function(faction) {
    enemyFaction = faction;
});
*/
