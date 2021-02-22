process.env['NTBA_FIX_319'] = 1;
require('dotenv').config({ silent: true });
var TelegramBot = require('node-telegram-bot-api');
var opt = { polling: true };
var bot = new TelegramBot(process.env.TOKEN, opt);
bot.on('polling_error', console.log);

const Bot = require('./Bot/Api');
const Chat = require('./Chat/Chat');
const Buttons = require('./Buttons/Buttons')
const schedule = require('node-schedule');
const WPApiGet = new Bot();
var firebase = require('firebase');

class NinjaBotInit {
	constructor() {
		this.wpMenuButton();
		this.wpQueryRegister();
		this.otherActions();
		this.chatHandler();
		this.subscribe();
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
			} else if (res.data === "get_notify") {
				docs = Button.notifyOptions()
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
			const slug = match[1];
			try {
				const result = await WPApiGet.downloads(msg, slug);
				let rep = 'Today (';
				for (let prop in result) {
					rep += prop + ')\n';
					rep += 'Downloads:    ' + result[prop];
				}
				bot.sendMessage(chatId, `===[${slug}]===\n\n` + rep);
			} catch (err) {
				bot.sendMessage(chatId, 'Oops! Please try another.');
			}
		});

		/*
		 * active query
		 */
		bot.onText(/\/ac (.+)/, async function(msg, match) {
			const slug = match[1];
			const chatId = msg.chat.id;
			try {
				const result = await WPApiGet.activeChart(msg, slug);
			} catch (err) {
				bot.sendMessage(chatId, 'Oops! Please try another.');
			}
		});

		/*
		* Status query
		*/
		bot.onText(/\/st (.+)/, async (msg, match) => {
			const slug = match[1];
			const chatId = msg.chat.id;

			//async method
			var statuses = await this.__getStatus(chatId, slug, false);
			var template = this.__processStatus(statuses.result);
			var rep = this.__processDownload(statuses.download, slug);
			bot.sendMessage(chatId, template + '\n\n' + rep);
		});
	}

	async __getStatus(chatId, slug, hasVal = false) {
		var has = hasVal;
			try {
				if (!has) {
					var result = await WPApiGet.status(chatId, slug);
					var recentDownload = await WPApiGet.downloads('', [
						'',
						slug
					]);
					return {
						result: result,
						download: recentDownload
					}
				} else {
					return {
						result: null,
						download: null
					}
				}
			} catch (err) {
				console.log(err)
				bot.sendMessage(chatId, 'Oops! Please try another.');
			}
	}

	__processDownload(recentDownload, slug) {
		let rep = 'Today (';
		for (let prop in recentDownload) {
			rep += prop + ')\n';
			rep +=
				'Downloads of ' + slug + '👉 ' + recentDownload[prop];
		}
		return rep;
	}

	__processStatus(result) {
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
		return template;
	}

	chatHandler() {
		bot.on('message', (msg) => {
			let isCommand = msg.text.indexOf('/') > -1;
			if (!isCommand) {
				let hi = 'hi';
				let bye = 'bye';
				if (msg.text.toString().toLowerCase().indexOf(hi) === 0) {
					bot.sendMessage(msg.chat.id, `Hello ${msg.chat.first_name} ✋`);
				} else if (msg.text.toString().toLowerCase().includes(bye)) {
					bot.sendMessage(
						msg.chat.id,
						'Hope to see you around again , Bye 😊'
					);
				} else if (msg.text.toString().toLowerCase().includes('love')) {
						bot.sendMessage(msg.chat.id, '😘');
				} else if (msg.text.toString().toLowerCase().includes('fuck')) {
						bot.sendMessage(msg.chat.id, '🤐');
						bot.sendMessage(msg.chat.id, "I think you should take some rest.\nDon't be crazy 🙄");
				} else if (msg.text.toString().toLowerCase().includes('dev')) {
					bot.sendMessage(msg.chat.id, 'His name is Hasanuzzaman (@shamim0902)\nFor more visit 🌎 www.hasanuzzaman.com');
				} else {
					const ChatInstance = new Chat(msg);
					let txt = ChatInstance.getMessage();
					let opt = (new Buttons(msg.chat)).helpOptions().markup;
					bot.sendMessage(
						msg.chat.id,
						txt,
						opt
					)
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
			const Button = new Buttons(msg.chat);
			const chatId = msg.chat.id;
			let docs = Button.startsOptions()
			bot.sendMessage(chatId, docs.msg, docs.markup);
		});

		bot.onText(/\/start/, (msg, match) => {
			const Button = new Buttons(msg.chat);
			const chatId = msg.chat.id;
			let docs = Button.startsOptions()
			bot.sendMessage(chatId, docs.msg, docs.markup);
		});

		bot.onText(/\/copyright/, function(msg) {
			bot.sendMessage(
				msg.chat.id,
				'===Developer===\n\nHasanuzzaman 😁\nVisit: www.hasanuzzaman.com\nText: @shamim0902'
			);
		});
	}

	subscribe() {
		schedule.scheduleJob('01 02 22 * * *', () => {
			console.log('cron-called')
			firebase
                .database()
                .ref()
				// .orderByChild("uid").equalTo('643219013')
                .ref.on("value", snapshot => {
					snapshot.forEach((userSnapshot) =>{
						this.callloop(userSnapshot);
					});

				});
		});
		//
		bot.onText(/\/alert (.+)/, (msg, match) => {
			let path = match[1];
			firebase
                .database()
                .ref(path)
				// .child('643219013')
                // .once("value")  //for read
				.push(msg.chat.id) //for write arup- 1340249975
			// .then(data => {console.log(data)})
		});

		bot.onText(/\/subscriptions/, (msg, match) => {
			// firebase
            //     .database()
            //     .ref()
			// 	// .orderByChild("uid").equalTo('643219013')
            //     .ref.on("value", snapshot => {
			// 		snapshot.forEach( (userSnapshot) =>{

			// 			//  this.callloop(userSnapshot);

			// 		});
			// 	});
			bot.sendMessage(msg.chat.id, 'I am working on this feature...');
		});



		bot.onText(/\/notify*/, (msg) => {
			const Button = new Buttons(msg.chat);
			const chatId = msg.chat.id;
			let docs = Button.notifyOptions()
			bot.sendMessage(chatId, docs.msg, docs.markup);
		});
	}

	async callloop(userSnapshot) {
		let slug = userSnapshot.key; //fluentform
		let user = userSnapshot.val();
		var hasVal = false;
		for (let key in user) {
			var chatId = parseInt(user[key]);
			console.log(chatId)
			var statuses = await this.__getStatus(chatId, slug);
			// hasVal = true;
			if (statuses.result) {
				var template = this.__processStatus(statuses.result);
				bot.sendMessage(chatId, template);
			}

			if (statuses.recentDownload) {
				var rep = this.__processDownload(statuses.recentDownload, slug);
				bot.sendMessage(chatId, rep);
			}

		}
	}
}

new NinjaBotInit();
