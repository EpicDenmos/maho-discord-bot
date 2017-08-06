const Discord = require("discord.js");
const requestify = require('requestify'); 

const bot = new Discord.Client();

const config = require("./config.json");

bot.on("ready", () => {
    console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`); 
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    bot.user.setGame(`Love Maho <3 !`);
});


bot.on("message", message => {
    if(message.author.bot) return;

    if(message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "ltwitch") {
        var msg = "@everyone Les personnes qui ne l'ont pas encore fait, merci de lier vos profils Discord/Twitch (Paramètres Utilisateurs/Connexion/Cliquer sur le logo Twitch) pour avoir le statut \"Twitch Sub\" sur le serveur.   Merci à tous de le faire pour me faciliter la tâche merci beaucoup et accessoirement le rang sub ne vous sera pas attriber sans cette manip.";
        message.channel.send(msg);
    }
});


bot.login(config.token);



/**
 * TWITCH STUFF 
 */

var STREAMER_ID = 'MahO_Tv';
var checkStreamUrl = 'https://api.twitch.tv/kraken/streams/'+STREAMER_ID+'?client_id=4vvo62clzhydthffekuubxdubj33t5';

var streamNotifMsg = '@everyone MahO vient de commencer à streamer ! Retrouver le sur Twitch : https://www.twitch.tv/maho_tv';

function checkStream() {
    requestify.get(checkStreamUrl).then(function(response) {            
        if(response.getBody().stream === null) {
            isStreamOnline = false;
        }
        else {
            if(typeof(isStreamOnline) !== 'undefined' && !isStreamOnline) {
                // Stream has come online, send message
                console.log("stream online");
                bot.channels.filter(chan => chan.name === 'general').forEach(function(channel){
                    channel.send(streamNotifMsg);
                });
            }
            isStreamOnline = true;
        }     
    });
}

function init() {
    checkStream();

    // Check every 30 seconds if the stream is online
    setInterval(checkStream, 30000);
}

init();