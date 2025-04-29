const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { register, login, googleLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const passport = require('passport');
const User = require('../models/User'); // Seu modelo de usuário

router.post(
  '/register',
  [
    check('username', 'Nome de usuário é obrigatório').not().isEmpty(),
    check('email', 'Por favor, inclua um email válido').isEmail(),
    check('password', 'Por favor, insira uma senha com 6 ou mais caracteres').isLength({ min: 6 })
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Por favor, inclua um email válido').isEmail(),
    check('password', 'Senha é obrigatória').exists()
  ],
  login
);

router.get('/me', protect, getMe);

// Importar estratégias
const TwitterStrategy = require('passport-twitter').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitchStrategy = require('passport-twitch-oauth2').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;

// Configurar serialização de usuário
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Configurar estratégia Twitter
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `${process.env.API_URL}/auth/twitter/callback`,
    includeEmail: true
  },
  async (token, tokenSecret, profile, done) => {
    try {
      // Verificar se o usuário já existe
      let user = await User.findOne({ 'social.twitter.id': profile.id });
      
      if (user) {
        // Atualizar token
        user.social.twitter.token = token;
        user.social.twitter.tokenSecret = tokenSecret;
        await user.save();
      } else {
        // Verificar se existe usuário com mesmo email
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (email) {
          user = await User.findOne({ email });
          
          if (user) {
            // Vincular conta social ao usuário existente
            user.social.twitter = {
              id: profile.id,
              username: profile.username,
              token,
              tokenSecret,
              profileUrl: `https://twitter.com/${profile.username}`
            };
            await user.save();
          }
        }
        
        // Se ainda não encontrou usuário, criar novo
        if (!user) {
          user = new User({
            username: profile.username,
            email: email,
            social: {
              twitter: {
                id: profile.id,
                username: profile.username,
                token,
                tokenSecret,
                profileUrl: `https://twitter.com/${profile.username}`
              }
            }
          });
          await user.save();
        }
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Configurar estratégia Instagram
passport.use(new InstagramStrategy({
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/auth/instagram/callback`,
    scope: ['user_profile', 'user_media']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Verificar se o usuário já existe
      let user = await User.findOne({ 'social.instagram.id': profile.id });
      
      if (user) {
        // Atualizar token
        user.social.instagram.token = accessToken;
        user.social.instagram.refreshToken = refreshToken;
        await user.save();
      } else {
        // Verificar se existe usuário com mesmo email
        if (profile.emails && profile.emails.length > 0) {
          const email = profile.emails[0].value;
          user = await User.findOne({ email });
          
          if (user) {
            // Vincular conta social ao usuário existente
            user.social.instagram = {
              id: profile.id,
              username: profile.username,
              token: accessToken,
              refreshToken,
              profileUrl: `https://instagram.com/${profile.username}`
            };
            await user.save();
          }
        }
        
        // Se ainda não encontrou usuário, criar novo
        if (!user) {
          user = new User({
            username: profile.username,
            email: profile.emails ? profile.emails[0].value : null,
            social: {
              instagram: {
                id: profile.id,
                username: profile.username,
                token: accessToken,
                refreshToken,
                profileUrl: `https://instagram.com/${profile.username}`
              }
            }
          });
          await user.save();
        }
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Configurar estratégia Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.API_URL}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email', 'link']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Verificar se o usuário já existe
      let user = await User.findOne({ 'social.facebook.id': profile.id });
      
      if (user) {
        // Atualizar token
        user.social.facebook.token = accessToken;
        await user.save();
      } else {
        // Verificar se existe usuário com mesmo email
        if (profile.emails && profile.emails.length > 0) {
          const email = profile.emails[0].value;
          user = await User.findOne({ email });
          
          if (user) {
            // Vincular conta social ao usuário existente
            user.social.facebook = {
              id: profile.id,
              name: profile.displayName,
              token: accessToken,
              profileUrl: profile.profileUrl || `https://facebook.com/${profile.id}`
            };
            await user.save();
          }
        }
        
        // Se ainda não encontrou usuário, criar novo
        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails ? profile.emails[0].value : null,
            social: {
              facebook: {
                id: profile.id,
                name: profile.displayName,
                token: accessToken,
                profileUrl: profile.profileUrl || `https://facebook.com/${profile.id}`
              }
            }
          });
          await user.save();
        }
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Configurar estratégia Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/auth/google/callback`,
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Verificar se o usuário já existe
      let user = await User.findOne({ 'social.google.id': profile.id });
      
      if (user) {
        // Atualizar token
        user.social.google.token = accessToken;
        user.social.google.refreshToken = refreshToken;
        await user.save();
      } else {
        // Verificar se existe usuário com mesmo email
        if (profile.emails && profile.emails.length > 0) {
          const email = profile.emails[0].value;
          user = await User.findOne({ email });
          
          if (user) {
            // Vincular conta social ao usuário existente
            user.social.google = {
              id: profile.id,
              name: profile.displayName,
              token: accessToken,
              refreshToken,
              email: email
            };
            await user.save();
          }
        }
        
        // Se ainda não encontrou usuário, criar novo
        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails ? profile.emails[0].value : null,
            social: {
              google: {
                id: profile.id,
                name: profile.displayName,
                token: accessToken,
                refreshToken,
                email: profile.emails ? profile.emails[0].value : null
              }
            }
          });
          await user.save();
        }
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Configurar estratégia Twitch
passport.use(new TwitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/auth/twitch/callback`,
    scope: 'user:read:email user:read:follows'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Verificar se o usuário já existe
      let user = await User.findOne({ 'social.twitch.id': profile.id });
      
      if (user) {
        // Atualizar token
        user.social.twitch.token = accessToken;
        user.social.twitch.refreshToken = refreshToken;
        await user.save();
      } else {
        // Verificar se existe usuário com mesmo email
        if (profile.email) {
          user = await User.findOne({ email: profile.email });
          
          if (user) {
            // Vincular conta social ao usuário existente
            user.social.twitch = {
              id: profile.id,
              username: profile.login,
              displayName: profile.display_name,
              token: accessToken,
              refreshToken,
              profileUrl: `https://twitch.tv/${profile.login}`
            };
            await user.save();
          }
        }
        
        // Se ainda não encontrou usuário, criar novo
        if (!user) {
          user = new User({
            username: profile.display_name || profile.login,
            email: profile.email,
            social: {
              twitch: {
                id: profile.id,
                username: profile.login,
                displayName: profile.display_name,
                token: accessToken,
                refreshToken,
                profileUrl: `https://twitch.tv/${profile.login}`
              }
            }
          });
          await user.save();
        }
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Configurar estratégia Discord
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/auth/discord/callback`,
    scope: ['identify', 'email']
  }, 
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Verificar se o usuário já existe
      let user = await User.findOne({ 'social.discord.id': profile.id });
      
      if (user) {
        // Atualizar token
        user.social.discord.token = accessToken;
        await user.save();
      } else {
        // Verificar se existe usuário com mesmo email
        if (profile.email) {
          user = await User.findOne({ email: profile.email });
          
          if (user) {
            // Vincular conta social ao usuário existente
            user.social.discord = {
              id: profile.id,
              username: profile.username,
              discriminator: profile.discriminator,
              token: accessToken,
              avatar: profile.avatar
            };
            await user.save();
          }
        }
        
        // Se ainda não encontrou usuário, criar novo
        if (!user) {
          user = new User({
            username: `${profile.username}#${profile.discriminator}`,
            email: profile.email,
            social: {
              discord: {
                id: profile.id,
                username: profile.username,
                discriminator: profile.discriminator,
                token: accessToken,
                avatar: profile.avatar
              }
            }
          });
          await user.save();
        }
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Rotas para Twitter
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    // Cookies para analytics
    res.cookie('social_connected', 'twitter', { maxAge: 900000 });
    res.redirect('/profile?social=twitter');
  }
);

