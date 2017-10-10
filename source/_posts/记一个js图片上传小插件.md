---
uuid: b70a1eb0-2a77-11ea-a744-1f4d64ae768d
title: 记一个js图片上传小插件
date: 2016-09-04 08:39:00
author: 程小刚
categories:
- 技术
tags:
- 前端
---

最近在做的项目中需要一个图片上传的小控件,由于用的功能不多,索性自己写一个得了.

<!-- more -->

# 需求分析

	我需要做一个能选择图片文件,进行预览,还能删除图片,选择查看图片大图.
    
# html文档结构
由js生成
```html
<div class="big_img_wrap">
	<img id="bigImg" class="big_img" src="" />
	<!-- 浏览大图 -->
</div>
<div style="height:10px;width:100%;"></div>
<div id="selPhotoList" class="selphoto_list">
	<!-- 选择的照片列表 -->
	<div class="thumb_wrp">
		<!-- 缩略图 -->
		<div class="photo_input_wrp">
			<!-- 选择框 -->
			<div class="photo_input_hline"></div>
			<!-- 选择框中间的横线 -->
			<div class="photo_input_vline"></div>
			<!-- 选择框中间的竖线 -->
			<input name="" type="file" class="photo_input" value="" accept="image/*" />
			<!-- 存放选择的文件 -->
			<input name="" type="hidden" value="" />
			<!-- 存放文件名 -->
		</div>
	</div>
</div>
```
# css样式
```css
<style type="text/css">
  .big_img_wrap {
    width: 500px;
    min-height: 100px;
    border: 1px solid black;
  }

  .big_img {
   width: 100%;
  }

  .thumb_wrp {
    position: relative;
    width: 77px;
    height: 77px;
    float: left;
    margin-right: 10px;
  }

  .photo_input_wrp {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    border: 1px solid gray;
  }

  .photo_input_wrp:active {
      opacity: 1;
  }

  .photo_input_hline {
    width: 50%;
    height: 2px;
    top: 50%;
    left: 25%;
  }

  .photo_input_vline {
    width: 2px;
    height: 50%;
    top: 25%;
    left: 50%;
  }

  .photo_input_hline,
  .photo_input_vline {
    position: absolute;
    background-color: #C7C7C6;
  }

  .photo_input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .thumb_img {
    position: absolute;
    border: 1px solid black;
    width: 100%;
    height: 100%;
    background-color: white;
  }

  .del_img_btn {
    position: absolute;
    top: 0;
    left: 100%;
    transform: translate(-8px, -8px);
    width: 16px;
    height: 16px;
    z-index: 1;
    color: blue;
    line-height: 16px;
    text-align: center;
    font-weight: bold;
    border: 1px solid gray;
    border-radius: 50%;
    background: blue;
    color: white;
    opacity: 0.8;
  }
</style>
```
# js动态生成
首先引入jquery,查看效果点击 <a href="javascript:;" id="toDemo" >点击这里</a>
在提交表单时,
选择的图片为:name="photo[i]",对应的图片名为:name="photoNames[i]",i 是图片的添加顺序
```javascript
	var selectPhotoArea = new PhotoSelect($("#selectPhotoArea"));
	//创建图片选择区域
    function PhotoSelect(photoSelectArea) {
      var photoNumMax = 4;//设置最多选择的图片数
		
		this.checkPhoto=function(){
			var photoLength = $(".thumb_wrp").length;
			if((photoLength-1) == 0){
				alert("请选择图片!");
				return false;
			}
			return true;
		}
		
		init();
		function init(){
			var html = "";
			html += '<div class="big_img_wrap">'+
						'<img id="bigImg" alt="请选择图片" class="big_img" src="" />'+
					'</div>'+
					'<div style="height:10px;width:100%;"></div>'+
					'<div id="selPhotoList" class="selphoto_list">'+
					'</div>';
			$(photoSelectArea).append(html);
			
			createThumbWrp();
		}
		
		function createThumbWrp() {
			var html = "";
			html +=
				'<div class="thumb_wrp">' +
					'<div class="photo_input_wrp">' +
						'<div class="photo_input_hline"></div>' +
						'<div class="photo_input_vline"></div>' +
						'<input name="" type="file" class="photo_input" value="" accept="image/*" />' +
						'<input name="" type="hidden" value="" />' +
					'</div>' +
				'</div>';
			$("#selPhotoList").append(html);
			$("#selPhotoList .photo_input:last").on("click", function(e) {
				var photoLength = $(".thumb_wrp").length;
				if(photoLength > photoNumMax) {
					e.preventDefault();
					return false;
				}
			});
			$("#selPhotoList .photo_input:last").on("change", function(e) {
				selPhoto(this);
			});
		}
		
		function previewPhoto(el) {
			var html = '';
			var src = "";
			var file = el.files[0];
			var reader = new FileReader();
			reader.onloadend = function() {
				src = reader.result;
				html += '<img class="thumb_img" src="' + src + '" />';
				html += '<div class="del_img_btn">×</div>';
				$(el).parent().parent().append(html);
				$(el).siblings("input[type=hidden]").val(el.value);
				$(el).parent().parent().find(".thumb_img").on("click", function(e) {
					setCurrentPhoto(this);
				});
				$(el).parent().parent().find(".del_img_btn").on("click", function(e) {
					delPhoto(this);
				});
				setCurrentPhoto($(el).parent().siblings(".thumb_img")[0]);
				refreshPhotoName();
				refreshMsg();
			}
			if(file) {
				reader.readAsDataURL(file);
			} else {
				src = "";
			}
		}

		function setCurrentPhoto(el) {
			if(el) {
				var el = $(el);
				var src = el.attr("src");
				$("#bigImg").attr("src", src);
				$(".thumb_img").css("border", "1px solid black");
				el.css("border", "1px solid red");
			} else {
				$("#bigImg").attr("src", "");
			}
		}

		function refreshPhotoName() {
			$("#selPhotoList").find("input[type=file]").each(function(index) {
				var photoUrl = $(this).val();
				if(photoUrl) {
					$(this).attr("name", "photos[" + index + "]");
					$(this).next("input[type=hidden]").attr("name", "photoNames[" + index + "]");
				} else {
					$(this).attr("name", "");
					$(this).next("input[type=hidden]").attr("name", "");
				}
			});
		}

		function refreshMsg() {
			var photoLength = $(".thumb_wrp").length;
			var html = (photoLength - 1) + "/" + photoNumMax;
			$("#selphoto_message").html(html);
		}

		function delPhoto(el) {
			$(el).parent().remove();
			var thumbs = $(".thumb_wrp");
			var len = thumbs.length;
			setCurrentPhoto($(".thumb_img")[0]);
			refreshPhotoName();
			refreshMsg();
		}

		function selPhoto(el) {
			var photoUrl = el.value;
			var photoLength = $(".thumb_wrp").length;
			if(!photoUrl) {
				return false;
			}
			if(photoLength > photoNumMax) {
				return false;
			}
			previewPhoto(el);
			createThumbWrp();
		}
		
	}
```
<style type="text/css">
  .big_img_wrap {
  width: 500px;
  min-height: 100px;
  border: 1px solid black;
  }

  .big_img {
  width: 100%;
  }

  .thumb_wrp {
  position: relative;
  width: 77px;
  height: 77px;
  float: left;
  margin-right: 10px;
  }

  .photo_input_wrp {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  border: 1px solid gray;
  }

  .photo_input_wrp:active {
  opacity: 1;
  }

  .photo_input_hline {
  width: 50%;
  height: 2px;
  top: 50%;
  left: 25%;
  }

  .photo_input_vline {
  width: 2px;
  height: 50%;
  top: 25%;
  left: 50%;
  }

  .photo_input_hline,
  .photo_input_vline {
  position: absolute;
  background-color: #C7C7C6;
  }

  .photo_input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  }

  .thumb_img {
  position: absolute;
  border: 1px solid black;
  width: 100%;
  height: 100%;
  background-color: white;
  }

  .del_img_btn {
  position: absolute;
  top: 0;
  left: 100%;
  transform: translate(-8px, -8px);
  width: 16px;
  height: 16px;
  z-index: 1;
  color: blue;
  line-height: 16px;
  text-align: center;
  font-weight: bold;
  border: 1px solid gray;
  border-radius: 50%;
  background: blue;
  color: white;
  opacity: 0.8;
  }
