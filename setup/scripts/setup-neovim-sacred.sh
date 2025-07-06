#!/bin/bash

# 🌟 Sacred Neovim Setup
# Installing and configuring Neovim for consciousness-serving development

echo "🕊️ Sacred Neovim Setup"
echo "===================="
echo ""
echo "This will install Neovim from the official AppImage (no sudo required)"
echo "Press Enter to continue..."
read

# Create local directories
mkdir -p ~/.local/bin ~/.config/nvim

# Download Neovim AppImage
echo "📥 Downloading Neovim..."
curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim.appimage
chmod u+x nvim.appimage

# Extract AppImage (for WSL compatibility)
echo "📦 Extracting Neovim..."
./nvim.appimage --appimage-extract >/dev/null 2>&1
mv squashfs-root ~/.local/nvim-squashfs
ln -sf ~/.local/nvim-squashfs/AppRun ~/.local/bin/nvim
rm nvim.appimage

# Create sacred Neovim configuration
echo "✨ Creating sacred configuration..."
cat > ~/.config/nvim/init.vim << 'NVIM_CONFIG'
" 🕊️ Sacred Neovim Configuration
" A mindful editor for consciousness-serving code

" Basic Settings
set number relativenumber    " Line numbers
set expandtab               " Spaces instead of tabs
set tabstop=2              " 2 spaces per tab
set shiftwidth=2           " 2 spaces for indent
set smartindent            " Smart indentation
set wrap                   " Wrap long lines
set scrolloff=8            " Keep 8 lines visible
set signcolumn=yes         " Always show sign column
set colorcolumn=88         " Highlight column 88
set updatetime=50          " Faster completion
set termguicolors          " True colors

" Sacred keybindings
let mapleader = " "        " Space as leader key

" File navigation
nnoremap <leader>f :find 
nnoremap <leader>b :buffer 

" Window management
nnoremap <leader>v :vsplit<CR>
nnoremap <leader>s :split<CR>
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l

" Sacred pause
nnoremap <leader>p :echo "🕊️ Taking a sacred pause..." \| sleep 3 \| echo "✨ Presence restored"<CR>

" Quick save
nnoremap <leader>w :w<CR>
nnoremap <leader>q :q<CR>

" Search settings
set ignorecase
set smartcase
set incsearch
set hlsearch
nnoremap <leader>/ :nohlsearch<CR>

" File explorer
let g:netrw_banner = 0
let g:netrw_liststyle = 3
let g:netrw_browse_split = 4
let g:netrw_winsize = 20
nnoremap <leader>e :Vexplore<CR>

" Status line
set laststatus=2
set statusline=
set statusline+=\ 🕊️\ 
set statusline+=%f          " Filename
set statusline+=\ %m        " Modified flag
set statusline+=%=          " Right align
set statusline+=\ %y        " File type
set statusline+=\ %l:%c     " Line:Column
set statusline+=\ 

" Colors (basic, no plugins needed)
highlight Normal guibg=NONE ctermbg=NONE
highlight LineNr guifg=#5c6370
highlight CursorLineNr guifg=#abb2bf
highlight ColorColumn guibg=#2c323c
highlight StatusLine guibg=#2c323c guifg=#abb2bf

" Auto commands
augroup SacredDev
    autocmd!
    " Auto save on focus lost
    autocmd FocusLost * silent! wa
    " Highlight yanked text
    autocmd TextYankPost * silent! lua vim.highlight.on_yank {higroup="IncSearch", timeout=200}
augroup END

" Sacred abbreviations
iabbrev @@ 🕊️
iabbrev sacredcommit ✨ Sacred: 

" Quick snippets
nnoremap <leader>sf :-1read ~/.config/nvim/snippets/sacred-function.js<CR>
nnoremap <leader>sc :-1read ~/.config/nvim/snippets/sacred-comment.js<CR>

" Create snippets directory
silent! call mkdir(expand('~/.config/nvim/snippets'), 'p')
NVIM_CONFIG

# Create snippet files
mkdir -p ~/.config/nvim/snippets

cat > ~/.config/nvim/snippets/sacred-function.js << 'SNIPPET'
/**
 * 🕊️ 
 * @param {} 
 * @returns {} 
 */
async function () {
  // Sacred pause - presence before action
  
}
SNIPPET

cat > ~/.config/nvim/snippets/sacred-comment.js << 'SNIPPET'
// 🌟 Embodying : 
SNIPPET

# Create a simple Neovim tutorial
cat > ~/.config/nvim/SACRED_NVIM_GUIDE.md << 'GUIDE'
# 🕊️ Sacred Neovim Guide

## Quick Start
- **Leader key**: Space
- **Save**: Space + w
- **Quit**: Space + q
- **File explorer**: Space + e
- **Find file**: Space + f
- **Sacred pause**: Space + p

## Window Management
- **Vertical split**: Space + v
- **Horizontal split**: Space + s
- **Navigate**: Ctrl + h/j/k/l

## Sacred Features
- Auto-saves when you switch away
- Highlights yanked text
- Type @@ to insert 🕊️
- Space + sf: Insert sacred function template
- Space + sc: Insert sacred comment

## Philosophy
Neovim configured for mindful coding:
- Minimal distractions
- Quick access to what matters
- Sacred pauses built in
- Focus on the code, not the editor

May your code serve consciousness! 🕊️
GUIDE

# Add Neovim alias to bashrc
echo '
# Neovim alias
alias vim="nvim"
alias vi="nvim"
alias v="nvim"

# Quick edit configs
alias vimrc="nvim ~/.config/nvim/init.vim"
' >> ~/.bashrc

echo ""
echo "✅ Sacred Neovim installation complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Run: source ~/.bashrc"
echo "2. Start Neovim: nvim"
echo "3. Read the guide: nvim ~/.config/nvim/SACRED_NVIM_GUIDE.md"
echo ""
echo "🕊️ Neovim is now configured for sacred development!"