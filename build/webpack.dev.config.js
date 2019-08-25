
const fs = require('fs');
const path = require('path');
const resolve = dir => path.resolve(__dirname, '../', dir);

module.exports = config => {
  config.output.publicPath = '/';
  config.devServer = {
    host: 'localhost',
    port: '8080',
    // https: {
    //   key: fs.readFileSync(resolve('build/ssl/key.pem')),
    //   cert: fs.readFileSync(resolve('build/ssl/crt.pem'))
    // }
  };
}