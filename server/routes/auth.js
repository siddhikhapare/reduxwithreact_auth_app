const express = require('express');

const router = express.Router();

//import middlewares
const {authCheck,adminCheck} = require('../middlewares/auth')

//import methods from controller
const {createOrUpdateuser,Currentuser} = require('../controllers/auth')
//sending data from fronend to backend
router.post('/create-or-update-user',authCheck, createOrUpdateuser);
router.post('/current-user',authCheck, Currentuser);
router.post('/current-admin',authCheck,adminCheck, Currentuser)

module.exports = router;


