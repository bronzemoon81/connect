// import sha256 from "crypto-js/sha256";
import Model from "../../model";
import md5 from "blueimp-md5";

export default class ErrorModel extends Model {
  name = "Error";

  tableName = "errors";

  casts = {
    request: "json",
    response: "json",
  };

  beforeSave(props) {
    const request = props.request ? JSON.stringify(props.request) : "";

    return {
      ...super.beforeSave(props),
      hash: md5(request),
    };
  }
}
