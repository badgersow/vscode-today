import * as vscode from 'vscode';

export function dailyFilePath(instant: Date, directory: string, locale?: string) {
	let year = instant.toLocaleDateString(locale, { year: 'numeric' });
	let month = instant.toLocaleDateString(locale, { month: '2-digit' });
	let day = instant.toLocaleDateString(locale, { day: '2-digit' });
	let weekday = instant.toLocaleDateString(locale, { weekday: 'short' });
	var filename = `${year}-${month}-${day} (${weekday}).md`;
	var path = require('path');
	var fullPath = path.join(directory, filename);
	return fullPath;
}

// On a given command 'Daily note', this function opens a 'daily markdown file' in the editor
// If the file didn't exist, it first creates a new one
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vscode-today" is now active!');

	let disposable = vscode.commands.registerCommand('vscode-today.today', () => {
		// This is hardcoded now, but needs to be added to settings
		let journalPath = '/Users/efim/workspace/journal';
		let now = new Date();
		// This creates a canonical markdown file full path
		var fullPath = dailyFilePath(now, journalPath);

		var uri: vscode.Uri = vscode.Uri.parse(/*schema*/'file:' + fullPath);
		let edit = new vscode.WorkspaceEdit();
		// This creates daily file if it doesn't exist
		edit.createFile(uri, {
			// If a daily file exists already, we shouldn't open it
			ignoreIfExists: true
		});
		// Application of the edit
		vscode.workspace.applyEdit(edit).then(() => {
			// Opens a file in the editor tab
			vscode.workspace.openTextDocument(uri).then((doc: vscode.TextDocument) => {
				// Focuses on the editor tab
				vscode.window.showTextDocument(doc, vscode.ViewColumn.Active, false);
			}, (error: any) => {
				console.error('Opening a daily file didn\'t work');
				console.error(error);
				debugger;
			});
		}, (error: any) => {
			console.error('Creating a daily file didn\'t work');
			console.error(error);
			debugger;
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
