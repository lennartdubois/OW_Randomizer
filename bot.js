var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt, channelID) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

//-------------------globale variablen-------------------
var klasse = ["tank", "healer", "dps"];
var klasDPS = ["Ashe", "Bastion", "Doomfist", "Genji", "Hanzo", "Junkrat", "Mccree", "Mei", "Pharah", "Reaper", "Solder: 76", "Sombra", "Symmetra", "Torbjörn", "Tracer", "Widowmaker"];
var klasHealer = ["Ana", "Brigitte", "Lucio", "Mercy", "Moira", "Zenyatta"];
var klasTank = ["D.va", "Orisa", "Reinhardt", "Roadhog", "Winston", "Wrecking ball", "Zarya"];

var tHealer = 0;
var tDps = 0;
var tTank = 0;
var myMessage = "";


bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        // Get the right data from the input:
        // split the input into bits
        let args = message.substring(1).match(/\S+/g) || [];
        //var args = message.substring(1).split('\s*');

        // get the command to run
        let cmd = args[0];

        // get the players who were entered:
        let players = args;
        // Remove the command
        players.splice(players.indexOf(cmd), 1);
        
        switch (cmd) {
            case 'assign':
            // keep counters of the classes (max 2 of each!)
                tHealer = 0;
                tDps = 0;
                tTank = 0;
                myMessage = "";
                // define a new array of the classes so we can manipulate them:
                let k = klasse.slice(0);

                for (i = 0; i < players.length; i++) {
                    p = players[i];
                    rk = getRandKlass(k);
                    rc = checkClass(rk);
                    console.log("player: " + p + " klass: " + rk + " champ: " + rc)
                    myMessage = myMessage + p + "       " + rk + "  /  " + rc + "\n"
                    
                }
                
                bot.sendMessage({
                    to: channelID,
                    message: myMessage,

                });

                break;
        }

        // Just add any case commands if you want to..
    }
});

//-------------------Appoint the checked class a champion-------------------
let checkClass = function (klas) {
    let champ;
    let kDPS = klasDPS.slice(0);
    let kHealer = klasHealer.slice(0);
    let kTank = klasTank.slice(0);
    switch (klas) {
        case "tank":
            champ = kTank[Math.floor((Math.random() * kTank.length))];
            kTank.splice(kTank.indexOf(champ), 1);
            return champ;
        case "healer":
            champ = kHealer[Math.floor((Math.random() * kHealer.length))];
            kHealer.splice(kHealer.indexOf(champ), 1);
            return champ;
        case "dps":
            champ = kDPS[Math.floor((Math.random() * kDPS.length))];
            kDPS.splice(kDPS.indexOf(champ), 1);
            return champ;
    }
}

//-------------------Get a random class and check if it didnt occure more than 2 times-------------------
let getRandKlass = function (k) {
    let randKlas = k[Math.floor((Math.random() * k.length))]
    console.log(randKlas);
    switch (randKlas) {
        case "tank":
            tTank++;
            if (tTank >= 2) {
                k.splice(k.indexOf(randKlas), 1);
            }
            return randKlas;
        case "healer":
            tHealer++;
            if (tHealer >= 2) {
                k.splice(k.indexOf(randKlas), 1);
            }
            return randKlas;
        case "dps":
            tDps++;
            if (tDps >= 2) {
                k.splice(k.indexOf(randKlas), 1);
            }
            return randKlas;
    }

}