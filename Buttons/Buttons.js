class Buttons {
	constructor(info) {
		this.user = info;
	}
	statusOptions() {
		var opts = {
			markup: {
				reply_markup: JSON.stringify({
					keyboard: [
						['/st fluentform', '/home 🏠'],
						['/st ninja-tables', '/downloads'],
						['/st fluent-smtp', '/chart'],
						['/st wp-payment-form', '/status'],
						['/st fluent-crm', '/help'],
						['/st ninja-charts', '/st wp-social-reviews'],
						['/st ninja-job-board', '/st fluentforms-pdf']
					]
				}),
				parse_mode: 'HTML'
			},
			msg: 'Type <pre>/st your-plugin-slug</pre>\nTo get all status, Some popular plugins are showing bellow menu as suggestion 👇'
		};
		return opts;
	}

	downloadOptions() {
		var opts = {
			markup: {
				reply_markup: JSON.stringify({
					keyboard: [
						['/dl fluentform', '/home 🏠'],
						['/dl ninja-tables', '/status'],
						['/dl fluent-smtp', '/chart'],
						['/dl wp-payment-form', '/help'],
						['/dl fluent-crm', '/dl wp-social-reviews'],
						['/dl ninja-charts', '/dl fluentforms-pdf'],
						['/dl ninja-job-board']
					]
				}),
				parse_mode: 'HTML'
			},
			msg: 'Type <pre>/dl your-plugin-slug</pre>\nTo get recent download status, Some popular plugins are showing bellow menu as suggestion 👇'
		};
		return opts;
	}

	chartOptions() {
		var opts = {
			markup: {
				reply_markup: JSON.stringify({
					keyboard: [
						['/ch fluentform', '/home 🏠'],
						['/ch ninja-tables', '/status'],
						['/ch fluent-smtp', '/download'],
						['/ch wp-payment-form', '/chart'],
						['/ch fluent-crm', '/help'],
						['/ch ninja-charts', '/ch wp-social-reviews'],
						['/ch ninja-job-board', '/ch fluentforms-pdf']
					]
				}),
				parse_mode: 'HTML'
			},
			msg: 'Type <code><b>/ch your-plugin-slug</b></code>\nTo get active growth chart, Some popular plugins are showing bellow menu as suggestion 👇'
		};
		return opts;
	}

	helpOptions() {
		var opts = {
			markup: {
				reply_markup: JSON.stringify({
					keyboard: [
						['/status', '/download', '/home 🏠'],
						['/chart', '/help'],
						[
							'/st ninja-tables',
							'/st fluent-crm',
							'/st fluent-form'
						],
						['/copyright', '/feedback']
					]
				}),
				parse_mode: 'HTML'
			},
			msg: `Don't worry ${this.user.first_name} 😊\nI am here to help you.\nPlease select from bellow menu 👇`
		};
		return opts;
	}

	notifyOptions() {
		var opts = {
			markup: {
				reply_markup: JSON.stringify({
					keyboard: [
						['/home 🏠'],
						['/test-subscriptions'],
						['/alert fluentform', '/unsubscribe'],
						['/alert ninja-tables', '/subscriptions'],
						['/alert fluent-smtp', '/help'],
						['/alert fluent-crm', '/fluentforms-pdf'],
						['/alert ninja-charts', '/alert wp-payment-form'],
						['/alert ninja-job-board', '/alert wp-social-reviews']
					]
				}),
				parse_mode: 'HTML'
			},
			msg: `Type\n<code>/alert plugin-slug</code>\nto set notification for specific plugin.\nYou can subscribe multiple plugins.`
		};
		return opts;
	}

	startsOptions() {
		var opts = {
			markup: {
				reply_markup: JSON.stringify({
					inline_keyboard: [
						[
							{
								text: '🧐 Status',
								callback_data: 'status_check'
							},
							{
								text: '⬇️ Downloads',
								callback_data: 'download_check'
							}
						],
						[
							{ text: '📈 Growth', callback_data: 'get_chart' },
							{ text: '🆘 Help', callback_data: 'get_help' }
						],
						[
							{
								text: '🔔 Notifications',
								callback_data: 'get_notify'
							}
						]
					]
				}),
				parse_mode: 'HTML'
			},
			msg: `Hey ${this.user.first_name} 😁\nGreeting from @wpninja_bot\nYou can check your wp.org plugin-status By asking me on text. 😎 Type or press /help for more query.`
		};
		return opts;
	}
}

module.exports = Buttons;
