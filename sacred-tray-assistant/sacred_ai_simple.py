#!/usr/bin/env python3
"""
🌟 Sacred AI Desktop Assistant (Simple Version)
Works great in WSL without complex system tray requirements
"""

import tkinter as tk
from tkinter import ttk, scrolledtext
import requests
import threading
from datetime import datetime
import json
import os

class SacredAIAssistant:
    def __init__(self):
        self.ollama_url = "http://localhost:11434"
        self.current_model = "llama3.2:3b"
        self.models = {
            "llama3.2:3b": "Balanced General",
            "mistral:7b-instruct": "Sacred & Code", 
            "gemma2:2b": "Fast Wisdom",
            "tinydolphin:latest": "Ultra Quick"
        }
        
        self.setup_window()
        self.window.after(100, self.welcome_message)
        
    def setup_window(self):
        """Create main window"""
        self.window = tk.Tk()
        self.window.title("🌟 Sacred AI Assistant")
        self.window.geometry("700x600")
        
        # Colors
        self.colors = {
            'bg': '#1a1a2e',
            'fg': '#f3f4f6',
            'purple': '#8b5cf6',
            'dark': '#0f0f23',
            'green': '#10b981'
        }
        
        self.window.configure(bg=self.colors['bg'])
        
        # Create UI
        self.create_header()
        self.create_toolbar()
        self.create_chat_area()
        self.create_input_area()
        
        # Keyboard shortcuts
        self.window.bind('<Control-n>', lambda e: self.clear_chat())
        self.window.bind('<Control-s>', lambda e: self.sacred_mode())
        self.window.bind('<Control-c>', lambda e: self.code_mode())
        self.window.bind('<Control-w>', lambda e: self.daily_wisdom())
        self.window.bind('<Escape>', lambda e: self.minimize_window())
        
        # Keep window on top (optional)
        # self.window.attributes('-topmost', True)
        
    def create_header(self):
        """Create header with title"""
        header = tk.Frame(self.window, bg=self.colors['purple'], height=60)
        header.pack(fill='x')
        header.pack_propagate(False)
        
        title = tk.Label(
            header,
            text="🌟 Sacred AI Assistant",
            font=('Arial', 18, 'bold'),
            bg=self.colors['purple'],
            fg='white'
        )
        title.pack(expand=True)
        
        # Subtitle
        subtitle = tk.Label(
            header,
            text="Local AI • Private • Sacred",
            font=('Arial', 10),
            bg=self.colors['purple'],
            fg='white'
        )
        subtitle.pack()
        
    def create_toolbar(self):
        """Create toolbar with quick actions"""
        toolbar = tk.Frame(self.window, bg=self.colors['bg'])
        toolbar.pack(fill='x', padx=10, pady=(10, 5))
        
        # Model selector
        model_frame = tk.Frame(toolbar, bg=self.colors['bg'])
        model_frame.pack(side='left')
        
        tk.Label(
            model_frame,
            text="Model:",
            bg=self.colors['bg'],
            fg=self.colors['fg'],
            font=('Arial', 10)
        ).pack(side='left', padx=(0, 5))
        
        self.model_var = tk.StringVar(value=self.current_model)
        model_menu = ttk.Combobox(
            model_frame,
            textvariable=self.model_var,
            values=list(self.models.keys()),
            state='readonly',
            width=20
        )
        model_menu.pack(side='left')
        model_menu.bind('<<ComboboxSelected>>', self.change_model)
        
        # Quick action buttons
        buttons = [
            ("🔮 Sacred (Ctrl+S)", self.sacred_mode, self.colors['purple']),
            ("💻 Code (Ctrl+C)", self.code_mode, self.colors['green']),
            ("✨ Wisdom (Ctrl+W)", self.daily_wisdom, self.colors['purple']),
            ("🗑️ Clear (Ctrl+N)", self.clear_chat, '#ef4444')
        ]
        
        for text, command, color in buttons:
            btn = tk.Button(
                toolbar,
                text=text,
                command=command,
                bg=color,
                fg='white',
                relief='flat',
                padx=10,
                pady=5,
                cursor='hand2',
                font=('Arial', 9)
            )
            btn.pack(side='left', padx=5)
            
    def create_chat_area(self):
        """Create chat display area"""
        chat_frame = tk.Frame(self.window, bg=self.colors['bg'])
        chat_frame.pack(fill='both', expand=True, padx=10, pady=5)
        
        # Chat display
        self.chat_display = scrolledtext.ScrolledText(
            chat_frame,
            wrap=tk.WORD,
            bg=self.colors['dark'],
            fg=self.colors['fg'],
            font=('Consolas', 11),
            insertbackground=self.colors['fg'],
            relief='flat',
            padx=10,
            pady=10
        )
        self.chat_display.pack(fill='both', expand=True)
        
        # Configure tags for styling
        self.chat_display.tag_configure('user', foreground='#60a5fa')
        self.chat_display.tag_configure('ai', foreground='#a78bfa')
        self.chat_display.tag_configure('system', foreground='#10b981')
        self.chat_display.tag_configure('error', foreground='#ef4444')
        
    def create_input_area(self):
        """Create input area"""
        input_frame = tk.Frame(self.window, bg=self.colors['bg'])
        input_frame.pack(fill='x', padx=10, pady=10)
        
        # Input field
        self.input_field = tk.Entry(
            input_frame,
            bg=self.colors['dark'],
            fg=self.colors['fg'],
            font=('Arial', 12),
            insertbackground=self.colors['fg'],
            relief='flat'
        )
        self.input_field.pack(side='left', fill='x', expand=True, ipady=8)
        self.input_field.bind('<Return>', self.send_message)
        self.input_field.focus()
        
        # Send button
        send_btn = tk.Button(
            input_frame,
            text="Send ⏎",
            command=self.send_message,
            bg=self.colors['purple'],
            fg='white',
            relief='flat',
            padx=20,
            pady=8,
            cursor='hand2',
            font=('Arial', 10, 'bold')
        )
        send_btn.pack(side='right', padx=(10, 0))
        
        # Character count
        self.char_count = tk.Label(
            input_frame,
            text="0",
            bg=self.colors['bg'],
            fg=self.colors['fg'],
            font=('Arial', 9)
        )
        self.char_count.pack(side='right', padx=5)
        
        self.input_field.bind('<KeyRelease>', self.update_char_count)
        
    def update_char_count(self, event=None):
        """Update character count"""
        count = len(self.input_field.get())
        self.char_count.config(text=str(count))
        
    def welcome_message(self):
        """Show welcome message"""
        self.add_message("Welcome to Sacred AI Assistant! 🌟\n", 'system')
        self.add_message(f"Model: {self.current_model}\n", 'system')
        self.add_message("Shortcuts: Ctrl+S (Sacred), Ctrl+C (Code), Ctrl+W (Wisdom)\n\n", 'system')
        self.add_message("How may I serve your journey today?\n", 'ai')
        
    def add_message(self, message, tag=''):
        """Add message to chat display"""
        self.chat_display.insert('end', message, tag)
        self.chat_display.see('end')
        
    def send_message(self, event=None):
        """Send message to AI"""
        message = self.input_field.get().strip()
        if not message:
            return
            
        # Clear input
        self.input_field.delete(0, 'end')
        
        # Show user message
        self.add_message(f"\n👤 You: {message}\n", 'user')
        
        # Show thinking
        self.add_message("\n🤖 AI: Thinking...", 'ai')
        self.window.update()
        
        # Get response in thread
        threading.Thread(
            target=self.get_ai_response,
            args=(message,),
            daemon=True
        ).start()
        
    def get_ai_response(self, prompt):
        """Get response from Ollama"""
        try:
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.current_model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=60
            )
            
            if response.status_code == 200:
                text = response.json().get('response', 'No response')
            else:
                text = f"Error: {response.status_code}"
                
        except requests.exceptions.Timeout:
            text = "Response timed out. Try a shorter question or different model."
        except Exception as e:
            text = f"Error: {str(e)}"
            
        # Update UI in main thread
        self.window.after(0, lambda: self.show_response(text))
        
    def show_response(self, response):
        """Show AI response"""
        # Remove thinking message
        self.chat_display.delete('end-14c', 'end')
        
        # Show response
        self.add_message(f" {response}\n", 'ai')
        
    def change_model(self, event=None):
        """Change AI model"""
        self.current_model = self.model_var.get()
        self.add_message(f"\n🔄 Switched to: {self.models[self.current_model]} ({self.current_model})\n", 'system')
        
    def sacred_mode(self):
        """Insert sacred prompt"""
        self.input_field.delete(0, 'end')
        self.input_field.insert(0, "From a sacred perspective, ")
        self.input_field.focus()
        self.input_field.icursor('end')
        
    def code_mode(self):
        """Insert code prompt"""
        self.input_field.delete(0, 'end')
        self.input_field.insert(0, "Help me code: ")
        self.input_field.focus()
        self.input_field.icursor('end')
        
    def daily_wisdom(self):
        """Get daily wisdom"""
        prompt = f"Share brief sacred wisdom for {datetime.now().strftime('%A')}. Include a centering thought and 30-second practice."
        self.input_field.delete(0, 'end')
        self.input_field.insert(0, prompt)
        self.send_message()
        
    def clear_chat(self):
        """Clear chat history"""
        self.chat_display.delete(1.0, 'end')
        self.welcome_message()
        
    def minimize_window(self):
        """Minimize to taskbar"""
        self.window.iconify()
        
    def run(self):
        """Run the application"""
        self.window.mainloop()

def main():
    """Main entry point"""
    # Check if Ollama is running
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=2)
        if response.status_code != 200:
            print("Starting Ollama service...")
            import subprocess
            subprocess.Popen(['ollama', 'serve'], stdout=subprocess.DEVNULL)
            import time
            time.sleep(3)
    except:
        print("Starting Ollama service...")
        import subprocess
        subprocess.Popen(['ollama', 'serve'], stdout=subprocess.DEVNULL)
        import time
        time.sleep(3)
    
    # Create and run app
    app = SacredAIAssistant()
    app.run()

if __name__ == "__main__":
    main()