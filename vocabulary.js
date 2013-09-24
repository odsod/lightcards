exports.parse = function(vocabulary) {
  return vocabulary.trim().split('\n').map(function(row) {
    var matches = /^(.+?), (.+), (.*)$/.exec(row.trim());
    if (!matches) { console.log('Failed to parse:', row); }
    return { hanzi: matches[1], pinyin: matches[2], translation: matches[3] };
  });
};
