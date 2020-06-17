var express = require('express');
var router = express.Router();
import arbitrage from '../arbitrageEngine';

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const response = await arbitrage();
  console.log(response);
  res.sendStatus(response);
});

module.exports = router;
