import { useAxios } from "./api";

export const authService = {
  profile: () => useAxios().get("api/auth/me"),

  login: async (params) => {
    const result = await useAxios({ responseField: "" }).post(
      "api/auth/login",
      params
    );
    if (result.kind !== "ok") return result;
    return {
      kind: "ok",
      data: _.get(result.data, "data", null),
      meta: _.get(result.data, "meta", null),
    };
  },

  forgotPassword: async (params) => {
    const result = await useAxios({ responseField: "" }).post(
      "api/auth/forgot-password",
      params
    );
    if (result.kind !== "ok") return result;
    return {
      kind: "ok",
      data: {
        status: _.get(result.data, "status", null),
      },
    };
  },

  sendEmailVerification: async () => {
    const result = await useAxios({ responseField: "" }).post(
      "api/auth/verify-email"
    );
    if (result.kind !== "ok") return result;
    return {
      kind: "ok",
      data: {
        success: _.get(result.data, "success") || false,
        message: _.get(result.data, "message", null),
      },
    };
  },

  logout: () => useAxios().post("api/auth/logout"),
};
