"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var Qunit = require( 'qunitjs' );
var expressionBuilder = require( '../../../js/app/expressions/expressionBuilder.js' );
var context = require( '../../../js/app/context.js' );

var IncExpression = require( './incExpression.js' );

var value = 5;

var dictionary = { 
    aNumber: value
};

var testNotDefinedExpression = function( assert ){
    zpt.run({
            root: document.body,
            dictionary: dictionary
    });
    assert.equal( $('#t1-1').html() , "undefined" );
};

var testDefinedExpression = function( assert ){
    zpt.run({
            root: document.body,
            dictionary: dictionary
    });
    assert.equal( $('#t1-1').html() , 6 );
    assert.equal( $('#t1-2').html() , 7 );
};

QUnit.test( "Custom expressions test", function( assert ) {
    
    // Set all cache off
    context.getConf().attributeCacheOn = false;
    context.getConf().expressionCacheOn = false;
    
    // Test when the custom expression is not registered yet
    testNotDefinedExpression( assert );
    
    // Test when the custom expression is registered
    expressionBuilder.register( IncExpression );
    testDefinedExpression( assert );
    
    // Test when the custom expression is unregistered
    expressionBuilder.unregister( IncExpression );
    testNotDefinedExpression( assert );
    
    // Test when the custom expression is registered again
    expressionBuilder.register( IncExpression );
    testDefinedExpression( assert );
});
