const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (params, dev) => {
    const env = dotenv.config({ path: './.env' }).parsed;
    const specificEnv = dotenv.config({ path: './.env.' + (dev ? "development" : "production") }).parsed
    const envKeys = Object.keys(Object.assign(env, specificEnv)).reduce((prev, next) => {
        if (typeof env[next] == "string")
            prev[`process.env.${next}`] = JSON.stringify(env[next]);
        else
            prev[`process.env.${next}`] = env[next];
        return prev;
    }, { 'process.env.DEV': dev, 'process.env.PROD': !dev });
    return {
        entry: './src/index.tsx',
        output: {
            filename: '[chunkhash].js',
            path: __dirname + '/dist',
            publicPath: '/'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            alias: {
                "react-dom": "@hot-loader/react-dom",
            }
        },
        module: {
            rules: [
                {
                    test: /\.(tsx|ts)?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.(png|jpg|gif|webp|webm)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts/'
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
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html'
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin(envKeys),
            new MiniCssExtractPlugin(
                {
                    filename: 'styles.[chunkhash].css',
                }
            ),
        ]
    }
};