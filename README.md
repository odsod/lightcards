lightcards
==========

<img align="center" src="http://odsod.github.io/lightcards/preview.png">

`lightcards` is a flash card software for learning Chinese characters. It is
designed to be lightweight and minimalistic.

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

* Add a watcher that handles updates to the vocabulary file.
* Add visual hint that `↓`-key reveals translation / input.
* Improve translations by handling multiple transcriptions of the same
  character.
* Verify Windows compatibility.
