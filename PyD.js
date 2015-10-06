ListaPagos = new Mongo.Collection('pagos');

function horaYfecha(){
  var d = new Date();
  return d.toLocaleString();
}

function cleanBoxing(){
  event.target.apodo.value = "";
  event.target.detalle.value = "";
  event.target.cantidad.value = "";
}

function validateForm() {
    var x = document.forms["myForm"]["fname"].value;
    if (x == null || x == "") {
        alert("Name must be filled out");
        return false;
    }
}

if (Meteor.isClient) {
  Meteor.subscribe("losPagos");

  Template.listarPagos.helpers({
    'pagos' : function(){
      return ListaPagos.find({}, {sort: {fechaHora : -1}});
    },

    'totalPagos' : function(){
      var vectorPagos = ListaPagos.find({});
      console.log(vectorPagos).length;
    }
  });

  Template.agregarPagos.events({
    'submit form' : function(event){
      event.preventDefault();
      var apodoV = event.target.apodo.value;
      var detalleV = event.target.detalle.value;
      var cantidadV = event.target.cantidad.value;
      cleanBoxing();
      Meteor.call('insertarPago', apodoV, detalleV, cantidadV);
    }
  });

  Template.listarPagos.events({
    'dblclick .pago' : function(){
      var pagoId = this._id;
      Meteor.call('removerPago', pagoId);
    },

    'click #botonSubmit' : function(){
      $("#section2").focus();
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    'insertarPago' : function(apodoV, detalleV, cantidadV){
      var currentUserId = this.userId;
      fechaHoraV = horaYfecha();
      ListaPagos.insert({
        apodo : apodoV,  
        cantidad : cantidadV,
        detalle : detalleV,
        fechaHora :  new Date()
      });
    },

    'removerPago' : function(selectedPago){
      ListaPagos.remove({_id: selectedPago});
    },

    'totalPagos' : function(){
      var vectorPagos = ListaPagos.find();
      console.log(ListaPagos.find());
    }
  });

  Meteor.publish('losPagos', function(){
    return ListaPagos.find();
  });
}