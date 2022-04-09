const { createClient } = require('redis');
const { YOUTUBE_DATA } = require("../data");

(async () => {
    global.db = createClient();
    global.dbError = false;
    global.db.on('error', (err) => {
        console.log('Redis Client Error', err);
        process.exit(1);
    });
    await global.db.connect();
    global.YOUTUBE_DATA = YOUTUBE_DATA;
})();