const Discord = require("discord.js");
const bot = new Discord.Client({
    disableEveryone: true
});
const fs = require("fs");
const prefix = "m!"; //change to your prefix
const DBL = require("dblapi.js") //discordbotlist API
const dbl = new DBL(process.env.DBL_TKN, bot);
const BOATS = require('boats.js'); //discord.boats API
const Boats = new BOATS(process.env.BOATS);
const unirest = require("unirest") //used to access botsfordiscord.com API

bot.commands = new Discord.Collection();



fs.readdir("./cmds/", (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
        console.log("No commands to load! Please add some to the 'cmds' folder!");
    }

    console.log(`Loading ${jsfiles.length} commands!`);

    jsfiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
});

// SERVER COUNT POST START
/*
dbl.on('posted', () => {
    console.log('Server count posted!');
})

dbl.on('error', e => {
    console.log(`Oops! ${e}`);
})

Boats.postStats(bot.guilds.size, '481894520741691393').then(() => {
    console.log('Successfully updated server count on discord.boats.');
}).catch((err) => {
    console.error(err);
});*/
// SERVER COUNT POST END

bot.on("ready", async () => {
    console.log("Bot is online!");

    bot.user.setActivity(`the sky in ${bot.guilds.size} servers // m!help`, {
        type: 'WATCHING'
    });
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;





    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length));


    if (cmd) {
        cmd.run(bot, message, args);

    }

});

bot.login(process.env.BOT_TKN); //process.env.BOT_TKN is for heroku, change it to "yourtokenhere"