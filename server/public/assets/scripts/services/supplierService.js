// Supplier Service
myApp.service( 'supplierService', [ '$http', '$location', function ( $http, $location ){
  var self = this;

  self.suppliers = { list: [] };
  // get all suppliers from database
  self.getSuppliers = function (){
    console.log( 'in get all suppliers' );
    $http.get( '/suppliers/getAll' ).then( function success(response) {
      console.log( 'suppliers getAll resp:', response.data );
      self.suppliers.list = response.data;
    }, function error ( response ){
      console.log( 'Error in getSuppliers:', response );
      if ( response.status === 403 ) {
        $location.path( '/' );
      }
    }); // end GET getAll from suppliers
  }; // end getSuppliers

  // add a supplier to the database
  self.addSupplier = function ( supplierObject ) {
    console.log( 'in add a supplier' );
    $http.post( '/suppliers/addSupplier', supplierObject ).then( function success( response ) {
      console.log( 'add supplier successfull:', response );
      self.getSuppliers();
    }, function error ( response ){
      console.log( 'Error in addSupplier:', response );
      if ( response.status === 403 ) {
        $location.path( '/' );
      }
    }); // end POST addSupplier to suppliers
  }; // end addSupplier

  self.getSuppliers();

}]); // end supplierService