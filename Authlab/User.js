class User {
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
			case 'arup_rd':
				txt = `Hey ${this.user.first_name} 😄\nWhat a busy day 🙈`;
				break;
			case 'csesumonpro':
				txt = `Hey ${this.user.first_name} 😄\nOMG you are pro 😳`;
				break;
			case 3:
				txt = `Hey ${this.user.first_name} 😄\n`;
				break;
			case 4:
				txt = `Hey ${this.user.first_name} 😄\n`;
				break;
			case 5:
				txt = `Hey ${this.user.first_name} 😄\n`;
				break;
			case 6:
				txt = `Hey ${this.user.first_name} 😄\n`;
                case 'shamim0902':
				txt = `Hey ${this.user.first_name} 😄\n`;
				break;
			case 7:
				txt = `Hey ${this.user.first_name} 😄\n`;
				break;
			case 8:
				txt = `Hey ${this.user.first_name} 😄\n`;
				break;
			case 9:
				txt = `Hey ${this.user.first_name} 😄\n`;
				break;
			case 10:
				txt = `Hey ${this.user.first_name} 😄\n`;
				break;
			case 11:
				txt = `Hey ${this.user.first_name} 😄\n`;
				break;
			case 12:
				txt = `Hey ${this.user.first_name} 😄\n`;
            default:
                txt = `Hey ${this.user.first_name} 😄\nHappy to hear from you!🤗`
		}

		return txt;
	}
}

module.exports = User;
