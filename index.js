const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();
const PORT = 3000;

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://portfolio-70f47-default-rtdb.firebaseio.com"
});

const db = getDatabase();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Mera pehla backend server chal raha hai!');
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const ref = db.ref('messages').push();
  ref.set({ name, email, message, time: Date.now() });
  console.log('Naya message Firebase mein save hua:', name);
  res.json({ status: 'success', reply: 'Shukriya! Aapka message receive ho gaya.' });
});

app.get('/messages', (req, res) => {
  db.ref('messages').once('value', (snapshot) => {
    res.json(snapshot.val() || {});
  });
});

app.get('/services', (req, res) => {
  db.ref('services').once('value', (snapshot) => {
    res.json(snapshot.val() || {});
  });
});

app.post('/services', (req, res) => {
  const { icon, title, desc } = req.body;
  const ref = db.ref('services').push();
  ref.set({ icon, title, desc });
  res.json({ status: 'added', id: ref.key });
});

app.put('/services/:id', (req, res) => {
  const { icon, title, desc } = req.body;
  db.ref('services/' + req.params.id).set({ icon, title, desc });
  res.json({ status: 'updated' });
});

app.delete('/services/:id', (req, res) => {
  db.ref('services/' + req.params.id).remove();
  res.json({ status: 'deleted' });
});

app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});
