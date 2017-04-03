var path = require('path');
module.exports = {
	entry: path.resolve(__dirname, 'src/main.js'),
	// Config for our build files
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{test: /\.jsx$/, exclude: /(libs|node_modules)/, loader: 'babel?stage=0'},
			{test: /\.(es6|js)$/, exclude: /(libs|node_modules)/, loader: 'babel?stage=0'},
			{test: /\.(png|jpg|ttf|woff|svg|eot)$/, loader: 'url-loader?limit=8192'},// inline base64 URLs for <=8k images, direct URLs for the rest
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 versions'
			},
			// support for .html as raw text
			{test: /\.html$/, loader: 'raw'},
			{
				test: /\.(scss|sass)$/,
				loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 versions!sass?sourceMap'
			},
			{
				test: /\.ts$/,
				exclude: /(libs|node_modules)/,
				loader: 'typescript-simple',
				query: {
					'ignoreWarnings': [
						2300, // 2300 -> Duplicate identifier
						2309, // 2309 -> An export assignment cannot be used in a module with other exported elements.
						2346, // 2346 -> Supplied parameters do not match any signature of call target.
						2432  // 2432 -> In an enum with multiple declarations, only one declaration can omit an initializer for its first enum element.
					]
				}
			}
		],
	},
	externals: {
		jquery: "jQuery",
		pageResponse: 'pageResponse'
	},
	resolve: {
		alias: {
			libs: path.resolve(__dirname, 'libs'),
			nm: path.resolve(__dirname, "node_modules")
		}
	}
};