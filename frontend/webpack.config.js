// webpack.config.js

module.exports = {
    module: {
      rules: [
        {
          test: /\.module\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true, // CSS Modulesを有効にするオプション
              },
            },
          ],
        },
      ],
    },
  };
  