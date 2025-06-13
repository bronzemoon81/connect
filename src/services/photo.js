import { useAxios } from "./api";
import axios from "axios";
export const photoService = {
  getSignedURL: (params) =>
    useAxios().post(
      `https://tr-v4-api.bayiloji.com/api/files/generate-signed-url`,
      params
    ),
  commitSendedFile: (sign, file) =>
    useAxios().post(`https://tr-v4-api.bayiloji.com/api/files`, {
      tags: "connect",
      uuid: sign.uuid,
      name: file.name,
      size: file.size,
      product_code: file.code,
    }),
  uploadToS3: (url, blob) =>
    useAxios().put(url, blob, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    }),
};
