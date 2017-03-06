ContactManager.module("ContactsApp", function(ContactsApp, ContactManager, Backbone, Marionette, $, _){
  ContactsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "contacts(/filter/criterion::criterion)": "listContacts",
      "contacts/:id": "showContact",
      "contacts/:id/edit": "editContact",
      //"contacts/gender": "showGender"
    }
  });

  var API = {
    listContacts: function(criterion){
      ContactsApp.List.Controller.listContacts(criterion);
      ContactManager.execute("set:active:header", "contacts");
    },

    showContact: function(id){
      ContactsApp.Show.Controller.showContact(id);
      ContactManager.execute("set:active:header", "contacts");
    },

    editContact: function(id){
      ContactsApp.Edit.Controller.editContact(id);
      ContactManager.execute("set:active:header", "contacts");
    },

    genderGraph: function(){
      ContactsApp.Gender.Controller.showGender();
      //ContactManager.execute("set:active:header", "contacts");
    }
  };

  ContactManager.on("contacts:list", function(){
    ContactManager.navigate("contacts");
    API.listContacts();
  });

  ContactManager.on("contacts:filter", function(criterion){
    if(criterion){
      ContactManager.navigate("contacts/filter/criterion:" + criterion);
    }
    else{
      ContactManager.navigate("contacts");
    }
  });

  ContactManager.on("contact:show", function(id){
    ContactManager.navigate("contacts/" + id);
    API.showContact(id);
  });

  ContactManager.on("contact:edit", function(id){
    ContactManager.navigate("contacts/" + id + "/edit");
    API.editContact(id);
  });

  ContactManager.on("contact:gender-view", function(){
    ContactManager.navigate("/gender-graph");
    API.genderGraph();
  });

  ContactsApp.on("start", function(){
    new ContactsApp.Router({
      controller: API
    });
  });
});