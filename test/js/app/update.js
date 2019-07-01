"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );
var utils = require( './utils.js' );
var context = zpt.context;

var errorsArray;
var errorFunction = function( _errorsArray ) {
    
    errorsArray = _errorsArray;
    /*alert( 
        errorsArray.join( '\n' ) 
    );*/
};
//zpt.context.setErrorFunction( errorFunction );

// Run tests!
QUnit.test( "simple TALContent test", function( assert ) {

    var dictionary = {
        number1: 1,
        text1: 'test 1'
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't1' ),
        dictionary: dictionary,
        indexExpressions: true
    });

    var testFunction = function(){
        assert.equal( $('#t1-1').text() , "" + arguments[ 0 ] );
        assert.equal( $('#t1-2').text() , "" + arguments[ 1 ] );        
        assert.equal( errorsArray, undefined );
    };

    testFunction( 1, 'test 1' );

    var dictionaryChanges = {
        number1: 2
    };
    dictionary.text1 = 'test 2';

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 2, 'test 1' );
});

QUnit.test( "simple TALAttributes test", function( assert ) {

    var dictionary = {
        number1: 100,
        text1: 'test 1'
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't2' ),
        dictionary: dictionary,
        indexExpressions: true
    });

    var testFunction = function(){
        assert.equal( $('#t2-1').attr('maxlength') , "" + arguments[ 0 ] );
        assert.equal( $('#t2-1').attr('placeholder') , "" + arguments[ 1 ] );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 100, 'test 1' );

    var dictionaryChanges = {
        text1: 'test 2'
    };
    dictionary.number1 = 200;

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 100, 'test 2' );
});

QUnit.test( "simple TALDefine test", function( assert ) {

    var dictionary = {
        number1: 1,
        text1: 'test'
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't3' ),
        dictionary: dictionary,
        indexExpressions: true
    });

    var testFunction = function(){
        assert.equal( $('#t3-1').text() , "" + arguments[ 0 ] );
        assert.equal( $('#t3-2').text() , "" + arguments[ 1 ] );
        assert.equal( $('#t3-3').text() , "" + arguments[ 2 ] );
        assert.equal( $('#t3-4').text() , "" + arguments[ 3 ] );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 1, 'test', 'test1', 'test100' );

    var dictionaryChanges = {
        number1: 2
    };

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 2, 'test', 'test2', 'test100' );
});

QUnit.test( "simple TALRepeat test", function( assert ) {

    var dictionary = {
        items: [ 1, 4, 9 ]
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't4' ),
        dictionary: dictionary,
        indexExpressions: true
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.item' ) , arguments[ 0 ]  );   
        assert.equal( errorsArray, undefined );
    };

    testFunction( '1/4/9' );

    var dictionaryChanges = {
        items: [ 2, 6, 8 ]
    };

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( '2/6/8' );
});

QUnit.test( "simple METALUseMacro test", function( assert ) {
    
    var done = assert.async();
    
    context.setExpressionCounter( 100 );
    
    var dictionary = {
        externalMacro: 'copyright@externalMacros-definitions.html'
    };

    errorsArray = undefined;

    zpt.run({
        command: 'preload',
        root: document.getElementById( 't5' ),
        dictionary: dictionary,
        declaredRemotePageUrls: [ 'externalMacros-definitions.html' ],
        callback: function(){
            
            zpt.run({
                indexExpressions: true
            });
            
            var t5 = 
`<div data-use-macro=\"externalMacro\" data-id=\"101\" style=\"display: none;\">
                Macro goes here
            </div><p data-mmacro=\"copyright\" data-tauto-define=\"_externalMacroUrl 'externalMacros-definitions.html'\" data-related-id=\"101\" data-qdup=\"1\">
            Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
        </p>`;
            assert.equal( $('#t5').html().trim(), t5 );

            var dictionaryChanges = {
                externalMacro: 'enhancedCopyright@externalMacros-definitions.html'
            };

            debugger;
            
            zpt.run({
                command: 'update',
                dictionaryChanges: dictionaryChanges
            });
            
            t5 = 
`<div data-use-macro=\"externalMacro\" data-id=\"101\" style=\"display: none;\">
                Macro goes here
            </div><div data-mmacro=\"enhancedCopyright\" data-tauto-define=\"_externalMacroUrl 'externalMacros-definitions.html'\" data-related-id=\"101\" data-qdup=\"1\">
            <p>
                This macro calls another macro.
            </p>
            <p data-use-macro=\"'copyright'\" data-id=\"102\" style=\"display: none;\">
                Macro goes here
            </p><p data-mmacro=\"copyright\" data-related-id=\"102\" data-qdup=\"1\">
            Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
        </p>
        </div>`;
            assert.equal( $('#t5').html().trim(), t5 );
            
            done();
        }
    });
});

