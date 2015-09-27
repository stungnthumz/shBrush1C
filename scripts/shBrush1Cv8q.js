/**
 * 1C:Enterprise v8 language module for SyntaxHighliter 3, Atlassian Confluence compatible
 * by Dmitrii Bulgakov (stungnthumz@dwemereth.net)
 *
 * SyntaxHighlighter:
 *     Сopyright (C) 2004-2011 Alex Gorbatchev
 *     http://alexgorbatchev.com/SyntaxHighlighter
 *
 * @license
 *     MIT
 */
;(function() {

	// Master highlighter
	//
	var sh = null;
	if (typeof(SyntaxHighlighter) != 'undefined') {
		sh = SyntaxHighlighter;

	} else if (typeof(require) != 'undefined') {
		sh = require('shCore').SyntaxHighlighter;

	};

	/**
		* Adds brush to highlighter
		*
		* @param {Object} brush      Brush.
		* @param {Array}  aliases    String array of brush names (aliases).
		*/
	var registerBrush = function(brush, aliases) {
		brush.prototype = new sh.Highlighter();

		brush.aliases = aliases;
		for (var key in aliases) {
			sh.brushes[aliases[key]] = brush;
		}

		if (typeof(exports) != 'undefined') {
			exports.Brush = brush;
		};
	}

	// Brush for query lang
	//
	var brush1CQuery = function () {

		// Helpers
		//
		var cyrillicChars = '\u0430-\u044F\u0410-\u042F\u0451\u0401';

		/**
			* Converts space separated list of keywords into a regexp string.
			* \b don't work with unicode, using this regexp constructor instead of this.getKeywords
			*
			* @param  {String} wordList    Space separated keywords.
			* @return {String}             Regular expression string.
			*/
		var getKeywords = function(wordList) {
			var excludeChars = '[^a-zA-Z' + cyrillicChars + ']';
			var keywords     = wordList.replace(/\s+/gmi, '|');

			return '(?:^|' + excludeChars + ')(' + keywords + ')(?=$|' + excludeChars + ')';
		};

		/**
			* Regexp for operators. Special char are fixed
			*
			* @param  {String} operatorList    Space separated operators.
			* @return {String}                 Regular expression string.
			*/
		var getOperators = function(operatorList) {
			var operators = operatorList.replace(/[\\\^\$\*\+\?\.\(\)\{\}\[\]\:\=\!\|\,\-]/gm, '\\$&').replace(/\s+/gmi, '|');

			return '(' + operators + ')';
		};

		/**
			* Regexp for query identifier.
			*
			* @return {String} Regular expression string.
			*/
		var getQueryIDs = function() {
			var charset = 'a-zA-Z' + cyrillicChars;

			return '([_#' + charset + '][_0-9.\*' + charset + ']*)';
		};

		/**
			* Regexp for query params.
			*
			* @return {String} Regular expression string.
			*/
		var getParameterIDs = function() {
			var charset = 'a-zA-Z' + cyrillicChars;

			return '(&amp;[_#' + charset + '][_0-9.\*' + charset + ']*)';
		};

		/**
			* Regexp for query functions.
			*
			* @param  {String} functionsList    Space separated functions.
			* @return {String}                  Regular expression string.
			*/
		var getFunctions = function(functionsList) {
			var excludeChars = '[^a-zA-Z' + cyrillicChars + ']';
			var functions    = functionsList.replace(/\s+/gmi, '|');

			return '(?:^|' + excludeChars + ')(' + functions+ ')(?=s*[(])';
		};

		/**
			* Regexp for query transform ops
			*
			* @param  {String} tramsformList    Space separated ops.
			* @return {String}                  Regular expression string.
			*/
		var getTransform = function(tramsformList) {
			var excludeChars = '[^a-zA-Z' + cyrillicChars + ']';
			var letterChars  = '[a-zA-Z' + cyrillicChars + ']';
			var transforms   = tramsformList.replace(/\s+/gmi, '|');

			return '(?:^|' + excludeChars + ')(' + transforms+ ')(?=s*' + letterChars + ')';
		};

		var keywords = 'ALL ALLOWED AS ASC AUTOORDER'
		             + ' BOOLEAN BY'
		             + ' CHARACTERISTIC CHARACTERISTICS CHARACTERISTICTYPES CHARACTERISTICVALUES'
		             + ' DATE DESC DISTINCT DROP'
		             + ' FOR FROM FULL'
		             + ' GROUP'
		             + ' HAVING HIERARCHY'
		             + ' ID INDEX INNER INTO'
		             + ' JOIN'
		             + ' KEYFIELD'
		             + ' LEFT LIST'
		             + ' NAME NAMEFIELD NUMBER'
		             + ' OBJECT OBJECTFIELD OF ON ONLY ORDER OUTER OVERALL'
		             + ' PERIODS'
		             + ' RIGHT'
		             + ' SELECT STRING'
		             + ' TOP TOTALS TYPE TYPEFIELD'
		             + ' UNION UPDATE'
		             + ' VALUE VALUEFIELD VALUES VALUETYPE VALUETYPEFIELD'
		             + ' WHERE'
		             + ' \u0410\u0412\u0422\u041e\u0423\u041f\u041e\u0420\u042f\u0414\u041e\u0427\u0418\u0412\u0410\u041d\u0418\u0415'
		             + ' \u0411\u0423\u041b\u0415\u0412\u041e'
		             + ' \u0412\u0418\u0414\u042b\u0425\u0410\u0420\u0410\u041a\u0422\u0415\u0420\u0418\u0421\u0422\u0418\u041a \u0412\u041d\u0415\u0428\u041d\u0415\u0415 \u0412\u041d\u0423\u0422\u0420\u0415\u041d\u041d\u0415\u0415 \u0412\u041e\u0417\u0420 \u0412\u0421\u0415 \u0412\u042b\u0411\u0420\u0410\u0422\u042c'
		             + ' \u0413\u0414\u0415'
		             + ' \u0414\u0410\u0422\u0410 \u0414\u041b\u042f \u0417\u041d\u0410\u0427\u0415\u041d\u0418\u0415 \u0417\u041d\u0410\u0427\u0415\u041d\u0418\u042f'
		             + ' \u0418\u0414\u0415\u041d\u0422\u0418\u0424\u0418\u041a\u0410\u0422\u041e\u0420 \u0418\u0417 \u0418\u0417\u041c\u0415\u041d\u0415\u041d\u0418\u042f \u0418\u041c\u0415\u042e\u0429\u0418\u0415 \u0418\u041c\u042f  \u0418\u041d\u0414\u0415\u041a\u0421\u0418\u0420\u041e\u0412\u0410\u0422\u042c \u0418\u0422\u041e\u0413\u0418'
		             + ' \u041a\u0410\u041a'
		             + ' \u041b\u0415\u0412\u041e\u0415'
		             + ' \u041e\u0411\u0429\u0418\u0415 \u041e\u0411\u042a\u0415\u0414\u0418\u041d\u0418\u0422\u042c \u041e\u0411\u042a\u0415\u041a\u0422'
		             + ' \u041f\u0415\u0420\u0412\u042b\u0415 \u041f\u0415\u0420\u0418\u041e\u0414\u0410\u041c\u0418 \u041f\u041e \u041f\u041e\u041b\u0415\u0412\u0418\u0414\u0410 \u041f\u041e\u041b\u0415\u0417\u041d\u0410\u0427\u0415\u041d\u0418\u042f \u041f\u041e\u041b\u0415\u0418\u041c\u0415\u041d\u0418 \u041f\u041e\u041b\u0415\u041a\u041b\u042e\u0427\u0410 \u041f\u041e\u041b\u0415\u041e\u0411\u042a\u0415\u041a\u0422\u0410 \u041f\u041e\u041b\u0415\u0422\u0418\u041f\u0410\u0417\u041d\u0410\u0427\u0415\u041d\u0418\u042f \u041f\u041e\u041b\u041d\u041e\u0415 \u041f\u041e\u041c\u0415\u0421\u0422\u0418\u0422\u042c \u041f\u0420\u0410\u0412\u041e\u0415'
		             + ' \u0420\u0410\u0417\u041b\u0418\u0427\u041d\u042b\u0415 \u0420\u0410\u0417\u0420\u0415\u0428\u0415\u041d\u041d\u042b\u0415'
		             + ' \u0421\u0413\u0420\u0423\u041f\u041f\u0418\u0420\u041e\u0412\u0410\u0422\u042c \u0421\u041e\u0415\u0414\u0418\u041d\u0415\u041d\u0418\u0415 \u0421\u041f\u0418\u0421\u041e\u041a \u0421\u0422\u0420\u041e\u041a\u0410'
		             + ' \u0422\u0418\u041f \u0422\u0418\u041f\u0417\u041d\u0410\u0427\u0415\u041d\u0418\u042f \u0422\u0418\u041f\u0417\u041d\u0410\u0427\u0415\u041d\u0418\u042f \u0422\u041e\u041b\u042c\u041a\u041e'
		             + ' \u0423\u0411\u042b\u0412 \u0423\u041d\u0418\u0427\u0422\u041e\u0416\u0418\u0422\u042c \u0423\u041f\u041e\u0420\u042f\u0414\u041e\u0427\u0418\u0422\u042c'
		             + ' \u0425\u0410\u0420\u0410\u041a\u0422\u0415\u0420\u0418\u0421\u0422\u0418\u041a\u0410 \u0425\u0410\u0420\u0410\u041a\u0422\u0415\u0420\u0418\u0421\u0422\u0418\u041a\u0418'
		             + ' \u0427\u0418\u0421\u041b\u041e';

		var functions = 'AVG'
		             + ' BEGINOFPERIOD'
		             + ' COUNT'
		             + ' DATEADD DATEDIFF DATETIME DAYOFYEAR'
		             + ' ENDOFPERIOD'
		             + ' ISNULL'
		             + ' MAX MIN'
		             + ' PRESENTATION'
		             + ' REFPRESENTATION'
		             + ' SUBSTRING SUM'
		             + ' WEEKDAY'
		             + ' \u0414\u0410\u0422\u0410\u0412\u0420\u0415\u041c\u042f \u0414\u0415\u041d\u042c\u0413\u041e\u0414\u0410 \u0414\u0415\u041d\u042c\u041d\u0415\u0414\u0415\u041b\u0418 \u0414\u041e\u0411\u0410\u0412\u0418\u0422\u042c\u041a\u0414\u0410\u0422\u0415'
		             + ' \u0415\u0421\u0422\u042cNULL'
		             + ' \u041a\u041e\u041b\u0418\u0427\u0415\u0421\u0422\u0412\u041e \u041a\u041e\u041d\u0415\u0426\u041f\u0415\u0420\u0418\u041e\u0414\u0410'
		             + ' \u041c\u0410\u041a\u0421\u0418\u041c\u0423\u041c \u041c\u0418\u041d\u0418\u041c\u0423\u041c'
		             + ' \u041d\u0410\u0427\u0410\u041b\u041e\u041f\u0415\u0420\u0418\u041e\u0414\u0410'
		             + ' \u041f\u041e\u0414\u0421\u0422\u0420\u041e\u041a\u0410 \u041f\u0420\u0415\u0414\u0421\u0422\u0410\u0412\u041b\u0415\u041d\u0418\u0415 \u041f\u0420\u0415\u0414\u0421\u0422\u0410\u0412\u041b\u0415\u041d\u0418\u0415\u0421\u0421\u042b\u041b\u041a\u0418'
		             + ' \u0420\u0410\u0417\u041d\u041e\u0421\u0422\u042c\u0414\u0410\u0422'
		             + ' \u0421\u0420\u0415\u0414\u041d\u0415\u0415 \u0421\u0423\u041c\u041c\u0410';

		var tokens = 'AND'
		             + ' BETWEEN'
		             + ' CASE CAST'
		             + ' DAY'
		             + ' ELSE END EMPTYTABLE\. ESCAPE'
		             + ' FALSE'
		             + ' HALFYEAR HOUR'
		             + ' IN IS'
		             + ' LIKE'
		             + ' MINUTE MONTH'
		             + ' NOT NULL'
		             + ' OR'
		             + ' QUARTER'
		             + ' SECOND'
		             + ' TENDAYS THEN TRUE'
		             + ' UNDEFINED'
		             + ' WEEK WHEN'
		             + ' YEAR'
		             + ' \u0412 \u0412\u042b\u0411\u041e\u0420 \u0412\u042b\u0420\u0410\u0417\u0418\u0422\u042c'
		             + ' \u0413\u041e\u0414'
		             + ' \u0414\u0415\u041a\u0410\u0414\u0410 \u0414\u0415\u041d\u042c'
		             + ' \u0415\u0421\u0422\u042c'
		             + ' \u0418 \u0418\u0415\u0420\u0410\u0420\u0425\u0418\u0418 \u0418\u041b\u0418 \u0418\u041d\u0410\u0427\u0415 \u0418\u0421\u0422\u0418\u041d\u0410'
		             + ' \u041a\u0412\u0410\u0420\u0422\u0410\u041b \u041a\u041e\u0413\u0414\u0410 \u041a\u041e\u041d\u0415\u0426 '
		             + ' \u041b\u041e\u0416\u042c'
		             + ' \u041c\u0415\u0416\u0414\u0423 \u041c\u0415\u0421\u042f\u0426 \u041c\u0418\u041d\u0423\u0422\u0410'
		             + ' \u041d\u0415 \u041d\u0415\u0414\u0415\u041b\u042f \u041d\u0415\u041e\u041f\u0420\u0415\u0414\u0415\u041b\u0415\u041d\u041e'
		             + ' \u041f\u041e\u0414\u041e\u0411\u041d\u041e \u041f\u041e\u041b\u0423\u0413\u041e\u0414\u0418\u0415 \u041f\u0423\u0421\u0422\u0410\u042f\u0422\u0410\u0411\u041b\u0418\u0426\u0410\.'
		             + ' \u0421\u0415\u041a\u0423\u041d\u0414\u0410 \u0421\u041f\u0415\u0426\u0421\u0418\u041c\u0412\u041e\u041b'
		             + ' \u0422\u041e\u0413\u0414\u0410'
		             + ' \u0427\u0410\u0421';
		
		var transform = 'REFS'
		              + ' \u0421\u0421\u042b\u041b\u041a\u0410';

		var operators = '+ - * / ( ) = &lt; &gt;';

		this.regexList = [
			{ regex: sh.regexLib.singleLineCComments,    css: 'comments' },         	// Comments
			{ regex: /"([^"]*)"/gm,                      css: 'string' },           	// String
			{ regex: /((?:[0-9]+?\.[0-9]+)|([0-9]+))/gm, css: 'color2' },           	// Number constants

			{ regex: new RegExp(getParameterIDs(), 'igm'),       css: 'value' },    	// Parameters
			{ regex: new RegExp(getFunctions(functions), 'igm'), css: 'functions' },	// Functions

			{ regex: new RegExp(getTransform(transform), 'igm'), css: 'functions' },	// Transform operators
			{ regex: new RegExp(getKeywords(keywords), 'igm'),   css: 'keyword' },  	// Keywords
			{ regex: new RegExp(getKeywords(tokens), 'igm'),     css: 'constants' },	// Tokens

			{ regex: new RegExp(getQueryIDs(), 'igm'),           css: 'variable' }, 	// Names and synonyms
			{ regex: new RegExp(getOperators(operators), 'igm'), css: 'color3'   }  	// Operators
		];
	};

	// Confluence 5.x Code Macro incorrectly handle mixedcase aliases, using lowcase only.
	// Also alias name must match CSS classname.
	//
	registerBrush(brush1CQuery, ['lang1cq']);

})();
