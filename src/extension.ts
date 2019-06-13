import * as vscode from 'vscode';
import querySelectorParser from './querySelectorParser';
import { Element, FindElement, FoundSelection, FOUND_SELECTION_TAG } from './types';
import domParser from './domParser';
import finder from './finder';

let selections:FoundSelection[] = [];
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {

	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	context.subscriptions.push(statusBarItem);

	let disposable = vscode.commands.registerCommand('domqs.find', () => {

		const activeTextEditor = vscode.window.activeTextEditor;

		// If file is not opened
		if(typeof activeTextEditor ==='undefined'){
			vscode.window.showErrorMessage("Please open a file to find by query selector.");
			return;
		}

		// Getting language id and checking the weather language is supporting by DOMQS
		const langId = activeTextEditor.document.languageId;

		let availableLangs:string[]|undefined = vscode.workspace.getConfiguration("domqs").get("availableLanguages");

		if(typeof availableLangs==='undefined'){
			availableLangs = ["html","xml"];
		}

		// If current lanaguage is not supporting
		if(!availableLangs.includes(langId)){
			vscode.window.showErrorMessage("Language is not supporting by DOMQS.");
			return;
		}

		// Getting query selector from the user
		vscode.window.showInputBox({
			placeHolder:"Enter the query selector",
			ignoreFocusOut:true
		}).then(value=>{
			if(typeof value ==='undefined'){
				return;
			}
			
			// Parsing query selector and document
			const findingElements: FindElement[] = querySelectorParser(value);

			if(!findingElements.length){
				vscode.window.showErrorMessage("Please enter a valid query selector to search.");
				return;
			}

			const document = activeTextEditor.document.getText();

			const parsed:Element[] = domParser(document);

			if(!parsed.length){
				vscode.window.showErrorMessage("Can not find any DOM element in the opened text editor.");
				return;
			}

			const found = finder(parsed,findingElements);

			if(found){
				selections = found.filter(el=>el.type===FOUND_SELECTION_TAG);
			}

			// Updating status bar with number of elements
			updateStatusBarItem(selections.length);

		});

		

	});

	context.subscriptions.push(disposable);
}

function updateStatusBarItem(foundCount:number): void {

	if (foundCount > 0) {
		statusBarItem.text = `$(megaphone) ${foundCount} element(s) found`;
		
		statusBarItem.show();
	} else {
		statusBarItem.hide();
	}
}

function makeRange(document:string,selection:FoundSelection){
	const beginPart = document.slice(0,selection.startingAt);
	let startLine = beginPart.split("\n").length;

	
}

// this method is called when your extension is deactivated
export function deactivate() {}
