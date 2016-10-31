var audio = document.getElementById('audio');

var play = document.getElementById('play');
var pause = document.getElementById('pause');

var loop = document.getElementById('loop');

var timeline = document.getElementById('timeline');
var playHead = document.getElementById('playHead');
var duration = document.getElementById('duration');

var prev = document.getElementById('prev');
var volume = document.getElementById('volume');
var next = document.getElementById('next');

var playList = document.getElementById('play--list');

var timelineWidth = timeline.offsetWidth - playHead.offsetWidth;

var ulTracks = document.getElementsByTagName('ul')[0];
var liTracks = document.getElementsByTagName('li');

var itr = 0;
var itr2 = 0;
var itr3 = 0;


//ARRRAY OF TRACKS
var tracks = new Array();

tracks[0] = new track("Lana Del Ray", "Blue Jeans", "mp3/Lana%20Del%20Ray%20-%20Blue%20Jeans.mp3.mp3")

tracks[1] = new track("Red Hot Chili Peppers", "Cant Stop", "mp3/Red%20Hot%20Chili%20Peppers%20-%20Cant%20Stop.mp3");

tracks[2] = new track("Image Dragon", "Demons", "mp3/imagine-dragons-demons-original.mp3")
tracks[3] = new track("Ricky Hil", "Slickville", "mp3/Ricky Hil Slickville.mp3");

tracks[4] = new track("Londo Grammar", "Nightcall", "mp3/london-grammar-nightcall.mp3");

//TITLE
//document.getElementsByTagName('h1')[0].innerHTML = tracks[0].artist;
//document.getElementsByTagName('h4')[0].innerHTML = tracks[0].nameTrack;
chanceTitle(0);

//CUSTOM TRACK

audio.src = tracks[0].src;

//CREATE UL WHIS TRACKS

for (var i = 0; i < tracks.length; i++) {
    ulTracks.appendChild(document.createElement('li'));
    ulTracks.appendChild(document.createElement('hr'));
}
for (var i = 0; i < tracks.length; i++) {
    liTracks[i].innerHTML = tracks[i].artist + "-" + tracks[i].nameTrack;
}

//PLAY

play.addEventListener('click', function startPlay() {
    audio.play();
    imagePlayAndPause(1)
    setInterval(function () {
        setTimeCarrent()
    })
});

//PAUSE

pause.addEventListener('click', function () {
    audio.pause();
    imagePlayAndPause(0)
});

//VOLUME DOWN
prev.addEventListener('click', function () {
    audio.volume -= 0.1;
});

//LOOP
loop.addEventListener('click', function () {
    if (audio.loop == false) {
        audio.loop = true;
        loop.style.backgroundImage = "url(img/loop2.png)"
    } else {
        audio.loop = false;
        loop.style.backgroundImage = "url(img/loop.png)"
    }

});
//VOLUME UP
next.addEventListener('click', function () {
    audio.volume += 0.1;
});

volume.addEventListener('click', function () {
    if (audio.muted == false) {
        audio.muted = true;
        volume.style.backgroundImage = "url(img/volume2.png)"
    } else {
        audio.muted = false;
        volume.style.backgroundImage = "url(img/volume.png)"
    }
});

//PLAY LIST
playList.addEventListener('click', function () {
    $("#conteiner--songs").slideToggle('slow');
    itr++;
    if (itr == 1) {
        playList.style.backgroundImage = "url(img/playList2.png)";
    }
    if (itr == 2) {
        playList.style.backgroundImage = "url(img/playList.png)";
        itr = 0;
    }
});

for (var i = 0; i < liTracks.length; i++) {
    liTracks[i].onclick = function () {
        var x = this.innerHTML;
        var index;
        for (var j = 0; j < tracks.length; j++) {
            var y = x.split("-");
            if (y[1] == tracks[j].nameTrack) {
                index = j;
            }
        }
        itr2 = index;
        audio.src = tracks[index].src;
        audio.autoplay = true;
        imagePlayAndPause(1)
        chanceTitle(index);
        setInterval(function () {
            setTimeCarrent()
        })
    }
}