</style>

<script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>

<script type="text/javascript">
$(document).ready(function() {
				$("#toDemo").on("click", function(e) {
					var e = e || window.event;
					floateWindow(e,"","js选择图片",-200,10);
					var selectPhotoArea = new PhotoSelect($("#floatWindowContent"));
				});
			});

/**
			 * 创建浮动窗口
			 * @param e 事件
			 * @param content 要显示的内容
			 * @param title 标题
			 * @param widthOffset  窗口出现位置的水平偏移量 负数向左偏移,默认值为-300
			 * @param heightOffset 窗口出现位置的竖直偏移量 负数向上偏移,默认值为30
			 */
			function floateWindow(e, content, title, widthOffset, heightOffset) {
				var floatWindow = $("#floatWindow");

				if(floatWindow.length === 0) { //首次执行时生成
					var floatWindowHtml =
						'<div id="floatWindow" style="position: absolute;top:400px;border-radius: 6px;background-color: #fbfbfb;' +
						'border: 1px solid rgba(240, 240, 240,0.8);box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);">' +
						'<style type="text/css">' +
						'#closeFloateWindow img{transition: transform 300ms;}' +
						'#closeFloateWindow img:hover{transform: rotate(360deg);}</style>' +
						'<div id="floatWindowTiltle" style="height:30px;width:100%;background-color:#F4F4F4;font-weight: bolder;font-size: 14px;line-height: 30px;padding-left:10px;"></div>' +
						'<div id="closeFloateWindow" style="position:absolute;right:5px;top:5px;width:15px;height:15px;font-weight:bold;cursor: pointer;font-size:20px;">' +
						'<img alt="关闭" src="data:image/gif;base64,R0lGODlhDgAOAMQAAE2QzaHE5bnT6/H2+1CSznir2ajJ56XH5rzV7KrK506RzbvU7Hut2qnJ56XH5/H3+7/X7QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEHAA8ALAAAAAAOAA4AAAVN4DMsT2mWyCAyxHGWBlEMEGG7pqEohPDoPFzC1srZFIHY7TU87nAvHWAaeOUUU0DV2iTsFFDYMUmEAouPrqu2vPIEA1ZYPBORrI/UIwQAOw=="/></div>' +
						'<div id="floatWindowContent" style="padding:5px;"></div>' +
						'</div>';
					$("body").append(floatWindowHtml);

					$("#closeFloateWindow").on("click", function() {
						$("#floatWindow").hide();
					});
					floatWindow = $("#floatWindow");
				}
				
				widthOffset = widthOffset || -300;
				heightOffset = heightOffset || 30;
				var left = e.pageX + widthOffset;
				var top = e.pageY + heightOffset;
				floatWindow.css({
					"left": left + "px",
					"top": top + "px"
				}).show();
				$("#floatWindowContent").html(content);
				$("#floatWindowTiltle").html(title);
			}
            
