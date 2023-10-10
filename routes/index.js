var express = require('express');
var router = express.Router();

const category_controller = require('../controllers/categoryController')
const item_controller = require('../controllers/itemController')

/// ITEM ROUTES ///

//Home
router.get('/', item_controller.index)

//Get create
router.get('/item/create', item_controller.item_create_get)

//Post create
router.post('/item/create', item_controller.item_create_post)

//Get delete
router.get('/item/:id/delete', item_controller.item_delete_get)

//Post delete
router.post('/item/:id/delete', item_controller.item_delete_post)

//Get update
router.get('/item/:id/update', item_controller.item_update_get)

//Post update
router.post('/item/:id/update', item_controller.item_update_post)

//Item detail
router.get('/item/:id', item_controller.item_detail)

//Items list
router.get('/items', item_controller.items_lists)

/// CATEGORY ROUTES ///

//Get create
router.get('/category/create', category_controller.category_create_get)

//Post create
router.get('/category/create', category_controller.category_create_post)

//Get delete
router.get('/category/:id/delete', category_controller.category_delete_get)

//Post delete
router.post('/category/:id/delete', category_controller.category_delete_post)

//Get update
router.get('/category/:id/update', category_controller.category_update_get)

//Post update
router.get('/category/:id/update', category_controller.category_update_post)

//Category detail
router.get('/category/:id', category_controller.category_detail)

//Category list
router.get('/categorys', category_controller.category_list)


module.exports = router;
