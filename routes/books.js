const express = require("express");
const Book = require("../models/book");
const ExpressError = require("../expressError");
const router = new express.Router();
const jsonschema = require("jsonschema");
const createBookSchema = require("../schemas/createBookSchema.json");
const updateBookSchema = require("../schemas/updateBookSchema.json");



/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, createBookSchema);

    if (!result.valid) {
      // pass validation errors to error handler
      //  (the "stack" key is generally the most useful)
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {

    if (err.code === '23505') {
      console.log('code', err.code)
      return next(new ExpressError(`ISBN ${req.body.isbn} is already in db.`, 400));
    }
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {

    if ("isbn" in req.body) {
      return next({
        status: 400,
        message: "Updating isbn is not allowed"
      });
    }

    const validation = jsonschema.validate(req.body, updateBookSchema);

    if (!validation.valid) {
      // pass validation errors to error handler
      //  (the "stack" key is generally the most useful)
      let listOfErrors = validation.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    const isbn = req.params.isbn;
    const currentData = await Book.findOne(isbn)
    const editedData = req.body
    // if req.body doesn't contain title set editedData.title to current title value
    // this changes editedData.isbn to currData.isbn, which is fine.
    for (const [key, value] of Object.entries(currentData)) {
      if (!editedData[key]) editedData[key] = value
    }

    const book = await Book.update(isbn, editedData);

    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
