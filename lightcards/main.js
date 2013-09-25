var ko = require('knockout'),
    LightcardsModel = require('./lightcards-model.js').LightcardsModel,
    LightcardsViewModel = require('./lightcards-view-model').LightCardsViewModel;

var model = new LightcardsModel(flashcards);

var viewModel = new LightcardsViewModel(model, {
  hasAudio: hasAudio
});

ko.applyBindings(viewModel);
