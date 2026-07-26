import api from "./api";

export const getCart = () => api.get("/cart");

export const addToCart = (data) => api.post("/cart", data);

export const deleteCartItem = (id) => api.delete(`/cart/${id}`);
