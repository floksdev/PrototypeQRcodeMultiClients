const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const tshirtDatabase = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function generateId() {
  return 'tshirt-' + Math.random().toString(36).substring(2, 8);
}

app.get('/', (req, res) => {
  const clientId = req.query.id;

  if (!clientId || !tshirtDatabase[clientId]) {
    const newId = generateId();
    return res.redirect(`/config?id=${newId}`);
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
    <form action="/config" method="POST">
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
    <p>Tu peux maintenant scanner ce QR avec n'importe quel tél.</p>
    <p><a href="/?id=${id}" target="_blank">Scanner ton QR maintenant</a></p>`);
});

app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});
