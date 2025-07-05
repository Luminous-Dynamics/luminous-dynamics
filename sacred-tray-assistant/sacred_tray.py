#!/usr/bin/env python3
"""
🌟 Sacred AI Desktop Assistant
A system tray application providing instant access to local AI
"""

import os
import sys
import json
import subprocess
import threading
from datetime import datetime
import tkinter as tk
from tkinter import ttk, scrolledtext
import pystray
from PIL import Image, ImageDraw
from pynput import keyboard
import requests

class SacredTrayAssistant:
    def __init__(self):
        self.ollama_url = "http://localhost:11434"
        self.current_model = "llama3.2:3b"
        self.models = {
            "llama3.2:3b": "Balanced General",
            "mistral:7b-instruct": "Sacred & Code",
            "gemma2:2b": "Fast Wisdom",
            "tinydolphin:latest": "Ultra Quick"
        }
        self.window = None
        self.icon = None
        self.setup_tray()
        self.setup_hotkeys()
        
    def create_icon_image(self):
        """Create a sacred purple icon"""
        # Create an image for the tray icon
        width = 64
        height = 64
        image = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)
        
        # Draw a purple circle with star
        purple = (139, 92, 246, 255)
        draw.ellipse([8, 8, 56, 56], fill=purple)
        
        # Draw a star in the center
        star_color = (255, 255, 255, 255)
        # Simple star shape
        draw.polygon([
            (32, 16), (38, 28), (50, 28), (40, 36),
            (44, 48), (32, 40), (20, 48), (24, 36),
            (14, 28), (26, 28)
        ], fill=star_color)
        
        return image
    
    def setup_tray(self):
        """Setup system tray icon"""
        # Create menu
        menu = pystray.Menu(
            pystray.MenuItem("Open Assistant", self.show_window),
            pystray.MenuItem("Quick Chat", self.quick_chat),
            pystray.Menu.SEPARATOR,
            pystray.MenuItem(
                "Model",
                pystray.Menu(*[
                    pystray.MenuItem(
                        f"{name} ({model})",
                        lambda _, m=model: self.set_model(m),
                        checked=lambda item, m=model: self.current_model == m
                    ) for model, name in self.models.items()
                ])
            ),
            pystray.Menu.SEPARATOR,
            pystray.MenuItem("Sacred Mode", self.sacred_mode),
            pystray.MenuItem("Code Mode", self.code_mode),
            pystray.MenuItem("Wisdom", self.daily_wisdom),
            pystray.Menu.SEPARATOR,
            pystray.MenuItem("Quit", self.quit_app)
        )
        
        # Create icon
        image = self.create_icon_image()
        self.icon = pystray.Icon("sacred_ai", image, "Sacred AI Assistant", menu)
        
    def setup_hotkeys(self):
        """Setup global hotkeys"""
        def on_hotkey():
            self.show_window()
            
        # Start keyboard listener in separate thread
        def listen_hotkeys():
            try:
                # Global hotkey: Ctrl+Space
                hotkey = keyboard.GlobalHotKeys({
                    '<ctrl>+<space>': on_hotkey
                })
                hotkey.start()
            except Exception as e:
                print(f"Hotkey setup failed: {e}")
                
        threading.Thread(target=listen_hotkeys, daemon=True).start()
    
    def query_ollama(self, prompt, model=None):
        """Query Ollama API"""
        if model is None:
            model = self.current_model
            
        try:
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json().get('response', 'No response')
            else:
                return f"Error: {response.status_code}"
        except Exception as e:
            return f"Error: {str(e)}"
    
    def show_window(self, icon=None, item=None):
        """Show the assistant window"""
        if self.window and self.window.winfo_exists():
            self.window.lift()
            self.window.focus_force()
            return
            
        self.window = tk.Tk()
        self.window.title("Sacred AI Assistant")
        self.window.geometry("600x500")
        
        # Set colors
        bg_color = "#1a1a2e"
        fg_color = "#f3f4f6"
        purple = "#8b5cf6"
        
        self.window.configure(bg=bg_color)
        
        # Header
        header = tk.Frame(self.window, bg=purple, height=50)
        header.pack(fill="x", padx=0, pady=0)
        
        title = tk.Label(
            header, 
            text="🌟 Sacred AI Assistant", 
            font=("Arial", 16, "bold"),
            bg=purple, 
            fg="white"
        )
        title.pack(pady=10)
        
        # Model selector
        model_frame = tk.Frame(self.window, bg=bg_color)
        model_frame.pack(fill="x", padx=10, pady=5)
        
        tk.Label(
            model_frame, 
            text="Model:", 
            bg=bg_color, 
            fg=fg_color
        ).pack(side="left", padx=5)
        
        model_var = tk.StringVar(value=self.current_model)
        model_combo = ttk.Combobox(
            model_frame,
            textvariable=model_var,
            values=list(self.models.keys()),
            state="readonly",
            width=20
        )
        model_combo.pack(side="left")
        model_combo.bind("<<ComboboxSelected>>", 
                        lambda e: self.set_model(model_var.get()))
        
        # Quick buttons
        button_frame = tk.Frame(self.window, bg=bg_color)
        button_frame.pack(fill="x", padx=10, pady=5)
        
        buttons = [
            ("🔮 Sacred", self.sacred_mode),
            ("💻 Code", self.code_mode),
            ("✨ Wisdom", self.daily_wisdom),
            ("🌸 Glyph", self.glyph_guide)
        ]
        
        for text, command in buttons:
            btn = tk.Button(
                button_frame,
                text=text,
                command=command,
                bg=purple,
                fg="white",
                padx=10,
                pady=5,
                relief="flat",
                cursor="hand2"
            )
            btn.pack(side="left", padx=5)
        
        # Chat area
        chat_frame = tk.Frame(self.window, bg=bg_color)
        chat_frame.pack(fill="both", expand=True, padx=10, pady=5)
        
        # Output area
        self.output = scrolledtext.ScrolledText(
            chat_frame,
            wrap=tk.WORD,
            bg="#0f0f23",
            fg=fg_color,
            font=("Consolas", 11),
            insertbackground=fg_color
        )
        self.output.pack(fill="both", expand=True)
        
        # Input area
        input_frame = tk.Frame(self.window, bg=bg_color)
        input_frame.pack(fill="x", padx=10, pady=10)
        
        self.input_field = tk.Entry(
            input_frame,
            bg="#0f0f23",
            fg=fg_color,
            font=("Arial", 12),
            insertbackground=fg_color
        )
        self.input_field.pack(side="left", fill="x", expand=True)
        self.input_field.bind("<Return>", self.send_message)
        self.input_field.focus()
        
        send_btn = tk.Button(
            input_frame,
            text="Send",
            command=self.send_message,
            bg=purple,
            fg="white",
            padx=20,
            pady=5,
            relief="flat",
            cursor="hand2"
        )
        send_btn.pack(side="right", padx=(10, 0))
        
        # Welcome message
        self.output.insert("end", "🌟 Sacred AI Assistant Ready\n")
        self.output.insert("end", f"Model: {self.current_model}\n")
        self.output.insert("end", "Hotkey: Ctrl+Space\n\n")
        self.output.insert("end", "How may I serve your journey today?\n\n")
        
        # Close behavior
        self.window.protocol("WM_DELETE_WINDOW", self.hide_window)
        
        # Center window on screen
        self.window.update_idletasks()
        x = (self.window.winfo_screenwidth() // 2) - (600 // 2)
        y = (self.window.winfo_screenheight() // 2) - (500 // 2)
        self.window.geometry(f"600x500+{x}+{y}")
    
    def hide_window(self):
        """Hide the window instead of destroying"""
        if self.window:
            self.window.withdraw()
    
    def send_message(self, event=None):
        """Send message to AI"""
        message = self.input_field.get().strip()
        if not message:
            return
            
        # Clear input
        self.input_field.delete(0, "end")
        
        # Show user message
        self.output.insert("end", f"\n👤 You: {message}\n")
        self.output.see("end")
        
        # Show thinking indicator
        self.output.insert("end", "\n🤖 AI: Thinking...\n")
        self.output.see("end")
        self.window.update()
        
        # Get response in thread
        def get_response():
            response = self.query_ollama(message)
            
            # Update UI in main thread
            self.window.after(0, lambda: self.show_response(response))
            
        threading.Thread(target=get_response, daemon=True).start()
    
    def show_response(self, response):
        """Show AI response"""
        # Remove thinking indicator
        self.output.delete("end-2l", "end-1l")
        
        # Show response
        self.output.insert("end", f"🤖 AI: {response}\n")
        self.output.see("end")
    
    def quick_chat(self, icon=None, item=None):
        """Quick chat from clipboard"""
        try:
            # Get clipboard content
            if self.window:
                clipboard = self.window.clipboard_get()
            else:
                # Create temporary window for clipboard
                temp = tk.Tk()
                temp.withdraw()
                clipboard = temp.clipboard_get()
                temp.destroy()
                
            response = self.query_ollama(f"Briefly explain: {clipboard}")
            
            # Show notification (simplified for cross-platform)
            self.show_notification("Sacred AI", response[:200] + "...")
            
        except Exception as e:
            self.show_notification("Error", str(e))
    
    def sacred_mode(self, icon=None, item=None):
        """Sacred perspective mode"""
        self.show_window()
        prompt = "From a sacred, conscious perspective, "
        self.input_field.insert(0, prompt)
        self.input_field.icursor(len(prompt))
    
    def code_mode(self, icon=None, item=None):
        """Code assistance mode"""
        self.show_window()
        prompt = "Help me code: "
        self.input_field.insert(0, prompt)
        self.input_field.icursor(len(prompt))
    
    def daily_wisdom(self, icon=None, item=None):
        """Get daily wisdom"""
        self.show_window()
        self.output.insert("end", "\n✨ Receiving sacred wisdom...\n")
        self.window.update()
        
        prompt = f"Share brief sacred wisdom for {datetime.now().strftime('%A')}. Include a centering thought and simple practice."
        
        def get_wisdom():
            response = self.query_ollama(prompt, "gemma2:2b")
            self.window.after(0, lambda: self.show_response(response))
            
        threading.Thread(target=get_wisdom, daemon=True).start()
    
    def glyph_guide(self, icon=None, item=None):
        """Sacred glyph guidance"""
        self.show_window()
        prompt = "Guide me through the sacred practice of "
        self.input_field.insert(0, prompt)
        self.input_field.icursor(len(prompt))
    
    def set_model(self, model):
        """Change AI model"""
        self.current_model = model
        if self.window and self.window.winfo_exists():
            self.output.insert("end", f"\n🔄 Switched to model: {model}\n")
            self.output.see("end")
    
    def show_notification(self, title, message):
        """Show desktop notification"""
        try:
            subprocess.run([
                "notify-send",
                "--app-name=Sacred AI",
                title,
                message
            ])
        except:
            # Fallback for systems without notify-send
            print(f"{title}: {message}")
    
    def quit_app(self, icon=None, item=None):
        """Quit application"""
        if self.window:
            self.window.destroy()
        if self.icon:
            self.icon.stop()
        sys.exit(0)
    
    def run(self):
        """Run the application"""
        # Start icon in separate thread
        icon_thread = threading.Thread(target=self.icon.run, daemon=True)
        icon_thread.start()
        
        # Show initial window
        self.show_window()
        
        # Run Tkinter mainloop
        tk.mainloop()

if __name__ == "__main__":
    # Check if Ollama is running
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code != 200:
            print("⚠️  Ollama not responding. Starting Ollama...")
            subprocess.Popen(["ollama", "serve"], stdout=subprocess.DEVNULL)
            import time
            time.sleep(3)
    except:
        print("⚠️  Starting Ollama service...")
        subprocess.Popen(["ollama", "serve"], stdout=subprocess.DEVNULL)
        import time
        time.sleep(3)
    
    # Create and run app
    app = SacredTrayAssistant()
    app.run()