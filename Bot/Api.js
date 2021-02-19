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
            if (sendMessage.status === 200) {
                return await sendMessage.json()
            }
            return {
                status: sendMessage.status,
                statusText: sendMessage.statusText
            }
        } catch (err){
            return err;
        }
    }

    async activeChart(msg, match) {
        try {
            var api = `${this.endpoint}active-installs.php?slug=${match[1]}&limit=70`;
            let sendMessage = await fetch(api)
            if (sendMessage.status === 200) {
                return await sendMessage.json()
            }
            return {
                status: sendMessage.status,
                statusText: sendMessage.statusText
            }
        } catch (err){
            return err;
        }
    }

    async status(msg, match) {
        try {
            var api = `${this.endpoint2}${match[1]}.json`;
            console.log(api)
            let sendMessage = await fetch(api)
            if (sendMessage.status === 200) {
                return await sendMessage.json()
            }
            return {
                status: sendMessage.status,
                statusText: sendMessage.statusText
            }
        } catch (err){
            return err;
        }
    }


}

module.exports = Api;