const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = (params) => merge(common(params, false), {
    mode: 'production',
    devServer: {
        hot: true,
        port: 3000,
        host: "localhost",
        historyApiFallback: true,
        open: false
    },
    devtool: 'source-map',
});