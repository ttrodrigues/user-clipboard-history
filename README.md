![](/media/logo.png)

# User Clipboard History

-----------------------------------------------------------------------------------------------------------

## Key Features

1. Save history of all copied and cut items on user settings and across all devices (sync feature is mandatory)
2. Paste from history
3. Clear all history
4. Remove selected item from history
5. Edit selected item in history

## Keyboard Shortcuts

:warning: **Type User Clipboard History in the command palette to view all commands.**

`Ctrl+C` copies and `Ctrl+X ` cuts the selected item. These override the default shortcuts to save the item to clipboard. If nothing is selected, the entire line will be saved. 

`Ctrl+V` pastes the most recent item.

`Ctrl+Shift+V` opens the clipboard history. Use the arrow keys to scroll and press `Enter` to paste a selected item. 

`Ctrl+Alt+V D` opens the clipboard delete settings. Use the arrow keys to scroll and press `Enter` to remove a selected item. 

`Ctrl+Alt+V E` opens the clipboard editor settings. Use the arrow keys to scroll and press `Enter` to edit a selected item. 

`Ctrl+Alt+V H` all history of user's clipboard will be erased. 

You can also add custom keyboard short cuts by following the instructions in the [customization documentation](https://code.visualstudio.com/docs/customization/keybindings).

## Configuration

`user-clipboard-history.size` is the maximum number of items saved in the clipboard. The default is **20**.

`user-clipboard-history.historyArray` array on user settings where **all history will be saved**.

Both configuration can be accessed on [settings](https://code.visualstudio.com/docs/getstarted/settings#_default-settings).

## Inspiration
Fork of [Clipboard History Extension](https://marketplace.visualstudio.com/items?itemName=Anjali.clipboard-history) with the changes to keep the clipboard history on user's settings, and synced for all devices.


-----------------------------------------------------------------------------------------------------------