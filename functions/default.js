module.exports = {
    name: 'default',
    description: 'default',
    execute(message, args, command) {
        if (command === 'default')
            message.channel.send('default')
        else
            message.channel.send('default')
    }
}