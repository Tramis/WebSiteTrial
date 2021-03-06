var url='../../music/northline.mp3';
if (!window.AudioContext) {
    alert('您的浏览器不支持AudioContext');
} else {
    //创建上下文
    var ctx = new AudioContext();
    var source = null;
    //使用Ajax获取音频文件

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';//配置数据的返回类型
    //加载完成
    request.onload = function () {
        var arraybuffer = request.response;
        ctx.decodeAudioData(arraybuffer, function (buffer) {
            //创建分析器
            var analyser = ctx.createAnalyser();
            source = ctx.createBufferSource();
            //将source与分析器链接
            source.connect(analyser);
            //将分析器与destination链接，这样才能形成到达扬声器的通路
            analyser.connect(ctx.destination);
            //将解码后的buffer数据复制给source
            source.buffer = buffer;
            //播放
            source.start(0);

            //开始绘制频谱图
            function drawSpectrum() {
                var canvas = document.getElementById('canvas'),
                    cwidth = canvas.width,
                    cheight = canvas.height - 2,
                    meterWidth = 10,//能量条的宽度
                    gap = 2,//能量条的间距
                    meterNum = 800 / (10 + 2),//计算当前画布上能画多少条
                    ctx = canvas.getContext('2d');
                var capHeight = 2;//
                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                console.info(array.length);
                var step = Math.round(array.length / meterNum);//计算从analyser中的采样步长
                console.log(array.length);
                //清理画布
                ctx.clearRect(0, 0, cwidth, cheight);
                //定义一个渐变样式用于画图
                var gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(1, '#0f0');
                gradient.addColorStop(0.5, '#ff0');
                gradient.addColorStop(0, '#f00');
                ctx.fillStyle = gradient;
                //对信源数组进行抽样遍历，画出每个频谱条
                for (var i = 0; i < meterNum; i++) {
                    var value = array[i * step];
                    ctx.fillRect(i * 12/*频谱条的宽度+条间距*/, cheight - value + capHeight,
                        meterWidth, cheight);
                }
                requestAnimationFrame(drawSpectrum)
            }
            requestAnimationFrame(drawSpectrum)
        }, function (e) {
            console.info('处理出错');
        });
    }
    request.send();




    // //绑定播放按钮
    // $('#playBtn').click(function () {
    //     var icon = $(this).find('i');;
    //     icon.toggleClass('glyphicon-play').toggleClass('glyphicon-pause');
    //     //停止播放
    //     source.stop();
    // });
}

// window.onload = function () {
//     document.getElementById("audio").volume = 0.2;
// }