// Rotas para Instagram
router.get('/instagram', passport.authenticate('instagram'));
router.get('/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  (req, res) => {
    res.cookie('social_connected', 'instagram', { maxAge: 900000 });
    res.redirect('/profile?social=instagram');
  }
);

// Rotas para Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'user_likes'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.cookie('social_connected', 'facebook', { maxAge: 900000 });
    res.redirect('/profile?social=facebook');
  }
);

// Rotas para Google
router.get('/google', passport.authenticate('google'));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.cookie('social_connected', 'google', { maxAge: 900000 });
    res.redirect('/profile?social=google');
  }
);

// Rotas para Twitch
router.get('/twitch', passport.authenticate('twitch'));
router.get('/twitch/callback',
  passport.authenticate('twitch', { failureRedirect: '/login' }),
  (req, res) => {
    res.cookie('social_connected', 'twitch', { maxAge: 900000 });
    res.redirect('/profile?social=twitch');
  }
);

// Rotas para Discord
router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => {
    res.cookie('social_connected', 'discord', { maxAge: 900000 });
    res.redirect('/profile?social=discord');
  }
);

// Rota para desconectar uma rede social
router.post('/disconnect/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const userId = req.user.id;
    
    // Verificar se plataforma é válida
    const validPlatforms = ['twitter', 'instagram', 'facebook', 'google', 'twitch', 'discord'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: 'Plataforma inválida' });
    }
    
    // Buscar usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Remover informações da rede social
    if (user.social && user.social[platform]) {
      user.social[platform] = undefined;
      await user.save();
    }
    
    res.json({ success: true, message: `Conta ${platform} desconectada com sucesso` });
  } catch (error) {
    console.error('Erro ao desconectar rede social:', error);
    res.status(500).json({ error: 'Erro ao desconectar rede social' });
  }
});

// Rota para obter dados sociais do usuário
router.get('/social-data', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Preparar resposta com informações seguras (sem tokens)
    const socialConnections = {};
    
    // Twitter
    if (user.social && user.social.twitter) {
      socialConnections.twitter = {
        connected: true,
        username: user.social.twitter.username,
        profileUrl: user.social.twitter.profileUrl
      };
    }
    
    // Instagram
    if (user.social && user.social.instagram) {
      socialConnections.instagram = {
        connected: true,
        username: user.social.instagram.username,
        profileUrl: user.social.instagram.profileUrl
      };
    }
    
    // Facebook
    if (user.social && user.social.facebook) {
      socialConnections.facebook = {
        connected: true,
        name: user.social.facebook.name,
        profileUrl: user.social.facebook.profileUrl
      };
    }
    
    // Google
    if (user.social && user.social.google) {
      socialConnections.google = {
        connected: true,
        name: user.social.google.name,
        email: user.social.google.email
      };
    }
    
    // Twitch
    if (user.social && user.social.twitch) {
      socialConnections.twitch = {
        connected: true,
        username: user.social.twitch.username,
        displayName: user.social.twitch.displayName,
        profileUrl: user.social.twitch.profileUrl
      };
    }
    
    // Discord
    if (user.social && user.social.discord) {
      socialConnections.discord = {
        connected: true,
        username: user.social.discord.username,
        discriminator: user.social.discord.discriminator
      };
    }
    
    res.json({ socialConnections });
  } catch (error) {
    console.error('Erro ao obter dados sociais:', error);
    res.status(500).json({ error: 'Erro ao obter dados sociais' });
  }
});

module.exports = router;