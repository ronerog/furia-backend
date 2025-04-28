const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id).select('-password');
      
      if (user) {
        return done(null, user);
      }
      
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Verificar se o usuário já existe
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          return done(null, user);
        }
        
        // Se não existir, criar novo usuário
        const username = profile.displayName.replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
        
        user = new User({
          username,
          email: profile.emails[0].value,
          fullName: profile.displayName,
          googleId: profile.id,
          // Gerar senha aleatória (não será usada)
          password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
        });
        
        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

module.exports = passport;