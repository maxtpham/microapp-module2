var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    entry: [
        ...process.env.NODE_ENV === 'production' ? ['babel-polyfill'] : [`webpack-dev-server/client?${process.env.WEBPACK_URL || `http://localhost:${process.env.DEV_PORT || 3002}`}/`, 'webpack/hot/only-dev-server', 'babel-polyfill'],
        './scripts/index.ts'
    ],
    output: process.env.NODE_ENV === 'development' ? {
        filename: 'bin/dev/app.js',
        publicPath: (process.env.WEBPACK_URL || `http://localhost:${process.env.DEV_PORT || 3002}`) + '/'
    } : {
        filename: 'app.js',
        path: path.resolve(__dirname, 'bin/prd/')
    },
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : 'hidden-source-map',
    externals: process.env.NODE_ENV === 'development' ? {} : {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    watchOptions: {
        ignored: /node_modules/
    },
    devServer: {
        disableHostCheck: process.env.NODE_ENV === 'development',
        historyApiFallback: process.env.NODE_ENV === 'production' ? false: { // true for index.html upon 404, object for multiple paths => react-router
            index: 'bin/dev/',
            disableDotRule: true,
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
    },
    plugins: [
        ...process.env.NODE_ENV === 'development' ? [] : [ new webpack.DefinePlugin({'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) }}), new webpack.optimize.UglifyJsPlugin() ],
        new ExtractTextPlugin(process.env.NODE_ENV === 'development' ? 'bin/dev/app.css' : 'app.css'),
        new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/)
    ],
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".ts", ".tsx"]
    },
    module: {
        rules: [
            {
                test: /\.(css|sass|scss)$/,
                include: /(node_modules)/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                minimize: (process.env.NODE_ENV === 'production'),
                                modules: false,
                                sourceMap: (process.env.NODE_ENV === 'development'),
                                importLoaders: 0,
                                localIdentName: '[path]_[name]_[local]'
                            },
                        },
                        {
                            loader: 'sass-loader',
                            query: {
                                sourceMap: (process.env.NODE_ENV === 'development'),
                                sourceMapContents: (process.env.NODE_ENV === 'development'),
                            },
                        },
                    ]
                })
            },
            {
                test: /\.(css|sass|scss)$/,
                exclude: /(node_modules)/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'typings-for-css-modules-loader',
                            query: {
                                minimize: (process.env.NODE_ENV === 'production'),
                                modules: true,
                                sourceMap: (process.env.NODE_ENV === 'development'),
                                importLoaders: 2,
                                localIdentName: '[path]_[name]_[local]'
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [require('autoprefixer')({browsers: ["> 1%", "last 2 versions"]})]
                            }
                        },
                        {
                            loader: 'sass-loader',
                            query: {
                                sourceMap: (process.env.NODE_ENV === 'development'),
                                sourceMapContents: (process.env.NODE_ENV === 'development'),
                            },
                        },
                    ]
                })
            },
            {
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                use: [
                    //'react-hot-loader',
                    'babel-loader?presets[]=env',
                    'ts-loader'
                ]
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: [
                    'babel-loader?presets[]=env',
                ]
            },
            {
                test: /\.js?$/,
                include: /(@mbb|@gtm)/,
                use: [
                    'babel-loader?presets[]=env',
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|eot|ttf|woff|woff2|wav|mp3|mp4|apk|csv)$/,
                use: 'file-loader?name=[path][name].[ext]'
            }
        ]
    }
};