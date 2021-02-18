const fetch = require('node-fetch');
class Api {
    constructor() {
        this.endpoint = 'https://api.wordpress.org/stats/plugin/1.0/';
        this.endpoint2 = 'http://api.wordpress.org/plugins/info/1.0/';
    }

    async downloads(msg, match) {
        try {
            const api = `${this.endpoint}downloads.php?slug=${match[1]}&limit=1`;
            let sendMessage = await fetch(api)
            return await sendMessage.json()
        } catch(err) {
            console.error(err)
        }
    }

    async activeChart(msg, match) {
        try {
            var api = `${this.endpoint}active-installs.php?slug=${match[1]}&limit=70`;
            let sendMessage = await fetch(api)
            return await sendMessage.json()
        } catch {
            console.error(err)
        }
    }

    async status(msg, match) {
        try {
            var api = `${this.endpoint2}${match[1]}.json`;
            console.log(api)
            let sendMessage = await fetch(api)
            return await sendMessage.json()
        } catch {
            console.error(err)
        }
    }


}

module.exports = Api;