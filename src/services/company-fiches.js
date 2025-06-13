import { useAxios } from "./api";

export const companyFicheService = {
  massArchive: (id) =>
    useAxios().post(`api/company-fiches/mass-archive`, { id }),
  massSubmit: (params) =>
    useAxios().post(`api/company-fiches/mass-store`, params),
};
