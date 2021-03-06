/* 
    Class ObjectDelete
*/
"use strict";

var AbstractObjectAction = require( './abstractObjectAction.js' );

var ObjectDelete = function( object, dictionary ) {
    AbstractObjectAction.call( this, object, dictionary );
};

ObjectDelete.prototype = Object.create( AbstractObjectAction.prototype );

ObjectDelete.prototype.updateDictionary = function( dictionary ){
    
    var objectValue = this.getValue( dictionary );
    delete objectValue[ this.property ];
};

module.exports = ObjectDelete;
