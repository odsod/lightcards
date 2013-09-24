exports.normalize = function(pinyin) {
  return pinyin
    .trim()
    .toLowerCase()
    .replace(/5/g, '')
    .replace(/u:/g, 'v')
    .replace(/\s+/g, '');
};
