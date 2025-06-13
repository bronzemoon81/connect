import { useAxios } from "./api";

export const companyService = {
  massArchive: (id) => useAxios().post(`api/companies/mass-archive`, { id }),
  massSubmit: (params) => useAxios().post(`api/companies/mass-store`, params),
};
