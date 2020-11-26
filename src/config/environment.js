let environment = {};
switch (process.env.NODE_ENV) {
  case 'development': {
    environment.appUrl = "http://39.98.85.187:8083/api/";
  }
    break;
  case 'production': {
    environment.appUrl = "http://39.98.85.187:8083/api";
  }
    break;
  case 'testing': {
    environment.appUrl = "http://39.98.85.187:8083/api/";
  }
    break;
}
export default environment;

