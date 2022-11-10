const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const mode = process.env.mode || 'development';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ijiaoyanHost = 'https://ijiaoyan.aixuexi.com';

module.exports = env => {
	return ({
		context: process.cwd(),
		entry: './src/index.js',
		mode,
		devtool: 'source-map',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'bundle.js',
			libraryTarget: 'umd'
		},
		resolve: {
			extensions: ['.js', '.jsx', '.ts', '.tsx', '.less']
		},
		module: {
			rules: [
				{
					test: /(\.js|\.tsx|\.ts)$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: [
									[
										'@babel/preset-typescript',
										{
											isTSX: true,
											allExtensions: true
										}
									]
								]
							}
						}
					]
				},
				{
					test: /\.jsx?$/, use: [
						{
							loader: 'babel-loader',
							options: {
								presets: [
									'@babel/preset-react'
								],
								plugins: [
									['@babel/plugin-proposal-decorators', { legacy: true }], //
									['@babel/plugin-proposal-class-properties', { loose: true }]
								]
							}
						}
					]
				},
				{ test: /\.txt$/, use: 'raw-loader' },
				{ test: /\.css/, use: ['style-loader', 'css-loader', 'postcss-loader'] }, // 从右往左执行,需要安装依赖
				{ test: /\.less/, use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'] }, //
				{ test: /\.scss/, use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'] }, //
				{
					test: /\.(png|jpg|gif)$/,
					use: [{
						loader: 'file-loader',
						options: {
							name: '[hash:10].[ext]'
						}
					}
					]
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './src/index.html'
			}),
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: ['**/*']
			})
		],
		devServer: {
			// contentBase: path.resolve(__dirname, 'static'), // 当前目录下的文件夹作为公共资源使用
			// writeToDisk: true, // 打包后的文件写到硬盘上
			compress: true, // 是否启动压缩
			port: 8080, // 指定HTTP服务器的端口号
			open: false, // 是否自动打开浏览器
			proxy: {
				'/api': {
					target: 'http://localhost:3000',
					pathRewrite: { // 正则匹配，路径重写
						'^/api': ''
					}
				},
				'/tiku/': {
					target: ijiaoyanHost,
					changeOrigin: true,
					secure: false,
				  },
			}
		},
		externals: [
			'react',
		],
	});
};
