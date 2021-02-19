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
						['/dl fluent-smtp', '/help'],
						['/status', '/active']
					]
				})
			};
			bot.sendMessage(
				msg.chat.id,
				'Type "/dl your-plugin-slug" \nOr select from bellow',
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
						['/ac fluent-smtp', '/help'],
						['/status', '/download']
					]
				})
			};
			bot.sendMessage(
				msg.chat.id,
				'Type "/ac your-plugin-slug" \nOr select from bellow',
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
						['/st fluent-smtp', '/help'],
						['/active', '/download']
					]
				})
			};
			bot.sendMessage(
				msg.chat.id,
				'Type "/st your-plugin-slug" \nOr select from bellow',
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
			try {
				const result = await BotInstance.downloads(msg, match);
				let rep = 'Today (';
				for (let prop in result) {
					rep += prop + ')\n';
					rep += 'Downloads:    ' + result[prop];
				}
			bot.sendMessage(chatId, `===[${match[1]}]===\n\n` + rep);
			}catch (err) {
				bot.sendMessage(
					chatId,
					'Oops! Please try another.'
				);
			}

		});

		/*
		 * active query
		 */
		bot.onText(/\/ac (.+)/, async function(msg, match) {
			const chatId = msg.chat.id;
			try {
				const result = await BotInstance.activeChart(msg, match);
				console.log(result);
			} catch (err) {
				bot.sendMessage(
					chatId,
					'Oops! Please try another.'
				);
			}

		});

		/*
		 * Status query
		 */
		bot.onText(/\/st (.+)/, async function(msg, match) {
			const chatId = msg.chat.id;
			try {
				const result = await BotInstance.status(msg, match);
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

				  var template =
				  `====[ ${slug} ]====
				  Version : ${version}
				  Author : ${authorName}
				  Birthday 🎂: ${added}
				  Requires WP : ${requires}
				  Requires php : ${requires_php}
				  Rating : ${rating}
				  Support threads : ${support_threads}
				  Support threads resolved : ${support_threads_resolved}
				  Downloaded : ${downloaded}
				  Tested : ${tested}
				  Last Updated : ${last_updated}`;

				bot.sendMessage(
					chatId,
					template
				);

				const recentDownload = await BotInstance.downloads('', ['', slug]);
				let rep = 'Today (';
				for (let prop in recentDownload) {
					rep += prop + ') 👇\n';
					rep += 'Downloads:                  ' + recentDownload[prop];
				}
				bot.sendMessage(chatId, rep);


			} catch (err) {
				bot.sendMessage(
					chatId,
					'Oops! Please try another.'
				);
			}
		});

		/*
		 * logo query
		 */
		bot.onText(/\/logo (.+)/, (msg, match) => {
			var slug = this.slugiFy(match[1]);
			var url = `https://ps.w.org/${slug}/assets/icon-256x256.png`;
			bot.sendPhoto(msg.chat.id, url);
		});

		/*
		 * authlab query
		 */
		bot.onText(/\/authlab/, (msg, match) => {
			var url =
				'https://authlab.io/wp-content/uploads/2016/06/authlab_logo-1.png';
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
						['/status', '/download', '/active'],
						[
							'/st ninja-tables',
							'/st fluent-crm',
							'/st fluent-form'
						],
						['/authlab', '/love', '/copyright'],

					]
				})
			};
			bot.sendMessage(
				msg.chat.id, "Available commands: \n/status \n/download \n/active \n/authlab\n/love \n/help\n/start\n/st your-plugin-slug\nThere are some examples!", opts
			);
		});

		bot.onText(/\/start/, (msg) => {
			const opts = {
				reply_markup: JSON.stringify({
					keyboard: [
						['/status', '/download'],
						['/active', '/help'],
						['/notify', '/copyright']
					]
				})
			};
			bot.sendMessage(
				msg.chat.id,
				'Welcome to WPNinja Bot😊 You can check your wp.org plugin-status By asking me on text. 😎 Type or press /help for more query.',
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


		bot.onText(/\/copyright/, function(msg) {
			bot.sendMessage(msg.chat.id, '===Developer===\n\nHasanuzzaman 😁\nVisit: www.hasanuzzaman.com\nText: @shamim0902');
		});

	}
}

new NinjaBotInit();
