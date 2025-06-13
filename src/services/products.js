import { useAxios } from "./api";

export const productService = {
  massArchive: (id) => useAxios().post(`api/products/mass-archive`, { id }),
  massSubmit: (params) => useAxios().post(`api/products/mass-store`, params),
};

export const productLotService = {
  massArchive: (id) => useAxios().post(`api/product-lots/mass-archive`, { id }),
  massSubmit: (params) =>
    useAxios().post(`api/product-lots/mass-store`, params),
};
