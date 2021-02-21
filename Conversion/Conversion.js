class Conversion {
	constructor(info) {
		this.user = info;
	}

	getMessage() {
		// return this.user.last_name;
		var txt = '';
		switch (this.user.username) {
			case 'shamim0902':
				txt = `Hey ${this.user.first_name} 😄\nThanks for developing me,But it's very weird to hear nasty things from people 🤨`;
				break;
            default:
                txt = `Hey ${this.user.first_name} 😄\nHappy to hear from you!🤗`
		}

		return txt;
	}
}

module.exports = Conversion;
