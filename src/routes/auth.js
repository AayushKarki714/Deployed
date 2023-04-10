const express = require("express");
const router = express.Router();

router.get("/login", function (req, res, next) {
  return res.status(200).json({ message: "You logged in " });
});
module.exports = router;
