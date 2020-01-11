const express = require("express");
const app = express();
const PORT = process.env.PORT = 3000;
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

require('dotenv').config();

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_API_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.CALLBACK_URL,
});

router.get('/favicon.ico', (req, res) => {
  res.send("");
});
router.get('/', function (req, res) {
  res.json({
    'message': 'Ping Successfull'
  });
});
router.get('/login', function (req, res) {
  var scopes = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + process.env.SPOTIFY_API_ID +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(process.env.CALLBACK_URL));
});
router.get('/callback', async (req, res) => {
  const {
    code
  } = req.query;
  try {
    console.log(code);
    var data = await spotifyApi.authorizationCodeGrant(code);
    const {
      access_token,
      refresh_token
    } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    res.redirect('http://localhost:3000/home');
  } catch (err) {
    res.redirect('/#/error/invalid token');
  }
});
router.get('/home', (req, res) => {
  res.send("Logged In");
});

app.use('/', router);

app.listen(PORT, function () {
  console.log('Server is running at PORT:', PORT);
});

module.exports = router;