///////////////////////////////
// DEPENDENCIES
////////////////////////////////

const express = require('express');
const router = express.Router();

const menuItemCtrl = require('../controllers/menuItem-controller');
const profileCtrl = require('../controllers/profile-controller')

///////////////////////////////
// ROUTES
////////////////////////////////

// MENU ITEM INDEX ROUTE
router.get("/", menuItemCtrl.index);

// MENU ITEM CREATE ROUTE
router.post("/", menuItemCtrl.create);

// MENU ITEM SEARCH ROUTE
router.get("/search", menuItemCtrl.search);

// MENU ITEM SHOW ROUTE
router.get("/:id", menuItemCtrl.getOne);

// MENU ITEM DELETE ROUTE
router.delete("/:id", menuItemCtrl.delete);

// MENU ITEM UPDATE ROUTE
router.put("/:id", menuItemCtrl.update);

// MENU ITEM SAVE TO FAVORITES ROUTE
router.post("/:id/save",profileCtrl.saveMenuItem);

module.exports = router