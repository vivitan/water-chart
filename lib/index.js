'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WaterChart = function WaterChart(options) {
    var _this = this;

    _classCallCheck(this, WaterChart);

    this.prevValue = 0;

    var _options = _extends({}, options),
        _options$className = _options.className,
        className = _options$className === undefined ? 'basic-water-chart' : _options$className,
        _options$minValue = _options.minValue,
        minValue = _options$minValue === undefined ? 0 : _options$minValue,
        _options$maxValue = _options.maxValue,
        maxValue = _options$maxValue === undefined ? 100 : _options$maxValue,
        _options$series = _options.series,
        series = _options$series === undefined ? [60] : _options$series,
        cx = _options.cx,
        cy = _options.cy,
        r = _options.r,
        _options$margin = _options.margin,
        margin = _options$margin === undefined ? 10 : _options$margin,
        _options$strokeWidth = _options.strokeWidth,
        strokeWidth = _options$strokeWidth === undefined ? 2 : _options$strokeWidth,
        _options$stroke = _options.stroke,
        stroke = _options$stroke === undefined ? '' : _options$stroke,
        _options$fill = _options.fill,
        fill = _options$fill === undefined ? 'transparent' : _options$fill,
        _options$waveCount = _options.waveCount,
        waveCount = _options$waveCount === undefined ? 1 : _options$waveCount,
        _options$waveHeight = _options.waveHeight,
        waveHeight = _options$waveHeight === undefined ? 0.25 : _options$waveHeight,
        _options$waveColor = _options.waveColor1,
        waveColor1 = _options$waveColor === undefined ? "#37ffeb" : _options$waveColor,
        _options$waveColor2 = _options.waveColor2,
        waveColor2 = _options$waveColor2 === undefined ? "#84e764" : _options$waveColor2,
        _options$fillOpacity = _options.fillOpacity,
        fillOpacity = _options$fillOpacity === undefined ? 0.8 : _options$fillOpacity,
        _options$waveRiseTime = _options.waveRiseTime,
        waveRiseTime = _options$waveRiseTime === undefined ? 1000 : _options$waveRiseTime,
        _options$waveRiseTime2 = _options.waveRiseTimeF,
        waveRiseTimeF = _options$waveRiseTime2 === undefined ? d3.easeLinear : _options$waveRiseTime2,
        _options$waveAnimateT = _options.waveAnimateTime,
        waveAnimateTime = _options$waveAnimateT === undefined ? 1600 : _options$waveAnimateT,
        _options$waveAnimatio = _options.waveAnimation,
        waveAnimation = _options$waveAnimatio === undefined ? true : _options$waveAnimatio,
        _options$waveAnimatio2 = _options.waveAnimationTimeF,
        waveAnimationTimeF = _options$waveAnimatio2 === undefined ? d3.easeLinear : _options$waveAnimatio2,
        _options$textIsAnimat = _options.textIsAnimate,
        textIsAnimate = _options$textIsAnimat === undefined ? true : _options$textIsAnimat,
        _options$textIsPercen = _options.textIsPercent,
        textIsPercent = _options$textIsPercen === undefined ? true : _options$textIsPercen,
        _options$textPosition = _options.textPositionY,
        textPositionY = _options$textPosition === undefined ? 0.2 : _options$textPosition,
        _options$textSize = _options.textSize,
        textSize = _options$textSize === undefined ? 0.5 : _options$textSize,
        _options$accuracy = _options.accuracy,
        accuracy = _options$accuracy === undefined ? 1 : _options$accuracy,
        _options$innerR = _options.innerR,
        innerR = _options$innerR === undefined ? 0 : _options$innerR,
        _options$textColor = _options.textColor1,
        textColor1 = _options$textColor === undefined ? "#3c5b96" : _options$textColor,
        textColor2 = _options.textColor2,
        textColor3 = _options.textColor3,
        _options$container = _options.container,
        container = _options$container === undefined ? 'svg' : _options$container;
    //gradient不用传递，根据stroke参数类型得出，gradient :是否渐变


    var gradient = false,
        circleColor = void 0,
        waveRise = waveAnimation; //波浪是否随着数值的变化有垂直动画,单独的从下到上的动画不支持，因为仅仅只是clippath的动画，ui不会刷新
    container = d3.select(container);
    //传递的参数初始化
    var initOptions = function initOptions() {
        if (!r) {
            var w = getComputedStyle(container.node()).width.split('px')[0],
                h = getComputedStyle(container.node()).height.split('px')[0];
            r = (Math.min(w, h) - strokeWidth) / 2;
            cx = w / 2;
            cy = h / 2;
        }
        innerR = r - margin - strokeWidth;
        if (!stroke || (typeof stroke === 'undefined' ? 'undefined' : _typeof(stroke)) === 'object') {
            gradient = true;
            if (Object.keys(stroke).length < 2) {
                waveColor1 = { begin: '#3f51b5', end: '#009688' };
                waveColor2 = { begin: '#2741b5', end: '#37ffeb' };
            } else {
                waveColor1 = _extends({}, stroke);
                waveColor2 = { begin: d3.color(stroke.begin).brighter(3), end: d3.color(stroke.end).brighter(3) };
            }
        } else {
            circleColor = stroke;
        }
    };
    var initGradient = function initGradient() {
        var gradient = container.append('defs');
        var id1 = className + 'gradient1',
            id2 = className + 'gradient2';
        var gradient1 = gradient.append('linearGradient').attr('id', id1).attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
        gradient1.append("stop").attr('class', 'start').attr("offset", "0%").style("stop-color", waveColor1.begin);
        gradient1.append("stop").attr('class', 'end').attr("offset", "100%").style("stop-color", waveColor1.end);
        var gradient2 = gradient.append('linearGradient').attr('id', id2).attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
        gradient2.append("stop").attr('class', 'start').attr("offset", "0%").style("stop-color", waveColor2.begin);
        gradient2.append("stop").attr('class', 'end').attr("offset", "100%").style("stop-color", waveColor2.end);
        waveColor1 = circleColor = 'url(#' + id1 + ')';
        waveColor2 = 'url(#' + id2 + ')';
    };
    var initOutCircle = function initOutCircle() {
        container.append('circle').attr('cx', cx).attr('cy', cy).attr('fill', fill).attr('stroke', circleColor).attr('stroke-width', strokeWidth).attr('r', r);
    };
    var initPath = function initPath(target, fn) {
        var waveHeightScale = d3.scaleLinear().range([3, innerR * 0.5]).domain([0, 1]),
            wavesHeight = waveHeightScale(waveHeight),
            wavesWidth = 2 * innerR / waveCount,
            clipCount = waveCount + 1,
            data = [];
        function makeData() {
            for (var i = 0; i <= 40 * clipCount; i++) {
                data.push({
                    x: i / (40 * clipCount),
                    y: i / 40
                });
            }
        }
        makeData();
        var scaleClipX = d3.scaleLinear().range([0, clipCount * wavesWidth]).domain([0, 1]),
            scaleClipY = d3.scaleLinear().range([0, wavesHeight * 2]).domain([-1, 1]);
        target.attr('d', d3.area().x(function (d) {
            return scaleClipX(d.x);
        }).y0(function (d) {
            return scaleClipY(fn(d.y * 2 * Math.PI));
        }).y1(function (d) {
            return 2 * innerR + wavesHeight * 2;
        })(data));
    };
    var raiseAnimate = function raiseAnimate(target) {
        var waveHeightScale = d3.scaleLinear().range([3, innerR * 0.5]).domain([0, 1]),
            wavesHeight = waveHeightScale(waveHeight),
            wavesWidth = 2 * innerR / waveCount,
            baseTrans = {
            x: cx - innerR - wavesWidth,
            y: cy - innerR - wavesHeight * 2 },
            waveRiseScale = d3.scaleLinear().range([baseTrans.y + 2 * innerR + 2 * wavesHeight, baseTrans.y + 0]).domain([0, 1]);
        var start = _this.prevEnd > 0 ? _this.prevEnd : 0 / (maxValue - minValue),
            end = (series[0] - minValue) / (maxValue - minValue);
        if (waveRise) {
            target.attr('transform', 'translate(0,' + waveRiseScale(start) + ')').transition().duration(waveRiseTime).ease(waveRiseTimeF).attr('transform', 'translate(0,' + waveRiseScale(end) + ')');
        } else {
            target.attr('transform', 'translate(0,' + waveRiseScale(end) + ')');
        }
    };
    var waveAnimate = function waveAnimate(target) {
        var waveHeightScale = d3.scaleLinear().range([3, innerR * 0.5]).domain([0, 1]),
            wavesHeight = waveHeightScale(waveHeight),
            wavesWidth = 2 * innerR / waveCount,
            baseTrans = {
            x: cx - innerR - wavesWidth,
            y: cy - innerR - wavesHeight * 2 };
        target.attr('transform', 'translate(' + baseTrans.x + ',0)');
        if (waveAnimation) {
            target.transition().duration(waveAnimateTime).ease(waveAnimationTimeF).attrTween('transform', function () {
                var i = d3.interpolate(baseTrans.x, baseTrans.x + wavesWidth);
                return function (t) {
                    return 'translate(' + i(t) + ',0)';
                };
            }).on('end', function () {
                waveAnimate(target);
            });
        }
    };
    var initWaves = function initWaves() {
        var text1 = container.append('text').attr('text-anchor', 'middle').attr('fill', textColor1).attr('transform', 'translate(' + cx + ',' + cy + ')');
        var group1 = container.append('g').attr('clip-path', 'url(#wave-clip-path1)'),
            group2 = container.append('g').attr('clip-path', 'url(#wave-clip-path2)'),
            circle1 = group1.append('circle').attr('cx', cx).attr('cy', cy).attr('r', innerR).attr('fill', waveColor1),
            circle2 = group2.append('circle').attr('cx', cx).attr('cy', cy).attr('r', innerR).attr('fill', waveColor2).attr('fill-opacity', fillOpacity),
            clipDefs = container.append('defs'),
            clipPath1 = clipDefs.append('clipPath').attr('id', 'wave-clip-path1'),
            clipPath2 = clipDefs.append('clipPath').attr('id', 'wave-clip-path2'),
            wave1 = clipPath1.append('path'),
            wave2 = clipPath2.append('path');
        var initText = function initText() {
            var text2 = group1.append('text').attr('text-anchor', 'middle').attr('fill', textColor2 || d3.color(textColor1).brighter(2)).attr('transform', 'translate(' + cx + ',' + cy + ')');
            var text3 = group2.append('text').attr('text-anchor', 'middle').attr('fill', textColor3 || d3.color(textColor1).brighter(5)).attr('transform', 'translate(' + cx + ',' + cy + ')');
            textCountAnimate(text1);
            textCountAnimate(text2);
            textCountAnimate(text3);
        };
        initPath(wave1, Math.sin);
        initPath(wave2, Math.cos);
        raiseAnimate(clipPath1);
        raiseAnimate(clipPath2);
        waveAnimate(wave1);
        waveAnimate(wave2);
        initText();
    };
    var textCountAnimate = function textCountAnimate(target) {
        var textSizeScale = d3.scaleLinear().range([14, innerR]).domain([0, 1]),
            fontSize = textSizeScale(textSize),
            startValue = (textIsAnimate ? _this.prevValue === 0 ? minValue : _this.prevValue : series[0]) / (maxValue - minValue),
            textScaleY = d3.scaleLinear().range([cy + innerR - fontSize / 2, cy - innerR + fontSize + fontSize / 2]).domain([1, 0]),
            textUnit = function () {
            return textIsPercent ? '%' : '';
        }();
        target.text((startValue * 100).toFixed(accuracy) + textUnit).attr('font-size', fontSize).attr('transform', 'translate(' + cx + ',' + textScaleY(textPositionY) + ')');
        var finalValue = series[0],
            oriFinalValue = series[0];
        if (textIsAnimate) {
            var textTween = function textTween() {
                var self = this;
                var i = d3.interpolate(parseFloat(self.textContent), finalValue);
                return function (t) {
                    self.textContent = parseFloat(i(t)).toFixed(accuracy) + textUnit;
                };
            };
            target.transition().duration(waveRiseTime).tween("text", textTween);
        }
    };
    initOptions();
    if (gradient) {
        initGradient();
    };
    initOutCircle();
    initWaves();
};

exports.default = WaterChart;