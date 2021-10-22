const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'raid',
    description: 'default',
    execute(message, args, command) {
        let option = args[0];
        if (option == "create") {
            let arguments = args.slice(1);
            createRaid(message, arguments);
            
        }
    }
}

function createRaid(message, args) {

    console.log(args);
    let raidName = args[0];
    let day = args[1];
    let hour = args[2];


    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(raidName + " | " + day + ", " + hour)
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
            { name: 'Regular field title', value: 'Some value here' },
            { name: '\u200B', value: '\u200B' },
            { name: 'Inline field title', value: 'Some value here', inline: true },
            { name: 'Inline field title', value: 'Some value here', inline: true },
        )
        .addField('Inline field title', 'Some value here', true)
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()


    message.channel.send({ embed });

}