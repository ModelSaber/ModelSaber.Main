const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = (params, dev) => {
    const env = dotenv.config({ path: './.env' }).parsed;
    const specificEnv = dotenv.config({ path: './.env.' + (dev ? "development" : "production") }).parsed
    const envKeys = Object.keys(Object.assign(env, specificEnv)).reduce((prev, next) => {
        if (typeof env[next] == "string")
            prev[`process.env.${next}`] = JSON.stringify(env[next]);
        else
            prev[`process.env.${next}`] = env[next];
        return prev;
    }, { 'process.env.DEV': dev, 'process.env.PROD': !dev, 'process.env.BASE_URL': '"/"' });
    const plugins = [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin(envKeys),
        new MiniCssExtractPlugin(
            {
                filename: '[name].[chunkhash].css',
            }
        ),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/*.png', to: '[name][ext]' },
                { from: 'public/*.svg', to: '[name][ext]' },
                { from: 'public/*.webm', to: '[name][ext]' },
                { from: 'public/manifest.json', to: 'manifest.json' }
            ]
        }),
        new ReactRefreshWebpackPlugin()
    ]
    if (!dev) plugins.push(new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    }));
    return {
        entry: './src/index.tsx',
        output: {
            filename: '[chunkhash].js',
            path: __dirname + '/dist',
            publicPath: '/'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        module: {
            rules: [
                {
                    test: /\.(tsx|ts)?$/,
                    use: {
                        loader: require.resolve('babel-loader'),
                        options: {
                            plugins: [dev && require.resolve("react-refresh/babel")].filter(Boolean)
                        }
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.(png|jpg|gif|webp|webm)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'assets/[name][ext][query]'
                            }
                        }],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext][query]',
                    }
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack'],
                },
                {
                    test: /\.s?css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        function () {
                                            return [require('autoprefixer')];
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                        }],
                }
            ],
        },
        plugins: plugins,
        target: ["browserslist"],
        optimization: {
            minimizer: [
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        preset: ["default"]
                    }
                }),
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        ecma: 6,
                        mangle: true,
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                            dead_code: true,
                            unused: true,
                            warnings: false,
                        },
                    }
                })
            ]
        }
    }
};