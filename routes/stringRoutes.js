const express = require('express');
const { getString, createString, deleteString, listStrings } = require('../controllers/stringController');
const {filterByNaturalLanguage} = require("../controllers/nplController")
const router = express.Router();



router.get("/", listStrings)
router.get("/:string_value", getString)
router.get('/filter-by-natural-language', filterByNaturalLanguage);
router.post("/", createString)
router.delete("/:string_value", deleteString)

module.exports = router;