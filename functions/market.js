var processed = false;

module.exports = {
    name: 'market',
    description: 'market commands',
    execute(message, args, command, User, Listening, ocrSpace, sharp, fetch, gearTypes, fs, perks) {
        var user;
        var option = args[0];
        var query = { userid: message.author.id };
        User.findOne(query).then((result) => {
            if (result != null) {
                user = result;
            }
            else {
                createUser(message, User);
                user = {
                    userid: message.author.id,
                    listeningsnumber: 0,
                }
            }

            if (option === 'sell') {
                if (message.attachments.size > 0) {
                    var attachment = (message.attachments).array()[0].url;
                    var msg;
                    message.channel.send("Analyzing you're picture (it might take a while)").then((x) => {
                        msg = x;
                        var interval = setInterval(function () {
                            if (msg.content == "Analyzing you're picture (it might take a while)")
                                msg.edit("It's taking longer than expected to process your image but we're still trying")
                            else
                                clearInterval(interval);
                        }, 10000);
                    })

                    var outputFile = './files/' + message.author.id + ".jpg";

                    resize(attachment, outputFile, sharp, fetch).then(() => {
                        setTimeout(function () {
                            try {
                                getText(outputFile, ocrSpace).then((data) => {
                                    if (!data.IsErroredOnProcessing) {
                                        var text = data.ParsedResults[0].ParsedText;
                                        parseText(text, msg, gearTypes, perks, attachment, message, args, Listening, User, user);
                                    }
                                    else {
                                        msg.edit("There was an error processing your image");
                                    }
                                    fs.unlinkSync(outputFile);
                                });
                            } catch (error) {
                                console.log(error);
                                fs.unlinkSync(outputFile);
                            }

                        }, 100);
                    });

                }
            }
        })
    }
}

function cancelListening(message,User,user){

}


function parseText(text, msg, gearTypes, perks, attachment, message, args, Listening, User, user) {
    let str;
    let focus;
    let int;
    let dex;
    let cons;

    var position = text.search("Strength");
    position != -1 ? str = text.substring(position - 3, position).replace(/\D/g, '') : str = 0;
    position = text.search("Focus");
    position != -1 ? focus = text.substring(position - 3, position).replace(/\D/g, '') : focus = 0;
    position = text.search("Dexterity");
    position != -1 ? dex = text.substring(position - 3, position).replace(/\D/g, '') : dex = 0;
    position = text.search("Constitution");
    position != -1 ? cons = text.substring(position - 3, position).replace(/\D/g, '') : cons = 0;
    position = text.search("Intelligence");
    position != -1 ? int = text.substring(position - 3, position).replace(/\D/g, '') : int = 0;

    str == undefined || str == '' ? str = 0 : null;
    dex == undefined || dex == '' ? dex = 0 : null;
    focus == undefined || focus == '' ? focus = 0 : null;
    int == undefined || int == '' ? int = 0 : null;
    cons == undefined || cons == '' ? cons = 0 : null;



    var gearPosition = text.search("Gear");
    var score = text.substring(10, gearPosition != -1 ? gearPosition : text.search("Score")).replace(/\D/g, '');
    var type;
    gearTypes.forEach(element => {
        if (text.search(element) != -1) {
            type = element;
        }
    });

    var perksArray = [];
    var alteredText = text;

    perks.forEach(element => {
        let position = alteredText.search(element);
        let hasNumbers = alteredText.substring(position - 8, position).match(/\d+/g);

        if (position != -1 && hasNumbers == null) {
            perksArray.push(element);
            alteredText = alteredText.replace(element, '');
        }
    });


    var gear = {
        score: score,
        type: type,
        strength: str,
        dexterity: dex,
        focus: focus,
        intelligence: int,
        constitution: cons,
        perks: perksArray,
    }



    var listening = {
        listeningid: 1,
        userid: message.author.id,
        messageid: message.id,
        type: gear.type,
        score: gear.score,
        url: attachment,
        price: args[1],
        gear: gear,
        status: 'Active'
    }

    createListening(listening, message, Listening, User, user);


    msg.edit(`Gear Score: ${score}\nType: ${type}\nstr: ${str}\nint: ${int}\ndex: ${dex}\nfocus: ${focus}\nconst: ${cons}`);
}

function enter() {
    return "\n";
}


async function resize(attachment, output, sharp, fetch) {
    const response = await fetch(attachment);
    const buffer = await response.buffer();
    var y = 1500;

    sharp(buffer).resize({ height: y }).toFile(output)
        .then(function (newFileInfo) {
        })
        .catch(function (err) {
            console.log(err);
        });
}




async function getText(attachment, ocrSpace) {
    const res2 = await ocrSpace(attachment, { apiKey: 'a9f3ffe40c88957' })

    return res2;
}


function createUser(message, User) {
    let user = {
        userid: message.author.id,
        listeningsnumber: 0,
    }

    User.create(user).then((result) => {

    })
};

function addListeningNumber(User, message, user) {
    let query = { userid: message.author.id }
    user.listeningsnumber++;

    User.updateOne(query, user).then((result) => {

    })
}

function removeListeningNumber(User, message, user) {
    let query = { userid: message.author.id }
    user.listeningsnumber--;

    User.updateOne(query, user).then((result) => {

    })
}


function createListening(item, message, Listening, User, user) {

    addListeningNumber(User, message, user);

    Listening.find().sort({ listeningid: -1 }).limit(1).then((result) => {

        item.listeningid = parseInt(result[0].listeningid) + 1;

        Listening.create(item).then((result) => {
            message.channel.send("Market listening successfuly created");
        })
    });
}