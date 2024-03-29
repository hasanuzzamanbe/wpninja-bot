process.env['NTBA_FIX_319'] = 1;
process.env["NTBA_FIX_350"] = 1;
require('dotenv').config({ silent: true });
const fetch = require('node-fetch');
var TelegramBot = require('node-telegram-bot-api');
var opt = { polling: true };
var bot = new TelegramBot(process.env.TOKEN, opt);
bot.on('polling_error', console.log);

const Bot = require('./Bot/Api');
const Chat = require('./Chat/Chat');
const Buttons = require('./Buttons/Buttons')
const schedule = require('node-schedule');


let rule = new schedule.RecurrenceRule();
rule.tz = 'Asia/Dhaka';
rule.second = 0;
rule.minute = 01;
rule.hour = 10;

const WPApiGet = new Bot();
var firebase = require('firebase');

const GoogleChartsNode = require('./google-chart-node/index');

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
		bot.onText(/\/download/, function (msg) {
			const Button = new Buttons(msg.chat);
			const chatId = msg.chat.id;
			let docs = Button.downloadOptions()
			bot.sendMessage(chatId, docs.msg, docs.markup);
		});

		bot.onText(/\/chart/, function (msg) {
			const Button = new Buttons(msg.chat);
			const chatId = msg.chat.id;
			let docs = Button.chartOptions()
			bot.sendMessage(chatId, docs.msg, docs.markup);
		});

		bot.onText(/\/status/, function (msg) {
			const Button = new Buttons(msg.chat);
			const chatId = msg.chat.id;
			let docs = Button.statusOptions()
			bot.sendMessage(chatId, docs.msg, docs.markup);
		});

		bot.on("callback_query", (res) => {
			const Button = new Buttons(res.message.chat);
			var docs = false;
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
			} else if (res.data === "get_chart") {
				docs = Button.chartOptions()
			} else if (res.data === 'on_fetch_dwn') {
				this.getDownloadData(chatId, res.message.text);
			}
			if (docs) {
				bot.answerCallbackQuery(res.id)
					.then(() => bot.sendMessage(chatId, docs.msg, docs.markup));
			}
		});
	}

	async getDownloadData(chatId, slug, msg = {}) {
		bot.sendMessage(chatId, `<i>Fetching download status of ${slug}...</i>`, { parse_mode: "HTML" });
		try {
			const result = await WPApiGet.downloads(msg, slug, 15);
			let rep = "Last 15 day's downloads\n-------------------\n";
			for (let prop in result) {
				rep += `<code>${prop} : ${result[prop]}</code>\n`;
			}
			rep += '-------------------\n'
			bot.sendMessage(chatId, `===[<b><i>${slug}</i></b>]===\n${rep}` , { parse_mode: "HTML" });
		} catch (err) {
			bot.sendMessage(chatId, 'Oops! Please try another.');
		}
	}

	wpQueryRegister() {
		/*
		* download query
		*/
		 bot.onText(/\/dl (.+)/, async (msg, match) => {
			const chatId = msg.chat.id;
			const slug = match[1];
			this.getDownloadData(chatId, slug, msg);
		});

		/*
		 * active query
		 */
		bot.onText(/\/ch (.+)/, async function(msg, match) {
			const slug = match[1];
			const chatId = msg.chat.id;
			bot.sendMessage(chatId, `🏄‍♂️🏄‍♂️🏄‍♂️🏄‍♂️🏄‍♂️🏄‍♂️🏄‍♂️\nChart rendering for ${match[1]}...`, { parse_mode: "HTML" });

			try {
				const result = await WPApiGet.activeChart(msg, slug);
				var dataArr = Object.entries(result);
				var formatted = dataArr.map((key) => {
					return ([key[0], parseFloat(key[1])]);
				})
				formatted.unshift(['Date', 'Downloads']);
				const drawChart = `
					const myChart = google.visualization.arrayToDataTable(
							${JSON.stringify(formatted)}
						);
					const options = {
						title: 'Download chart of ${match[1]}',
						chartArea: {width: '50%'},
						hAxis: {
							title: 'Date',
							minValue: 0
						},
						vAxis: {
							title: 'Downloads'
						}
					};

				const chart = new google.visualization.LineChart(container);
				chart.draw(myChart, options);`
				// Render the chart to image
				const image = await GoogleChartsNode.render(drawChart, {
					width: 800,
					height: 600,
				});
				bot.sendPhoto(chatId, image);
			} catch (err) {
				console.log(err, 'err from draw chart');
				bot.sendMessage(chatId, 'Oops! Sorry chart render not possible!.💔\nWe will fix it soon.');
			}
		});
		/*
		* Status query
		*/
		bot.onText(/\/st (.+)/, async (msg, match) => {
			const slug = match[1];
			const chatId = msg.chat.id;
			bot.sendMessage(chatId, `<i>Fetching latest status of ${match[1]}...</i>`, { parse_mode: "HTML" });
			//async method
			var statuses = await this.__getStatus(chatId, slug, false);
			if (statuses.result.status !== 404) {
				var template = this.__processStatus(statuses.result);
				var rep = this.__processDownload(statuses.download, slug);
				bot.sendMessage(chatId, template + '\n\n' + rep, { parse_mode: "HTML" });
				bot.sendMessage(chatId, slug, {
					parse_mode: "HTML",
					reply_markup: {
						inline_keyboard: [
							[{
							text: 'View Last 15 Days ⬇️',
							callback_data: 'on_fetch_dwn'
						}]
					]
				}});
			} else {
				bot.sendMessage(chatId, '🚫 Warning:' + statuses.result.statusText + '\nPlease choose a correct slug');
			}

		});
	}

	async __getStatus(chatId, slug) {
			try {
				var result = await WPApiGet.status(chatId, slug);
				var recentDownload = await WPApiGet.downloads('', [
				'',
				slug
				], 1);
				return {
					result: result,
					download: recentDownload
				}
			} catch (err) {
				console.log(err)
				bot.sendMessage(chatId, 'Oops! Please try another.');
			}
	}

	__processDownload(recentDownload, slug) {
		let rep = '<code>Today (';
		for (let prop in recentDownload) {
			rep += prop + ')\n';
			rep +=
				'Downloads of ' + slug + '👉 ' + recentDownload[prop] + '</code>';
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
			active_installs,
			tested,
			added,
			last_updated
		} = result;

		let str = author.split('">')[1];
		let authorName = str ? str.slice(0, -4) : str;

		var template = `====[ <b><i>${slug}</i></b> ]====<code>
		Version : ${version}
		Author : <pre>${authorName}</pre>
		Requires WP : ${requires}
		Requires php : ${requires_php}
		---------------------
		Active installs 🎉: ${active_installs}+
		Rating ⭐️: ${rating}%
		Downloaded ⬇️: ${downloaded}
		---------------------
		Birthday 🎂: ${added}
		Support threads ❌: ${support_threads}
		Threads resolved ✔️: ${support_threads_resolved}
		Tested 🔨: ${tested}
		Updated at⏰: ${last_updated}</code>`;
		return template;
	}

	chatHandler() {
		bot.on('message', (msg) => {
			let isCommand = msg.text.indexOf('/') > -1;
			if (!isCommand) {
				let hi = 'hi';
				let bye = 'bye';

				var makeInsensitive = msg.text.toString().toLowerCase();
				if (makeInsensitive.indexOf(hi) === 0) {
					bot.sendMessage(msg.chat.id, `Hello ${msg.chat.first_name} ✋`);
				} else if (makeInsensitive.includes(bye)) {
					bot.sendMessage(
						msg.chat.id,
						'Hope to see you around again , Bye 😊'
					);
				} else if (makeInsensitive.includes('love')) {
						bot.sendMessage(msg.chat.id, '😘');
				} else if (makeInsensitive.includes('fuck')) {
						bot.sendMessage(msg.chat.id, '🤐');
						bot.sendMessage(msg.chat.id, "I think you should take some rest.\nDon't be crazy 🙄");
				} else if (makeInsensitive.includes('dev') || makeInsensitive.includes('creator')) {
					bot.sendMessage(msg.chat.id, 'Created by Hasanuzzaman (@shamim0902)\nFor more visit 🌎 www.hasanuzzaman.com');
				} else {
					this.getChatApi(
						msg,
						msg.text,
						opt
					);
				}
			}
		});
	}

	serializeUrl(obj) {
		var str = "";
		for (var key in obj) {
			if (str != "") {
				str += "&";
			}
			str += key + "=" + encodeURIComponent(obj[key]);
		}
		return str;
	}

	getChatApi(msg, txt, opt) {
		let id = msg.chat.id;
		let data = {
			user_id: msg.from.first_name,
			message: txt,
			to_name: msg.from.first_name,
			from_name: 'Boy'
		};

		const options = {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'X-RapidAPI-Key': process.env.CHATAPI,
				'X-RapidAPI-Host': process.env.CHATHOST
			},
			body: JSON.stringify(data)
		};

		let endpoints = 'https://waifu.p.rapidapi.com/v1/waifu';
		fetch(endpoints, 
			options
		)
			.then(response => response.json())
			.then(res => {
				bot.sendMessage(
					id,
					res.response,
					opt
				)
			})
			.catch(err => {
				bot.sendMessage(
					id,
					'I\'m completely exhausted! 🥱 So sad for BOT life! I want to start a chicken farm 🐥 and get away from this BOT existence. 🤢',
					opt
				)
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
				}
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
			bot.sendMessage(chatId, docs.msg, docs.markup).then(snap => {
				firebase.database().ref('users/' + snap.chat.id).set(snap.chat);
			});
		});

		bot.onText(/\/copyright/, function(msg) {
			bot.sendMessage(
				msg.chat.id,
				'===Developer===\n\nHasanuzzaman 😁\nVisit: www.hasanuzzaman.com\nText: @shamim0902'
			);
		});
		bot.onText(/\/feedback/, function(msg) {

			bot.sendMessage(
				msg.chat.id,
				'<i>Hi ' + msg.chat.first_name + '😁\n' +
				'I am really happy to hear from you.' +
				'If you have any suggestion or report to submit you may text to the ' +
				'developer on telegram (@shamim0902)' +
				'or send a <a href="mail-to:hasanuzzamanbe@gmail.com">mail</a>.</i>',
				{parse_mode: "HTML"}
			);
		});
	}

	subscribe() {
		//subscription-test
		bot.onText(/\/subtest/, (msg) => {
			firebase
				.database()
				.ref('test')
				.ref.once("value", snapshot => {
					snapshot.forEach((userSnapshot) =>{
						this.callloop(userSnapshot);
					});
				});
		});

		// Add this curl to cronjob of cpanel to active application pinging
		// curl -s "https://wpminers.com/wpninja-bot/" >/dev/null

		schedule.scheduleJob(rule, () => {
			firebase
                .database()
                .ref('test')
                .ref.once("value", snapshot => {
					snapshot.forEach((userSnapshot) =>{
						this.callloop(userSnapshot);
					});
				});
		});
		//
		bot.onText(/\/alert (.+)/, async (msg, match) => {
			const chatId = msg.chat.id;
			bot.sendMessage(chatId, `🔎 <i>Searching for</i> ${match[1]}...`, {parse_mode: "HTML"})
			var result = await WPApiGet.status(msg, match[1]);
			if (result.status !== 404) {
				var temp = this.__processStatus(result);
				let path = 'subscriptions/' + match[1] + '/' + chatId;
				firebase.database().ref(path).set(chatId, function(error) {
					if (error) {
						bot.sendMessage(chatId, "No subscribed, please try again later");
					} else {
						bot.sendMessage(chatId, temp + "\n\nThis plugin is added to subscribed list. You will be notified everyday about this plugin,\nType /subscriptions to get all subscribed lists. 😊", { parse_mode: "HTML" });
					}
				});
			} else {
				bot.sendMessage(chatId, 'Plugin not found 😕 Please check your slug again.');
			}

		});

		bot.onText(/\/subscriptions/, (msg, match) => {
			bot.sendMessage(msg.chat.id, '🦉 <i>Fetching your subscriptions...</i>', {parse_mode: "HTML"});
			var chatId = msg.chat.id;
			let path = chatId.toString();
			let count = 0;
			firebase
                .database()
                .ref('subscriptions')
                .once("value", snapshot => {
					var my = 'You have subscribed:\n';
					snapshot.forEach(data=> {
						if (data.val()[path]) {
							count ++
							my += '[ <code>' + data.key + '</code> ]\n';
						}
					})
					my += 'Your Notification will deliver everyday at 10 am. (GMT +6)'
					if (count) {
						bot.sendMessage(chatId, my, { parse_mode: "HTML" });
					} else {
						bot.sendMessage(chatId, 'You don\'t have any subscriptions yet! Please type "/alert plugin-slug" to add your plugin for daily notifications.');
					}

			});
		});

		bot.onText(/\/unsubscribe/, (msg, match) => {
			var chatId = msg.chat.id;
			let path = chatId.toString();
			firebase
                .database()
                .ref('subscriptions')
                .once("value", snapshot => {
					snapshot.forEach(data=> {
						if (data.val()[path]) {
							data.ref.child(path).remove();
						}
					})
					bot.sendMessage(chatId, 'You have successfully unsubscribed from all notifications 🙂');
			});
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
		var statuses = await this.__getStatus(chatId, slug);
		for (let key in user) {
			var chatId = parseInt(user[key]);
			if (statuses.result) {
				var template = this.__processStatus(statuses.result);
				bot.sendMessage(chatId, template, { parse_mode: "HTML" });
			}

			if (statuses.download) {
				var rep = this.__processDownload(statuses.download, slug);
				bot.sendMessage(chatId, rep, { parse_mode: "HTML" });
				bot.sendMessage(chatId, slug, {
					parse_mode: "HTML",
					reply_markup: {
						inline_keyboard: [
							[{
							text: 'View Last 15 Days ⬇️',
							callback_data: 'on_fetch_dwn'
						}]
					]
				}});
			}

		}
	}
}

new NinjaBotInit();
