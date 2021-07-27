---
title: Python Stuff
layout: default
permalink: /python/
published: true
---

After spending years of learning and using Python for day-to-day tasks, I have come to understand a lot of its rules and quirks. But sometimes, in order to really appreciate the inner workings of something, you have to crack it open, or stretch it till it tears, and see what falls out.

This page holds a number of interesting, lesser-known, or just plain nonsensical Python tidbits. They are meant to be either informative or silly---with no particular guarantee for either one. If you come away learning something, that's very good; if you just have a chuckle, even better.

# The Good...

Let's start with some actually useful stuff. These are language features that may or may not be well-known, but are worth pointing nonetheless.

## Or `else`...!

In Python, `for` and `while` loops support an `else` block that is executed if the loop finishes without hitting a `break` statement. In other terms, we can make our loops execute some default fall-through behaviour if they never meet any premature exit condition.

As a matter of fact, `try/except` blocks support them too! So the full-blown version of exception handling in Python is this:

```python
try:
	# something
except ...:
	# catch errors
else:
	# if no error occurs
finally:
	# execute this no matter what
```

Speaking of `finally`: Can you guess what the value of `x` is at the end of this code?

```python
try:
	x = True
except:
	pass
finally:
	x = False
```

## Order!

Another quick, but useful fact: Since version 3.6, dictionaries in Python are always in insertion order. Loop away!

## Talk to the file

With the release of Python 3, `print` became a function. There are many useful implications to this, but a particular one is that it accepts a `file` parameter---and it does exactly what it says on the tin: Give it a file object, and it redirects the output to that file instead of the console. Gone are the days of `f.write(text)` and clumsy newline concatenation!

# The Bad & The Ugly

Okay, enough of the serious stuff. Here's some of the promised silly junk.

## Identity Crisis

We've all asked ourselves at some point, "Who am I *really*?" It's a confusing and---perhaps---ultimately pointless question; but it can keep us up at night at the worst possible time.

Luckily, we don't have to be alone in our existential dread. Through its permissive scoping and naming rules, we can teach Python to experience the same thing. Just take a look:

```python
>>> class self:
...     def __init__(self):
...         self.self: self = self
...
>>> self = self()
>>> self
<__main__.self object at 0x000002133D308A60>
>>> self.self
<__main__.self object at 0x000002133D308A60>
>>> self.self.self
<__main__.self object at 0x000002133D308A60>
```

The answer, it turns out, is quite simple: You are who you are. Stop worrying.

## "I am Spartacus!"

Recursion, as in the `self` example above, is more of a cheap "gotcha" than a real eyebrow-raiser once you've reached a certain level of programming maturity. But through some careful abuse of the `__new__` class method, we can make this a little more entertaining:

```python
>>> class Spartacus:
...     def __new__(self):
...         print("I am Spartacus!")
...         return Spartacus2
...
>>> class Spartacus2:
...     def __new__(self):
...         print("No, I am Spartacus!")
...         return Spartacus
...
...
>>> Spartacus()
I am Spartacus!
<class '__main__.Spartacus2'>
>>> Spartacus()()
I am Spartacus!
No, I am Spartacus!
<class '__main__.Spartacus'>
>>> Spartacus()()()
I am Spartacus!
No, I am Spartacus!
I am Spartacus!
```

And the best part: It's extensible to any number of objects we want!

## *tacet*

Ever had a bug that you couldn't track down? A program that would throw exceptions and you didn't know why? Code that kept crashing for seemingly no reason?

At this point, some programmers with sufficient experience under their belt would quip, "Just wrap your entire program in a `try/except` block, ha ha!" and think that they're very clever.

However, here's the *actual* clever way to do it:

```python
import sys
sys.stderr.close()
```

No more errors!


## And finally...

... my personal *pièce de résistance*: The concatenation-based FizzBuzz one-liner!

```python
[print((i%3==0)*"Fizz"+(i%5==0)*"Buzz"+((i%3*i%5)!=0)*str(i)) for i in range(1,101)]
```
