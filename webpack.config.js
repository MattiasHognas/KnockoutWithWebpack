const { join } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

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
            path: join(outputDir, "wwwroot"),
            libraryTarget: "umd",
            library: "[name]",
            umdNamedDefine: true,
            globalObject: "window",
            pathinfo: false
        },

        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
            modules: ["node_modules"]
        },

        module: {
            rules: [
                {
                    test: require.resolve("jquery"),
                    use: [
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
                    test: /\.tsx?$/,
                    include: /ClientApp/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                transpileOnly: true,
                                experimentalWatchApi: true
                            }
                        }
                    ]
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
                        priority: -20,
                        reuseExistingChunk: true
                    },
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                            return `vendor.${packageName.replace("@", "")}`;
                        }
                    }
                }
            }
        },
        plugins: [
            new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [join(outputDir, "wwwroot", "dist")] })
        ]
    };
};
