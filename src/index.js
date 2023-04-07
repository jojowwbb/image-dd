
var current=''


function downloadIamge(imgsrc, name) { // 下载图片地址和图片名
    var image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = function() {
	    var canvas = document.createElement('canvas');
	    canvas.width = image.width;
	    canvas.height = image.height;
	    var context = canvas.getContext('2d');
	    context.drawImage(image, 0, 0, image.width, image.height);
        var ext=imgsrc.split('/').pop().split('.').pop();
	    var url = canvas.toDataURL('image/'+(ext||png)); //得到图片的base64编码数据
	    var a = document.createElement('a'); // 生成一个a元素
	    var event = new MouseEvent('click'); // 创建一个单击事件
	    a.download = (name+'.'+ext) || 'photo'; // 设置图片名称
	    a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
    }
    image.src = imgsrc;
}

var images=document.querySelectorAll('img');
document.addEventListener('dragend',function(e){
    if(e.target.tagName=='IMG'){
        new jsFileDownloader({ url:e.target.src }).catch(function(){
            downloadIamge(e.target.src,Date.now())
        })
    }
})


function title(target,width,height,size,w,h){
    var _size=size>=1024?(size/1024):size;
    var html=`真实大小:${_size.toFixed(2)}${size>=1024?'MB':'KB'};
显示尺寸:${w}*${h};
真实尺寸:${width}*${height}`;

    target.title=html
}

document.addEventListener('mouseover',function(e){
    if(e.target.tagName=='IMG'){
        if(current!=e.target.src){
            var image = new Image();
            image.setAttribute('crossOrigin', 'anonymous');
            image.onload = function() {
                fetch(e.target.src).then(function(res){
                    return res.blob()
                  }).then(function(data){
                        title(e.target,image.width,image.height,data.size/1024,e.target.width,e.target.height)
                  })
                
            }
            image.src = e.target.src;
            current=e.target.src
        }
        
    }
},true)
