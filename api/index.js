const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const serverless = require('serverless-http');

const tshirtDatabase = {};

app.use(bodyParser.urlencoded({ extended: true }));

function generateId() {
  return 'tshirt-' + Math.random().toString(36).substring(2, 8);
}

app.get('/', (req, res) => {
  const clientId = req.query.id;

  if (!clientId || !tshirtDatabase[clientId]) {
    const newId = generateId();
    return res.redirect(`/api/config?id=${newId}`);
  }

  const link = tshirtDatabase[clientId].redirection;
  res.send(`<!DOCTYPE html><html><body>
    <h2>Redirection...</h2>
    <script>window.location.href = "${link}";</script>
  </body></html>`);
});

app.get('/config', (req, res) => {
  const id = req.query.id;
  res.send(`<!DOCTYPE html><html><body>
    <h2>Configurer ton lien</h2>
    <form action="/api/config" method="POST">
      <input type="hidden" name="id" value="${id}" />
      <label>Ton lien (ex: https://instagram.com/tonprofil)</label><br>
      <input type="text" name="redirection" style="width: 300px"/><br><br>
      <button type="submit">Enregistrer</button>
    </form>
  </body></html>`);
});

app.post('/config', (req, res) => {
  const id = req.body.id;
  const redirection = req.body.redirection;
  tshirtDatabase[id] = { redirection };

  res.send(`<h2>Configuration enregistrée pour ${id} !</h2>
    <p><a href="/api/?id=${id}" target="_blank">Scanner ton QR maintenant</a></p>`);
});

module.exports = serverless(app);
