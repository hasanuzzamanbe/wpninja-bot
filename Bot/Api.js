const fetch = require('node-fetch');
class Api {
    constructor() {
        this.endpoint = 'https://api.wordpress.org/stats/plugin/1.0/';
        this.endpoint2 = 'http://api.wordpress.org/plugins/info/1.0/';
    }

    async downloads(chatId, slug) {
        try {
            const api = `${this.endpoint}downloads.php?slug=${slug}&limit=1`;
            let sendMessage = await fetch(api);
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

    async activeChart(chatId, slug) {
        try {
            var api = `${this.endpoint}active-installs.php?slug=${slug}&limit=140`;
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

    async status(chatId, slug) {
        try {
            var api = `${this.endpoint2}${slug}.json`;
            console.log(api, 'status')
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