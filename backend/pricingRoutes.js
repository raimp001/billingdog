const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Pricing route');
});

module.exports = router;
