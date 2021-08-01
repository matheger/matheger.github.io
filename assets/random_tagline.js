var taglines = [
	"Particularly big zeros have been known to almost equal a little bit of one.",
	"\"Just remember that a CPU is literally a rock that we tricked into thinking.\"",
	"<a href='https://www.youtube.com/watch?v=yneJIxOdMX4'>You look like a thing and I love you.</a>",
	"Statistically speaking, Vatican City is home to two popes per square kilometer.",
	"e = π = 3, for sufficiently large e and small π."
	]

function getTagline() {
	var n = Math.floor(Math.random() * (taglines.length));
	document.getElementById("tagline").innerHTML = taglines[n];
};

