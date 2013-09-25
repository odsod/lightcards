var ko = require('knockout'),
    LightcardsModel = require('./lightcards-model.js').LightcardsModel,
    LightcardsViewModel = require('./lightcards-view-model').LightCardsViewModel;

ko.applyBindings(new LightcardsViewModel(new LightcardsModel(cards)));
