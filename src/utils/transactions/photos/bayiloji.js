import { localDatabase } from "@/utils/properties/local-database";
import { selectionService } from "@/services";
import { helper } from "@/utils/properties/helper";
import { Bayiloji } from "@/utils/transactions/bayiloji";
import _ from "lodash";

export class BayilojiMethod extends Bayiloji {
  constructor() {
    super();
    this.model = localDatabase().productPhotos.bayiloji;
    this.model.truncate();
  }

  async fetch(page = 1, perpage = 250) {
    const columns = await this.model.getColumnNames();
    const columnKeys = _.keys(_.omit(columns, ["id"]));

    const result = await selectionService.fetch({
      product: {
        "@select": ["product_group_code", "code"],
        "@page": page,
        "@paginate": perpage,
        "@func": ["withPhotos"],
        "@order": "sq:desc",
      },
    });

    if (result.kind !== "ok") throw new Error(result.message);

    const list = _.get(result.data, "product.data", []).flatMap((item) => {
      const code = _.get(item, "code");
      return item.photos.map((photo) => ({
        code,
        name: _.get(photo, "name"),
        size: _.get(photo, "size"),
        extension: _.get(photo, "extension"),
        updated_at: _.get(photo, "updated_at"),
        path: _.get(photo, "path"),
      }));
    });
    await this.model.insert(list);
    return;
  }

  // async fetch(page = 1, perpage = 250) {
  //   const columns = await this.model.getColumnNames();
  //   const columnKeys = _.keys(_.omit(columns, ["id"]));
  //
  //   const result = await selectionService.fetch({
  //     file: {
  //       "@get": true,
  //       "@select": [...columnKeys],
  //     },
  //   });
  //
  //   if (result.kind !== "ok") throw new Error(result.message);
  //
  //   const list = _.get(result.data, "file.data", []);
  //   const filteredList = list.filter((item) => {
  //     const extension = item.extension.toLowerCase();
  //     return extension === "jpg" || extension === "jpeg" || extension === "png";
  //   });
  //   // console.log("files", { filteredList });
  //   await this.model.insert(filteredList);
  // }
}
