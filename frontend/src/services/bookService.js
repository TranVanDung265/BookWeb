import api from "./api";

export const getBooks = (page = 1) => api.get(`/books?page=${page}`);

export const getBookById = (id) => api.get(`/books/${id}`);

export const createBook = (data) => api.post("/books", data);

export const updateBook = (id, data) => api.patch(`/books/${id}`, data);

export const deleteBook = (id) => api.delete(`/books/${id}`);

export const uploadBookImage = (formData) =>
  api.post("/books/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
