// http://stackoverflow.com/questions/1598856/convert-numbered-to-accentuated-pinyin

var numToMark = {
  '1': {
    'a': '\u0101',
    'e': '\u0113',
    'i': '\u012B',
    'o': '\u014D',
    'u': '\u016B',
    'ü': '\u01D6'
  },
  '2': {
    'a': '\u00E1',
    'e': '\u00E9',
    'i': '\u00ED',
    'o': '\u00F3',
    'u': '\u00FA',
    'ü': '\u01D8'
  },
  '3': {'a': '\u01CE',
    'e': '\u011B',
    'i': '\u01D0',
    'o': '\u01D2',
    'u': '\u01D4',
    'ü': '\u01DA'
  },
  '4': {'a': '\u00E0',
    'e': '\u00E8',
    'i': '\u00EC',
    'o': '\u00F2',
    'u': '\u00F9',
    'ü': '\u01DC'
  },
  '5': {'a': 'a',
    'e': 'e',
    'i': 'i',
    'o': 'o',
    'u': 'u',
    'ü': 'ü'
  }
};

var markToNum = {
  'ā': { 'replaceWith': 'a', 'tone': '1' },
  'ē': { 'replaceWith': 'e', 'tone': '1' },
  'ī': { 'replaceWith': 'i', 'tone': '1' },
  'ō': { 'replaceWith': 'o', 'tone': '1' },
  'ū': { 'replaceWith': 'u', 'tone': '1' },
  'ǖ': { 'replaceWith': 'ü', 'tone': '1' },
  'á': { 'replaceWith': 'a', 'tone': '2' },
  'é': { 'replaceWith': 'e', 'tone': '2' },
  'í': { 'replaceWith': 'i', 'tone': '2' },
  'ó': { 'replaceWith': 'o', 'tone': '2' },
  'ú': { 'replaceWith': 'u', 'tone': '2' },
  'ǘ': { 'replaceWith': 'ü', 'tone': '2' },
  'ǎ': { 'replaceWith': 'a', 'tone': '3' },
  'ě': { 'replaceWith': 'e', 'tone': '3' },
  'ǐ': { 'replaceWith': 'i', 'tone': '3' },
  'ǒ': { 'replaceWith': 'o', 'tone': '3' },
  'ǔ': { 'replaceWith': 'u', 'tone': '3' },
  'ǚ': { 'replaceWith': 'ü', 'tone': '3' },
  'à': { 'replaceWith': 'a', 'tone': '4' },
  'è': { 'replaceWith': 'e', 'tone': '4' },
  'ì': { 'replaceWith': 'i', 'tone': '4' },
  'ò': { 'replaceWith': 'o', 'tone': '4' },
  'ù': { 'replaceWith': 'u', 'tone': '4' },
  'ǜ': { 'replaceWith': 'ü', 'tone': '4' }
};

exports.normalize = function(pinyin) {
  return pinyin
    .trim()
    .replace(/5/g, '')
    .replace(/u:/g, 'v')
    .replace(/ü/g, 'v')
    .replace(/\s+/g, '');
};
