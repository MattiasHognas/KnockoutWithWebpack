const { join } = require("path");
const webpack = require("webpack");
// const { CheckerPlugin } = require("awesome-typescript-loader");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    const outputDir = (env && env.publishDir)
        ? env.publishDir
        : __dirname;

    return [{
        mode: isDevBuild ? "development" : "production",

        devtool: "source-map",

        target: "web",

        stats: {
            modules: true
        },

        entry: {
            // "App": "./ClientApp/App.tsx",
            "TestA": "./ClientApp/TestA.ts",
            "TestB": "./ClientApp/TestB.ts"
        },

        watchOptions: {
            ignored: /node_modules/
        },

        output: {
            filename: "dist/[name].js",
            publicPath: "/",
            path: join(outputDir, "wwwroot"),
            libraryTarget: 'umd',
            library: '[name]',
            umdNamedDefine: true,
            globalObject: 'window'
            // library: 'app',
            // libraryTarget: 'var'
        },

        resolve: {
            // Add ".ts" and ".tsx" as resolvable extensions.
            extensions: [".ts", ".tsx", ".js", ".json"],
            modules: ["node_modules"]
        },

        devServer: {
             hot: true
        },

        module: {
            rules: [
                {
                    test: require.resolve('jquery'),
                    use: [
                        {
                            loader: 'expose-loader',
                            options: '$'
                        }
                    ]
                },
                // All files with a ".ts" or ".tsx" extension will be handled by "awesome-typescript-loader".
                {
                    test: /\.tsx?$/,
                    include: /ClientApp/,
                    use: [
                        {
                            loader: "ts-loader"
                        }
                    ]
                    // loader: [
                    //     {
                    //         loader: "awesome-typescript-loader",
                    //         options: {
                    //             useCache: true,
                    //             useBabel: true,
                    //             babelOptions: {
                    //                 babelrc: false,
                    //                 // plugins: ["react-hot-loader/babel"],
                    //             }
                    //         }
                    //     }
                    // ]
                },
                {
                    enforce: "pre",
                    test: /\.js$/,
                    loader: "source-map-loader"
                }
            ]
        },
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                chunks: "all",
                minSize: 0,
                cacheGroups: {
                    default: {
                        name: 'common',
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    },
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                        minChunks: 2
                    }
                }
            }
        },
        // externals: {
        //     "react": "React",
        //     "react-dom": "ReactDOM"
        // },
        plugins: [
            // new webpack.ProvidePlugin({
            //     $: 'jquery',
            //     jQuery: 'jquery',
            //     'window.jQuery': 'jquery'
            // }),
            new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [join(outputDir, "wwwroot", "dist")] }),
            // new CheckerPlugin()
        ]
    }];
};
