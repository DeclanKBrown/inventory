const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Category = require('../models/category')
const Item = require('../models/item')

exports.category_list = asyncHandler(async(req, res, next) => {
    const allCategories = await Category.find().sort({ name: 1 }).exec()

    res.render('category_list', {
        title: 'Category List',
        category_list: allCategories,
    })
})

exports.category_detail = asyncHandler(async(req, res, next) => {
    const [category, categoryItems] = await Promise.all([
        Category.find(req.params.id).exec(),
        Item.find({ category: req.params.id }).exec()
    ])

    if (category === null) {
        const err = new Error('Category not found')
        err.status = 404
        return next(err)
    }

    res.render('category_detail', {
        title: 'Browse Category',
        category: category,
        items: categoryItems
    })
})

exports.category_create_get = asyncHandler(async(req, res, next) => {
    res.render('category_form', { title: 'Create Category' })
})

exports.category_create_post = [
    body('name')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('Category name must be specified')
        .isAlpha(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req)

        const category = new Category({ name: req.body.name })

        if (!errors.isEmpty()) {
            res.render('category_form', { 
                title: 'Create Category',
                category: category,
                errors: errors.array(),
            })
            return
        } else {
            await category.save()

            res.redirect(category.url)
        }
    })
]

exports.category_delete_get = asyncHandler(async(req, res, next) => {
    const [category, categoryItems] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }).exec()
    ])

    if (category === null) {
        res.redirect('/categorys')
    }

    res.render('category_delete', {
        title: 'Delete Category',
        category: category,
        items: categoryItems,
    })
})

exports.category_delete_post = asyncHandler(async(req, res, next) => {
    const [category, categoryItems] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }).exec()
    ])

    if (categoryItems.length > 0) {
        res.render('category_delete', {
            title: 'Delete Category',
            category: category,
            items: categoryItems,
        })
        return
    } else {
        await Category.findByIdAndRemove(req.body.categoryid)
        res.redirect('/categorys')
    }
})

exports.category_update_get = asyncHandler(async(req, res, next) => {
    const category = await Category.findById(req.params.id).exec()

    if (category == null) {
        const err = new Error('Category not found')
        err.statis = 404
        return next(err)
    }

    res.render('category_form', { title: 'Update Category', category: category })
})

exports.category_update_post = [
    body('name')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Category name must be specified')
    .isAlpha(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req)

        const category = new Category({
            name: req.body.name,
            _id: req.params.id,
        })

        if (!errors.isEmpty()) {
            res.render('category_update', {
                title: 'Update Category',
                category: category,
                errors: errors.array(),
            })
            return
        } else {
            await Category.findByIdAndUpdate(req.params.id, category)
            res.redirect(category.url)
        }
    })
]