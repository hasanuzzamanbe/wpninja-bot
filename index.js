require('./bot');
require('./web');

var firebase = require('firebase');
firebase.initializeApp({
	apiKey: 'AIzaSyDGkfc1WMiAOAlrrTEr6ZVMspReimmJ1Lc',
	authDomain: 'wpninja-bot.firebaseapp.com',
	databaseURL: 'https://wpninja-bot-default-rtdb.firebaseio.com',
	projectId: 'wpninja-bot',
	storageBucket: 'wpninja-bot.appspot.com',
	messagingSenderId: '582073423916',
	appId: '1:582073423916:web:419ec627e690aed8451989',
	measurementId: 'G-WEDMJ7T5GJ'
});
