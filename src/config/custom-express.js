require('marko/node-require').install();
require('marko/express');

const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const app = express();

    app.use('/estatico', express.static('src/app/public'));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
          var method = req.body._method;
          delete req.body._method;
          return method;
        }
      }));

      const sessaoAutenticacao = require('./sessao-autenticacao');
      sessaoAutenticacao(app);

    consign()
        .include('/src/app/rotas')
        .into(app);

        app.use(function (req, res, next) {
          return res.status(404).marko(
              require('../app/views/layouts/base/erros/404.marko')
              );
          });
          
        app.use(function (erro, req, res, next) {
            return res.status(500).marko(
                require('../app/views/layouts/base/erros/500.marko')
                );
          });

module.exports = app;