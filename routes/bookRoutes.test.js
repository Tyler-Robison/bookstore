process.env.NODE_ENV = 'test'

const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

describe("Book Routes Test", function () {

    beforeEach(async function () {

        await db.query("DELETE FROM books");

        const data = {
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking Hidden Math in Video Games",
            "year": 2020
        }

        let b1 = await Book.create(data);
    });

    describe("GET routes", function () {
        test("can get all books", async function () {
            let response = await request(app)
                .get("/books");


            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({
                "books": [
                    {
                        isbn: "0691161518",
                        amazon_url: "http://a.co/eobPtX2",
                        author: "Matthew Lane",
                        language: "english",
                        pages: 264,
                        publisher: "Princeton University Press",
                        title: "Power-Up: Unlocking Hidden Math in Video Games",
                        year: 2020
                    }
                ]
            })
        });

        test("can get specific book", async function () {
            let response = await request(app)
                .get("/books/0691161518");


            const data = {
                "book": {
                    isbn: "0691161518",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Matthew Lane",
                    language: "english",
                    pages: 264,
                    publisher: "Princeton University Press",
                    title: "Power-Up: Unlocking Hidden Math in Video Games",
                    year: 2020
                }
            }
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual(data)
        });

        test("404 on bad isbn", async function () {
            let response = await request(app)
                .get("/books/11111111");

            expect(response.statusCode).toEqual(404);

        });
    });

    describe("POST routes", function () {
        test("Can POST new book", async function () {

            const data = {
                isbn: "1469246874",
                amazon_url: "http://a.co/edffsd",
                author: "Tyler Robison",
                language: "C++",
                pages: 9000,
                publisher: "My mom",
                title: "What if there was a third + ?",
                year: 2022
            }
            let response = await request(app)
                .post("/books")
                .send(data);


            expect(response.statusCode).toEqual(201);
            expect(response.body).toEqual({
                "book":
                {
                    isbn: "1469246874",
                    amazon_url: "http://a.co/edffsd",
                    author: "Tyler Robison",
                    language: "C++",
                    pages: 9000,
                    publisher: "My mom",
                    title: "What if there was a third + ?",
                    year: 2022
                }
            })
        });

        test("400 on duplicate ISBN", async function () {

            const data = {
                isbn: "0691161518",
                amazon_url: "http://a.co/edffsd",
                author: "Tyler Robison",
                language: "C++",
                pages: 9000,
                publisher: "My mom",
                title: "What if there was a third + ?",
                year: 2022
            }
            let response = await request(app)
                .post("/books")
                .send(data);

            expect(response.statusCode).toEqual(400);
        });


        test("400 on no author", async function () {

            const data = {
                isbn: "1469246874",
                amazon_url: "http://a.co/edffsd",
                language: "C++",
                pages: 9000,
                publisher: "My mom",
                title: "What if there was a third + ?",
                year: 2022
            }
            let response = await request(app)
                .post("/books")
                .send(data);

            expect(response.statusCode).toEqual(400);
        });
    });

    describe("PUT routes", function () {
        test("Can update book", async function () {
            const data = {
                amazon_url: "http://a.co/eobPtX2",
                author: "new author",
                language: "new lang",
                pages: 800,
                publisher: "new pub",
                title: "new title",
                year: 2015
            }

            let response = await request(app)
                .put("/books/0691161518")
                .send(data);

            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({
                "book": {
                    isbn: "0691161518",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "new author",
                    language: "new lang",
                    pages: 800,
                    publisher: "new pub",
                    title: "new title",
                    year: 2015
                }
            });
        });

        test("404 on bad isbn", async function () {
            const data = {
                amazon_url: "http://a.co/eobPtX2",
                author: "new author",
                language: "new lang",
                pages: 800,
                publisher: "new pub",
                title: "new title",
                year: 2015
            }

            let response = await request(app)
                .put("/books/111111111")
                .send(data);

            expect(response.statusCode).toEqual(404);
        });
    });

    describe("DELETE routes", function () {
        test("Can delete a book", async function () {
            let response = await request(app)
                .delete("/books/0691161518")

            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({ message: "Book deleted" });

        });

        test("404 on bad isbn", async function () {
            let response = await request(app)
            .delete("/books/11111111111")

        expect(response.statusCode).toEqual(404);
        });
    });

});

afterAll(async function () {
    await db.query("DELETE FROM books");
    await db.end();
});