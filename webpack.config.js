const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');

var website = {
  publicPath: "http://192.168.0.196:1313/",
}

module.exports={
  devtool:'',
  entry:{
    entry:'./src/entry.js',
    entry2:'./src/entry.js',
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
    //new uglifyPlugin()
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
    })
  ],
  devServer:{
    contentBase:path.resolve(__dirname, 'dist'),
    host:'192.168.0.196',
    compress:true,
    port: 1313,
  }
}
