DROP DATABASE book_db;
CREATE DATABASE book_db;

\c book_db

CREATE TABLE books (
  isbn TEXT PRIMARY KEY,
  amazon_url TEXT,
  author TEXT,
  language TEXT, 
  pages INTEGER,
  publisher TEXT,
  title TEXT, 
  year INTEGER
);

-- {
--   "isbn": "0691161518",
--   "amazon_url": "http://a.co/eobPtX2",
--   "author": "Matthew Lane",
--   "language": "english",
--   "pages": 264,
--   "publisher": "Princeton University Press",
--   "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
--   "year": 2017
-- }
