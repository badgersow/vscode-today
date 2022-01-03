import * as assert from 'assert';
import * as vscode from 'vscode';
import * as ext from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Test date format', () => {
		// 1641167487 = Mon Jan 03 2022 10:51:27 GMT+1100 (AEDT)
		let path = require('path');
		let expected = path.join('foo', '2022-01-03 (Mon).md');

		assert.strictEqual(expected,
			ext.dailyFilePath(new Date(1641167487000), 'foo', 'en-AU'));
	});
});
