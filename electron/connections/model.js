import _ from "lodash";
import * as dateFns from "date-fns";

export default class Model {
  timeout = 1000;

  name = "";

  tableName = "";

  knex = {};

  casts = {};

  columnDescriptions = {};
  columnSchemes = {};

  constructor(knex) {
    this.knex = knex;
    setTimeout(() => {
      this.knex
        .table(this.tableName)
        .columnInfo()
        .then((result) => (this.columnSchemes = result));
    }, 250);
  }

  /** Tablodaki tüm kayıtları getirme fonksiyonu */
  async get(ctx = {}) {
    const query = this.generalBuilderMethods(
      this.knex.from(this.tableName),
      ctx
    );
    return query.then((results) => this.fromCast(results));
  }

  async paginate(start, take, where = {}) {
    const query = this.knex
      .from(this.tableName)
      .where(where)
      .limit(take)
      .offset(start);
    return query.then((results) => this.fromCast(results));
  }

  /** Tek kayıt ekleme fonksiyonu */
  async create(props) {
    let formattedProps = this.beforeCreate(props);
    formattedProps = this.beforeSave(formattedProps);
    formattedProps = this.toCast(formattedProps);

    return this.knex
      .insert(formattedProps)
      .into(this.tableName)
      .then((results) => {
        return Array.isArray(results) ? results[0] : results;
      });
  }

  /** Çoklu kayıt ekleme fonksiyonu */
  async insert(rows = []) {
    if (rows.length > 0) {
      for (const chunk of _.chunk(rows, 100)) {
        await this.knex
          .insert(
            chunk.map((item) => {
              let formattedProps = this.beforeCreate(item);
              formattedProps = this.beforeSave(formattedProps);
              return this.toCast(formattedProps);
            })
          )
          .into(this.tableName)
          .then((results) => results);
      }
    }
    return Promise.resolve();
  }

  async first(ctx = {}) {
    const query = this.generalBuilderMethods(
      this.knex.from(this.tableName),
      ctx
    );

    return query.first().then((results) => this.fromCast(results));
  }

  async delete(ctx = {}) {
    const query = this.generalBuilderMethods(
      this.knex.from(this.tableName),
      ctx
    );
    return query.del().then((results) => {
      return Array.isArray(results) ? results[0] : results;
    });
  }

  async deleteGTE(key, val) {
    return this.knex
      .from(this.tableName)
      .where(key, ">=", val)
      .del()
      .then((result) => result);
  }

  async update(props, where = {}) {
    let formattedProps = await this.beforeUpdate(props);
    formattedProps = await this.beforeSave(formattedProps);

    return this.knex
      .update(this.toCast(formattedProps))
      .from(this.tableName)
      .where(where)
      .then((results) => {
        return Array.isArray(results) ? results[0] : results;
      });
  }

  async createOrUpdate(props, where = {}) {
    return this.first({ where }).then((result) => {
      if (result) return this.update(props, where);
      else return this.create(props);
    });
  }

  // Empty değerleri Null yapıyor.
  emptyToNullAndInsert(query, knexErp) {
    return knexErp.raw(query).then((rows) => {
      const chunks = _.chunk(rows, 500);
      chunks.map((item) => {
        item.forEach((row) => {
          for (const [key, value] of Object.entries(row)) {
            if (value === "") {
              row[key] = null;
            }
          }
        });
        this.insert(item);
      });
    });
  }

  emptyToNullThenInsert(rows) {
    const chunks = _.chunk(rows, 500);
    chunks.map((item) => {
      item.forEach((row) => {
        for (const [key, value] of Object.entries(row)) {
          if (value === "") {
            row[key] = null;
          }
        }
      });
      this.insert(item);
    });
    return rows.length;
  }

  async truncate() {
    return this.knex
      .table(this.tableName)
      .truncate()
      .then((results) => results);
  }

  async raw(sql, parameters) {
    return this.knex.raw(sql, parameters).then((rows) => rows);
  }

  async getColumnNames() {
    return this.columnSchemes;
  }

  getColumnDescriptions() {
    return Object.keys(this.columnDescriptions)
      .sort()
      .reduce((obj, key) => {
        obj[key] = this.columnDescriptions[key];
        return obj;
      }, {});
  }

