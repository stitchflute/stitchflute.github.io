<!DOCTYPE html>
<html lang="en">
<head>
<!-- 	<link href="//vjs.zencdn.net/7.10.2/video-js.min.css" rel="stylesheet">
	<script src="//vjs.zencdn.net/7.10.2/video.min.js"></script> -->
    <link type="text/css" rel="stylesheet" href="./style.css">
    <!--<link type="text/css" rel="stylesheet" href="css/default.css">-->
    <script type="text/javascript" src="./jquery.js"></script>
    <script type="text/javascript" src="./garden.js"></script>
    <script type="text/javascript" src="./function.js"></script>
    <!--<script type="text/javascript" src="./love.js"></script>-->

</head>
<body>
<div class = "header">
	<div class = "music-box" id = "music-box">
		<!-- <div class = "play">
			<input type="button" value="暂停" id="pause" />
		</div>
		<div class = "pouse">
			<input type="button" value="播放" id="play" />
		</div> -->
		 <!--<embed id = "music" src = "music/胡歌 - 风起时.mp3" autostart=true hidden="true">-->
		<!-- <audio controls id = "music" src="./9420.mp3" autoplay = "autoplay" loop = "loop"></audio> -->
		<audio controls id = "music" src="./9420.mp3" autoplay = "autoplay"></audio>
		<!-- <video controls id = "my_video" src="./happy.mp4" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation={'portrait'} autoplay = "autoplay" loop = "loop" width="280" height="160"></video> -->
	</div>
</div>
<div class = "content">
	<!--<canvas id = "canvas"></canvas>-->
	<div class = "content-left">
		<div class = "text">
			<div class = "textLeft">
				<span class = "poem">世间安得双全法</span><br>
				<span class = "poem">不负如来不负卿</span><br><br>
				<span class = "poem">我摇动所有的转经筒</span><br>
				<span class = "poem">不为超度</span><br>
				<span class = "poem">只为触摸你的指尖</span><br><br>
				<span class = "poem">我磕长头匍匐在山路</span><br>
				<span class = "poem">不为朝佛觐见</span><br>
				<span class = "poem">只为贴着你的温暖</span><br><br>
				<span class = "poem">转山转水转佛塔</span><br>
				<span class = "poem">不为修来世</span><br>
				<span class = "poem">只为在途中与你相见</span><br><br>

			</div>
			<div class = "textRight">
				<span class = "poem">我行遍世间所有的路</span><br>
				<span class = "poem">逆着时光行走</span><br>
				<span class = "poem">只为今生与你邂逅</span><br><br>
				<span class = "poem">你一直在我的伤口中幽居</span><br>
				<span class = "poem">我放下过天地</span><br>
				<span class = "poem">却从未放下过你</span><br><br>
				<span class = "poem">为了今生遇见你</span><br>
				<span class = "poem">我在前世</span><br>
				<span class = "poem">早已留有余地</span><br><br>
				<span class = "poem">我步入你</span><br>
				<span class = "poem">一场大雪</span><br>
				<span class = "poem">便封住了世间万物</span><br><br>
			</div>
		</div>
		<!--<div class = "pic"></div>-->
		<div class = "date" id="dateTime">
			<div class = "begin">
				<span>自<span class = "large">2017</span>年<span class = "large">7</span>月<span class = "large">8</span>日<span class = "large">16</span>时<span class = "large">21</span>分<span class = "large">00</span>秒开始</span><br>
				<span class = "large">月月</span>和<span class = "large">岗岗</span>已经相爱了</span>
			</div>
			<div id = "dateId">
			</div>
			<!-- <audio controls muted id = "music" src="./music/胡歌 - 风起时.mp3" autoplay = "autoplay" loop = "loop"></audio> -->
			<!-- <embed id = music src = "music/胡歌 - 风起时.mp3" autostart=true> -->
		</div>
	</div>
	<div class = "content-right">
		<div class = "pic" id="loveHeart">
				<canvas id="garden"></canvas>
				<div id="words">
					<div id="messages">
						亲爱的，这是我们相爱在一起的时光。
						<div id="elapseClock"></div>
					</div>
					<div id="loveu">
						<!-- <video controls id = "my_video" src="./happy.mp4" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation='portrait' autoplay = "autoplay"></video> -->
						<!-- <video
						    id="my_video"
						    class="video-js"
						    controls
						    preload="auto"
						    width="280"
						    height="160"
						    data-setup='{}'>
						  <source src="./happy.mp4" type="video/mp4"></source>
						  <p class="vjs-no-js">
						    To view this video please enable JavaScript, and consider upgrading to a
						    web browser that
						    <a href="https://videojs.com/html5-video-support/" target="_blank">
						      supports HTML5 video
						    </a>
						  </p>
						</video> -->
						Love you forever<br/>
						<div class="signature">- 岗岗</div>
					</div>
				</div>
		</div>
	</div>
