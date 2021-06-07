const expressJwt = require('express-jwt');

function authJwt() {
  const secret = process.env.secret;
  return expressJwt ({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/aidrequests(.*)/, methods: ['GET, POST'] },
      { url: /\/api\/v1\/users(.*)/, methods: ['GET, POST'] },
      '/api/v1/aidrequests',
      '/api/v1/users'
    ]
  })
}


//payload contains data from token
async function isRevoked(req, payload, done) {
 if(!payload.isAdmin) {
   done(null, true);
 }
 done();
}
module.exports = authJwt;