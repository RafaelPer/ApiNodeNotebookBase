const express    = require('express');
const bodyParser = require('body-parser');
const config     = require('config');
const consign = require('consign');

module.exports = () => {
  const app = express();

  // SETANDO VARIAVEIS DA APLICAÇÃO
  app.set('port', process.env.PORT || config.get('server.port'));

  // MIDDLEWARES
  app.use(
    bodyParser.json(),
    function(req, res, next){ 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, Access-Control-Allow-Headers, Authorization");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
    next();
    }
  );

  consign({cwd: 'api'}).then('data').then('controllers').then('routes').into(app)

  return app;
};
