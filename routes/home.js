const express = require('express');
const router = express.Router();
const discord = require('../bot');
const { ensureAuthenticated } = require('../auth/auth');
const dateformat = require('dateformat');
const config = require('../config/config.json');
const ver = require('../config/version.json');
const number = require('easy-number-formatter');
const jsonfile = require('jsonfile');

const themes = "./config/theme.json";

router.get('/', ensureAuthenticated, (req, res) => {
  res.redirect('/home');
});

router.get('/home', ensureAuthenticated, (req, res) => {
  const theme = jsonfile.readFileSync(themes);

  // No external request → just use local version.json
  const verL = ver.ver;

  res.render('home/home', {
    profile: req.user,
    client: discord.client,
    joinedDate: dateformat(`${discord.client.user.createdAt}`, 'dddd, mmmm dS, yyyy, h:MM TT'),
    prefix: config.prefix,
    number: number,
    Latestversion: verL,      // Always local version
    Currentversion: ver.ver,  // Same as local
    theme: theme
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged out');
  res.redirect('/login');
});

module.exports = router;