//创建图片选择区域
    function PhotoSelect(photoSelectArea) {
      var photoNumMax = 4;//设置最多选择的图片数
		
		this.checkPhoto=function(){
			var photoLength = $(".thumb_wrp").length;
			if((photoLength-1) == 0){
				alert("请选择图片!");
				return false;
			}
			return true;
		}
		
		init();
		function init(){
			var html = "";
			html += '<div class="big_img_wrap">'+
						'<img id="bigImg" alt="请选择图片" class="big_img" src="" />'+
					'</div>'+
					'<div style="height:10px;width:100%;"></div>'+
					'<div id="selPhotoList" class="selphoto_list">'+
					'</div>';
			$(photoSelectArea).append(html);
			
			createThumbWrp();
		}
		
		function createThumbWrp() {
			var html = "";
			html +=
				'<div class="thumb_wrp">' +
					'<div class="photo_input_wrp">' +
						'<div class="photo_input_hline"></div>' +
						'<div class="photo_input_vline"></div>' +
						'<input name="" type="file" class="photo_input" value="" accept="image/*" />' +
						'<input name="" type="hidden" value="" />' +
					'</div>' +
				'</div>';
			$("#selPhotoList").append(html);
			$("#selPhotoList .photo_input:last").on("click", function(e) {
				var photoLength = $(".thumb_wrp").length;
				if(photoLength > photoNumMax) {
					e.preventDefault();
					return false;
				}
			});
			$("#selPhotoList .photo_input:last").on("change", function(e) {
				selPhoto(this);
			});
		}
		
		function previewPhoto(el) {
			var html = '';
			var src = "";
			var file = el.files[0];
			var reader = new FileReader();
			reader.onloadend = function() {
				src = reader.result;
				html += '<img class="thumb_img" src="' + src + '" />';
				html += '<div class="del_img_btn">×</div>';
				$(el).parent().parent().append(html);
				$(el).siblings("input[type=hidden]").val(el.value);
				$(el).parent().parent().find(".thumb_img").on("click", function(e) {
					setCurrentPhoto(this);
				});
				$(el).parent().parent().find(".del_img_btn").on("click", function(e) {
					delPhoto(this);
				});
				setCurrentPhoto($(el).parent().siblings(".thumb_img")[0]);
				refreshPhotoName();
				refreshMsg();
			}
			if(file) {
				reader.readAsDataURL(file);
			} else {
				src = "";
			}
		}

		function setCurrentPhoto(el) {
			if(el) {
				var el = $(el);
				var src = el.attr("src");
				$("#bigImg").attr("src", src);
				$(".thumb_img").css("border", "1px solid black");
				el.css("border", "1px solid red");
			} else {
				$("#bigImg").attr("src", "");
			}
		}

		function refreshPhotoName() {
			$("#selPhotoList").find("input[type=file]").each(function(index) {
				var photoUrl = $(this).val();
				if(photoUrl) {
					$(this).attr("name", "photos[" + index + "]");
					$(this).next("input[type=hidden]").attr("name", "photoNames[" + index + "]");
				} else {
					$(this).attr("name", "");
					$(this).next("input[type=hidden]").attr("name", "");
				}
			});
		}

		function refreshMsg() {
			var photoLength = $(".thumb_wrp").length;
			var html = (photoLength - 1) + "/" + photoNumMax;
			$("#selphoto_message").html(html);
		}

		function delPhoto(el) {
			$(el).parent().remove();
			var thumbs = $(".thumb_wrp");
			var len = thumbs.length;
			setCurrentPhoto($(".thumb_img")[0]);
			refreshPhotoName();
			refreshMsg();
		}

		function selPhoto(el) {
			var photoUrl = el.value;
			var photoLength = $(".thumb_wrp").length;
			if(!photoUrl) {
				return false;
			}
			if(photoLength > photoNumMax) {
				return false;
			}
			previewPhoto(el);
			createThumbWrp();
		}
		
	}
</script>