ContactManager.module("ContactsApp.Gender", function(Gender, ContactManager, Backbone, Marionette, $, _){
  Gender.ShowGender = Marionette.ItemView.extend({
    template: "#gender-graph",
    className: "gender-graph-container"
  });
});
