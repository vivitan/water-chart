import WaterChart from './index.js'; // ES6 Module
module.exports = {
    run: function (name) {
        new WaterChart(name);
    }
};