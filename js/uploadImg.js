document.getElementById("avatar").addEventListener('tap',
function() {

    if (mui.os.plus) {

        var a = [{

            title: "拍照"

        },
        {

            title: "从手机相册选择"

        }];

        plus.nativeUI.actionSheet({

            title: "修改用户头像",

            cancel: "取消",

            buttons: a

        },
        function(b) {

            switch (b.index) {

            case 0:

                break;

            case 1:

                //alert("拍照");
                getImage(); //拍照
                break;

            case 2:

                //alert("打开相册");
                galleryImg(); //打开相册
                break;

            default:

                break;

            }

        });

    }

},
false);

//拍照
function getImage() {

    var c = plus.camera.getCamera();

    c.captureImage(function(e) {

        plus.io.resolveLocalFileSystemURL(e,
        function(entry) {

            var s = entry.toLocalURL() + "?version=" + new Date().getTime();

            uploadHead(s); //上传图片
        },
        function(e) {

            console.log("读取拍照文件错误：" + e.message);

        });

    },
    function(s) {

        console.log("error" + s);

    },
    {

        filename: "_doc/bg.png"

    })

}

//从相册选图上传
function galleryImg() {

    plus.gallery.pick(function(a) {

        plus.io.resolveLocalFileSystemURL(a,
        function(entry) {

            plus.io.resolveLocalFileSystemURL("_doc/",
            function(root) {

                root.getFile("bg.png", {},
                function(file) {

                    //文件已存在
                    file.remove(function() {

                        //console.log("file remove success");

                        entry.copyTo(root, 'bg.png',
                        function(e) {

                            var e = e.fullPath + "?version=" + new Date().getTime();

                            uploadHead(e); //上传图片
                        },

                        function(e) {

                            console.log('copy image file:' + e.message);

                        });

                    },
                    function() {

                        console.log('delete image file:' + e.message);

                    });

                },
                function() {

                    //文件不存在
                    entry.copyTo(root, 'bg.png',
                    function(e) {

                        var path = e.fullPath + "?version=" + new Date().getTime();

                        uploadHead(path);

                    },
                    function(e) {

                        console.log('copy image fail:' + e.message);

                    });

                });

            },
            function(e) {

                console.log("get _www folder fail");

            })

        },
        function(e) {

            console.log("读取拍照文件错误：" + e.message);

        });

    },
    function(a) {},
    {

        filter: "image"

    })

};

//上传头像图片
function uploadHead(imgPath) {

    //console.log("imgPath =" + imgPath);

    var mainImage = document.getElementById("avatar");

    mainImage.src = imgPath;

    mainImage.style.width = "64px";

    mainImage.style.height = "64px";

    var image = new Image();

    image.src = imgPath;

    image.onload = function() {

        var imgData = getBase64Image(image);
        document.getElementById("avatarPath").value = imgData;
    }

}

//将图片压缩成base64
function getBase64Image(img) {

    var canvas = document.createElement("canvas");

    var width = img.width;

    var height = img.height;

    if (width > height) {

        if (width > 100) {

            height = Math.round(height *= 100 / width);

            width = 100;

        }

    } else {

        if (height > 100) {

            width = Math.round(width *= 100 / height);

            height = 100;

        }

    }

    canvas.width = width;

    canvas.height = height;

    var ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, width, height);

    var dataURL = canvas.toDataURL("image/png", 0.8);

    return dataURL.replace("data:image/png;base64,", "");

}