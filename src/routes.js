const { addBooks, getAllBooks, getBookbyId, updateBookById, deleteBookById } = require("./handlers");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: addBooks,

  },
  {
    method: "GET",
    path: "/books",
    handler: getAllBooks,
  },

  {
    method: "GET",
    path: "/books/{id}",
    handler: getBookbyId,
  },
  {
    method: "PUT",
    path: "/books/{id}",
    handler: updateBookById,
  },

  {
    method: "DELETE",
    path: "/books/{id}",
    handler: deleteBookById,
  },
];

module.exports = routes;
