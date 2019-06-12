import * as vscode from 'vscode';
import querySelectorParser from './querySelectorParser';
import { Element, FindElement } from './types';
import domParser from './domParser';

export function activate(context: vscode.ExtensionContext) {

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

						
		});

		

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
