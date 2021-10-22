const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '-';
const mongoose = require('mongoose');
const options = {
    hostname: 'newworldfans.com',
    port: 443,
    path: '/api/v1/dev_tracker?page=1&source=',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}
require('dotenv').config();
client.functions = new Discord.Collection();
client.events = new Discord.Collection();
const User = require('./models/user');
const Listening = require('./models/gearlistening');
const ocrSpace = require('ocr-space-api-wrapper');
const sharp = require('sharp');
const fetch = require('node-fetch');
const fs = require('fs');
const gearTypes = require('./files/gear');
const perks = require('./files/perks');


const commands = fs.readdirSync('./functions/').filter(file => file.endsWith('.js'));

var command;

for (const file of commands) {
    command = require("./functions/" + file)
    client.functions.set(command.name, command);

}


client.once('ready', () => {
    client.user.setActivity("New World");
    console.log('Online')

    var channel = client.channels.cache.get(`818268720257433604`);

    // client.functions.get('getNews').execute(options, https, fs, client);

    // setInterval(function () {
    //     client.functions.get('getNews').execute(options, https, fs, client);
    // }, 30 * 1000)

    // channel.send("REMEMBER TO DONATE ALL YOUR GOLD TO THE COMPANY OR YOU'LL GET BANNED");
    // setInterval(function () {
    //     channel.send("REMEMBER TO DONATE ALL YOUR GOLD TO THE COMPANY OR YOU'LL GET BANNED");
    // }, 6 * 60 * 60 * 1000)
})


const market = ["market", "mrkt", "mkt"];
const raids = ["raid"];


client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (market.includes(command)) {
        client.functions.get('market').execute(message, args, command, User, Listening, ocrSpace, sharp, fetch, gearTypes, fs, perks);
    }
    else if (command == 'test') {


    }
    else if (raids.includes(command)) {
        client.functions.get('raid').execute(message, args, command);
    }
    else {
        message.channel.send("Invalid command");
    }
});

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database connected")
}).catch((error) => {
    console.log(error)
})


client.login(process.env.TOKEN);