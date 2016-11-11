/* 
    context singleton class
*/
module.exports = (function() {
    "use strict";
    
    /* Tags */
    var defaultTags = {
            talCondition:     "data-tcondition",
            talRepeat:        "data-trepeat",
            talAttributes:    "data-tattributes",
            talContent:       "data-tcontent",
            talDefine:        "data-tdefine",
            talOmitTag:       "data-tomit-tag",
            talReplace:       "data-treplace",
            talOnError:       "data-ton-error",
            qdup:             "data-qdup",
            metalDefineMacro: "data-mdefine-macro",
            metalUseMacro:    "data-muse-macro",
            metalDefineSlot:  "data-mdefine-slot",
            metalFillSlot:    "data-mfill-slot",
            metalMacro:       "data-mmacro",
            i18nDomain:       "data-idomain"
    };
    var tags = defaultTags;
    var tal = '';
    //var self = this;
    
    var getTags = function (){
        return tags;
    };
    
    var setTags = function ( tagsToSet ){
        tags = tagsToSet;
        tal = '';
    };
    
    var getTal = function (){
        if ( tal == '' ){
            var c = 0;
            var notInclude = tags.qdup;
            for ( property in tags ) {
                if ( notInclude == tags[ property ] ){
                    continue;
                }
                if ( c++ > 0){
                    tal += ",";
                }
                tal += "*[" + tags[ property ] + "]";
            }
        }
        
        return tal;
    };
    /* End Tags */
    
    /* Formatters */
    var formatters = {};
    formatters.lowerCase = function ( value ){
        return value.toLocaleLowerCase();
    };
    formatters.upperCase = function ( value ){
        return value.toLocaleUpperCase();
    };
    formatters.localeDate = function ( value ){
        return value.toLocaleDateString;
    };
    formatters.localeTime = function ( value ){
        return value.toLocaleTimeString;
    };
    formatters.localeString = function ( value, locale ){
        return locale? 
               value.toLocaleString( value, locale ): 
               value.toLocaleString( value );
    };
    formatters.fix = function ( number, fixTo ){
        return number.toFixed( fixTo );
    };
    
    var getFormatter = function ( id ){
        return formatters[ id ];
    };
    
    var registerFormatter = function ( id, formatter ){
        formatters[ id ] = formatter;
    };
    /* End Formatters */
    
    /* Conf */
    var EXPRESSION_SUFFIX = ":";
    var defaultConf = {
            pathDelimiter:          '|',
            pathSegmentDelimiter:   '/',
            expressionDelimiter:    ' ',
            intervalDelimiter:      ':',
            propertyDelimiter:      '/',
            defineDelimiter:        ';',
            inDefineDelimiter:      ' ',
            attributeDelimiter:     ';',
            inAttributeDelimiter:   ' ',
            domainDelimiter:        ' ',
            i18nOptionsDelimiter:   ';',
            inI18nOptionsDelimiter: ' ',
            argumentsDelimiter:     ',',
        
            htmlStructureExpressionPrefix:  "html",
            globalVariableExpressionPrefix: "global",
        
            templateErrorVarName: "error",
            onErrorVarName: "on-error",
            i18nDomainVarName: "i18nDomain",
            repeatVarName: "repeat",
        
            stringExpression: "string" + EXPRESSION_SUFFIX,
            existsExpression: "exists" + EXPRESSION_SUFFIX,
            noCallExpression: "nocall" + EXPRESSION_SUFFIX,
            notExpression: "not" + EXPRESSION_SUFFIX,
            javaScriptExpression: "js" + EXPRESSION_SUFFIX,
            equalsExpression: "eq" + EXPRESSION_SUFFIX,
            greaterExpression: "gt" + EXPRESSION_SUFFIX,
            lowerExpression: "lt" + EXPRESSION_SUFFIX,
            addExpression: "+" + EXPRESSION_SUFFIX,
            subExpression: "-" + EXPRESSION_SUFFIX,
            mulExpression: "*" + EXPRESSION_SUFFIX,
            divExpression: ":" + EXPRESSION_SUFFIX,
            modExpression: "%" + EXPRESSION_SUFFIX,
            orExpression: "or" + EXPRESSION_SUFFIX,
            andExpression: "and" + EXPRESSION_SUFFIX,
            condExpression: "cond" + EXPRESSION_SUFFIX,
            formatExpression: "format" + EXPRESSION_SUFFIX,
            trExpression: "tr" + EXPRESSION_SUFFIX,
            trNumberExpression: "trNumber" + EXPRESSION_SUFFIX,
            trCurrencyExpression: "trCurrency" + EXPRESSION_SUFFIX,
            trDateTimeExpression: "trDate" + EXPRESSION_SUFFIX,
            jqueryExpression: "$"
    };
    var conf = defaultConf;
    
    var getConf = function (){
        return conf;
    };
    
    var setConf = function ( confToSet ){
        conf = confToSet;
        var expressionEvaluator = require( './expressionEvaluator.js' );
        expressionEvaluator.updateConf( conf );
    };
    /* End conf */
    
    return {
        getTags: getTags,
        setTags: setTags,
        getTal: getTal,
        getFormatter: getFormatter,
        registerFormatter: registerFormatter,
        getConf: getConf,
        setConf: setConf
    };
})();
