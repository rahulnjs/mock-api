let items = [];
const fetch = require("node-fetch");

const url = 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyCc1vWocCyY921yDvAQBiTwhDx5uKTskFU&type=video&part=snippet&maxResults=100&q=javascript&nextPageToken=CDIQAA';




(function _fetch() {
    fetch(url)
        .then(r => r.json())
        .then(d => {
            items = [...items, ...d.items];
            if (items.length < 500) {
                setTimeout(() => {
                    _fetch();
                }, 5000);
            } else {
                console.log(JSON.stringify(items));
            }
        });
})();



