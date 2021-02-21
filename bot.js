process.env['NTBA_FIX_319'] = 1;
require('dotenv').config({ silent: true });
var TelegramBot = require('node-telegram-bot-api');
var opt = { polling: true };
var bot = new TelegramBot(process.env.TOKEN, opt);
bot.on('polling_error', console.log);
const Bot = require('./Bot/Api');
const WPApiGet = new Bot();
const User = require('./Authlab/User');
const Conversion = require('./Conversion/Conversion');

const Buttons = require('./Buttons/Buttons')

// console.log('hi cron');
const schedule = require('node-schedule');

const job = schedule.scheduleJob('1 07 18 * * *', function() {
	console.log('The answer to life, the universe, and everything!');
	[643219013, 635152218].forEach((id) => {
		bot.sendMessage(id, '/st ninja-tables');
	});
});

class NinjaBotInit {
	constructor() {
		this.wpMenuButton();
		this.wpQueryRegister();
		this.otherActions();
		this.chatHandler();

	}

	static slugiFy(str) {
		return str.toString().toLowerCase();
	}

	wpMenuButton() {
		bot.onText(/\/download/, function onLoveText(msg) {
			const Button = new Buttons(msg.chat);
			const chatId = msg.chat.id;
			let docs = Button.downloadOptions()
			bot.sendMessage(chatId, docs.msg, docs.markup);
		});

		bot.onText(/\/active/, function onLoveText(msg) {
			const Button = new Buttons(msg.chat);
			const chatId = msg.chat.id;
			let docs = Button.activeOptions()
			bot.sendMessage(chatId, docs.msg, docs.markup);
		});

		bot.onText(/\/status/, function onLoveText(msg) {
			const Button = new Buttons(msg.chat);
			const chatId = msg.chat.id;
			let docs = Button.statusOptions()
			bot.sendMessage(chatId, docs.msg, docs.markup);
		});

		bot.on("callback_query", (res) => {
			const Button = new Buttons(res.message.chat);
			var docs = null;
			const chatId = res.message.chat.id;

			if (res.data === "status_check") {
				docs = Button.statusOptions()
			} else if (res.data === "download_check") {
				docs = Button.downloadOptions()
			} else if (res.data === "active_check") {
				docs = Button.activeOptions()
			} else if (res.data === "get_help") {
				docs = Button.helpOptions()
			}

			if (docs) {
				bot.answerCallbackQuery(res.id)
					.then(() => bot.sendMessage(chatId, docs.msg, docs.markup));
			}
		});
	}

	wpQueryRegister() {
		/*
		* download query
		*/
		 bot.onText(/\/dl (.+)/, async function(msg, match) {
			const chatId = msg.chat.id;
			try {
				const result = await WPApiGet.downloads(msg, match);
				let rep = 'Today (';
				for (let prop in result) {
					rep += prop + ')\n';
					rep += 'Downloads:    ' + result[prop];
				}
				bot.sendMessage(chatId, `===[${match[1]}]===\n\n` + rep);
			} catch (err) {
				bot.sendMessage(chatId, 'Oops! Please try another.');
			}
		});

		/*
		 * active query
		 */
		bot.onText(/\/ac (.+)/, async function(msg, match) {
			const chatId = msg.chat.id;
			try {
				const result = await WPApiGet.activeChart(msg, match);
			} catch (err) {
				bot.sendMessage(chatId, 'Oops! Please try another.');
			}
		});

		/*
		* Status query
		*/
		bot.onText(/\/st (.+)/, async function(msg, match) {
			const chatId = msg.chat.id;
			try {
				const result = await WPApiGet.status(msg, match);
				const {
					slug,
					version,
					author,
					requires,
					requires_php,
					rating,
					support_threads,
					support_threads_resolved,
					downloaded,
					tested,
					added,
					last_updated
				} = result;

				let str = author.split('">')[1];
				let authorName = str ? str.slice(0, -4) : str;

				var template = `====[ ${slug} ]====
				  Version : ${version}
				  Author : ${authorName}
				  Requires WP : ${requires}
				  Requires php : ${requires_php}
				  Rating : ${rating}%
				  Birthday 🎂: ${added}
				  Support threads : ${support_threads}
				  Support threads resolved : ${support_threads_resolved}
				  Downloaded : ${downloaded}
				  Tested : ${tested}
				  Last Updated : ${last_updated}`;

				bot.sendMessage(chatId, template);

				const recentDownload = await WPApiGet.downloads('', [
					'',
					slug
				]);
				let rep = 'Today (';
				for (let prop in recentDownload) {
					rep += prop + ') 👇\n';
					rep +=
						'Downloads:                  ' + recentDownload[prop];
				}
				bot.sendMessage(chatId, rep);
			} catch (err) {
				bot.sendMessage(chatId, 'Oops! Please try another.');
			}
		});

	}

