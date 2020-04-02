const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: {
		landing: path.join(__dirname, "src", "landing", "landing_switcher.jsx"),
		switcher: path.join(__dirname, "src", "switcher", "switcher.jsx"),
		article: path.join(__dirname, "src", "article", "article.jsx"),
		subscribe: path.join(__dirname, "src", "subscribe", "subscribe.jsx"),
		login: path.join(__dirname, "src", "landing", "login.jsx")
	},
	output: {
		path: path.join(__dirname, "build"),
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: "babel-loader"
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 10000
						}
					}
				]
			},
			{
				test: /\.(eot|svg|ttf|woff2?|otf)$/,
				use: "file-loader"
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "public", "index.html"),
			favicon: path.join(__dirname, "public", "favicon.ico")
		})
	]
};
