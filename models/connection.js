const mongoose = require('mongoose');

require('dotenv').config();
const KEY_DB = process.env.REACT_APP_KEY;
const NAME_DB = process.env.REACT_APP_NAME;

/* ----- My DB ------ */

const dbUrl = `mongodb+srv://${NAME_DB}:${KEY_DB}@cluster0-mza1q.mongodb.net/morningnews?retryWrites=truew=majority`;
/* --------------------- */

/* ----- DB Options ------ */
const options = {
	connectTimeoutMS: 5000,
	useNewUrlParser: true
};

mongoose.connect(dbUrl, options, (error) => {
	if (error) {
		console.error(error);
	} else {
		console.log('Your database is operational...');
	}
});

module.exports = mongoose;
