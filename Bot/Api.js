const fetch = require('node-fetch');
class Api {
    constructor() {
        this.endpoint = 'https://api.wordpress.org/stats/plugin/1.0/';
        this.endpoint2 = 'http://api.wordpress.org/plugins/info/1.0/';
        this.endpoint3 = 'https://api.wordpress.org/plugins/info/1.2/?action=plugin_information&request%5Bslug%5D=';
    }

    async downloads(chatId, slug, limit = 1) {
        try {
            const api = `${this.endpoint}downloads.php?slug=${slug}&limit=${limit}`;
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
            var api = `${this.endpoint}active-installs.php?slug=${slug}&limit=210`;
            let sendMessage = await fetch(api)
            if (sendMessage.status == 400) {
                return {
                    status: sendMessage.status,
                    statusText: sendMessage.statusText
                }
            }
            return sendMessage.json()

        } catch (err){
            return err;
        }
    }

    async status(chatId, slug) {
        try {
            var api = `${this.endpoint3}${slug}&request%5Bfields%5D%5Bdownloaded%5D=1`;
            let sendMessage = await fetch(api);
            if (sendMessage.status == 200) {
                return await sendMessage.json()
            }
            throw {
                status: sendMessage.status,
                statusText: sendMessage.statusText
            }
        } catch (err){
            return err;
        }
    }


}

module.exports = Api;