  beforeCreate(props) {
    return props;
  }

  beforeUpdate(props) {
    return props;
  }

  beforeSave(props) {
    const schemeKeys = _.keys(this.columnSchemes);
    const keys = _.keys(props);
    const expect = keys.filter((o) => schemeKeys.indexOf(o) === -1);
    const data = _.omit(props, expect);
    Object.keys(data).map((k) => {
      data[k] = typeof data[k] === "string" ? data[k].trim() : data[k];
    });
    return data;
  }

  generalBuilderMethods(query, ctx = {}) {
    if (ctx.whereIn) {
      _.forEach(ctx.whereIn, (val, key) => {
        query.whereIn(key, val);
      });
    }
    if (ctx.whereNotIn) {
      _.forEach(ctx.whereNotIn, (val, key) => {
        query.whereNotIn(key, val);
      });
    }
    if (ctx.where) {
      _.forEach(ctx.where, (val, key) => {
        query.where(key, val);
      });
    }
    if (ctx.orderBy) {
      _.forEach(ctx.orderBy, (val, key) => {
        query.orderBy(key, val);
      });
    }
    if (ctx.select) {
      query.select(ctx.select);
    }

    return query;
  }

  async count(ctx = {}) {
    return this.generalBuilderMethods(this.knex.from(this.tableName), ctx)
      .count("* as count")
      .then((results) => _.get(results, "0.count") || 0);
  }

  fromCast(data) {
    const items = _.isArray(data) ? _.clone(data) : [data];

    items.map((item) => {
      _.forEach(this.casts, (cast, key) => {
        try {
          if (_.has(item, key)) {
            if (cast === "json" && item[key]) item[key] = JSON.parse(item[key]);
            if (cast === "boolean") item[key] = !!item[key];
          }
        } catch (e) {}
      });
    });

    return _.isArray(data) ? items : _.get(items, 0) || null;
  }

  toCast(data) {
    const items = _.isArray(data) ? _.clone(data) : [data];

    items.map((item) => {
      _.forEach(this.casts, (cast, key) => {
        try {
          if (_.has(item, key)) {
            if (cast === "json" && item[key])
              item[key] = JSON.stringify(item[key]);
            if (cast === "boolean") item[key] = !!item[key] ? 1 : 0;
            if (cast === "datetime")
              item[key] = this.dateToIsoString(item[key]);
          }
        } catch (e) {}
      });
    });

    return _.isArray(data) ? items : _.get(items, 0) || null;
  }

  dateToIsoString(date) {
    if (!date) return null;
    if (_.isNumber(date)) date = new Date(date);
    else if (_.isString(date)) {
      if (/^\d{4}[-]\d{2}[-]\d{2}$/.test(date)) {
        date = dateFns.parse(date, "yyyy-MM-dd", new Date());
      } else if (/^\d{4}[-]\d{2}[-]\d{2}[ ]\d{2}[:]\d{2}$/.test(date)) {
        date = dateFns.parse(date, "yyyy-MM-dd HH:mm", new Date());
      } else if (/^\d{4}[-]\d{2}[-]\d{2}[ ]\d{2}[:]\d{2}[:]\d{2}$/.test(date)) {
        date = dateFns.parse(date, "yyyy-MM-dd HH:mm:ss", new Date());
      } else {
        date = new Date(date);
      }
    }
    if (date instanceof Date) return date.toISOString();
    return null;
  }

  getInstance() {
    return {
      knex: this.knex,
      name: this.name,
      tableName: this.tableName,
      get: this.get.bind(this),
      first: this.first.bind(this),
      create: this.create.bind(this),
      insert: this.insert.bind(this),
      update: this.update.bind(this),
      delete: this.delete.bind(this),
      deleteGTE: this.deleteGTE.bind(this),
      truncate: this.truncate.bind(this),
      createOrUpdate: this.createOrUpdate.bind(this),
      raw: this.raw.bind(this),
      getColumnNames: this.getColumnNames.bind(this),
      getColumnDescriptions: this.getColumnDescriptions.bind(this),
      count: this.count.bind(this),
      paginate: this.paginate.bind(this),
      emptyToNullAndInsert: this.emptyToNullAndInsert.bind(this),
    };
  }
}
