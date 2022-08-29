import Webpack from "webpack";
import { join } from "path";
import TerserPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin, { loader as _loader } from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import FileManagerPlugin from "filemanager-webpack-plugin";

const opts = {
  rootDir: process.cwd(),
  devBuild: process.env.NODE_ENV !== "production"
};

export const entry = {
  app: "./src/js/app.js"
};
export const mode = process.env.NODE_ENV === "production" ? "production" : "development";
export const devtool = process.env.NODE_ENV === "production" ? "source-map" : "inline-source-map";
export const output = {
  path: join(opts.rootDir, "dist"),
  pathinfo: opts.devBuild,
  filename: "js/[name].js",
  chunkFilename: 'js/[name].js',
};
export const performance = { hints: false };
export const optimization = {
  minimizer: [
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        ecma: 5
      }
    }),
    new CssMinimizerPlugin({})
  ],
  runtimeChunk: false
};
export const plugins = [
  // Extract css files to seperate bundle
  new MiniCssExtractPlugin({
    filename: "css/app.css",
    chunkFilename: "css/app.css"
  }),
  // Copy fonts and images to dist
  new CopyWebpackPlugin({
    patterns: [
      { from: "src/fonts", to: "fonts" },
      { from: "src/img", to: "img" }
    ]
  }),
  // Copy dist folder to static
  new FileManagerPlugin({
    events: {
      onEnd: {
        copy: [
          { source: "./dist/", destination: "./static" }
        ]
      }
    }
  }),
];
export const module = {
  rules: [
    // Babel-loader
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: "babel-loader",
        options: {
          cacheDirectory: true
        }
      }
    },
    // Css-loader & sass-loader
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        _loader,
        "css-loader",
        "postcss-loader",
        {
          loader: "sass-loader",
          options: {
            implementation: require.resolve("sass"),
          }
        }
      ]
    },
    // Load fonts
    {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      type: "asset/resource",
      generator: {
        filename: "fonts/[name][ext]"
      }
    },
    // Load images
    {
      test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/,
      type: "asset/resource",
      generator: {
        filename: "img/[name][ext]"
      }
    },
  ]
};
export const resolve = {
  extensions: [".js", ".scss"],
  modules: ["node_modules"],
  alias: {
    request$: "xhr"
  }
};
export const devServer = {
  static: {
    directory: join(__dirname, "static")
  },
  compress: true,
  port: 8080,
  open: true
};
