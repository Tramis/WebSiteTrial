function $(id) {
    return document.getElementById(id);
}

var cav = $("canvas");
var cxt = cav.getContext('2d');

window.load(function () {
    navigator.getUserMedia({
        audio: true;
    }).then(stream =>{
        console.log(stream);
    })

    // // 这里是打开摄像头和麦克设备（会返回一个Promise对象）
    // navigator.mediaDevices.getUserMedia({
    //     audio: true,
    //     video: true
    // }).then(stream => {
    //     console.log(stream) // 放回音视频流
    // }).catch(err => {
    //     console.log(err) // 错误回调
    // })

    cxt.beginPath();
})