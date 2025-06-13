import { useAxios } from "./api";

export const priceService = {
  massSubmit: (params) => useAxios().post(`api/prices/mass-store`, params),
};
