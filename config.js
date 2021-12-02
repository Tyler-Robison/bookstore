/** Common config for bookstore. */


let DB_URI = `postgresql://`;

if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}/book_db_test`;
} else {
  DB_URI = process.env.DATABASE_URL || `${DB_URI}/book_db`;
}


module.exports = { DB_URI };