var taglines = [
	"Particularly big zeroes have been known to almost equal a little bit of one.",
	"\"Just remember that a CPU is literally a rock that we tricked into thinking.\"",
	"<a href='https://www.youtube.com/watch?v=yneJIxOdMX4'>You look like a thing and I love you.</a>",
	"Did you know that, statistically speaking, there are two popes per square kilometer in Vatican City?",
	]

function getTagline() {
	var n = Math.floor(Math.random() * (taglines.length));
	document.getElementById("tagline").innerHTML = taglines[n];
};

