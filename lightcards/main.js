var ko = require('knockout'),
    LightCardsViewModel = require('./light-cards-view-model').LightCardsViewModel;

ko.applyBindings(new LightCardsViewModel(cards));
