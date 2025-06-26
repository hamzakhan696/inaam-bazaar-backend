const { createNestServer } = require('../dist/src/main');

let cachedServer = null;

module.exports = async (req, res) => {
  if (!cachedServer) {
    cachedServer = await createNestServer();
  }
  return cachedServer(req, res);
}; 