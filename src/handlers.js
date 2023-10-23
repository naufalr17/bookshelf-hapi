const { nanoid } = require("nanoid");
const bookshelfs = require("./bookshelfs");
const Joi = require("joi");

const bookSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .required(),
  author: Joi.string().required(),
  summary: Joi.string().required(),
  publisher: Joi.string().required(),
  pageCount: Joi.number().integer().min(1).required(),
  readPage: Joi.number().integer().min(0).required(),
  reading: Joi.boolean().required(),
});
//clear
const addBooks = (request, h) => {
  const { error, value } = bookSchema.validate(request.payload);
  if (error) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });

    response.code(400);
    return response;
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = value;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage ? true : false;
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });

    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  bookshelfs.push(newBook);
  const isSuccess = bookshelfs.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "catatan gagal ditambahkan",
  });

  response.code(500);
  return response;
};

//clear
const getAllBooks = (request, h) => {
  const { finished, reading, name } = request.query;

  const books = bookshelfs
    .filter((book) => {
      if (finished === "1") {
        return book.finished === true;
      } else if (finished === "0") {
        return book.finished === false;
      } else if (reading === "1") {
        return book.reading === true;
      } else if (reading === "0") {
        return book.reading === false;
      } else if (name){
        return book.name.toLowerCase().includes(name.toLowerCase());
      }
      return true;
    })
    .map(({ id, name, publisher }) => ({ id, name, publisher }));

  return h.response({
    status: "success",
    data: {
      books,
    },
  });
};

const getBookbyId = (request, h) => {
  const { id } = request.params;

  const book = bookshelfs.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });

  response.code(404);
  return response;
};

const updateBookById = (request, h) => {
  const { error, value } = bookSchema.validate(request.payload);
  if (error) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });

    response.code(400);
    return response;
  }
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = value;

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage ? true : false;

  const index = bookshelfs.findIndex((book) => book.id === id);

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });

    response.code(400);
    return response;
  }
  if (index !== -1) {
    bookshelfs[index] = {
      ...bookshelfs[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });

  response.code(404);
  return response;
};

const deleteBookById = (request, h) => {
  const { id } = request.params;

  const index = bookshelfs.findIndex((book) => book.id === id);

  if (index !== -1) {
    bookshelfs.splice(index, 1);

    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });

  response.code(404);
  return response;
};

module.exports = {
  addBooks,
  getAllBooks,
  getBookbyId,
  updateBookById,
  deleteBookById,
};
