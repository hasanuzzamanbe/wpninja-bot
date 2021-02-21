class Chat {
	constructor(info) {
		this.user = info;
	}

	getMessage() {
		// return this.user.last_name;
		var txt = '';
		switch (this.user.username) {
			case 'shamim0902':
				txt = `Hey ${this.user.chat.first_name} 😄\nThanks for developing me,But it's very weird to hear nasty things from people 🤨`;
				break;
            default:
                txt = `Hey ${this.user.chat.first_name} 😄\nHappy to hear from you! But I am not trained enough. And I can only follow some available commands.🤗`
		}
		return txt;
	}
}

module.exports = Chat;
