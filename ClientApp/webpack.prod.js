const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = (params) => merge(common(params, false), {
    mode: 'production',
    devtool: 'source-map',
});