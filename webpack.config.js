import { fileURLToPath } from "url";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import DotenvWebpackPlugin from "dotenv-webpack";
import webpack from "webpack";
import { createRequire } from "module";
import dotenv from "dotenv";
dotenv.config();

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === "development";

export default {
  entry: {
    main: path.resolve(__dirname, "./src/index"),
  },
  mode: isDev ? "development" : "production",
  devtool: isDev ? "inline-source-map" : false,
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      img: path.join(__dirname, "src", "assets", "img"),
      svg: path.join(__dirname, "src", "assets", "svg"),
    },
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.inline\.svg$/i,
        type: "asset/source",
      },
      {
        test: /\.svg$/i,
        exclude: /\.inline\.svg$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/svg/[name][ext]",
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource",
        generator: {
          // filename: 'assets/img/[name][hash][ext]',
          filename: "assets/img/[name][ext]",
        },
      },
      {
        test: /\.(ts|tsx)$/i,
        use: "ts-loader",
        exclude: [/node_modules/, /\.(spec|test)\.ts$/],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public"),
          to: path.resolve(__dirname, "dist/public"),
          globOptions: {
            ignore: ["**/*.html"],
          },
        },
        {
          from: path.resolve(__dirname, "public/404.html"),
          to: path.resolve(__dirname, "dist/404.html"),
        },
        // { from: path.resolve(__dirname, "src/assets"), to: path.resolve(__dirname, "dist/assets") },
      ],
    }),
    new ESLintPlugin({
      eslintPath: require.resolve("eslint"),
      extensions: ["js", "ts", "tsx"],
    }),
    new DotenvWebpackPlugin(),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: process.env.PORT || 3020,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
};
