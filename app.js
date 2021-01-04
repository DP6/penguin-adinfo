require('dotenv').config({ path: __dirname + '/.env' });

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const fileUpload = require('express-fileupload');

const app    = express();

app.use(fileUpload({
  createParentPath: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  'allowedHeaders': ['agency', 'Content-Type', 'company', 'file', 'data', 'config'],
  'exposedHeaders': ['agency', 'company', 'file', 'data', 'config'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

const rotas = require('./src/js/src/ts/routes/routes');
rotas(app);

app.get('/', (req, res) => res.status(200).send('OK'));

module.exports = app;