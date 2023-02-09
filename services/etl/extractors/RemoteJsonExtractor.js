const axios = require('axios');

module.exports = class RemoteJsonExtractor {
  constructor(url) {
    this.url = url;
  }

  async extract() {
    const res = await axios.get(this.url);
    return res.data;
  }
};
