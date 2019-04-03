const { GoogleToken } = require('gtoken');
import path from 'path';
const gtoken = new GoogleToken({
  keyFile: './secrets/key.json',
  scope: ['https://www.googleapis.com/auth/calendar'] // or space-delimited string of scopes
});

gtoken.getToken(function(err, token) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(token);
});