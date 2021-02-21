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
                        ['/st fluent-crm', '/help'],
                        ['/st ninja-charts', '/st wp-payment-form'],
                        ['/st ninja-job-board', '/st wp-social-reviews']
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
                        ['/dl fluent-crm', '/help'],
                        ['/dl ninja-charts', '/dl wp-payment-form'],
                        ['/dl ninja-job-board', '/dl wp-social-reviews']
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
                        ['/ac ninja-tables', '/download'],
                        ['/ac fluent-smtp', '/status'],
                        ['/ac fluent-crm', '/help'],
                        ['/ac ninja-charts', '/ac wp-payment-form'],
                        ['/ac ninja-job-board', '/ac wp-social-reviews']
                    ]
                })
            },
            msg: "Type '/ac your-plugin-slug'\nOr select from bellow menu 👇"
        };
        return opts;
    }
    helpOptions() {
        var opts = {
            markup: {
                reply_markup: JSON.stringify({
                    keyboard: [
						['/status', '/download', '/home 🏠'],
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
