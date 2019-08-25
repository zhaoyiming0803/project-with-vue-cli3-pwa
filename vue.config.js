/**
 * https://github.com/zymfe/project-with-vue-cli3/blob/master/vue.config.js
 * vue-cli3 自定义配置
 * @author zhaoyiming
 * @since  2019/08/16
 */

const path = require('path');
const resolve = dir => path.resolve(__dirname, './', dir);
const webpackDevConfig = require('./build/webpack.dev.config');
const webpackProdConfig = require('./build/webpack.prod.config');

const configure = {
  development: config => webpackDevConfig(config),
  production: config => webpackProdConfig(config)
}

// doc: https://github.com/neutrinojs/webpack-chain
const chainWebpack = config => {
  config.resolve.alias
    .set('public', resolve('public'));
  config.resolve.extensions
    .add('.less')
    .add('.css');

  config.plugins
    .delete('prefetch')
    .delete('preload');

  config.plugin('inline-source')
    .use(require('html-webpack-inline-source-plugin'))
    .after('html');

  config.plugin('script-ext')
    .use(require('script-ext-html-webpack-plugin'), [{
      defaultAttribute: 'defer'
    }])
    .after('html');

  config.plugin('html')
    .tap(args => {
      args[0].inlineSource = '.(app|chunk-vendors).*.(css|js)';
      // args[0].minify = undefined;
      args[0].var = {
        isProd: process.env.npm_lifecycle_event === 'build'
      }
      return args;
    });
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/project-with-vue-cli3-pwa/'
    : '/',
  configureWebpack: config => configure[process.env.NODE_ENV](config),
  chainWebpack: chainWebpack
};
