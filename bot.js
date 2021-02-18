process.env['NTBA_FIX_319'] = 1;
require('dotenv').config({ silent: true });
var TelegramBot = require('node-telegram-bot-api');
var opt = { polling: true };
var bot = new TelegramBot(process.env.TOKEN, opt);
bot.on('polling_error', console.log);
const Bot = require('./Bot/Api');
const BotInstance = new Bot();

class NinjaBotInit {
	constructor() {
		this.buttonSuggestions();
		this.registerQueries();
	}

	static slugiFy(str) {
		return str.toString().toLowerCase();
	}

	buttonSuggestions() {
		bot.onText(/\/download/, function onLoveText(msg) {
			const opts = {
				reply_markup: JSON.stringify({
					keyboard: [
						['/dl fluentform', '/dl wp-payment-form'],
						[
							'/dl ninja-tables',
							'/dl fluent-crm',
							'/dl ninja-charts'
						],
						['/dl ninja-job-board', '/dl wp-social-reviews'],
						['/dl fluent-smtp', '/help']
					]
				})
			};
			bot.sendMessage(
				msg.chat.id,
				'Select from bellow or \n Type "/dl plugin-slug"',
				opts
			);
		});

		bot.onText(/\/active/, function onLoveText(msg) {
			const opts = {
				reply_markup: JSON.stringify({
					keyboard: [
						['/ac fluentform', '/ac wp-payment-form'],
						[
							'/ac ninja-tables',
							'/ac fluent-crm',
							'/ac ninja-charts'
						],
						['/ac ninja-job-board', '/ac wp-social-reviews'],
						['/ac fluent-smtp', '/help']
					]
				})
			};
			bot.sendMessage(
				msg.chat.id,
				'Select from bellow or \n Type "/ac plugin-slug"',
				opts
			);
		});

		// Matches /start
		bot.onText(/\/status/, function onLoveText(msg) {
			const opts = {
				reply_markup: JSON.stringify({
					keyboard: [
						['/st fluentform', '/st wp-payment-form'],
						[
							'/st ninja-tables',
							'/st fluent-crm',
							'/st ninja-charts'
						],
						['/st ninja-job-board', '/st wp-social-reviews'],
						['/st fluent-smtp', '/help']
					]
				})
			};
			bot.sendMessage(
				msg.chat.id,
				'Select from bellow or \n Type "/st plugin-slug"',
				opts
			);
		});
	}

	registerQueries() {
		/*
		 * download query
		 */
		bot.onText(/\/dl (.+)/, async function(msg, match) {
			const chatId = msg.chat.id;
			const result = await BotInstance.downloads(msg, match);
			let rep = 'Today (';
			for (let prop in result) {
				rep += prop + ')\n';
				rep += 'Downloads:' + result[prop];
			}
			bot.sendMessage(chatId, '===Result===\n' + rep);
		});

		/*
		 * active query
		 */
		bot.onText(/\/ac (.+)/, async function(msg, match) {
			const chatId = msg.chat.id;
			const result = await BotInstance.activeChart(msg, match);
			console.log(result);
		});

		/*
		 * Status query
		 */
		bot.onText(/\/st (.+)/, async function(msg, match) {
			const chatId = msg.chat.id;
			const result = await BotInstance.status(msg, match);
			console.log(result);
		});

		/*
		 * logo query
		 */
		bot.onText(/\/logo (.+)/, (msg, match) => {
			var slug = this.slugiFy(match[1]);
			var url = `https://ps.w.org/${slug}/assets/icon-256x256.png`;
			console.log(url);
			bot.sendPhoto(msg.chat.id, url);
		});

		/*
		 * authlab query
		 */
		bot.onText(/\/authlab/, (msg, match) => {
			var url =
				'https://authlab.io/wp-content/uploads/2016/06/authlab_logo-1.png';
			console.log(url);
			bot.sendPhoto(
				msg.chat.id,
				url,
				{
					caption:
						'Where a band of geeks and nerds actualize your business ideas'
				},
				{ parse_mode: 'pre' }
			);
			bot.sendLocation(msg.chat.id, 24.90986066235793, 91.86431760739505);
		});

		// Matches /start
		bot.onText(/\/help/, function(msg) {
			const opts = {
				reply_markup: JSON.stringify({
					keyboard: [
						['/st fluentform', '/dl fluentform'],
						['/ac fluentform', '/help']
					]
				})
			};
			bot.sendMessage(
				msg.chat.id,
				'Type /st {plugin-slug} [for plugin all status]\n /ac {plugin-slug} [for plugin active growth]\n /dl {plugin-slug} [for plugin download info]\n Get some shortcuts: /active, /download, /status,\n /authlab, /love, /help, /start \n There are some examples!',
				opts
			);
		});

		bot.onText(/\/start/, (msg) => {
			const opts = {
				reply_markup: JSON.stringify({
					keyboard: [['/help']]
				})
			};
			bot.sendMessage(
				msg.chat.id,
				`Hi ${msg.from.first_name} 😄 \nWelcome to WPNinja Bot😊 You can check your wp.org plugin-status By asking me on text. 😎 Type or press /help for more query.`,
				opts
			);
		});

		// Matches /love
		bot.onText(/\/love/, function(msg) {
			const opts = {
				reply_to_message_id: msg.message_id,
				reply_markup: JSON.stringify({
					keyboard: [
						['Yes, you are the bot of my life ❤'],
						['No, sorry there is another one...']
					]
				})
			};
			bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
		});

		bot.on('callback_query', function onCallbackQuery(callbackQuery) {
			const action = callbackQuery.data;
			const msg = callbackQuery.message;
			const opts = {
				chat_id: msg.chat.id,
				message_id: msg.message_id
			};
			let text;

			if (action === 'edit') {
				text = 'Edited Text';
			}
			bot.sendMessage(text, 'hello', opts);
		});
	}
}

new NinjaBotInit();
