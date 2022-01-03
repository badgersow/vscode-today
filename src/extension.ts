import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';

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

function expandHome(path: string): string {
	return path.replace(/^~/, os.homedir);
}

function readJournalPath(): string | undefined {
	let directory: string | undefined = vscode.workspace
		.getConfiguration('vscode-today')
		.get('dailyNotesDirectoryFullPath');
	if (!directory) {
		return undefined;
	}
	return expandHome(directory);
}

// On a given command 'Daily note', this function opens a 'daily markdown file' in the editor
// If the file didn't exist, it first creates a new one
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('vscode-today.today', () => {
		// This is hardcoded now, but needs to be added to settings
		let journalPath = readJournalPath();
		if (!journalPath) {
			vscode.window.showErrorMessage("Please setup 'Daily Notes Directory Full Path' in Settings");
			return;
		}

		// This creates a canonical markdown file full path
		var fullPath = dailyFilePath(new Date(), journalPath);

		// This creates daily file if it doesn't exist, otherwise does nothing
		createFileIfNotExists(fullPath);

		// Opens a file in the editor tab
		var uri: vscode.Uri = vscode.Uri.parse(/*schema*/'file:' + fullPath);
		vscode.workspace.openTextDocument(uri).then((doc: vscode.TextDocument) => {
			// Focuses on the editor tab
			vscode.window.showTextDocument(doc, vscode.ViewColumn.Active, false);
		}, (error: any) => {
			vscode.window.showErrorMessage("Opening a daily file has failed");
			console.error(error);
			debugger;
		});
	});

	context.subscriptions.push(disposable);
}

function createFileIfNotExists(fullPath: any) {
	if (!fs.existsSync(fullPath)) {
		fs.closeSync(fs.openSync(fullPath, 'w+'));
	}
}

export function deactivate() { }

