var globalIds = [];
var reddit = false;
var twitter = false;
var website = false;

module.exports = {
    name: 'getNews',
    description: 'get all news',
    execute(options, https, fs, client) {
        let paths = ["/api/v1/dev_tracker?page=1&source=reddit",
            "/api/v1/dev_tracker?page=1&source=twitter",
            "/api/v1/dev_tracker?page=1&source=website-news"
        ]

        fs.readFile('./files/news.txt', (err, ids) => {
            if (err) throw err;

            let arrayIds = ids.toString('utf8').split(',');
            
            paths.forEach(element => {
                options.path = element;
                getNews(options, https, fs, arrayIds, client);
            });
        });
    }
}


async function getNews(options, https, fs, arrayIds, client) {
    let output = '';
    var channel = client.channels.cache.get(`818268720257433604`);

    const req = https.request(options, (res) => {
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            output += chunk;
        });



        res.on('end', () => {
            let data = JSON.parse(output);


            if (data[0].source == 'twitter') {
                if (arrayIds[0] != data[0].id && data[0].developer_name == '@playnewworld') {
                    channel.send(data[0].source_url);
                    globalIds[0] = data[0].id;
                    twitter = true;
                }
                else {
                    globalIds[0] = data[0].id;
                    twitter = true;
                }
            }

            if (data[0].source == 'reddit') {
                if (arrayIds[1] != data[0].id) {
                    channel.send(data[0].source_url);
                    globalIds[1] = data[0].id;
                }
                else {
                    globalIds[1] = data[0].id;
                }
                reddit = true;
            }

            if (data[0].source == 'website-news') {
                if (arrayIds[2] != data[0].id) {
                    channel.send(data[0].source_url.replace("de-de", "en-us"));
                    globalIds[2] = data[0].id;
                }

                else {
                    globalIds[2] = data[0].id;
                }
                website = true;
            }

            if (reddit && twitter && website) {

                writeNewIds(fs, arrayIds);
            }

        });
    });

    req.on('error', (err) => {
    });

    req.end();
}

function writeNewIds(fs) {
    var ids = globalIds[0] + "," + globalIds[1] + "," + globalIds[2];

    fs.writeFile('./files/news.txt', ids, (err) => {
        if (err) throw err;
    });
}
