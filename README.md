lightcards
==========

<img align="center" src="http://odsod.github.io/lightcards/preview.png">

`lightcards` is a flash card software for learning Chinese characters. 

It is designed with the Unix philosophy in mind. Edit your
vocabulary using Sublime, Notepad, or whatever software you like.

I use Google Docs, so I can edit my vocabulary when I'm on the go. When I have
updated my vocabulary, I wget it to stdout and pipe it into `lightcards`.

Getting started
---------------

Requirements:

* A sufficiently modern web browser
* Node.js

To install:

    sudo npm install -g lightcards

`lightcards` needs a vocabulary to generate flash cards from. A vocabulary
is a `.txt` file containing chinese characters separated by newlines:

    什么
    名字
    谢谢
    很
    早饭
    苹果
    孩子
    鸭子
    吃
    你
    吗
    我

To generate a starting vocabulary:

    lightcards init

To run `lightcards`:

    lightcards

`lightcards` then starts a local web server that you find by navigating to
`http://localhost:3000` in your web browser.

By default, `lightcards` uses `vocabulary.txt` from the current working
directory. If no `vocabulary.txt` can be found, `lightcards` will create
it create it for you.

Have fun!

Todo
----

* Add visual hint that `↓`-key reveals translation / input
* Keep track of state between sessions using a local file
* Randomize cards using a spaced repetition algorithm
* Add support for pronounciation mp3:s
* Improve translations by handling multiple transcriptions of the same
  character
* Verify Windows compatibility
