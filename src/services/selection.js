import { useAxios } from "./api";

export const selectionService = {
  fetch: (params) =>
    useAxios({ responseField: "" }).post("api/selections", params),
};
