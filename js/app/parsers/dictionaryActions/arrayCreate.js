/* 
    Class ArrayCreate
*/
var AbstractArrayAction = require( './abstractArrayAction.js' );
var context = require( '../../context.js' );

var ArrayCreate = function( object ) {
    AbstractArrayAction.call( this, object );
    
    this.newElement = object.newElement;
};

ArrayCreate.prototype = Object.create( AbstractArrayAction.prototype );

ArrayCreate.prototype.updateDictionary = function( dictionary ){
    
    this.indexToUse = this.getIndexToUse( dictionary );
    var arrayValue = this.getArrayValue( dictionary );
    
    if ( this.indexToUse === -1 ){
        arrayValue.push( this.newElement );
    } else {
        arrayValue.splice( this.indexToUse, 0, this.newElement );
    }
};

ArrayCreate.prototype.updateHTML = function( indexItem, parserUpdater ){
    
    // Must get the nodeToUpdate
    var node = this.resolveThisNode( indexItem, parserUpdater );
    if ( ! node ){
        throw 'No node found to clone';
    }
    
    ///////////////
    var tags = context.getTags();
    var nodeDataId = node.getAttribute( tags.id );
    var parentNode = node.parentNode;
    
    // Get tmpNode
    var tmpNode = node.cloneNode( true );
    if ( 'form' in tmpNode ) {
        tmpNode.checked = false;
    }
    
    // Set id and related id if needed
    tmpNode.setAttribute( tags.id, context.nextExpressionCounter() );
    tmpNode.setAttribute( tags.relatedId, nodeDataId );
    ////////////
    
    // Remove attributes
    tmpNode.removeAttribute( tags.talRepeat );
    tmpNode.removeAttribute( 'style' );
    tmpNode.setAttribute( tags.qdup, 1 );
    
    // Configure loop attributes
    var itemIndex = this.indexToUse === -1? 
        parentNode.childElementCount - 1:
        this.indexToUse;
    tmpNode.setAttribute( 
        'data-tauto-define',
        'item-index ' + itemIndex + ';'
            + 'item-all ' + indexItem.attributeInstance.getExpressionString() + ';'
            + 'item item-all[item-index];'
            + 'item-repeat context/repeat(item-index,' + parentNode.childElementCount + ',0)'
    );
    
    // Insert it
    var sibling = this.indexToUse === -1?
        null:
        parentNode.children[ 1 + this.indexToUse ];
    parentNode.insertBefore( tmpNode, sibling );
    
    // Update the selected node
    parserUpdater.updateNode( tmpNode );
};

module.exports = ArrayCreate;