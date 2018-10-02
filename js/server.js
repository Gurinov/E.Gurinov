// Зависимости
var page = '../game.html';
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var fs = require('fs');

let rund;

function player(number) {
    id = number;
    moveThisUser = false;
    faction = "";
    deck = [];
    cards = [];
    deletedCards = [];
    endOfRound = false;
}

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

let players = [];
app.set('port', 5000);
app.use(express.static(__dirname + '/../'));

let mainPage = fs.readFileSync('page.txt', 'utf8');

// Начало игры
function startGame() {
    io.sockets.sockets[players[0].id].emit('startGame',mainPage);
    io.sockets.sockets[players[1].id].emit('startGame',mainPage);
}

// Перезапуск игры
function restartGame() {
    console.log(players.length);
    if(players.length === 0){}else
        if(players.length === 1){
            io.sockets.sockets[players[0].id].emit('startGame','<h1 style="width: 100vw; height: 100vh; text-align: center; font-size: 500%">Ожидание подключения других игроков.</h1>');
        }else{
            io.sockets.sockets[players[0].id].emit('index',1);
            io.sockets.sockets[players[1].id].emit('index',2);
            startGame();
        }
}

// Формирование колоды
function choiceDeck(faction){
    let cardNumber = 1;
    let tempArr = [];
    switch (faction){
        case "Cевер":
            tempArr = [ new Card("",6,"Artillery",cardNumber++,faction,"",false),
                new Card("",6,"Artillery",cardNumber++,faction,"",false),
                new Card("Боец Синих Полосок",4,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("Боец Синих Полосок",4,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("Боец Синих Полосок",4,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("",5,"Warriors",cardNumber++,faction,"",false),
                new Card("",10,"Warriors",cardNumber++,faction,"",true),
                new Card("",6,"Archers",cardNumber++,faction,"",false),
                new Card("",4,"Warriors",cardNumber++,faction,"Шпион",false),
                new Card("",5,"Warriors",cardNumber++,faction,"",false),
                new Card("Катапульта",8,"Artillery",cardNumber++,faction,"Прочная связь",false),
                new Card("Катапульта",8,"Artillery",cardNumber++,faction,"Прочная связь",false),
                new Card("",5,"Archers",cardNumber++,faction,"",false),
                new Card("",5,"Artillery",cardNumber++,faction,"Медик",false),
                new Card("",1,"Artillery",cardNumber++,faction,"Прилив сил",false),
                new Card("",6,"Artillery",cardNumber++,faction,"",false),
                new Card("",1,"Artillery",cardNumber++,faction,"Прилив сил",false),
                new Card("",1,"Artillery",cardNumber++,faction,"Прилив сил",false),
                new Card("",1,"Warriors",cardNumber++,faction,"",false),
                new Card("Пехтура",1,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("Пехтура",1,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("Пехтура",1,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("",5,"Warriors",cardNumber++,faction,"Шпион",false),
                new Card("",1,"Warriors",cardNumber++,faction,"",false),
                new Card("",2,"Warriors",cardNumber++,faction,"",false),
                new Card("",4,"Archers",cardNumber++,faction,"",false),
                new Card("",1,"Artillery",cardNumber++,faction,"Шпион",false),
                new Card("",6,"Artillery",cardNumber++,faction,"",false),
                new Card("",6,"Artillery",cardNumber++,faction,"",false),
                new Card("",10,"Archers",cardNumber++,faction,"",true),
                new Card("",5,"Archers",cardNumber++,faction,"",false),
                new Card("",4,"Archers",cardNumber++,faction,"",false),
                new Card("",10,"Warriors",cardNumber++,faction,"",true),
                new Card("",10,"Warriors",cardNumber++,faction,"",true),
                new Card("Рубайлы",5,"Archers",cardNumber++,faction,"Прочная связь",false),
                new Card("Рубайлы",5,"Archers",cardNumber++,faction,"Прочная связь",false),
                new Card("Рубайлы",5,"Archers",cardNumber++,faction,"Прочная связь",false)];
            break;
        case "Белки":
            tempArr = [ new Card("",6,"Warriors",cardNumber++,faction,"Проворство",false),
                new Card("",5,"Warriors",cardNumber++,faction,"Проворство",false),
                new Card("",5,"Warriors",cardNumber++,faction,"Проворство",false),
                new Card("Поддержка",5,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("",6,"Warriors",cardNumber++,faction,"",false),
                new Card("",5,"Warriors",cardNumber++,faction,"",false),
                new Card("",5,"Warriors",cardNumber++,faction,"",false),
                new Card("Застрельщик",2,"Archers",cardNumber++,faction,"Двойник",false),
                new Card("Застрельщик",2,"Archers",cardNumber++,faction,"Двойник",false),
                new Card("Краснолюд",3,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("Застрельщик",2,"Archers",cardNumber++,faction,"Двойник",false),
                new Card("Краснолюд",3,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("",6,"Archers",cardNumber++,faction,"",false),
                new Card("",10,"Warriors",cardNumber++,faction,"Прилив сил",true),
                new Card("",10,"Archers",cardNumber++,faction,"",true),
                new Card("",4,"Archers",cardNumber++,faction,"",false),
                new Card("",3,"Warriors",cardNumber++,faction,"Проворство",false),
                new Card("Краснолюд",3,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("",0,"Archers",cardNumber++,faction,"Медик",false),
                new Card("",0,"Archers",cardNumber++,faction,"Медик",false),
                new Card("",0,"Archers",cardNumber++,faction,"Медик",false),
                new Card("",4,"Archers",cardNumber++,faction,"",false),
                new Card("",5,"Warriors",cardNumber++,faction,"",false),
                new Card("",5,"Warriors",cardNumber++,faction,"",false),
                new Card("",5,"Warriors",cardNumber++,faction,"",false),
                new Card("",10,"Archers",cardNumber++,faction,"Прилив сил",false),
                new Card("Поддержка",5,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("Поддержка",5,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("",1,"Archers",cardNumber++,faction,"",false),
                new Card("",10,"Archers",cardNumber++,faction,"",true),
                new Card("",6,"Warriors",cardNumber++,faction,"Проворство",false),
                new Card("",6,"Warriors",cardNumber++,faction,"Проворство",false),
                new Card("",6,"Warriors",cardNumber++,faction,"Проворство",false),
                new Card("",2,"Archers",cardNumber++,faction,"",false),
                new Card("",6,"Warriors",cardNumber++,faction,"Проворство",false),
                new Card("",10,"Archers",cardNumber++,faction,"",true),
                new Card("",6,"Warriors",cardNumber++,faction,"Проворство",false)];
            break;
        case "Нильфгаард":
            tempArr = [ new Card("",2,"Archers",cardNumber++,faction,"",false),
                new Card("",6,"Archers",cardNumber++,faction,"",false),
                new Card("",7,"Warriors",cardNumber++,faction,"Шпион",false),
                new Card("",4,"Archers",cardNumber++,faction,"",false),
                new Card("",4,"Warriors",cardNumber++,faction,"Шпион",false),
                new Card("",2,"Warriors",cardNumber++,faction,"",false),
                new Card("Кавалерия",2,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("",6,"Warriors",cardNumber++,faction,"",false),
                new Card("",10,"Warriors",cardNumber++,faction,"",true),
                new Card("",10,"Archers",cardNumber++,faction,"",false),
                new Card("",10,"Warriors",cardNumber++,faction,"Медик",true),
                new Card("",10,"Artillery",cardNumber++,faction,"",true),
                new Card("",3,"Warriors",cardNumber++,faction,"",false),
                new Card("",0,"Artillery",cardNumber++,faction,"Медик",false),
                new Card("",1,"Archers",cardNumber++,faction,"Медик",false),
                new Card("",1,"Archers",cardNumber++,faction,"Медик",false),
                new Card("Посланник",5,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("Посланник",5,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("",3,"Archers",cardNumber++,faction,"",false),
                new Card("",4,"Warriors",cardNumber++,faction,"",false),
                new Card("",5,"Archers",cardNumber++,faction,"",false),
                new Card("",6,"Artillery",cardNumber++,faction,"",false),
                new Card("",2,"Archers",cardNumber++,faction,"",false),
                new Card("",3,"Artillery",cardNumber++,faction,"",false),
                new Card("",10,"Artillery",cardNumber++,faction,"",false),
                new Card("",5,"Artillery",cardNumber++,faction,"",false),
                new Card("",9,"Warriors",cardNumber++,faction,"Шпион",false),
                new Card("",10,"Archers",cardNumber++,faction,"",true),
                new Card("",6,"Archers",cardNumber++,faction,"",false),
                new Card("",4,"Archers",cardNumber++,faction,"",false),
                new Card("",10,"Archers",cardNumber++,faction,"",false),
                new Card("Бригада",3,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("Бригада",3,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("Бригада",3,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("Бригада",3,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("Кавалерия",2,"Warriors",cardNumber++,faction,"Прочная связь",false),
                new Card("Кавалерия",2,"Warriors",cardNumber++,faction,"Прочная связь",false)];
            break;
        case "Чудовища":
            tempArr = [ new Card("",5,"Archers",cardNumber++,faction,"",false),
                new Card("",6,"Warriors",cardNumber++,faction,"",false),
                new Card("Вампиры",4,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("Вампиры",4,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("Вампиры",4,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("Вампиры",4,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("",2,"Archers",cardNumber++,faction,"",false),
                new Card("Ведьмы",6,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("Ведьмы",6,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("Ведьмы",6,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("",2,"Archers",cardNumber++,faction,"",false),
                new Card("",5,"Warriors",cardNumber++,faction,"",false),
                new Card("",5,"Warriors",cardNumber++,faction,"",false),
                new Card("",2,"Archers",cardNumber++,faction,"",false),
                new Card("",2,"Archers",cardNumber++,faction,"Проворство",false),
                new Card("",2,"Archers",cardNumber++,faction,"Проворство",false),
                new Card("Главоглаз",6,"Artillery",cardNumber++,faction,"Двойник",false),
                new Card("Главоглаз",4,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("Главоглаз",4,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("Главоглаз",4,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("",5,"Warriors",cardNumber++,faction,"",false),
                new Card("Гуль",1,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("Гуль",1,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("Гуль",1,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("",10,"Warriors",cardNumber++,faction,"",true),
                new Card("",4,"Warriors",cardNumber++,faction,"",false),
                new Card("",10,"Warriors",cardNumber++,faction,"",true),
                new Card("",8,"Warriors",cardNumber++,faction,"Прилив сил",true),
                new Card("",5,"Artillery",cardNumber++,faction,"",false),
                new Card("",10,"Archers",cardNumber++,faction,"",true),
                new Card("",5,"Warriors",cardNumber++,faction,"",false),
                new Card("Накер",2,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("Накер",2,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("Накер",2,"Warriors",cardNumber++,faction,"Двойник",false),
                new Card("",5,"Warriors",cardNumber++,faction,"",false),
                new Card("",2,"Warriors",cardNumber++,faction,"",false),
                new Card("",6,"Artillery",cardNumber++,faction,"",false),
                new Card("",6,"Artillery",cardNumber++,faction,"",false),
                new Card("",2,"Archers",cardNumber++,faction,"",false)];
            break;
    }
    cardNumber = 1;
    tempArr[tempArr.length] = new Card("",6,"Warriors",cardNumber++,"Нейтральные","",false);
    tempArr[tempArr.length] = new Card("",15,"Warriors",cardNumber++,"Нейтральные","",true);
    tempArr[tempArr.length] = new Card("",5,"Warriors",cardNumber++,"Нейтральные","",false);
    tempArr[tempArr.length] = new Card("",5,"Warriors",cardNumber++,"Нейтральные","",false);
    tempArr[tempArr.length] = new Card("",7,"Archers",cardNumber++,"Нейтральные","Медик",true);
    tempArr[tempArr.length] = new Card("",15,"Warriors",cardNumber++,"Нейтральные","",true);
    tempArr[tempArr.length] = new Card("",0,"Warriors",cardNumber++,"Нейтральные","Шпион",true);
    tempArr[tempArr.length] = new Card("",7,"Warriors",cardNumber++,"Нейтральные","",true);

    return tempArr;
}

// Выбор случайных карт из колоды
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

// Отправка колоды игрокам
function sendStartCards() {
    let deckLength = 10;
    players[0].deck = choiceDeck(players[0].faction);
    players[1].deck = choiceDeck(players[1].faction);

    players[0].cards = getRandomCards(players[0].deck, deckLength);
    players[1].cards = getRandomCards(players[1].deck, deckLength);

    io.sockets.sockets[players[0].id].emit('sendStartCards', players[0].cards);
    io.sockets.sockets[players[1].id].emit('sendStartCards', players[1].cards);
}

// Выбор случайного целого числа
function getRandomInt(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

// Маршруты
app.get('/', function(request, response) {

    players[players.length] = new player(players.length + 1);
    if(players.length < 2){
        page = '../wait.html';
    } else
        if(players.length > 2){
            page = '../error.html';
        }
    response.sendFile(path.join(__dirname, page));
    if(players.length === 2) {
        setTimeout(startGame,2000);
    }
});

// Запуск сервера
server.listen(5000, function() {
    console.log('Запускаю сервер на порте 5000');
});

// Обработчик веб-сокетов
io.on('connection', function(socket) {

    // Подключился новый игрок
    socket.on('new player', function() {
        players[players.length - 1].id = socket.id;
        console.log(socket.id);
        if(players.length  < 3 ){
            socket.emit('index',players.length);
        }
    });

    // Отключился игрок
    socket.on('close', function(id) {
        console.log('user ' + id + ' closed game');
        players.splice(id-1,1);
        if((id === 1 || id === 2) && (players.length > 0)){
            if(id === 1) {
                io.sockets.sockets[players[0].id].emit('index',1);
            }

            players[0].moveThisUser = false;
            players[0].faction = "";
            players[0].deck = [];
            players[0].cards = [];
            players[0].deletedCards = [];
            players[0].endOfRound = false;

            setTimeout(restartGame,1000);
        }
    });

    // Получаем выбранные игроками фракции
    socket.on('choiceDeck',function(id, faction) {
        console.log('user ' + id + ' closed "' + faction + '"');
        players[id-1].faction = faction;
        if( typeof players[0].faction !== 'undefined' && typeof players[1].faction !== 'undefined'){
            sendStartCards();
        }
    });

    // Рандомим игрока, который будет ходить первый
    socket.on('getFactionsAndFirstMovePlayers', function() {
        if (!players[0].moveThisUser && !players[1].moveThisUser) {
            rund = Math.random();
            console.log(rund)
            if (rund < 0.5){
                rund = 1;

            } else rund = 2;
        }
        console.log('user ' + rund + ' make a move first');
        players[rund-1].moveThisUser = true;
        socket.emit('choiceFirstMovePlayer','../img/card/' + players[0].faction + '/1.jpg', '../img/card/' + players[1].faction + '/1.jpg',rund);
    });
});



/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Зависимости
var page = '../game.html';
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

var mainFaction;

app.set('port', 5000);
app.use(express.static(__dirname + '/../'));

// Маршруты
app.get('/', function(request, response) {
    if(io.engine.clientsCount < 2){
        page = '../game.html';
    } else page = '../error.html';
    response.sendFile(path.join(__dirname, page));
});

// Запуск сервера
server.listen(5000, function() {
    console.log('Запускаю сервер на порте 5000');
});

// Обработчик веб-сокетов
io.on('connection', function(socket) {
    socket.on('new player', function() {
        console.log(io.engine.clientsCount);
        if(io.engine.clientsCount === 1){
            socket.emit('move', true);
        }else {
            socket.emit('enemyFaction', mainFaction);
            socket.emit('move', false);
        }
    });
    socket.on('card', function(card) {
        socket.broadcast.emit('state', card);
    });
    socket.on('endRound', function(endRound) {
        socket.broadcast.emit('enemyEndRound', endRound);
    });
    socket.on('faction', function(faction) {
        mainFaction = faction;
        socket.broadcast.emit('enemyFaction', faction);
    });
    socket.on('endMove', function() {
        socket.broadcast.emit('move', true);
        socket.emit('move', false);
    });
});
*/
