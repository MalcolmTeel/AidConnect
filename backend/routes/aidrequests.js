const { AidRequest } = require('../models/aidrequest');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Get list of all AidRequests
router.get('/', async(req, res) => {

  const aidrequestList = await AidRequest.find();

  if(!aidrequestList) {
    res.status(500).json({ success: false })
  }
  res.send(aidrequestList);

})

//Get an AidRequest by ID
router.get('/:id', async (req, res) => {
  
  //Validate ID as to avoid hanging on the backend if bad ID
  if(!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid AidRequest ID');
  }

  const aidrequest = await AidRequest.findById(req.params.id);

  if(!aidrequest) {
    res.status(500).json({messsage: 'The AidRequest with the given ID cannot be found!'});
  }

  res.status(200).send(aidrequest);
})

//Post a new AidRequest
router.post('/', async (req, res) => {

  let aidrequest = new AidRequest ({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    priorityRating: req.body.priorityRating,
    dateCreated: req.body.dateCreated,
  });
  
  //Save new aid request to the mongoDB database
  aidrequest = await aidrequest.save();

  if(!aidrequest) {
    res.status(404).send('The aid-request cannot be created.');
  }
  res.send(aidrequest);
})

//Update an AidRequest
router.put('/:id', async (req, res) => {

  //Validate ID as to avoid hanging on the backend if bad ID
  if(!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid AidRequest ID');
  }

  const aidrequest = await AidRequest.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
      priorityRating: req.body.priorityRating,
      dateCreated: req.body.dateCreated,
    },
    { new: true }
  )
  
  if(!aidrequest) {
    return res.status(404).send('The aidrequest cannot be created');
  }
  res.send(aidrequest);
})

//Delete an AidRequest
router.delete('/:id', (req, res)=>{
  aidrequest.findByIdAndRemove(req.params.id).then(aidrequest =>{
    if(aidrequest) {
      return res.status(200).json({success: true, message: 'the aidrequest is deleted'});
    } else {
      return res.status(404).json({success: false, message: 'aidrequest not found!'});
    }
  }).catch(err=>{
    return res.status(400).json({success: false, error: err})
  })
})

module.exports = router;