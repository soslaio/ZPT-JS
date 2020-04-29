/* 
    Class AbstractArrayAction
*/
var utils = require( '../../utils.js' );

var AbstractArrayAction = function( object ) {
    
    this.id = object.id;
    this.var = object.var;
    this.index = object.index;
    this.currentElement = object.currentElement;
};

AbstractArrayAction.prototype.getArrayValue = function( dictionary ){
    return this.var === undefined?
        dictionary[ this.id ]:
        this.var;
};

AbstractArrayAction.prototype.getIndexToUse = function( dictionary ){

    if ( this.index === undefined && this.currentElement === undefined ){
        throw 'index or currentElement must be defined in ' + this.id + ' array action!';
    }
    
    if ( this.index !== undefined ){
        if ( this.index == '_first_' ){
            return 0;
        } else if ( this.index == '_last_' ){
            return -1; // This means it is the last
        } else {
            return this.index;
        }
    }
    
    // Must use newElement
    var arrayValue = this.getArrayValue( dictionary );
    
    for ( var i = 0; i < arrayValue.length; ++i ){
        var element = arrayValue[ i ];
        //if ( element == this.currentElement ){
        if ( utils.deepEqual( element, this.currentElement ) ){
            return i;
        }
    }
    
    throw 'currentElement ' + this.currentElement + ' not found in ' + this.id + ' array action!';
};

AbstractArrayAction.prototype.attributeInstanceIsRelated = function( attributeInstance ){
    return attributeInstance.type === 'tal:repeat';
};

AbstractArrayAction.prototype.updateDictionary = function(){
    throw 'Error: updateDictionary must be implemented!';
};

AbstractArrayAction.prototype.updateHTML = function(){
    throw 'Error: updateHTML must be implemented!';
};

AbstractArrayAction.prototype.resolveChildNode = function( indexItem, parserUpdater ){
    
    //var attributeInstance = indexItem.attributeInstance;
    var node = parserUpdater.findNodeById( indexItem.nodeId );
    if ( ! node ){
        // Removed node!
        parserUpdater.addRemovedToStatistics();
        return false;
    }
    parserUpdater.addUpdatedToStatistics();
    
    // Return the node
    return this.indexToUse === -1?
        null:
        node.parentNode.children[ 1 + this.indexToUse ]; // The first is always the tal:repeat
};

AbstractArrayAction.prototype.resolveThisNode = function( indexItem, parserUpdater ){
    
    //var attributeInstance = indexItem.attributeInstance;
    var node = parserUpdater.findNodeById( indexItem.nodeId );
    if ( ! node ){
        // Removed node!
        parserUpdater.addRemovedToStatistics();
        return false;
    }
    parserUpdater.addUpdatedToStatistics();
    
    // Return the node
    return node;
};

module.exports = AbstractArrayAction;
