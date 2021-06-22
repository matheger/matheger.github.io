---
layout: post
title: Short Project
description: description of the short project which is long enough
---

Example taken from [here](http://www.unexpected-vortices.com/sw/rippledoc/quick-markdown-example.html){:target="_blank"}.

H1 Header
============

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, **bold**, and `monospace`. Itemized lists
look like:

  * this one
  * that one
  * the other one

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺


H2 Header
------------

Here's a numbered list:

 1. first item
 2. second item
 3. third item

Note again how the actual text starts at 4 columns in (4 characters
from the left side). Here's a code sample:

    # Let me re-iterate ...
    for i in 1 .. 10 { do-something(i) }

As you probably guessed, indented 4 spaces. By the way, instead of
indenting the block, you can use delimited blocks, if you like:

~~~
define foobar() {
    print "Welcome to flavor country!";
}
~~~

(which makes copying & pasting easier). You can optionally mark the
delimited block for Pandoc to syntax highlight it:

~~~python
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print(i)
~~~



### An h3 header ###

Now a nested list:

 1. First, get these ingredients:

      * carrots
      * celery
      * lentils

 2. Boil some water.

 3. Dump everything in the pot and follow
    this algorithm:

        find wooden spoon
        uncover pot
        stir
        cover pot
        balance wooden spoon precariously on pot handle
        wait 10 minutes
        goto first step (or shut off burner when done)

    Do not bump wooden spoon or it will fall.

Notice again how text always lines up on 4-space indents (including
that last line which continues item 3 above).

Here's a link to [a website](http://foo.bar), to a [local
doc](local-doc.html), and to a [section heading in the current
doc](#an-h2-header). Here's a footnote.[^1]

Tables can look like this:

Name           Size  Material      Color
------------- -----  ------------  ------------
All Business      9  leather       brown
Roundabout       10  hemp canvas   natural
Cinderella       11  glass         transparent

Table: Shoes sizes, materials, and colors.

(The above is the caption for the table.) Pandoc also supports
multi-line tables:

--------  -----------------------
Keyword   Text
--------  -----------------------
red       Sunsets, apples, and
          other red or reddish
          things.

green     Leaves, grass, frogs
          and other things it's
          not easy being.
--------  -----------------------

A horizontal rule follows.

***

Here's a definition list:

apples
  : Good for making applesauce.

oranges
  : Citrus!

tomatoes
  : There's no "e" in tomatoe.

Again, text is indented 4 spaces. (Put a blank line between each
term and  its definition to spread things out more.)

Here's a "line block" (note how whitespace is honored):

| Line one
|   Line too
| Line tree

and images can be specified like so:

{: .center}
![example image](/assets/1_project/example-image.jpg){:height="100px" width="100px"}


Inline math equation: $$\omega = d\phi / dt$$. Display math should get its own line like so:

$$I = \int \rho R^{2} dV$$

And note that you can backslash-escape any punctuation characters
which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.

<div markup=0 class='tableauPlaceholder' id='viz1624325704590'>
	<noscript>
		<a href='#'>
			<img alt='Average Number of Rides Started on Workdays and Weekends ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;GO&#47;GOOGLE_DA-CaseStudy1-Rideshare&#47;RidesonWorkdaysWeekends&#47;1_rss.png' style='border: none' />
		</a>
	</noscript>

	<object class='tableauViz'  style='display:none;'>
		<param name='dataDetails' value='no' />
		<param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> 
		<param name='embed_code_version' value='3' /> 
		<param name='site_root' value='' />
		<param name='name' value='GOOGLE_DA-CaseStudy1-Rideshare&#47;RidesonWorkdaysWeekends' />
		<param name='tabs' value='no' />
		<param name='toolbar' value='no' />
		<param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;GO&#47;GOOGLE_DA-CaseStudy1-Rideshare&#47;RidesonWorkdaysWeekends&#47;1.png' /> 
		<param name='animate_transition' value='yes' />
		<param name='display_static_image' value='yes' />
		<param name='display_spinner' value='yes' />
		<param name='display_overlay' value='yes' />
		<param name='display_count' value='yes' />
		<param name='language' value='en-US' />
	</object>
</div>

<script type='text/javascript'>
	var divElement = document.getElementById('viz1624325704590');
	var vizElement = divElement.getElementsByTagName('object')[0];
	vizElement.style.width='100%';
	vizElement.style.height=(divElement.offsetWidth*0.75)+'px';
	var scriptElement = document.createElement('script');
	scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);
</script>

253

[^1]: Some footnote text.
