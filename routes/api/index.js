const express  = require('express');
const router = express.Router();

const {router: userRouter, } = require('./user');

router.get('', async (req, res) => {
    res.send('Welcome to the API');
});
router.use('/logs/', require('./log'));
router.use('/user/', userRouter);
router.use('/scoreBoard/', require('./scoreBoard'));

module.exports=router;