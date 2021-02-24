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
                        ['/st ninja-tables', '/download'],
                        ['/st fluent-smtp', '/active'],
                        ['/st wp-payment-form', '/chart'],
                        ['/st fluent-crm', '/help'],
                        ['/st ninja-charts', '/st wp-social-reviews'],
                        ['/st ninja-job-board', '/st fluentforms-pdf']
                    ]
                })
            },
            msg: "Type '/st your-plugin-slug'\nOr select from bellow menu 👇"
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
                        ['/dl fluent-smtp', '/active'],
                        ['/dl wp-payment-form', '/chart'],
                        ['/dl fluent-crm', '/help'],
                        ['/dl ninja-charts', '/dl wp-social-reviews'],
                        ['/dl ninja-job-board', '/dl fluentforms-pdf']
                    ]
                })
            },
            msg: "Type '/dl your-plugin-slug'\nOr select from bellow menu 👇"
        };
        return opts;
    }
    activeOptions() {
        var opts = {
            markup: {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['/ac fluentform', '/home 🏠'],
                        ['/ac ninja-tables', '/status'],
                        ['/ac fluent-smtp', '/download'],
                        ['/ac wp-payment-form', '/chart'],
                        ['/ac fluent-crm', '/help'],
                        ['/ac ninja-charts', '/ac wp-social-reviews'],
                        ['/ac ninja-job-board', '/ac fluentforms-pdf']
                    ]
                })
            },
            msg: "Type '/ac your-plugin-slug'\nOr select from bellow menu 👇"
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
                })
            },
            msg: "Type '/ch your-plugin-slug'\nOr select from bellow menu 👇"
        };
        return opts;
    }

    helpOptions() {
        var opts = {
            markup: {
                reply_markup: JSON.stringify({
                    keyboard: [
						['/status', '/download', '/home 🏠'],
                        ['/chart', '/active'],
						[
							'/st ninja-tables',
							'/st fluent-crm',
							'/st fluent-form'
						],
						['/authlab', '/copyright']
					]
                })
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
						['/alert fluentform', '/unsubscribe'],
                        ['/alert ninja-tables', '/subscriptions'],
                        ['/alert fluent-smtp', '/help'],
                        ['/alert fluent-crm', '/fluentforms-pdf'],
                        ['/alert ninja-charts', '/alert wp-payment-form'],
                        ['/alert ninja-job-board', '/alert wp-social-reviews']
					]
                })
            },
            msg: `Select from the menu to get notification everyday about ManageNinja's plugin. Or type\n/alert plugin-slug\nto set notification for specific plugin.\nYou can subscribe multiple plugins.`
        };
        return opts;
    }

    startsOptions() {
        var opts = {
            markup: {
                reply_markup: JSON.stringify({
					inline_keyboard: [
						[	{ text: '🧐 Status', callback_data: 'status_check' },
							{ text: 'Active', callback_data: 'active_check' }
						],
						[	{ text: '⬇️ Downloads', callback_data: 'download_check' },
							{ text: '🆘 Help', callback_data: 'get_help' }
						],
						[{ text: '🔔 Set Notifications', callback_data: 'get_notify' }]
					]
				})
            },
            msg: `Hey ${this.user.first_name} 😁\nGreeting from @wpninja_bot\nYou can check your wp.org plugin-status By asking me on text. 😎 Type or press /help for more query.`
        };
        return opts;
    }
}

module.exports = Buttons;