</div>
<div class = "foot">
</div>

<script >
	// var offsetX = $("#loveHeart").width()-200;
	// var offsetY = $("#loveHeart").height()-345;
	// var music = document.getElementById('music');
	// music.muted = false;
	// <!--var mp3 = "tonghuazhen.flac";-->
 //    <!--var mp3 = new Audio(mp3);-->
 //    <!--//监听循环播放-->
	// <!--$(mp3).bind("ended", function() {-->
 //                <!--mp3.play();-->
 //    <!--});-->
 //    <!--mp3.play();-->
 //    <!--document.getElementById('music').play();-->
	execute();
	// window.onload() = function(){
	// 	alert("finish!!!");
	// 	document.getElementById('music').click(); // player是audio标签的ID
	// }
		// var video = document.getElementById('my_video')
		// if (video.requestFullscreen) {
		// 	// alert("full111");
		// 	window.location.href='happy.mp4';
  //           video.requestFullscreen();
  //       } else if (video.mozRequestFullScreen) {
  //       	alert("full222");
  //           video.mozRequestFullScreen();
  //       } else if (video.webkitRequestFullscreen) {
  //       	alert("full3333");
  //           video.webkitRequestFullscreen();
  //       } else if (video.webkitSupportsFullscreen) {
  //       	alert("full444");
  //           video.webkitEnterFullscreen();
  //       } else if (video.msRequestFullscreen) {
  //       	alert("full555");
  //           video.msRequestFullscreen();
  //       } else {
  //           this.addClass(el, "video-player--is-cssfullscreen");
        // }
        function onFullScreen(e) {
			// var isFullscreenNow = document.webkitFullscreenElement || document.fullscreenElement || mozFullscreenElement
			// window.location.href='happy.mp4';
			top.location.href='happy.mp4';
		}
		document.getElementById("my_video").addEventListener('fullscreenchange', onFullScreen)
		document.getElementById("my_video").addEventListener('webkitfullscreenchange', onFullScreen)
		// document.getElementById("my_video").addEventListener('mozfullscreenchange', onFullScreen)

function execute(){
	// alert("w=" + $(window).width());
    setTimeout(function () {
		startHeartAnimation();
	}, 500);
	// <!--var date = new Date("June 8, 2017 16:21:00")；-->
	// <!--timeElapse(date);-->
	// <!--setInterval(function () {-->
	// 	<!--timeElapse(date);-->
	// <!--}, 500);-->

	// adjustCodePosition();
	// window.location.Reload();
	showTime();
	$(".text").typewriter();
	// $("#music")[0].play();
}


</script>
<!--<iframe id = "iframe" src = "music/胡歌 - 风起时.mp3" allow = "autoplay" />-->
<!-- <script type="text/javascript">
	$ (function ()
    {
        // var player = $ ("#music");
        var player = document.getElementById('music');
        $ ('#play').click (function ()
        {
        	// alert("play");
        	document.getElementById('music-box').style.backgroundColor = "blue";
            player.Play ();
        })
 
        $ ('#pause').click (function ()
        {
        	// alert("pause");
        	document.getElementById('music-box').style.backgroundColor = "yellow";
            player.Stop();
        })
         
        // $ ('#b7').click (function ()
        // {
        //     player.Stop ();
        // })
 
    })
</script> -->

</body>


</html>