	chatHandler() {
		bot.on('message', (msg) => {
			let isCommand = msg.text.indexOf('/') > -1;

			if (!isCommand) {
				let hi = 'hi';
				let bye = 'bye';
				if (msg.text.toString().toLowerCase().indexOf(hi) === 0) {
					bot.sendMessage(msg.chat.id, `Hello ${msg.chat.first_name}`);
				} else if (msg.text.toString().toLowerCase().includes(bye)) {
					bot.sendMessage(
						msg.chat.id,
						'Hope to see you around again , Bye 😊'
					);
				} else {
					// bot.sendChatAction(msg.chat.id, 'typing')
					const Chat = new Conversion(msg.chat);
					let txt = Chat.getMessage();
					console.log(txt, 'shamim');
				}
			}

		});
	}

	otherActions() {
		bot.onText(/\/authlab/, (msg, match) => {
			var url =
				'https://authlab.io/wp-content/uploads/2016/06/authlab_logo-1.png';
			bot.sendPhoto(
				msg.chat.id,
				url,
				{
					caption:
						'www.authlab.io\nWhere a band of geeks and nerds actualize your business ideas'
				},
				{ parse_mode: 'pre' }
			);
			bot.sendLocation(msg.chat.id, 24.90986066235793, 91.86431760739505);
		});

		// Matches /help
		bot.onText(/\/help/, function(msg) {
			const Button = new Buttons(msg.chat);
			const chatId = msg.chat.id;
			let docs = Button.helpOptions()
			bot.sendMessage(chatId, docs.msg, docs.markup);
		});

		bot.onText(/\/home*/, (msg) => {
			const opts = {
				reply_markup: JSON.stringify({
					keyboard: [
						['/status', '/download'],
						['/active', '/help'],
						['/notify', '/copyright'],
						[{ text: 'hi', callback_data: 'explore_user' }]
					]
				})
			};
			bot.sendMessage(
				msg.chat.id,
				`Hey ${msg.chat.first_name} 😁\nYou can check your wp.org plugin-status By asking me on text. 😎 Type or press /help for more query.`,
				opts
			);
		});

		bot.onText(/\/start/, (msg, match) => {
			const opts = {
				reply_markup: JSON.stringify({
					inline_keyboard: [
						[	{ text: 'Check Status', callback_data: 'status_check' },
							{ text: 'Check Active', callback_data: 'active_check' }
						],
						[	{ text: 'Check Download', callback_data: 'download_check' },
							{ text: 'Help', callback_data: 'get_help' }
						]
					]
				})
			};
			bot.sendMessage(
				msg.chat.id,
				`Hey ${msg.chat.first_name} 😁\nWelcome to WPNinja Bot😊 You can check your wp.org plugin-status By asking me on text. 😎 Type or press /help for more query.`,
				opts
			)
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

		bot.onText(/\/copyright/, function(msg) {
			bot.sendMessage(
				msg.chat.id,
				'===Developer===\n\nHasanuzzaman 😁\nVisit: www.hasanuzzaman.com\nText: @shamim0902'
			);
		});
	}
}

new NinjaBotInit();
