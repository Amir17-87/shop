import axios from "axios";

export const SERVER_URL = process.env.NODE_ENV === "development" ? "https://localhost:7000" : "https://api.shop.amirmahdian.ir";

export const getAllProducts = () => {
    const url = `${SERVER_URL}/Product/GetAllProducts`;
    return axios.get(url);
}

export const getProduct = (productId) => {
    const url = `${SERVER_URL}/Product/Find/${productId}`;
    return axios.get(url);
}

export const getAllProductGroups = () => {
    const url = `${SERVER_URL}/ProductGroup/GetAllProductGroups`;
    return axios.get(url);
}

export const findGroup = (productGroupId) => {
    const url = `${SERVER_URL}/ProductGroup/Find/${productGroupId}`;
    return axios.get(url);
}

export const createProduct = (product) => {
    const url = `${SERVER_URL}/Product/`;
    return axios.post(url, product);
}

export const updateProduct = (product, productId) => {
    const url = `${SERVER_URL}/Product/${productId}`;
    return axios.put(url, product);
}

export const deleteProduct = (productId) => {
    const url = `${SERVER_URL}/Product/${productId}`;
    return axios.delete(url);
}