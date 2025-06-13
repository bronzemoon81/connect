import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { useSystemStore } from "@/stores/system-store";
import { helper } from "@/utils/properties/helper";
import { ToastNotify } from "@/libs/toast-notify";

const axiosDefaultConfig = {
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/vnd.api+json",
    "x-client-app": "connect",
    "x-client-app-version": import.meta.env.VITE_APP_VERSION,
  },
};

export const useAxios = (config = {}) => {
  const { responseField = "data", isCentral = false, ...axiosConfig } = config;
  const authStore = useAuthStore();
  const systemStore = useSystemStore();
  const tenant = authStore.tenant();
  const token = authStore.token();

  const baseUrl = import.meta.env.VITE_APP_BACKEND_URL;

  axiosConfig.headers = {
    ...axiosDefaultConfig.headers,
    ...axiosConfig.headers,
    "Accept-Language": systemStore.locale,
    "x-tenant": tenant,
    "x-client-request-id": helper.uuid(),
  };

  if (token) {
    axiosConfig.headers = {
      ...axiosConfig.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const withPrefix = (url) => {
    return `${url}`;
  };

  const createConfig = {
    baseURL: withPrefix(baseUrl),
    ...axiosDefaultConfig,
    ...axiosConfig,
  };

  let transformRequest = [];
  if (axios.defaults.transformRequest) {
    if (_.isArray(axios.defaults.transformRequest))
      transformRequest = axios.defaults.transformRequest;
    else transformRequest = [axios.defaults.transformRequest];
  }

  let transformResponse = [];
  if (axios.defaults.transformResponse) {
    if (_.isArray(axios.defaults.transformResponse))
      transformResponse = axios.defaults.transformResponse;
    else transformResponse = [axios.defaults.transformResponse];
  }

  const instance = axios.create({
    ...createConfig,
    transformRequest: transformRequest.concat((data) => {
      return data;
    }),
    transformResponse: transformResponse.concat((data, headers) => {
      if (_.has(headers, "x-expires-at")) {
        authStore.setExpiresAt(_.get(headers, "x-expires-at"));
      }
      return data;
    }),
  });

  instance.interceptors.response.use(
    (interceptorResponse) => {
      return interceptorResponse;
    },
    async (interceptorError) => {
      const originalRequest = interceptorError.config;

      if (interceptorError.response.status === 429) {
        const resetTimeUnix = _.get(
          interceptorError,
          "response.headers.x-ratelimit-reset",
          ""
        );
        const second = helper.diffTimeByNow(resetTimeUnix).seconds;

        const message =
          "Üzgünüz, çok fazla deneme hatası aldık ve " +
          second +
          " saniye boyunca hesabınıza erişim engellendi. Bu önlem, hesabınızın güvenliğini korumak amacıyla alınmıştır.";

        ToastNotify({ className: "warning", text: message });

        systemStore.setTooManyAttempts(second);
        await helper.sleep((second + 1) * 1000);

        return instance(originalRequest);
      } else if (interceptorError.response.status === 401) {
        await authStore.logout();
      }

      return Promise.reject(interceptorError);
    }
  );

  const getField = (result) => {
    if (responseField) return _.get(result, responseField, null);
    return result;
  };

  return {
    instance,
    get: async (url, config) => {
      let result = await instance.get(url, config).catch((error) => error);

      if (result instanceof Error) {
        return getGeneralApiProblem(result);
      }

      return {
        kind: "ok",
        data: getField(result.data),
        meta: _.get(result.data, "meta"),
      };
    },
    post: async (url, params, config) => {
      let result = await instance
        .post(url, params, config)
        .catch((error) => error);

      if (result instanceof Error) {
        return getGeneralApiProblem(result);
      }

      return {
        kind: "ok",
        data: getField(result.data),
        meta: _.get(result.data, "meta"),
      };
    },
    put: async (url, params, config) => {
      let result = await instance
        .put(url, params, config)
        .catch((error) => error);

      if (result instanceof Error) {
        return getGeneralApiProblem(result);
      }

      return {
        kind: "ok",
        data: getField(result.data),
        meta: _.get(result.data, "meta"),
      };
    },
    delete: async (url, config) => {
      let result = await instance.delete(url, config).catch((error) => error);

      if (result instanceof Error) {
        return getGeneralApiProblem(result);
      }

      return { kind: "ok" };
    },
  };
};

export function getGeneralApiProblem(error) {
  switch (error.response?.status) {
    case 401:
      return {
        kind: "unauthorized",
        message:
          "401 - Yetkisiz Erişim: Bu kaynağa erişim izniniz yok. Lütfen giriş yapın veya uygun yetkilendirmeyi alın.",
      };
    case 403:
      return {
        kind: "forbidden",
        message: _.get(error, "response.data.message", ""),
      };
    case 404:
      return {
        kind: "not-found",
        message: _.get(error, "response.data.message", ""),
      };
    case 422:
      return {
        kind: "validation",
        message: _.get(error, "response.data.message", ""),
        fields: _.get(error, "response.data.errors", []),
      };
    case 429:
      return {
        kind: "too-many",
        message: _.get(error, "response.data.message", ""),
        reset: _.get(error, "response.headers.x-ratelimit-reset", ""),
      };
    default:
      return {
        kind: "rejected",
        message: _.get(error, "response.data.message", error.message),
      };
  }
}
