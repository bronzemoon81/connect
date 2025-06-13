import UserModel from "./user";
import SettingModel from "./setting";

import ErrorModel from "./error";
import CompanyGroupModel from "./company-group";
import CategoryModel from "./category";

import StaffModel from "./staff";

import CompanyBayilojiModel from "./company/company-bayiloji";
import CompanyBridgeModel from "./company/company-bridge";
import CompanyErpModel from "./company/company-erp";

import CompanyFicheErpModel from "./company-fiche/company-fiche-erp";
import CompanyFicheBayilojiModel from "./company-fiche/company-fiche-bayiloji";
import CompanyFicheBridgeModel from "./company-fiche/company-fiche-bridge";

import CompanyBalanceErpModel from "./company-balance/company-balance-erp";
import CompanyBalanceBayilojiModel from "./company-balance/company-balance-bayiloji";
import CompanyBalanceBridgeModel from "./company-balance/company-balance-bridge";

import ProductErpModel from "./product/product-erp";
import ProductBayilojiModel from "./product/product-bayiloji";
import ProductBridgeModel from "./product/product-bridge";

import ProductPhotosErpModel from "./product_photo/product-photos-erp";
import ProductPhotosBayilojiModel from "./product_photo/product-photos-bayiloji";
import ProductPhotosBridgeModel from "./product_photo/product-photos-bridge";

import ProductLotBayilojiModel from "./product-lot/product-lot-bayiloji";
import ProductLotBridgeModel from "./product-lot/product-lot-bridge";
import ProductLotErpModel from "./product-lot/product-lot-erp";
import PricesBayilojiModel from "./price/prices-bayiloji";
import PricesBridgeModel from "./price/prices-bridge";
import PricesErpModel from "./price/prices-erp";
import PriceListModel from "./price-list";

export default function (knex) {
  return {
    errors: new ErrorModel(knex).getInstance(),
    users: new UserModel(knex).getInstance(),
    settings: new SettingModel(knex).getInstance(),
    categories: new CategoryModel(knex).getInstance(),
    staff: new StaffModel(knex).getInstance(),
    priceList: new PriceListModel(knex).getInstance(),
    companyGroups: new CompanyGroupModel(knex).getInstance(),
    companies: {
      bayiloji: new CompanyBayilojiModel(knex).getInstance(),
      bridge: new CompanyBridgeModel(knex).getInstance(),
      erp: new CompanyErpModel(knex).getInstance(),
    },
    companyFiches: {
      bayiloji: new CompanyFicheBayilojiModel(knex).getInstance(),
      bridge: new CompanyFicheBridgeModel(knex).getInstance(),
      erp: new CompanyFicheErpModel(knex).getInstance(),
    },
    companyBalances: {
      bayiloji: new CompanyBalanceBayilojiModel(knex).getInstance(),
      bridge: new CompanyBalanceBridgeModel(knex).getInstance(),
      erp: new CompanyBalanceErpModel(knex).getInstance(),
    },
    products: {
      bayiloji: new ProductBayilojiModel(knex).getInstance(),
      bridge: new ProductBridgeModel(knex).getInstance(),
      erp: new ProductErpModel(knex).getInstance(),
    },
    productPhotos: {
      bayiloji: new ProductPhotosBayilojiModel(knex).getInstance(),
      bridge: new ProductPhotosBridgeModel(knex).getInstance(),
      erp: new ProductPhotosErpModel(knex).getInstance(),
    },
    productLots: {
      bayiloji: new ProductLotBayilojiModel(knex).getInstance(),
      bridge: new ProductLotBridgeModel(knex).getInstance(),
      erp: new ProductLotErpModel(knex).getInstance(),
    },
    prices: {
      bayiloji: new PricesBayilojiModel(knex).getInstance(),
      bridge: new PricesBridgeModel(knex).getInstance(),
      erp: new PricesErpModel(knex).getInstance(),
    },
  };
}