QUnit.test( "simple TALCondition test", function( assert ) {

    // First invokation
    var dictionary = {
        number1: 1,
        text1: 'test 1',
        boolean1: false,
        boolean2: false
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't6' ),
        dictionary: dictionary,
        indexExpressions: true
    });
    
    var testFunction = function(){
        assert.equal( $('#t6-1').text() , "" + arguments[ 0 ] );
        assert.ok( arguments[ 1 ] == $('#t6-1').is(':visible') );
        assert.equal( $('#t6-2').text() , "" + arguments[ 2 ] );  
        assert.ok( arguments[ 3 ] == $('#t6-2').is(':visible') );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'an integer', false, 'a text', false );
    
    // Second invokation
    var dictionaryChanges = {
        boolean2: true
    };

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });
    
    testFunction( 1, true, 'test 1', true );
    
    // Second invokation
    var dictionaryChanges = {
        boolean2: false
    };

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 1, false, 'test 1', false );
    
    // Fourth invokation
    var dictionaryChanges = {
        number1: 2,
        text1: 'test 2',
        boolean2: true
    };

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 2, true, 'test 2', true );
});

QUnit.test( "simple I18NLanguage and I18nDomain test", function( assert ) {

    var I18n = zpt.I18n;
    var I18nBundle = zpt.I18nBundle;

    /* I18n maps init */
    var msg = {
        en : {},
        es : {}
    };

    /* English i18n messages */
    msg.en[ '/CONF/' ] = {
        language: 'en',
        locale: 'en-US'
    };
    msg.en[ 'Hello world!' ] = 'Hello world!';
    msg.en[ 'Results msg' ] = '{GENDER, select, male{He} female{She} other{They} }' +
        ' found ' +
        '{RES, plural, =0{no results} one{1 result} other{# results} }';

    /* Spanish i18n messages */
    msg.es[ '/CONF/' ] = {
        language: 'es',
        locale: 'es-ES'
    };
    msg.es[ 'Hello world!' ] = '¡Hola mundo!';
    msg.es[ 'Results msg' ] = '{ GENDER, select, male{Él} female{Ella} other{Ellos} }' +
        ' ' +
        '{ RES, plural, =0{no } other{} }' +
        '{ GENDER, select, male{ha} female{ha} other{han} }' +
        ' encontrado ' +
        '{ RES, plural, =0{ningún resultado} one{un único resultado} other{# resultados} }';

    // Create I18n and I18nBundle instances
    var i18nES = new I18n( 'es', msg[ 'es' ] );
    var i18nEN = new I18n( 'en', msg[ 'en' ] );
    var i18nBundle = new I18nBundle( i18nES, i18nEN );

    // Init dictionary
    var dictionary = {
        i18nES:  i18nES,
        i18nEN:  i18nEN,
        i18nBundle: i18nBundle,
        language: 'es'
    };
    
    errorsArray = undefined;

    // First ZPT invokation
    zpt.run({
        root: document.getElementById( 't7' ),
        dictionary: dictionary,
        indexExpressions: true
    });

    var testFunction = function(){
        assert.equal( $('#t7-1').text() , "" + arguments[ 0 ] );
        assert.equal( $('#t7-2').text() , "" + arguments[ 1 ] );
        assert.equal( $('#t7-3').text() , "" + arguments[ 2 ] );
        assert.ok( arguments[ 3 ].indexOf( $('#t7-4').html() ) != -1 );
        assert.equal( $('#t7-5').text() , "" + arguments[ 4 ] );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 
        '¡Hola mundo!', 
        'Ella ha encontrado 10 resultados', 
        '1.355,23', 
        [ "1.355,23&nbsp;€", "1.355,23" ],
        'viernes, 21 de diciembre de 2012' 
    );
    
    // Second ZPT invokation: language changes
    var dictionaryChanges = {
        language: 'en'
    };
    
    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });
    
    testFunction( 
        'Hello world!', 
        'She found 10 results', 
        '1,355.23', 
        [ "€1,355.23", "1,355.23" ],
        'Friday, December 21, 2012' 
    );
    
    // Third ZPT invokation: domain changes
    msg.en[ 'Hello world!' ] = 'Hello world v2!';
    msg.en[ 'Results msg' ] = '{GENDER, select, male{He} female{She} other{They} }' +
        ' found ' +
        '{RES, plural, =0{no results} one{1 result} other{# results} } v2';
    i18nEN = new I18n( 'en', msg[ 'en' ] );
    i18nBundle = new I18nBundle( i18nES, i18nEN );
    
    var dictionaryChanges = {
        i18nBundle: i18nBundle
    };
    
    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 
        'Hello world v2!', 
        'She found 10 results v2', 
        '1,355.23', 
        [ "€1,355.23", "1,355.23" ],
        'Friday, December 21, 2012' 
    );
});
