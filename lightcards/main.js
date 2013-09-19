var ko = require('knockout'),
    cards = require('../cards.js'),
    LightCardsViewModel = require('./light-cards-view-model').LightCardsViewModel;

ko.applyBindings(new LightCardsViewModel(cards));
