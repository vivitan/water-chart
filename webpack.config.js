module.exports = {
    mode: 'production',
    output: {
        filename: 'water-chart.min.js',
        library: 'WaterChart',
        libraryTarget: 'umd',
        libraryExport: "default",
    },
    externals: {
        d3: 'd3'
    },
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