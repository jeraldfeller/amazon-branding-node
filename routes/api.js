const express = require('express');
const route = express.Router();


route.post('/', async (req, res) => {
  const {error} = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({email: req.body.email});
  if(!user) res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) res.status(400).send('Invalid email or password.');

  res.send(true);

});