//TIME UPDATE
audio.addEventListener("timeupdate", timeUpdate, false);

timeline.addEventListener("click", function (event) {
    moveplayhead(event);
    audio.currentTime = audio.duration * clickPercent(event);
}, false);


function clickPercent(e) {
    return (e.pageX - timeline.offsetLeft) / timelineWidth;
}


playHead.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);


var onplayhead = false;

function mouseDown() {
    onplayhead = true;
    window.addEventListener('mousemove', moveplayhead, true);
    audio.removeEventListener('timeupdate', timeUpdate, false);
}

function mouseUp(e) {
    if (onplayhead == true) {
        moveplayhead(e);
        window.removeEventListener('mousemove', moveplayhead, true);
        // change current time
        audio.currentTime = audio.duration * clickPercent(e);
        audio.addEventListener('timeupdate', timeUpdate, false);
    }
    onplayhead = false;
}

function moveplayhead(e) {
    var newMargLeft = e.pageX - timeline.offsetLeft;
    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
        playHead.style.marginLeft = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
        playHead.style.marginLeft = "0px";
    }
    if (newMargLeft > timelineWidth) {
        playHead.style.marginLeft = timelineWidth + "px";
    }
}


function timeUpdate() {
    var playPercent = timelineWidth * (audio.currentTime / audio.duration);
    playHead.style.marginLeft = playPercent + "px";

}

//FUNCTION CONVERT TIME
function convertTime(seconds) {
    minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}


//ANALYSER
var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;
// Initialize the MP3 player after the page loads all of its HTML into the window
window.addEventListener("load", initMp3Player, false);

function initMp3Player() {
    context = new AudioContext(); // AudioContext object instance
    analyser = context.createAnalyser(); // AnalyserNode method
    canvas = document.getElementById('analyser_render');
    ctx = canvas.getContext('2d');
    // Re-route audio playback into the processing graph of the AudioContext
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLooper();
}
// frameLooper() animates any style of graphics you wish to the audio frequency
// Looping at the default frame rate that the browser provides(approx. 60 FPS)
function frameLooper() {
    window.requestAnimationFrame(frameLooper);
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    var my_gradient = ctx.createLinearGradient(0, 50, 0, 170);
    my_gradient.addColorStop(0, "#04d7de");
    my_gradient.addColorStop(1, "white");
    ctx.fillStyle = my_gradient;
    //    ctx.fillStyle = '#04d7de'; // Color of the bars
    bars = 100;
    for (var i = 0; i < bars; i++) {
        bar_x = i * 3;
        bar_width = 2;
        bar_height = -(fbc_array[i] / 2);
        //  fillRect( x, y, width, height ) // Explanation of the parameters below
        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
    }
}




//CONSTRUCTOR TRACKS
function track(artist, nameTrack, src) {
    this.artist = artist;
    this.nameTrack = nameTrack;
    this.src = src;
}
//FUNCTION TIME CARRENT
function setTimeCarrent() {
    document.getElementsByTagName('span')[0].innerHTML = convertTime(audio.currentTime);
    document.getElementsByTagName('span')[1].innerHTML = "/";
    document.getElementsByTagName('span')[2].innerHTML = convertTime(audio.duration);
    if (audio.currentTime === audio.duration) {
        itr2++;
        audio.src = tracks[itr2].src;
        chanceTitle(itr2);
        audio.autoplay = true;
    }
}
//FUNCTION CHANCHE TITLE
function chanceTitle(x) {
    document.getElementsByTagName('h1')[0].innerHTML = tracks[x].nameTrack;
    document.getElementsByTagName('h4')[0].innerHTML = tracks[x].artist;
}
//FUNCTION CHANCHE IMG PLAY AND PAUSE
// play-1
// pause-0
function imagePlayAndPause(x) {
    if (x === 1) {
        play.style.backgroundImage = "url(img/play2.png)";
        pause.style.backgroundImage = "url(img/pausa.png)";
    }
    if (x === 0) {
        play.style.backgroundImage = "url(img/play.png)";
        pause.style.backgroundImage = "url(img/pausa2.png)";
    }

}