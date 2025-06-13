function localDatabase() {
  const localeConnection = window.expose.connections.local();
  return {
    testConnection: localeConnection.testConnection,
    ...localeConnection.models,
  };
}

const install = (app) => {
  app.config.globalProperties.$db = localDatabase;
};

export { install as default, localDatabase };
