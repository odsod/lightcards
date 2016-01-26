lightcards
==========

<img align="center" src="http://odsod.github.io/lightcards/preview.png">

`lightcards` is a minimalistic flash card software for learning Chinese characters. 

Getting started
---------------

~~~sh
$ npm install -g lightcards
    
$ lightcards init
File vocabulary.txt created.

$ lightcards < vocabulary.txt

Reading vocabulary from stdin... OK!
Generating flashcards... OK!
Compiling scripts... OK!
Starting local web server... OK!

Start learning on http://localhost:3000
~~~
    
Have fun!

Todo
----

[x] Recompile script on every request

[x] Keep track of state between sessions using a local file

[x] Randomize cards using a spaced repetition algorithm

[x] Add support for pronounciation mp3:s
