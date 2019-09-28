const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const FilewatcherPlugin = require("filewatcher-webpack-plugin");
const ForkTsCheckerNotifierWebpackPlugin = require("fork-ts-checker-notifier-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HappyPack = require("happypack");
const happyThreadPool = HappyPack.ThreadPool({ size: 7 });


module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    const isWatching = !(env && env.watch);

    console.log("isWatching", isWatching);

    const outputDir = (env && env.publishDir)
        ? env.publishDir
        : __dirname;

    return {
        mode: isDevBuild ? "development" : "production",

        devtool: isDevBuild ? "inline-source-map" : false,

        target: "web",

        stats: {
            modules: true
        },

        entry: {
            "TestA": "./ClientApp/TestA.ts",
            "TestB": "./ClientApp/TestB.ts"
        },

        watchOptions: {
            ignored: /node_modules/
        },

        output: {
            filename: "dist/[name].js",
            publicPath: "/",
            path: path.join(outputDir, "wwwroot"),
            libraryTarget: "umd",
            library: "[name]",
            umdNamedDefine: true,
            globalObject: "window",
            pathinfo: false
        },

        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json", ".resx"],
            modules: ["node_modules"],
            plugins: [
                new TsconfigPathsPlugin(
                    {
                        configFile: "./tsconfig.json"
                    }
                )
            ]
        },

        module: {
            rules: [
                {
                    test: [/\.resx$/],
                    use: [
                        {
                            loader: path.resolve("./chinsay-resx2ts-loader.js"),
                            options: {
                                typeScriptResourcesNamespace: "test",
                                virtualResxFolder: "./Resources",
                                virtualTypeScriptFolder: "./ClientApp/Resources"
                            }
                        }
                    ]
                },
                {
                    test: require.resolve("jquery"),
                    use: [
                        {
                            loader: "expose-loader",
                            options: "jQuery"
                        },
                        {
                            loader: "expose-loader",
                            options: "$"
                        }
                    ]
                },
                {
                    test: require.resolve("knockout"),
                    use: [
                        {
                            loader: "expose-loader",
                            options: "ko"
                        }
                    ]
                },
                {
                    test: /\.(ts|tsx)?$/,
                    include: /ClientApp/,
                    use: "happypack/loader?id=tsx"
                },
                // {
                //     test: /\.js$/,
                //     enforce: "pre",
                //     use: "happypack/loader?id=pre"
                // }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(
                {
                    cleanOnceBeforeBuildPatterns: [
                        path.join(outputDir, "wwwroot", "dist")
                    ]
                }
            ),
            new HappyPack(
                {
                    id: "tsx",
                    threadPool: happyThreadPool,
                    loaders: [
                        {
                            path: "ts-loader",
                            query: {
                                happyPackMode: true,
                                configFile: path.resolve(__dirname, "./tsconfig.json"),
                                transpileOnly: true,
                                experimentalWatchApi: true
                            }
                        }
                    ]
                }
            ),
            // new HappyPack(
            //     {
            //         id: "pre",
            //         threadPool: happyThreadPool,
            //         loaders: [
            //             {
            //                 path: "source-map-loader",
            //                 query: {
            //                     happyPackMode: true
            //                 }
            //             }
            //         ]
            //     }
            // ),
            new ForkTsCheckerWebpackPlugin(
                {
                    tsconfig: path.resolve(__dirname, "./tsconfig.json"),
                    eslint: true,
                    checkSyntacticErrors: true
                }
            ),
            // new ForkTsCheckerNotifierWebpackPlugin(
            //     {
            //         title: "TypeScript",
            //         excludeWarnings: false
            //     }
            // )
        ].concat(
            isWatching
                ? new FilewatcherPlugin(
                    {
                        watchFileRegex: [
                            "./Resources/**/*.resx",
                            "./Resources/**/*.cs"
                        ]
                    }
                )
                : []
        ),
        optimization: {
            runtimeChunk: "single",
            minimizer: [
                new TerserPlugin(
                    {
                        chunkFilter: (chunk) => {
                            if (chunk.name === "vendor") {
                                return false;
                            }
                            return true;
                        }
                    }
                )
            ],
            splitChunks: {
                chunks: "all",
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    default: {
                        name: "common",
                        minChunks: 2,
                        priority: 1,
                        reuseExistingChunk: true
                    },
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: 2,
                        name(module) {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                            return `vendor.${packageName.replace("@", "")}`;
                        }
                    }
                }
            }
        }
    };
};
