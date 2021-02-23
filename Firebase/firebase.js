require('dotenv').config({ silent: true });

var firebase = require('firebase');
var initApp = {
	apiKey: process.env.FIREBASE_API,
	authDomain: process.env.FIREBASE_AUTHDOMAIN,
	databaseURL: process.env.FIREBASE_DBURL,
	projectId: process.env.FIREBASE_PR_ID,
	// storageBucket: process.env.FIREBASE_STR_BUCKET,
	messagingSenderId: process.env.FIREBASE_MSG_SEN_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MEA_ID
}
firebase.initializeApp(initApp);
