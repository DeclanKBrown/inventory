const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Category = require('../models/category')
const Item = require('../models/item')

exports.index = asyncHandler(async(req,res, next) => {
    const allItems = await Item.find().exec()

    res.render('index', { title: 'Grocerys', items: allItems })
})

exports.item_list = asyncHandler(async(req, res, next) => {
    const allItems = await Item.find({}, 'name price')
        .sort({ name: 1 })
        .exec()

    res.render('item_list', { title: 'All Items', items: allItems })
})

exports.item_detail = asyncHandler(async(req, res, next) => {
    const item = await Item.findById(req.params.id).exec()
    const category = await Category.findById(item.category).exec()

    if (item === null) {
        const err = new Error('Item not found')
        err.status = 404
        next(err)
    }

    res.render('item_detail', {
        item: item,
        category: category
    })
})

exports.item_create_get = asyncHandler(async(req, res, next) => {
    const allCategorys = await Category.find().exec()

    res.render('item_form', {
        title: 'Create Item', 
        categories: allCategorys
    })
})

exports.item_create_post = [
    body('name')
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body('category.*')
        .escape(),
    body('price')
        .notEmpty().withMessage('Price is required')
        .trim()
        .escape(),
    body('numberInStock')
        .notEmpty().withMessage('Number in stock is required')
        .isInt().withMessage('Number in stock must be an integer')
        .trim()
        .escape(),
    body('expiryDate')
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req)

        const item = new Item({ 
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            expiryDate: req.body.expiryDate
        })

        if (!errors.isEmpty()) {
            const category = await Category.find().exec()

            res.render('item_form', {
                title: 'Create Item',
                item: item,
                category: category,
                errors: errors.array()
            })
        } else {
            await item.save()
            res.redirect(item.url)
        }
    })
]

exports.item_delete_get = asyncHandler(async(req, res, next) => {
    const item = Item.findById(req.params.id).exec()

    if (item === null) {
        res.redirect('/items')
    }

    res.render('item_delete', {
        title: 'Delete Item',
        item: item
    })
})

exports.item_delete_post = asyncHandler(async(req, res, next) => {
    await Item.findByIdAndRemove(req.params.id)

    res.redirect('/')
})

exports.item_update_get = asyncHandler(async(req, res, next) => {
    const item = await Item.findById(req.params.id).exec()
    const category =  await Category.find().exec()

    if (item === null) {
        const err = new Error('Item not found')
        err.status = 404
        next(err)
    }

    res.render('item_form', {
        title: 'Update Item',
        item: item,
        categories: category
    })
})

exports.item_update_post = [
    body('name')
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body('category.*')
        .escape(),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isDecimal().withMessage('Price must be a decimal number')
        .trim()
        .escape(),
    body('numberInStock')
        .notEmpty().withMessage('Number in stock is required')
        .isInt().withMessage('Number in stock must be an integer')
        .trim()
        .escape(),
    body('expiryDate')
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req)

        const item = new Item({ 
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            expiryDate: req.body.expiryDate
        })

        if (!errors.isEmpty()) {
            const category = await Category.find().exec()

            res.render('item_form', {
                title: 'Create Item',
                item: item,
                categorys: category,
                errors: errors.array()
            })
            return
        } else {
            await Item.findByIdAndUpdate(req.parmas.id, item)
            res.redirect(item.url)
        }
    })
]
