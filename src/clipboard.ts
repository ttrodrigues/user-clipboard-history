'use strict';
import {ExtensionContext, workspace, TextEditor, TextDocument, Range, Position, QuickPickItem, window, commands} from 'vscode';

export function activate(context: ExtensionContext) {
    let config:any = workspace.getConfiguration('user-clipboard-history');
    let clipboardSize:number = config.get('size', 20);
    let clipboardArray:any = config.get('historyArray');    
    let disposableArray:any = [];

    // Save all values that are copied to clipboard in array
    function addClipboardItem(editor: TextEditor) {
        let doc: TextDocument = editor.document;
        let sels = editor.selections;
        for (const element of sels) {
            let line = element.active.line;
            let text = doc.getText(new Range(element.start, element.end));
            if (element.isEmpty) { // Get full line if no selection highlighted
                let lineStart = new Position(line, 0);
                let lineEnd = new Position(line, doc.lineAt(line).range.end.character)
                text = doc.getText(new Range(lineStart, lineEnd));
            }
            
            console.log(clipboardArray.length);
            console.log(clipboardSize);
            
            if (clipboardArray.indexOf(text) === -1) {
                clipboardArray.push(text);
                if (clipboardArray.length > clipboardSize) {
                    clipboardArray.shift();
                }
                updateUserSetting(clipboardArray);
            }
        }
    }    

    function makeQuickPick(clipboardArray, toBeRemoved?: boolean) {
        // Create quick pick clipboard items
        let copiedItems: QuickPickItem[] = [];
        // List clipboard items in order of recency
        for (const element of clipboardArray) {
            copiedItems.unshift(element);
        }
        return copiedItems;
    }

    function removeQuickPickItem(clipboardArray, item: QuickPickItem) {
        let index = clipboardArray.indexOf(item)
        if (index > -1) { clipboardArray.splice(index, 1); }
        return clipboardArray;
    }

    function editQuickPickItem(clipboardArray, item: QuickPickItem, text: string) {
        let index = clipboardArray.indexOf(item);
        if (index > -1) {clipboardArray[index] = text; }
        return clipboardArray;
    }

    function pasteSelected(item: QuickPickItem) {
        if (!item) return;

        let activeEditor
        if (activeEditor = window.activeTextEditor) {    // Don't run if no active text editor instance available
            activeEditor.edit(function (textInserter) {
                textInserter.delete(activeEditor.selection);    // Delete anything currently selected
            }).then(function () {
                activeEditor.edit(function (textInserter) {
                    textInserter.insert(activeEditor.selection.start, item)     // Insert text from list
                })
            })  
        }         
    }

    function updateUserSetting(array:any) {
        workspace.getConfiguration().update('user-clipboard-history.historyArray', array, true);
    }

    function quickPickOptions(text:string) {
        return {placeHolder: text};
    }

    disposableArray.push(commands.registerCommand('user-clipboard-history.copy', () => {
        addClipboardItem(window.activeTextEditor);
        commands.executeCommand("editor.action.clipboardCopyAction");
    }));

    disposableArray.push(commands.registerCommand('user-clipboard-history.cut', () => {
        addClipboardItem(window.activeTextEditor);
        commands.executeCommand("editor.action.clipboardCutAction");
    }));

    disposableArray.push(commands.registerCommand('user-clipboard-history.paste', () => {
        commands.executeCommand("editor.action.clipboardPasteAction");
    }));

    disposableArray.push(commands.registerCommand('user-clipboard-history.pasteFromClipboard', () => {
        if (clipboardArray.length == 0) { 
            window.setStatusBarMessage("No items in clipboard");
            return; 
        } else {
            window.showQuickPick(makeQuickPick(clipboardArray), quickPickOptions("Select an clipboard item to paste...")).then((item) => { pasteSelected(item); });
        }
    }));

    disposableArray.push(commands.registerCommand('user-clipboard-history.removeFromClipboard', () => {
        if (clipboardArray.length == 0) {
            window.setStatusBarMessage("No items in clipboard");
            return;
        } else {
            let currentQuickPick = makeQuickPick(clipboardArray, true);
            window.showQuickPick(currentQuickPick, quickPickOptions("Select an clipboard item to remove...")).then((item)=>{
                let removedQuickPick = makeQuickPick(removeQuickPickItem(clipboardArray, item), true);
                updateUserSetting(removedQuickPick);
                window.setStatusBarMessage("Removed from clipboard");
            });
        }
    }));
    
    disposableArray.push(commands.registerCommand('user-clipboard-history.editClipboard', () => {
        if (clipboardArray.length == 0) {
            window.setStatusBarMessage("No items in clipboard");
            return;
        } else {
            let currentQuickPick = makeQuickPick(clipboardArray);
            window.showQuickPick(currentQuickPick, quickPickOptions("Select an clipboard item to edit...")).then((item) => {
                window.showInputBox({ value: item.toString() })
                    .then(val => {
                        let editedQuickPick = makeQuickPick(editQuickPickItem(clipboardArray, item, val));
                        updateUserSetting(editedQuickPick);
                        window.setStatusBarMessage("Edited clipboard item");
                    });
            })
        }
    }));

    disposableArray.push(commands.registerCommand('user-clipboard-history.clearClipboard', () => {
        if (clipboardArray.length == 0) {
            window.setStatusBarMessage("No items in clipboard");
            return;
        } else {          
            clipboardArray = [];  
            updateUserSetting([]);
            window.setStatusBarMessage("All clipboard history has been cleared");    
        }
    }));   

    context.subscriptions.concat(disposableArray);
}

// Called when extension is deactivated
export function deactivate() {
}
