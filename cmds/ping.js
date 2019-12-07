const Discord = module.require("discord.js");
const DBL = require("dblapi.js") //DBL api
const unirest = require("unirest")
const BOATS = require('boats.js'); //discord.boats API
const Boats = new BOATS(process.env.BOATS);

module.exports.run = async(bot, message, args) => {
    // SERVER COUNT POST START
    const dbl = new DBL(process.env.DBL_TKN, bot);
    dbl.on('posted', () => {
        console.log('Server count posted!');
    })

    dbl.on('error', e => {
        console.log(`Oops! ${e}`);
    })
    unirest.post('https://botsfordiscord.com/api/bot/481894520741691393')
        .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        .send({ "count": bot.guilds.size, "Authorization": process.env.BFD_TKN })
        .end(function(response) {
            console.log("Server count posted to B4D");
        });
        Boats.postStats(bot.guilds.size, '481894520741691393').then(() => {
            console.log('Successfully updated server count on discord.boats.');
        }).catch((err) => {
            console.error(err);
        });
    // SERVER COUNT POST END
    let m = await message.channel.send("Pinging...");

    let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setDescription(":ping_pong: Pong!")
        .addField("Latency", `${m.createdTimestamp - message.createdTimestamp}ms`)
        .setColor("#000000")
        .setFooter(`Information shown here may not be accurate!`)

    message.channel.send({ embed: embed });
}

module.exports.help = {
    name: "ping"
}