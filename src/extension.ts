import * as vscode from 'vscode';
import querySelectorParser from './querySelectorParser';
import { Element, FindElement, FoundSelection, FOUND_SELECTION_TAG } from './types';
import domParser from './domParser';
import finder from './finder';

let selections:FoundSelection[] = [];
let currentSelections =[0];
let foundSelections = false;

let statusBarItem: vscode.StatusBarItem;

let selectionDecoration:vscode.TextEditorDecorationType;
let currentSelectionDecoration:vscode.TextEditorDecorationType;
setDecorations();

export function activate(context: vscode.ExtensionContext) {

	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	context.subscriptions.push(statusBarItem);

	let findCommand = vscode.commands.registerCommand('domqs.find', () => {

		const activeTextEditor = vscode.window.activeTextEditor;

		const validated = validateDocument(activeTextEditor);

		if(!validated||!activeTextEditor){
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

			selections = [];

			if(found){

				selections = found.filter(el=>el.type===FOUND_SELECTION_TAG);
				currentSelections = [0];

				decorateSelections(activeTextEditor);
			}

			// Updating status bar with number of elements
			updateStatusBarItem(selections.length);

		});

	});
	context.subscriptions.push(findCommand);

	let selectAllCommand = vscode.commands.registerCommand('domqs.selectAll',()=>{
		const activeTextEditor = vscode.window.activeTextEditor;

		const validated = validateDocument(activeTextEditor);

		if(!validated||!activeTextEditor){
			return;
		}

		if(!foundSelections){
			vscode.window.showErrorMessage("You haven't found for any element. You can not run next selection/ previous selection or select all commands before finding elements.");
			return;
		}

		let i = 0;

		for(const selection in selections){
			currentSelections.push(i);
		}

		decorateSelections(activeTextEditor);
	});
	context.subscriptions.push(selectAllCommand);

	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(hideSelections));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(hideSelections));

}

function validateDocument(activeTextEditor:vscode.TextEditor|undefined):boolean{
	// If file is not opened
	if(typeof activeTextEditor ==='undefined'){
		vscode.window.showErrorMessage("Please open a file to find by query selector.");
		return false;
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
		return false;
	}

	return true;
}

function decorateSelections(activeTextEditor:vscode.TextEditor){
	let decorations:vscode.DecorationOptions[] = [];
	let selectedTags:vscode.Selection[] = [];

	let i=0;

	for (const selection of selections){
		const range = makeRange(activeTextEditor.document.getText(),selection);
		if(currentSelections.includes(i)){
			selectedTags.push(new vscode.Selection(range.end,range.start));
		} else {
			decorations.push({range});
		}
		i++;
	}

	foundSelections = true;

	activeTextEditor.selections = selectedTags;
	activeTextEditor.setDecorations(selectionDecoration,decorations);

}

function setDecorations(){

	selectionDecoration = vscode.window.createTextEditorDecorationType({
		backgroundColor: new vscode.ThemeColor('editor.selectionBackground')
	});
	
	currentSelectionDecoration = vscode.window.createTextEditorDecorationType({
		backgroundColor: new vscode.ThemeColor('editor.selectionHighlightBackground')
	});
}

function hideSelections():void{
	updateStatusBarItem(0);

	selectionDecoration.dispose();
	currentSelectionDecoration.dispose();

	selections = [];
	currentSelections = [0];
	foundSelections = false;

	setDecorations();
}

function updateStatusBarItem(foundCount:number): void {

	if (foundCount > 0) {
		statusBarItem.text = `$(megaphone) ${foundCount} element(s) found`;
		
		statusBarItem.show();
	} else {
		statusBarItem.hide();
	}
}

function makePosition(document:string,position:number):vscode.Position{
	const lines = document.slice(0,position).split(/\r?\n|\r/g);
	const lineIndex = lines.length-1;
	const line = lines.pop();
	let cursor = typeof line ==='undefined'?0:line.length;

	return new vscode.Position(lineIndex,cursor);
}

function makeRange(document:string,selection:FoundSelection):vscode.Range{

	return new vscode.Range(makePosition(document,selection.startingAt),makePosition(document,selection.endingAt));
}

// this method is called when your extension is deactivated
export function deactivate() {}
