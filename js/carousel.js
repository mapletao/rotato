//; 防止前面引入文件未加; 报错
;
(function($) {
	var Carousel = function(poster) {
		this.poster = poster; //保存当前幻灯区块
		this.bannerList = this.poster.find("ul.banner-list"); //获取ul区域
		this.btn = this.poster.find("div.banner-btn"); //获取按钮
		this.bannerItem = this.poster.find("li.banner-item"); //获取所有的li 放置图片区
		
		this.bannerList.append(this.bannerItem.slice(1).clone());
		this.bannerItem=this.bannerList.children();

		this.firstItem = this.bannerItem.first(); //获取第一张图片
		this.lastItem = this.bannerItem.last(); //获取最后一张图片
		this.prevBtn = this.poster.find("div.banner-prev-btn");
		this.nextBtn = this.poster.find("div.banner-next-btn");
		this.rotateFlag = true;
		var that = this;
		//默认配置
		this.setting = {
			width: 1000, //幻灯片宽
			height: 270, //幻灯片高
			posterWidth: 640, //显示第一张图片的宽度
			posterHeight: 270, //显示第一张图片的高度
			scale: .9, //剩余图片的大小数
			speed: 500, //点击或者自动轮播速度
			autoPlay: true, //是否自动轮播
			delay: 2000, //轮播时间
			verticalAlign: 'middle' //居中方式
		};
		//改变默认setting 替换掉不同的 
		$.extend(this.setting, this.getSetting());
		this.setBanner();
		this.setPosterPos();
		this.prevBtn.click(function() {
			if (that.rotateFlag) {
				that.rotateFlag = false;
				that.carouselRotate("right");
			}
		});
		this.nextBtn.click(function() {
			if (that.rotateFlag) {
				that.rotateFlag = false;
				that.carouselRotate("left");
			}
		})
		if(this.setting.autoPlay){
			this.autoPlay();
			this.poster.hover(function() {
				clearInterval(that.timer);
			}, function() {
				that.autoPlay();
			});
		}
	};
	Carousel.prototype = {
		//自动轮播
		autoPlay: function() {
			var that=this;
			this.timer=setInterval(function(){that.nextBtn.click()},this.setting.delay);
		},
		//旋转
		carouselRotate: function(str) {
			var self = this;
			var zIndexArr = [];
			if (str === "left") {
				this.bannerItem.each(function() {
					var that = $(this),
						prev = that.prev().get(0) ? that.prev() : self.lastItem,
						width = prev.width(),
						height = prev.height(),
						zIndex = prev.css("zIndex"),
						left = prev.css("left"),
						top = prev.css("top"),
						opacity = prev.css("opacity");
					zIndexArr.push(zIndex);
					that.animate({
						width: width,
						height: height,
						left: left,
						top: top,
						// zIndex:zIndex,
						opacity: opacity
					},self.setting.speed,function(){
						self.rotateFlag=true;
					});
				});
				this.bannerItem.each(function(i) {
					$(this).css("zIndex", zIndexArr[i]);
				})
			} else {
				this.bannerItem.each(function() {
					var that = $(this),
						next = that.next().get(0) ? that.next() : self.firstItem,
						width = next.width(),
						height = next.height(),
						zIndex = next.css("zIndex"),
						left = next.css("left"),
						top = next.css("top"),
						opacity = next.css("opacity");
					zIndexArr.push(zIndex);
					that.animate({
						width: width,
						height: height,
						left: left,
						top: top,
						// zIndex:zIndex,
						opacity: opacity
					},self.setting.speed,function(){
						self.rotateFlag=true;
					});
				});
				this.bannerItem.each(function(i) {
					$(this).css("zIndex", zIndexArr[i]);
				})
			}
		},
		//设置对齐方式
		setAlign: function(height) {
			var settingAlign = this.setting.verticalAlign;
			var top = 0;
			if (settingAlign == "middle") {
				top = (this.setting.height - height) / 2;
			} else if (settingAlign == "top") {
				top = 0;
			} else if (settingAlign == "bottom") {
				top = this.setting.height - height;
			} else {
				top = (this.setting.height - height) / 2;
			}
			return top;
		},
		//设置位置关系
		setPosterPos: function() {
			var sliceItems = this.bannerItem.slice(1); //除去首张剩余的图片
			var sliceSize = Math.floor(sliceItems.size() / 2); //左右两边应有的图片张数
			var rightSize = sliceItems.slice(0, sliceSize); //右边因有的图片数
			var level = Math.floor(this.bannerItem.size() / 2); //zIndex层次关系
			var leftSize = sliceItems.slice(sliceSize); //左边应有的图片数
			var self = this; //保存this
			//设置右边帧的位置关系和宽度高度top
			var rw = this.setting.posterWidth;
			var rh = this.setting.posterHeight;
			var firstLeft = (this.setting.width - this.setting.posterWidth) / 2; //显示的图片的left	
			var gap = ((this.setting.width - this.setting.posterWidth) / 2) / level; //图片之间的间隔
			var offsetLeft = firstLeft + rw;

			rightSize.each(function(i) {
				level -= 1;
				rw = rw * self.setting.scale;
				rh = rh * self.setting.scale;
				var j = i + 1;
				$(this).css({
					width: rw,
					height: rh,
					zIndex: level,
					left: offsetLeft + (++i) * gap - rw,
					top: self.setAlign(rh),
					opacity: 1 / (j)
				});
			});
			//左边
			var lss = leftSize.size();
			var lw = rightSize.last().width();
			var lh = rightSize.last().height();
			leftSize.each(function(i) {
				$(this).css({
					width: lw,
					height: lh,
					zIndex: i,
					left: gap * (i),
					top: self.setAlign(lh),
					opacity: 1 / lss
				});
				lss--;
				lw = lw / self.setting.scale;
				lh = lh / self.setting.scale;
			});
		},
		//设置幻灯片样式
		setBanner: function() {
			this.poster.css({
				width: this.setting.width,
				height: this.setting.height
			});
			this.bannerList.css({
				width: this.setting.width,
				height: this.setting.height
			});
			var w = (this.setting.width - this.setting.posterWidth) / 2;
			var pz = Math.ceil(this.bannerItem.length / 2);
			this.btn.css({
				width: w,
				height: this.setting.height,
				zIndex: pz
			});
			this.firstItem.css({
				width: this.setting.posterWidth,
				height: this.setting.posterHeight,
				left: w,
				zIndex: pz
			});
		},
		//获取个人配置
		getSetting: function() {
			//获取配置对象 转化成json对象 扩展默认对象
			var setting = this.poster.attr("date-setting");
			if (setting && setting != "") {
				return $.parseJSON(setting);
			} else {
				return {};
			}
		},
	};
	//初始化方法 创建对象
	Carousel.init = function(posters) {
			var _this_ = this;
			posters.each(function() {
				new _this_($(this));
			})
		}
		//注册Carousel
	window["Carousel"] = Carousel;
})(jQuery);