const common = require('./webpack.common.js');

module.exports = (params) => Object.assign(common(params, true), {
    mode: 'development',
    devServer: {
        hot: true,
        port: 3000,
        host: "localhost",
        historyApiFallback: true,
        open: false
    },
    devtool: 'inline-source-map',
});