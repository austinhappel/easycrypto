/*global $: true, sjcl: true */
/*jslint devel: true, browser: true, sloppy: true, nomen: true, maxerr: 50, indent: 4 */

(function ($) {
	"use strict";
	var baseUrl = "index.html";
	function parseUrl(url, action) {
		var urlArray = url.split('/'),
			start    = urlArray.indexOf(action),
			string   = JSON.stringify({
				iv: urlArray[start + 1],
				salt: urlArray[start + 2],
				ct: urlArray[start + 3]
			});

		if (action === 'decrypt') {
			$('#encrypt-section').hide();
			$('#decrypt-text').val(string);
		}
	}

	function makeLink(encryptedText) {
		var obj = JSON.parse(encryptedText);
		return 'http://' + baseUrl + "#/decrypt/" + obj.iv + '/' + obj.salt + '/' + obj.ct;
	}

	$.domReady(function () {
		$('#decrypt-button').click(function (e) {
			var pw = $('#decrypt-password').val(),
				text = $('#decrypt-text').val();
			$('#result')
				.empty()
				.text(sjcl.decrypt(pw, text));
		});
		$('#encrypt-button').click(function (e) {
			var pw = $('#encrypt-password').val(),
				text = $('#encrypt-text').val(),
				encryptedText = sjcl.encrypt(pw, text),
				pText = "<h3>Encrypted text:</h3><pre>" + encryptedText + "</pre>",
				pLink = "<h3>Link to share:</h3><pre>" + makeLink(encryptedText) + "</pre>";

			$('#result')
				.empty()
				.html(pText + pLink);

		});

		var url = window.location.href;

		if (url.indexOf('decrypt') > -1) {
			parseUrl(url, 'decrypt');
		}
	});
}($));