const express = require('express');
const uuidv4 = require('uuid/v4');
const cors = require('cors');

const { getToken, getUserInfo, authenticate, authenticate2, auth } = require('./signicat');

// redis?
const db = require('./db');

// rabbit MQ or maybe redis?
const queue = [];

const app = express();
app.use(cors());

app.post('/authenticate/:pno', (req, res) => {
  const state = uuidv4();
  const { pno } = req.params;
  db.setAuthStarted(state, pno);

  const startAuth = async () => {
    try {
      await authenticate(pno, state);
    } catch (e) {
      db.setAuthError(state, e.message);
    }
  };

  queue.push(startAuth);

  return res.json({ authReference: state });
});

app.post('/auth', async (req, res) => {
  const state = uuidv4();
  db.setAuthStarted(state);

  console.log('state', state);

  const { autoStartToken, collectUrl, orderRef } = await auth(state);

  const bankIdUrl = `bankid:///?autostarttoken=${autoStartToken}&redirect=null`;
  console.log('bankIdUrl', bankIdUrl);

  const startAuth = async () => {
    try {
      await authenticate2(collectUrl, orderRef);
    } catch (e) {
      db.setAuthError(state, e.message);
    }
  };

  queue.push(startAuth);

  return res.json({ authReference: state, autoStartToken });
});

app.delete('/:authReference', async (req, res) => {
  const { authReference } = req.params;
  const authState = db.getAuthState(authReference);
  if (!authState) return res.status(404).send();
  db.remove(authReference);
  return res.status(202).send();
});

app.get('/peek/:authReference', async (req, res) => {
  const { authReference } = req.params;
  const authState = db.getAuthState(authReference);
  if (!authState) return res.status(404).send();
  return res.json(authState.data);
});

app.get('/redirect', async (req, res) => {
  // TODO: Somehow verify the validity of the /redirect comparing cookies and query state
  console.log('/redirect req.query', req.query);

  const { code, state } = req.query;
  const token = await getToken(code);
  const userInfo = await getUserInfo(token);

  db.setAuthComplete(state, { userInfo, token, code, state });
  db.dump();
  return res.send();
});

const loop = async () => {
  const nextAuth = queue.length > 0 && queue.shift();
  if (nextAuth) {
    console.log('processing auth, queue.length: ', queue.length);
    await nextAuth();
  }
};

app.listen(80, () => {
  console.log('listening on port 80');

  // Poor man's event loop
  setInterval(loop, 50);
});
