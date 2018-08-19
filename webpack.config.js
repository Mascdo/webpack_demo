const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const entry = require('./webpack_config/entry_webpack.js');
const copyWebpackPlugin = require('copy-webpack-plugin');

console.log(encodeURIComponent(process.env.type));
if(process.env.type=="build"){
  var website = {
    publicPath: "http://webwebweb.com:1313/"
  }
}else{
  var website = {
    publicPath: "http://192.168.0.196:1313/"
  }
}



module.exports={
  devtool:'',
  entry:{
    entry:'./src/entry.js',
    jquery:'jquery',
    vue: 'vue'
  },
  output:{
    path:path.resolve(__dirname, 'dist'),
    filename:'[name].js',
    publicPath:website.publicPath
  },
  module:{
    rules:[
      {
        test:/\.css$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {loader: 'css-loader', options:{importLoaders:1}},
            'postcss-loader'
          ]
        })

      },{
        test:/\.(png|jpg|gif)/,
        use:[{
          loader:'url-loader',
          options:{
            limit: 5000, // 大于5000b把图片拷贝过去 否则的话变成base64
            outputPath:'images/',
          }
        }]
      },{
        test:/\.(htm|html)$/i,
        use:['html-withimg-loader']
      },{
        test:/\.less$/,
        use:extractTextPlugin.extract({
          use:[{
            loader: "css-loader"
          },{
            loader: "less-loader"
          }],
          fallback:"style-loader"
        })
      },{
        test:/\.scss/,
        use:extractTextPlugin.extract({
          use:[{
            loader:"css-loader"
          },{
            loader:"sass-loader"
          }],
          fallback:"style-loader"
        })
      },{
        test:/\.(jsx|js)$/,
        use:{
          loader:'babel-loader',
        },
        exclude:/node_modules/
      }
    ]
  },
  plugins:[
    new webpack.optimize.CommonsChunkPlugin({
      name: ['jquery', 'vue'], // 对应入口文件的jquery，单独抽离
      filename: "assets/js/[name].js", // 抽离到的路径
      minChunks: 2 // 最小抽离出两个文件
    }),



    //new uglifyPlugin()
    new webpack.ProvidePlugin({
      $:"jquery"
    }),
    new htmlPlugin({
      minify:{
        removeAttributeQuotes: true,
      },
      hash: true,
      template:'./src/index.html',
    }),
    new extractTextPlugin("css/index.css"),
    new PurifyCSSPlugin({
      paths:glob.sync(path.join(__dirname,'src/*.html'))
    }),
    new webpack.BannerPlugin('Museuseuse, practice.'),
    new copyWebpackPlugin([{
      from:__dirname+'/src/public', // 要打包的静态资源地址
      to: './public'
    }]),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer:{
    contentBase:path.resolve(__dirname, 'dist'),
    host:'192.168.0.196',
    compress:true,
    port: 1313,
  },
  watchOptions:{
    poll: 1000, // 1s更新一次
    aggregeateTimeout: 500, // 半秒内重复打包只算一次
    ignored:/node_modules/, // 忽视文件
  }
}
