import * as d3 from 'd3'

export default class WaterChart{

    constructor(options){
        this.prevValue = 0;
        let {
            className = 'basic-water-chart',
            minValue = 0, // 最小值
            maxValue = 100,//最大值
            series = [60],//当前值,这里为了配合云图的数据格式，采用了数组形式
            cx,//圆心
            cy,//圆心
            r,//外圆半径
            margin = 10,//外圆到波浪的距离
            strokeWidth = 5,//外圆的边框宽度
            stroke ='',//外圆的颜色，如果没有传值，默认为渐变色，如果指定了渐变色，底部波浪和外圆使用一个渐变色，上层圆提亮几个level
            fill = 'transparent',//外圆的背景色
            waveCount= 1,//图形中有几个波浪
            waveHeight = 0.25,// 波浪的高度，即：振幅,最小为3px，最大为内圆的一半；
            waveColor1 = "#37ffeb", // 底层波浪的颜色
            waveColor2 = "#84e764", // 上层波浪的颜色
            fillOpacity = 0.8,//波浪2的透明度
            waveRiseTime = 1000,// 波浪垂直动画的时间
            waveRiseTimeF = d3.easeLinear,//垂直动画的时间函数
            waveAnimateTime = 1600, //水平动画时间
            waveAnimation = true,//是否进行水平动画，这个肯定要有吧，不然怎么对得起写动画的人呢？四不四
            waveAnimationTimeF = d3.easeLinear,//水平动画的时间函数
            textIsAnimate = true,//文本是否有从小变大的动画
            textIsPercent = true,//是否加百分号显示
            textUnit,//指定单位
            textUnitSize = '18px',//指定单位的字号
            textPositionY = 0.2, // 文本垂直位置
            textSize = 0.5 ,//文本大小
            accuracy = 1, // 精度
            innerR = 0,
            textColor1 = "#3c5b96",
            textColor2,//第一个波浪下的文字的颜色
            textColor3,//第二个波浪下的文字的颜色
            container = 'svg'
        }= {...options};
        textIsPercent = textUnit?false:textIsPercent;
        //gradient不用传递，根据stroke参数类型得出，gradient :是否渐变
        let gradient = false,circleColor,waveRise = waveAnimation;//波浪是否随着数值的变化有垂直动画,单独的从下到上的动画不支持，因为仅仅只是clippath的动画，ui不会刷新
        container = d3.select(container);
        //传递的参数初始化
        let initOptions = () => {
            if(!r){
                let w = getComputedStyle(container.node()).width.split('px')[0],
                    h = getComputedStyle(container.node()).height.split('px')[0];
                    r = (Math.min(w,h) - strokeWidth)/2;
                    cx = w/2;
                    cy = h/2;

            }
            innerR = r - margin - strokeWidth/2;
            if(!stroke||typeof (stroke) ==='object'){
                gradient = true;
                if(Object.keys(stroke).length < 2){
                    waveColor1 = {begin: '#3f51b5', end: '#009688'};
                    waveColor2 = {begin: '#2741b5', end: '#37ffeb'};
                }else {
                    waveColor1 = {...stroke};
                    waveColor2 = {begin: d3.color(stroke.begin).brighter(3), end: d3.color(stroke.end).brighter(3)};
                }
            }else {
                circleColor = stroke;
            }
        }
        //渐变
        let initGradient = () => {
            let gradient = container.append('defs');
            let id1 = className + 'gradient1',id2 = className + 'gradient2';
            let gradient1 = gradient.append('linearGradient').attr('id',id1).attr('x1','0%').attr('y1','0%').attr('x2','0%').attr('y2','100%');
            gradient1.append("stop")
                .attr('class', 'start')
                .attr("offset", "0%")
                .style("stop-color", waveColor1.begin);
            gradient1.append("stop")
                .attr('class', 'end')
                .attr("offset", "100%")
                .style("stop-color", waveColor1.end);
            let gradient2 = gradient.append('linearGradient').attr('id',id2).attr('x1','0%').attr('y1','0%').attr('x2','0%').attr('y2','100%');
            gradient2.append("stop")
                .attr('class', 'start')
                .attr("offset", "0%")
                .style("stop-color", waveColor2.begin);
            gradient2.append("stop")
                .attr('class', 'end')
                .attr("offset", "100%")
                .style("stop-color", waveColor2.end);
            waveColor1 = circleColor = `url(#${id1})`;
            waveColor2 = `url(#${id2})`;
        }
        //外圆
        let initOutCircle = () => {
            container.append('circle').attr('cx',cx).attr('cy',cy).attr('fill',fill).attr('stroke',circleColor).attr('stroke-width',strokeWidth).attr('r',r);
        }
        //波浪路径
        let initPath = (target,fn) => {
            const  waveHeightScale = d3.scaleLinear().range([3, innerR * 0.5]).domain([0, 1]),
                wavesHeight = waveHeightScale(waveHeight),
                wavesWidth = 2 * innerR / waveCount,
                clipCount = waveCount + 1, data = [];
            function makeData() {
                for (let i = 0; i <= 40 * clipCount; i++) {
                    data.push({
                        x: i / (40 * clipCount),
                        y: i / 40
                    })
                }
            }
            makeData();
            let scaleClipX = d3.scaleLinear().range([0, clipCount * wavesWidth]).domain([0, 1]),
                scaleClipY = d3.scaleLinear().range([0, wavesHeight * 2]).domain([-1, 1]);
            target.attr('d',d3.area()
                .x((d) => scaleClipX(d.x))
                .y0((d) => scaleClipY(fn(d.y * 2 * Math.PI)))
                .y1((d) => {
                    return 2 * innerR + wavesHeight * 2
                })(data));

        }
        //波浪垂直动画
        let raiseAnimate = (target) => {
            const waveHeightScale = d3.scaleLinear().range([3, innerR * 0.5]).domain([0, 1]),
                wavesHeight = waveHeightScale(waveHeight),
                wavesWidth = 2 * innerR / waveCount,
                baseTrans = {
                    x: cx - innerR - wavesWidth,
                    y: cy - innerR - wavesHeight * 2},
                waveRiseScale = d3.scaleLinear()
                    .range([baseTrans.y + 2*innerR + 2*wavesHeight,baseTrans.y + 0])
                    .domain([0,1]);
            let start = this.prevEnd > 0 ? this.prevEnd : 0/(maxValue-minValue),
                end = (series[0]-minValue)/(maxValue-minValue);
            if(waveRise){
                target.attr('transform',`translate(0,${waveRiseScale(start)})`)
                    .transition().duration(waveRiseTime).ease(waveRiseTimeF).attr('transform',
                    `translate(0,${waveRiseScale(end)})`);
            }else {
                target.attr('transform', `translate(0,${waveRiseScale(end)})`);
            }
        }
        //波浪水平动画
        let waveAnimate = (target) => {
            const  waveHeightScale = d3.scaleLinear().range([3, innerR * 0.5]).domain([0, 1]),
                wavesHeight = waveHeightScale(waveHeight),
                wavesWidth = 2 * innerR / waveCount,
                baseTrans = {
                    x: cx - innerR - wavesWidth,
                    y: cy - innerR - wavesHeight * 2};
            target.attr('transform',`translate(${baseTrans.x},0)`);
            if(waveAnimation){
                target.transition().duration(waveAnimateTime)
                    .ease(waveAnimationTimeF).attrTween('transform',function () {
                    var i = d3.interpolate(baseTrans.x, baseTrans.x + wavesWidth);
                    return (t) =>  {return `translate(${i(t)},0)`};
                }).on('end',()=>{
                    waveAnimate(target);
                });
            }
        }
        //初始化波浪
        let initWaves = () => {
            let text1 = container.append('text').attr('text-anchor','middle').attr('fill',textColor1).attr('transform',`translate(${cx},${cy})`);
            let  group1 = container.append('g').attr('clip-path',`url(#wave-clip-path1)`),
                group2 = container.append('g').attr('clip-path',`url(#wave-clip-path2)`),
                circle1 = group1.append('circle').attr('cx',cx).attr('cy',cy).attr('r',innerR).attr('fill',waveColor1),
                circle2 = group2.append('circle').attr('cx',cx).attr('cy',cy).attr('r',innerR).attr('fill',waveColor2).attr('fill-opacity',fillOpacity),
                clipDefs = container.append('defs'),
                clipPath1 = clipDefs.append('clipPath').attr('id', 'wave-clip-path1'),
                clipPath2 = clipDefs.append('clipPath').attr('id', 'wave-clip-path2'),
                wave1 = clipPath1.append('path'),
                wave2 = clipPath2.append('path');
            let initText = () => {
                let text2 = group1.append('text').attr('text-anchor','middle').attr('fill',textColor2||d3.color(textColor1).brighter(2)).attr('transform',`translate(${cx},${cy})`);
                let text3 = group2.append('text').attr('text-anchor','middle').attr('fill',textColor3||d3.color(textColor1).brighter(5)).attr('transform',`translate(${cx},${cy})`);
                textCountAnimate(text1);
                textCountAnimate(text2);
                textCountAnimate(text3);
            }
            initPath(wave1,Math.sin);
            initPath(wave2,Math.cos);
            raiseAnimate (clipPath1);
            raiseAnimate (clipPath2);
            waveAnimate (wave1);
            waveAnimate (wave2);
            initText();
        }
        //文本动画
        let textCountAnimate = (target) => {
            const textSizeScale = d3.scaleLinear().range([14, innerR]).domain([0, 1]),
                fontSize = textSizeScale(textSize),
                textScaleY = d3.scaleLinear().range([cy + innerR -fontSize/2,cy - innerR + fontSize + fontSize/2 ]).domain([1,0]);
                textUnit = textUnit ? textUnit: (textIsPercent ? '%':'');
            let finalValue, startValue = (textIsAnimate ? (this.prevValue===0 ? minValue:this.prevValue) : series[0]);
            startValue = textIsPercent ? textIsPercent/(maxValue-minValue) : startValue;
            finalValue = (textIsPercent? series[0]/(maxValue - minValue)*100: series[0]).toFixed(accuracy);
            target.text((textIsPercent?startValue*100:startValue).toFixed(accuracy)).attr('font-size',fontSize)
                .attr('transform',`translate(${cx},${textScaleY(textPositionY)})`);
            target.append('tspan').text(textUnit).attr('font-size',textUnitSize);
            if(textIsAnimate){
                let textTween = function(){
                    let self = this;
                    var i = d3.interpolate(parseFloat(self.textContent), finalValue);
                    return (t) =>  {
                        target.text(parseFloat(i(t)).toFixed(accuracy));
                        target.append('tspan').text(textUnit).attr('font-size',textUnitSize);
                    };

                };
                target.transition()
                    .duration(waveRiseTime)
                    .tween("text", textTween);
            }

        }
        initOptions();
        if(gradient){initGradient()};
        initOutCircle();
        initWaves();
    }
    

}