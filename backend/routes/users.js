const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//List of all users, displays without their passwordHash
router.get('/', async(req, res) => {
  const userList = await User.find().select('name phone email');

  if(!userList) {
    res.status(500).json({ success: false })
  }
  res.send(userList);
})

//Get a user by their ID
router.get('/:id', async (req, res) => {
  //Check if valid ID to avoid hanging on backend with bad ID
  if(!mongoose.isValidObjectId(req.params.id)) {
    return res.status(200).send('Invalid user ID');
  }
  const user = await User.findById(req.params.id).select('-passwordHash');
  if(!user) {
    res.status(500).json({messsage: 'The user with the given ID cannot be found!'});
  }
  res.status(200).send(user);
})

router.get('/get/count', async (req, res) => {
  const userCount = await User.countDocuments((count) => count);

  if(!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount
  });
})


//Login
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;

  if(!user) {
    return res.status(400).send('The user was not found');
  }

  if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: '1d' }
    )
    res.status(200).send({user: user.email, token: token})
  } else {
    res.status(400).send('password is wrong!');
  }

  return res.status(200).send(user);
})

//Register
router.post('/register', async (req,res) => {
  let user = new User ({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
    }); 
  user = await user.save();

  if(!user) {
    return res.status(404).send('The user cannot be created');
  }
  res.send(user);
})
module.exports = router;