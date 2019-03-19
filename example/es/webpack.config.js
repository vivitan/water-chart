module.exports = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                use : [
                    {
                        loader: "babel-loader"
                    }
                ],
                exclude:/node_modules/
            }
        ]
    }
};