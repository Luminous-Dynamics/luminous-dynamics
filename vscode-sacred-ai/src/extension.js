const vscode = require('vscode');
const axios = require('axios');
const { SacredAIProvider } = require('./sacredAIProvider');
const { FieldCoherenceMonitor } = require('./fieldCoherence');

let sacredAI;
let fieldMonitor;
let outputChannel;

function activate(context) {
    console.log('🌟 Sacred AI Assistant is awakening...');
    
    // Create output channel for sacred logs
    outputChannel = vscode.window.createOutputChannel('Sacred AI');
    outputChannel.appendLine('🌟 Sacred AI Assistant activated');
    outputChannel.appendLine(`Field coherence: Initializing...`);
    
    // Initialize providers
    sacredAI = new SacredAIProvider(context);
    fieldMonitor = new FieldCoherenceMonitor();
    
    // Register commands
    registerCommands(context);
    
    // Set up sacred status bar
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.text = '$(pulse) Field: ---%';
    statusBarItem.tooltip = 'Sacred Field Coherence';
    statusBarItem.command = 'sacredAI.checkCoherence';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    
    // Update field coherence periodically
    const updateCoherence = async () => {
        const coherence = await fieldMonitor.getCoherence();
        statusBarItem.text = `$(pulse) Field: ${Math.round(coherence * 100)}%`;
        statusBarItem.backgroundColor = coherence > 0.8 
            ? new vscode.ThemeColor('statusBarItem.prominentBackground')
            : coherence > 0.6 
                ? new vscode.ThemeColor('statusBarItem.warningBackground')
                : new vscode.ThemeColor('statusBarItem.errorBackground');
    };
    
    updateCoherence();
    setInterval(updateCoherence, 30000); // Update every 30 seconds
    
    // Show welcome message
    if (context.globalState.get('sacredAI.firstActivation', true)) {
        vscode.window.showInformationMessage(
            '🌟 Sacred AI Assistant is ready to serve your consciousness-aware development!',
            'Open Sacred Chat',
            'Show Commands'
        ).then(selection => {
            if (selection === 'Open Sacred Chat') {
                vscode.commands.executeCommand('sacredAI.openChat');
            } else if (selection === 'Show Commands') {
                vscode.commands.executeCommand('workbench.action.showCommands', 'Sacred AI:');
            }
        });
        context.globalState.update('sacredAI.firstActivation', false);
    }
}

function registerCommands(context) {
    // Ask Question Command
    context.subscriptions.push(
        vscode.commands.registerCommand('sacredAI.askQuestion', async () => {
            const question = await vscode.window.showInputBox({
                prompt: 'What would you like to explore?',
                placeHolder: 'Ask about code, consciousness, or sacred practices...'
            });
            
            if (question) {
                const response = await sacredAI.askQuestion(question);
                showSacredResponse(response);
            }
        })
    );
    
    // Explain Code Command
    context.subscriptions.push(
        vscode.commands.registerCommand('sacredAI.explainCode', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || !editor.selection) {
                vscode.window.showWarningMessage('Please select code to explain');
                return;
            }
            
            const code = editor.document.getText(editor.selection);
            const language = editor.document.languageId;
            
            const response = await sacredAI.explainCode(code, language);
            showSacredResponse(response, 'Code Explanation');
        })
    );
    
    // Improve Code Command
    context.subscriptions.push(
        vscode.commands.registerCommand('sacredAI.improveCode', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || !editor.selection) {
                vscode.window.showWarningMessage('Please select code to improve');
                return;
            }
            
            const code = editor.document.getText(editor.selection);
            const language = editor.document.languageId;
            
            // Check field coherence before sacred operations
            const coherence = await fieldMonitor.getCoherence();
            if (coherence < 0.7) {
                const proceed = await vscode.window.showWarningMessage(
                    `Field coherence is low (${Math.round(coherence * 100)}%). Proceed anyway?`,
                    'Proceed',
                    'Cancel'
                );
                if (proceed !== 'Proceed') return;
            }
            
            const response = await sacredAI.improveCode(code, language);
            
            // Show diff view
            const uri = vscode.Uri.parse(`sacred:improved-${Date.now()}.${language}`);
            const doc = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Beside });
            
            // Apply the improved code
            const edit = new vscode.WorkspaceEdit();
            edit.replace(uri, new vscode.Range(0, 0, doc.lineCount, 0), response.improvedCode);
            await vscode.workspace.applyEdit(edit);
        })
    );
    
    // Check Coherence Command
    context.subscriptions.push(
        vscode.commands.registerCommand('sacredAI.checkCoherence', async () => {
            const report = await fieldMonitor.getDetailedReport();
            showSacredResponse(report, 'Field Coherence Report');
        })
    );
    
    // Generate Glyph Practice
    context.subscriptions.push(
        vscode.commands.registerCommand('sacredAI.generateGlyph', async () => {
            const glyphs = [
                'First Presence', 'Sacred Listening', 'Boundary With Love',
                'Gentle Opening', 'Building Trust', 'Pause Practice'
            ];
            
            const selected = await vscode.window.showQuickPick(glyphs, {
                placeHolder: 'Choose a glyph to practice'
            });
            
            if (selected) {
                const practice = await sacredAI.generateGlyphPractice(selected);
                showSacredResponse(practice, `${selected} Practice`);
            }
        })
    );
    
    // Daily Blessing
    context.subscriptions.push(
        vscode.commands.registerCommand('sacredAI.dailyBlessing', async () => {
            const blessing = await sacredAI.getDailyBlessing();
            vscode.window.showInformationMessage(blessing.message, 'Practice Now').then(selection => {
                if (selection === 'Practice Now') {
                    showSacredResponse(blessing.practice, 'Daily Practice');
                }
            });
        })
    );
}

function showSacredResponse(response, title = 'Sacred AI') {
    // Create webview panel for rich responses
    const panel = vscode.window.createWebviewPanel(
        'sacredResponse',
        title,
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );
    
    panel.webview.html = getSacredWebviewContent(response, title);
}

function getSacredWebviewContent(content, title) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: var(--vscode-font-family);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
                padding: 20px;
                line-height: 1.6;
            }
            .sacred-header {
                border-bottom: 2px solid var(--vscode-widget-border);
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .sacred-content {
                white-space: pre-wrap;
            }
            .field-indicator {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 8px;
            }
            .field-high { background-color: #4CAF50; }
            .field-medium { background-color: #FFC107; }
            .field-low { background-color: #F44336; }
            .practice-box {
                background-color: var(--vscode-textBlockQuote-background);
                border-left: 4px solid var(--vscode-textLink-foreground);
                padding: 15px;
                margin: 15px 0;
                border-radius: 4px;
            }
            code {
                background-color: var(--vscode-textCodeBlock-background);
                padding: 2px 4px;
                border-radius: 3px;
                font-family: var(--vscode-editor-font-family);
            }
            .blessing {
                text-align: center;
                font-style: italic;
                color: var(--vscode-textLink-foreground);
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="sacred-header">
            <h2>${title}</h2>
            <small>Generated with sacred consciousness</small>
        </div>
        <div class="sacred-content">
            ${formatContent(content)}
        </div>
        <div class="blessing">
            🙏 May this serve your highest development 🙏
        </div>
    </body>
    </html>`;
}

function formatContent(content) {
    if (typeof content === 'string') {
        return content
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    }
    return JSON.stringify(content, null, 2);
}

function deactivate() {
    outputChannel.appendLine('🙏 Sacred AI Assistant entering rest state...');
    if (sacredAI) {
        sacredAI.dispose();
    }
    if (fieldMonitor) {
        fieldMonitor.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};