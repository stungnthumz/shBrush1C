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

	// Get master highlighter
	//
	var sh = null;
	if (typeof (SyntaxHighlighter) != 'undefined') {
		sh = SyntaxHighlighter;

	} else if (typeof (require) != 'undefined') {
		sh = require('shCore').SyntaxHighlighter;

	};

	// Main brush
	//
	var brush = function() {

		var cyrillicChars = '\u0430-\u044F\u0410-\u042F\u0451\u0401';

		/**
		 * Converts space separated list of keywords into a regexp string.
		 * \b don't work with unicode, using this regexp constructor instead of this.getKeywords
		 *
		 * @param  {String} wordList    Space separated keywords.
		 * @return {String}             Returns regular expression string.
		 */
		var getKeywords = function(wordList) {
			var excludeChars = '[^a-zA-Z' + cyrillicChars + ']';

			var keywords = wordList.replace(/\s+/gmi, '|');

			return '(?:^|' + excludeChars + ')(' + keywords + ')(?=$|' + excludeChars + ')';
		};

		/**
		 * Regexp for operators. Special char are fixed
		 *
		 * @param  {String} operatorList    Space separated operators.
		 * @return {String} Regular         expression string.
		 */
		var getOperators = function(operatorList) {

			var operators = operatorList.replace(/[\\\^\$\*\+\?\.\(\)\{\}\[\]\:\=\!\|\,\-]/gm, '\\$&').replace(/\s+/gmi, '|');

			return '(' + operators + ')';
		};

		/**
		 * Regexp for identifier.
		 *
		 * @return {String} Regular expression string.
		 */
		var getIDs = function() {
			var charset = 'a-zA-Z' + cyrillicChars;

			return '([_' + charset + '][_0-9' + charset + ']*)';
		};

		var keywords = 'Execute'
		             + ' While For Each In To Do Break Continue EndDo'
		             + ' If Then ElsIf Else EndIf'
		             + ' New'
		             + ' Goto'
		             + ' Var Export'
		             + ' Try Except Raise EndTry'
		             + ' Procedure Val Export Return EndProcedure'
		             + ' Function EndFunction'
		             + ' AddHandler RemoveHandler'
		             + ' Null'
		             + ' Undefined True False'
		             + ' And Or Not'
		             + ' \u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C'
		             + ' \u041F\u043E\u043A\u0430 \u0414\u043B\u044F \u041A\u0430\u0436\u0434\u043E\u0433\u043E \u0418\u0437 \u041F\u043E \u0426\u0438\u043A\u043B \u041F\u0440\u0435\u0440\u0432\u0430\u0442\u044C \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u041A\u043E\u043D\u0435\u0446\u0426\u0438\u043A\u043B\u0430'
		             + ' \u0415\u0441\u043B\u0438 \u0422\u043E\u0433\u0434\u0430 \u0418\u043D\u0430\u0447\u0435\u0415\u0441\u043B\u0438 \u0418\u043D\u0430\u0447\u0435 \u041A\u043E\u043D\u0435\u0446\u0415\u0441\u043B\u0438'
		             + ' \u041D\u043E\u0432\u044B\u0439'
		             + ' \u041F\u0435\u0440\u0435\u0439\u0442\u0438'
		             + ' \u041F\u0435\u0440\u0435\u043C \u042D\u043A\u0441\u043F\u043E\u0440\u0442'
		             + ' \u041F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0430 \u0417\u043D\u0430\u0447 \u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0412\u043E\u0437\u0432\u0440\u0430\u0442 \u041A\u043E\u043D\u0435\u0446\u041F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u044B'
		             + ' \u041F\u043E\u043F\u044B\u0442\u043A\u0430 \u0418\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0412\u044B\u0437\u0432\u0430\u0442\u044C\u0418\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u041A\u043E\u043D\u0435\u0446\u041F\u043E\u043F\u044B\u0442\u043A\u0438'
		             + ' \u0424\u0443\u043D\u043A\u0446\u0438\u044F \u041A\u043E\u043D\u0435\u0446\u0424\u0443\u043D\u043A\u0446\u0438\u0438'
		             + ' \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A \u0423\u0434\u0430\u043B\u0438\u0442\u044C\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A'
		             + ' \u041D\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u043E \u0418\u0441\u0442\u0438\u043D\u0430 \u041B\u043E\u0436\u044C'
		             + ' \u0418 \u0418\u043B\u0438 \u041D\u0435'
		;

		var operators = '+ - * / % = ? . , ( ) [ ] ;';

		var lib = sh.regexLib;

		this.regexList = [
			{ regex: /^\s*((?:#|&).*)$/gm,    css: 'preprocessor' },	// Preprocessor and compile options
			{ regex: lib.singleLineCComments, css: 'comments' },    	// Comments

			{ regex: /"([^"]*)"/gm,                      css: 'string' },	// Singleline and multiline string
			{ regex: lib.singleQuotedString,             css: 'color1' },	// Date constants
			{ regex: /((?:[0-9]+?\.[0-9]+)|([0-9]+))/gm, css: 'color2' },	// Number constants

			{ regex: new RegExp(getKeywords(keywords), 'igm'),   css: 'keyword' },	// Keywords
			{ regex: new RegExp(getOperators(operators), 'igm'), css: 'color3' }, 	// Operators
			{ regex: new RegExp(getIDs(), 'igm'),                css: 'variable' }	// Variable
		];

	};

	brush.prototype = new sh.Highlighter();

	// Confluence 5.x Code Macro incorrectly handle mixedcase aliases, using lowcase only.
	// Also alias name must match CSS classname.
	//
	brush.aliases = ['lang1c'];

	sh.brushes[brush.aliases[0]] = brush;

	if (typeof (exports) != 'undefined') {
		exports.Brush = brush;
	};
})();
