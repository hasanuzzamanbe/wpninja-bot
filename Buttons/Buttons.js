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
            msg: "Type '/st your-plugin-slug'\nOr select from bellow"
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
            msg: "Type '/dl your-plugin-slug'\nOr select from bellow menu"
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
            msg: "Type '/ac your-plugin-slug'\nOr select from bellow menu"
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
						['/authlab', '/love', '/copyright']
					]
                })
            },
            msg: `Don't worry ${this.user.first_name} 😊\nI am here to help you. Please select from bellow menu.`
        };
        return opts;
    }
}

module.exports = Buttons;
