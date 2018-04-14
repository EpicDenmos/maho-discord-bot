const Discord = require("discord.js");
const requestify = require('requestify'); 
var MessageFormat = require('messageformat');
var mf = new MessageFormat('en');

const bot = new Discord.Client();

const config = require("/mahobot/config.json");
const REQUIRED_TWITCH_CHECK = 3;
var currentTwitchCheck = 0;
var isStreamOnline = false;

bot.on("ready", () => {
    console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`); 

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


/**
 * Greeting message for new members
 */
var welcomeMsg = mf.compile('Bienvenue {NAME} sur le discord du Fail :wink:  ! Pense à lire les règles du discord stp #regles  Merci !');

bot.on("guildMemberAdd", member => {
    // Only active greetings for Maho Discord
    if(member.guild.name === 'MahO_Tv') {
        member.guild.channels.filter(chan => chan.name === 'general').forEach(function(channel) {
            channel.send(welcomeMsg({ NAME : member.user.username }));
        });
    }
});



bot.login(config.token);



/**
 * TWITCH STUFF 
 */
var checkStreamUrl = 'https://api.twitch.tv/kraken/streams/'+config.streamerId+'?client_id='+config.twitchClientId;



function checkStream() {
    requestify.get(checkStreamUrl).then(function(response) {            
        if(response.getBody().stream === null) {
            isStreamOnline = false;
            currentTwitchCheck = 0;
        }
        else {
            if(typeof(isStreamOnline) !== 'undefined' && !isStreamOnline) {
                
                currentTwitchCheck += 1;
                
                if(currentTwitchCheck >= REQUIRED_TWITCH_CHECK) {
                    // Stream has come online, send message
                    var streamNotifMsg = '@everyone MahO vient de commencer à streamer ! Au menu aujourd\'hui : ' + response.getBody().stream.channel.status + '. Retrouvez le sur Twitch : https://www.twitch.tv/maho_tv';
                    bot.channels.filter(chan => chan.name === 'info-live').forEach(function(channel){
                        channel.send(streamNotifMsg);
                    });

                    isStreamOnline = true;
                }
            }            
        }     
    });
}

function init() {
    checkStream();

    // Check every 30 seconds if the stream is online
    setInterval(checkStream, 30000);
}

init();