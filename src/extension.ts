import * as vscode from 'vscode';
import { FoundSelection, CommandCollection, ModCheerio, ModCheerioElement } from './types';

let selections:FoundSelection[] = [];
let currentSelections =[0];
let foundSelections = false;

let statusBarItem: vscode.StatusBarItem;

let selectionDecoration:vscode.TextEditorDecorationType;
let currentSelectionDecoration:vscode.TextEditorDecorationType;
setDecorations();

const cheerio = require('cheerio');

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

			if(!value.length){
				vscode.window.showErrorMessage("Please enter a valid query selector to search.");
				return;
			}

			const document = activeTextEditor.document.getText();

			const $ = cheerio.load(document,{ withStartIndices: true,withEndIndices: true, xmlMode:true });

			selections = [];

			try {
				
				let matched:ModCheerio = $(value);


				matched.each(function(this: ModCheerio ,i,elem){
					selections.push({
						start:elem.startIndex,
						end:elem.endIndex+1
					});
				});
	
				if(selections.length){
	
					currentSelections = [0];
	
					decorateSelections(activeTextEditor);
				}
	
				// Updating status bar with number of elements
				updateStatusBarItem(selections.length);

			} catch (error) {
				vscode.window.showErrorMessage("Please enter a valid query selector to search.");
				return;
			}

		});

	});
	context.subscriptions.push(findCommand);

	let selectionCommands:CommandCollection = {
		selectAll:()=>{

			currentSelections = [];

			for(let i=0;i<selections.length;i++){
				currentSelections.push(i);
			}
		},
		nextSelection:()=>{
			let selectionsLength = selections.length;
			let lastSelection = currentSelections.pop();

			if(typeof lastSelection!=='undefined'){
				currentSelections = [lastSelection+1>=selectionsLength?0:lastSelection+1];
			}
		},
		previousSelection:()=>{
			let selectionsLength = selections.length;
			let firstSelection = currentSelections.shift();

			if(typeof firstSelection!=='undefined'){
				currentSelections = [firstSelection===0?selectionsLength-1:firstSelection-1];
			}
		}
	};

	for (const commandName of Object.keys(selectionCommands)){
		const command = vscode.commands.registerCommand('domqs.'+commandName,()=>{
			const activeTextEditor = vscode.window.activeTextEditor;

			const validated = validateDocument(activeTextEditor);

			if(!validated||!activeTextEditor){
				return;
			}

			if(!foundSelections){
				vscode.window.showErrorMessage("You haven't found for any element. You can not run next selection/ previous selection or select all commands before finding elements.");
				return;
			}

			selectionCommands[commandName]();

			decorateSelections(activeTextEditor);
		});

		context.subscriptions.push(command);

	}

	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(changeTextEditor));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(hideSelections));

}
/**
 * Validating the document in the current open editor and return the status
 * 
 * @param activeTextEditor 
 */
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
/**
 * Decorating the other selections and current selections
 * 
 * @param activeTextEditor 
 */
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

	activeTextEditor.selections = selectedTags;

	activeTextEditor.setDecorations(selectionDecoration,decorations);
	foundSelections = true;

}
/**
 * Setting up the decorations after destroyed by the dispose method and on initial
 */
function setDecorations(){

	selectionDecoration = vscode.window.createTextEditorDecorationType({
		backgroundColor: new vscode.ThemeColor('editor.findRangeHighlightBackground')
	});
	
	currentSelectionDecoration = vscode.window.createTextEditorDecorationType({
		backgroundColor: new vscode.ThemeColor('editor.findMatchBackground')
	});

}
/**
 * Alias to the hideSelections method.
 */
function changeTextEditor(){
	hideSelections();
}
/**
 * Hiding the all selections and highlighted texts
 * 
 * @param e
 */
function hideSelections(e:vscode.TextEditorSelectionChangeEvent|undefined=undefined):void{

	if(typeof e !== 'undefined'){
		if(typeof e.kind!=='undefined'){
			if(e.kind===3){
				return;
			}
		} else {
			return;
		}
	} else {
		return;
	}

	updateStatusBarItem(0);

	selectionDecoration.dispose();
	currentSelectionDecoration.dispose();

	selections = [];
	currentSelections = [0];
	foundSelections = false;

	setDecorations();
}
/**
 * Updating the status bar to dispalying the count of matching elements
 * 
 * @param foundCount
 */
function updateStatusBarItem(foundCount:number): void {

	if (foundCount > 0) {
		statusBarItem.text = `$(megaphone) ${foundCount} element(s) found`;
		
		statusBarItem.show();
	} else {
		statusBarItem.hide();
	}
}
/**
 * Making a VSCode position
 * 
 * @param document document text as tring
 * @param position text offset from the begining
 */
function makePosition(document:string,position:number):vscode.Position{
	const lines = document.slice(0,position).split(/\r?\n|\r/g);
	const lineIndex = lines.length-1;
	const line = lines.pop();
	let cursor = typeof line ==='undefined'?0:line.length;

	return new vscode.Position(lineIndex,cursor);
}
/**
 * Making a VSCode range
 * 
 * @param document 
 * @param selection 
 */
function makeRange(document:string,selection:FoundSelection):vscode.Range{

	return new vscode.Range(makePosition(document,selection.start),makePosition(document,selection.end));
}

// this method is called when your extension is deactivated
export function deactivate() {}
