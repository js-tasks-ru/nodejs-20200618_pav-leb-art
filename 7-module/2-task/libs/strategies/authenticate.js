const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  // console.log(arguments)
  if(!email) {
    return done(null, false, `Не указан email`)
  };

  const user = await User.findOne({ email });
  
  if(!user) {
    const newUser = new User({
      email,
      displayName
    });

    const error = newUser.validateSync();
    if(error) return done(error);

    await newUser.save()

    return done(null, newUser);
  };

  done(null, user);
};
