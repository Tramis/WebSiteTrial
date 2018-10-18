const Pi = Math.PI;
var flag = 0;

function $(id) {
    return document.getElementById(id);
}

function cnm(){
    alert(flag);
    flag+=1;
}

var url='../../music/northline_small.mp3';
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
            var cav = document.getElementById("canvas");
            var cxt = cav.getContext('2d');
            var len = 250;
            var cwidth = cav.width,
                cheight = cav.height;
            //开始绘制频谱图
            function drawSpectrum() {

                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                console.info(array.length);
                //清除画布
                cxt.clearRect(0, 0, cwidth, cheight);

                for (let i = 0; i < 360; i += 2) {
                    cxt.moveTo(300,300);
                    let lenTmp = len + array[i*2]/10;
                    let x=300+lenTmp*Math.cos(i*Pi/180);
                    let y=300+lenTmp*Math.sin(i*Pi/180);
                    cxt.lineWidth=2;
                    cxt.strokeStyle = 'white';
                    cxt.lineTo(x,y);
                    cxt.stroke();
                }
                cxt.beginPath();
                cxt.arc(300,300,230,0,Pi*2);
                cxt.closePath();
                cxt.fillStyle = 'black';
                cxt.fill();

                requestAnimationFrame(drawSpectrum)
            }
            requestAnimationFrame(drawSpectrum)
        }, function (e) {
            console.info('处理出错');
        });
    };
    request.send();

    // //绑定播放按钮
    // $('#playBtn').click(function () {
    //     var icon = $(this).find('i');;
    //     icon.toggleClass('glyphicon-play').toggleClass('glyphicon-pause');
    //     //停止播放
    //     source.stop();
    // });
}