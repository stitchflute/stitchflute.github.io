
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();


$(function () {
    // setup garden
	$loveHeart = $("#loveHeart");
	// var offsetX = $loveHeart.width() / 2;
	// var offsetY = $loveHeart.height() / 2 - 55;
    $garden = $("#garden");
    gardenCanvas = $garden[0];
//	gardenCanvas.width = $("#loveHeart").width();
//    gardenCanvas.height = $("#loveHeart").height();
	if(clientWidth > 1600){
        gardenCanvas.width = $("#loveHeart").width()*1.6;
        gardenCanvas.height = $("#loveHeart").height()*1.6;
    }
    else if(clientWidth > 1300){
        gardenCanvas.width = $("#loveHeart").width()*1.8;
        gardenCanvas.height = $("#loveHeart").height()*1.8;
    }
    else if(clientWidth > 1000){
        gardenCanvas.width = $("#loveHeart").width()*1.6;
        gardenCanvas.height = $("#loveHeart").height()*1.6;
    }
    else{
        gardenCanvas.width = $("#loveHeart").width()*1.4;
        gardenCanvas.height = $("#loveHeart").height()*1.4;
    }

    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);
	
//	$("#content").css("width", $loveHeart.width() + $("#code").width());
//	$("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
//	$("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
//	$("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));

    // renderLoop
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
});

$(window).resize(function() {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

function getHeartPoint(angle) {
	var offsetX, offsetY;
	// offsetX = $("#loveHeart").width()*0.7;
    // offsetY = $("#loveHeart").height()*0.5;
	if(clientWidth > 1600){
        offsetX = $("#loveHeart").width()*0.7;
        offsetY = $("#loveHeart").height()*0.6;
    }
    else if(clientWidth > 1300){
        offsetX = $("#loveHeart").width()-40;
        offsetY = $("#loveHeart").height()-205;
    }
    else if(clientWidth > 1000){
        offsetX = $("#loveHeart").width()-100;
        offsetY = $("#loveHeart").height()-245;
    }
    else{
        offsetX = $("#loveHeart").width()-170;// 减的值越小越靠右
        offsetY = $("#loveHeart").height()-185;// 减的值越小越靠下
    }
	var t = angle / Math.PI;
	var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
	var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
	return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
	var interval = 50;
	var angle = 10;
	var heart = new Array();
	var animationTimer = setInterval(function () {
		var bloom = getHeartPoint(angle);
		var draw = true;
		for (var i = 0; i < heart.length; i++) {
			var p = heart[i];
			var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
			if (distance < Garden.options.bloomRadius.max * 1.3) {
				draw = false;
				break;
			}
		}
		if (draw) {
			heart.push(bloom);
			garden.createRandomBloom(bloom[0], bloom[1]);
		}
		if (angle >= 30) {
			clearInterval(animationTimer);
			showMessages();
		} else {
			angle += 0.2;
		}
	}, interval);
}

(function($) {
	$.fn.typewriter = function() {
		this.each(function() {
			var $ele = $(this), str = $ele.html(), progress = 0;
			$ele.html('');
			var timer = setInterval(function() {
				var current = str.substr(progress, 1);
				if (current == '<') {
					progress = str.indexOf('>', progress) + 1;
				} else {
					progress++;
				}
				$ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
				if (progress >= str.length) {
					clearInterval(timer);
				}
			}, 75);
		});
		return this;
	};
})(jQuery);

function showTime()
{
	// var newDiv = document.createElement("div");
	var date = new Date("July 8, 2017 16:21:00")
	// var date = new Date("April 26, 2019 00:00:00")
	var current = Date();
	var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
	var days = Math.floor(seconds / (3600 * 24));
	seconds = seconds % (3600 * 24);
	var hours = Math.floor(seconds / 3600);
	if (hours < 10) {
		hours = "0" + hours;
	}
	seconds = seconds % 3600;
	var minutes = Math.floor(seconds / 60);
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	seconds = seconds % 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
//	document.getElementById('dateId').innerHTML = "第 <span class=\"large\">" + days + "</span> 天 <span class=\"large\">" + hours + "</span> 小时 <span class=\"large\">" + minutes + "</span> 分钟 <span class=\"large\">" + seconds + "</span> 秒";
	var result = "<span class=\"large\">" + days + "</span> 天 <span class=\"large\">" + hours + "</span> 小时 <span class=\"large\">" + minutes + "</span> 分钟 <span class=\"large\">" + seconds + "</span> 秒";
	$("#dateId").html(result);
//	<!--// document.write(h + ":" + m + ":" + s);-->
//	document.getElementById('dateId').innerHTML = hours + ":" + minutes + ":" + seconds;
	t=setTimeout('showTime()',500);
}

function showMessages() {
	adjustWordsPosition();
	// adjustVideoPosition();
	showLoveU();
//	$('#messages').fadeIn(5000, function() {
//		showLoveU();
//	});
}

function adjustWordsPosition() {
	$('#words').css("position", "absolute");
	// alert(clientWidth)
	// $('#words').css("top", $("#garden").position().top*3.2);
 //    $('#words').css("left", $("#garden").position().left*1.1);
	if(clientWidth > 1600){
        $('#words').css("top", $("#garden").position().top*3.2);
        $('#words').css("left", $("#garden").position().left*1.1);
    }
	else if(clientWidth > 1300){
        $('#words').css("top", $("#garden").position().top + 90);
        $('#words').css("left", $("#garden").position().left + 70);
    }
    else if(clientWidth > 1000){
        $('#words').css("top", $("#garden").position().top + 90);
        $('#words').css("left", $("#garden").position().left + 80);
    }
    else{
        $('#words').css("top", $("#garden").position().top + 100);
        $('#words').css("left", $("#garden").position().left + 60);
    }
}

function adjustVideoPosition() {
	// $('#my_video').css("position", "absolute");
	if(clientWidth > 1300){
		$('#words').css("top", $("#garden").position().top*2.7);
    	$('#words').css("left", $("#garden").position().left*1.15);
        $('#my_video').css("width", 280);
        $('#my_video').css("height", 160);
    }
    else if(clientWidth > 1000){
    	// $('#words').css("top", $("#garden").position().top*2);
    	// $('#words').css("left", $("#garden").position().left*1);
        $('#my_video').css("width", 40);
        $('#my_video').css("height", 20);
    }
    else{
    	$('#words').css("top", $("#garden").position().top);
    	$('#words').css("left", $("#garden").position().left);
        $('#my_video').css("width", 20);
        $('#my_video').css("height", 10);
    }
}

function adjustCodePosition() {
	$('#text').css("margin-top", ($("#garden").height() - $("#text").height()) / 2);
}

function showLoveU() {
	$('#loveu').fadeIn(3000);
	$('#dateTime').fadeIn(3000);
}


// $(window).load(function() {
// 	$("#music-box").css("backgroundColor", "black");
// });
