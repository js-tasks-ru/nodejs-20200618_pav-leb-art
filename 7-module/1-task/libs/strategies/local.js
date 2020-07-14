const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');
const {
	use
} = require('chai');

module.exports = new LocalStrategy({
		usernameField: 'email',
		session: false
	},
	async function (email, password, done) {
		await User.findOne({
				email
			},
			async function (err, user) {

				// error check
				if (err) {
					return done(err);
				};

				// user exist check
				if (!user) {
					return done(null, false, "Нет такого пользователя");
				};

				// password check
				let flag = await user.checkPassword(password)
				if (!flag) {
					return done(null, false, "Неверный пароль");
				}

				// success
				return done(null, user);
			});
	}
);