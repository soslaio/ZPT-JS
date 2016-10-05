$(function () {
    "use strict";

    /* Simple tests */
    var counter = 4;
    var root = $( '#simple' )[0];
    var dictionary = { 
        counter: counter
    };

    QUnit.test( "Rerun simple tests", function( assert ) {
        zpt.run( 
            root, 
            dictionary, 
            function(){
                continueTesting( root, counter );
            }
        );
    
        function continueTesting( root, counter ){
            runTests( counter );
            if ( counter > 1 ){
                var dictionary = { 
                    counter: --counter
                };
                zpt.run( 
                    root, 
                    dictionary, 
                    function(){
                        continueTesting( root, counter ) 
                    }
                );
            }
        }

        function runTests( counter ){
            assert.equal( $('#t1-1').attr('title') , "counter=" + counter );

            if ( counter % 2 == 0 ){
                assert.ok( $('#t1-2').is(':visible') );
            } else {
                assert.notOk( $('#t1-2').is(':visible') );
            }

            assert.equal( $('#t1-3').html() , "counter=" + counter );
            assert.equal( $('#t1-4').html() , "counter=" + counter );
        };
    });
});

