# Warp Terminal Configuration for NixOS
# Add this to your /etc/nixos/configuration.nix or as an overlay

{ config, pkgs, lib, ... }:

let
  # Warp is not in nixpkgs yet, so we need to package it
  warp-terminal = pkgs.stdenv.mkDerivation rec {
    pname = "warp-terminal";
    version = "2024.12.10";  # Check latest version
    
    src = pkgs.fetchurl {
      # For Linux x86_64
      url = "https://app.warp.dev/download/linux/x86_64/stable";
      sha256 = "0000000000000000000000000000000000000000000000000000";  # Replace with actual
    };
    
    nativeBuildInputs = with pkgs; [
      autoPatchelfHook
      makeWrapper
    ];
    
    buildInputs = with pkgs; [
      stdenv.cc.cc.lib
      xorg.libX11
      xorg.libXcursor
      xorg.libXrandr
      xorg.libXi
      libGL
      vulkan-loader
      wayland
      libxkbcommon
      openssl
      zlib
      fontconfig
      freetype
    ];
    
    installPhase = ''
      mkdir -p $out/bin $out/share/applications
      cp -r . $out/opt/warp
      
      makeWrapper $out/opt/warp/warp $out/bin/warp \
        --prefix LD_LIBRARY_PATH : "${lib.makeLibraryPath buildInputs}"
      
      # Desktop entry
      cat > $out/share/applications/warp.desktop << EOF
      [Desktop Entry]
      Name=Warp
      Comment=The AI-powered terminal for LuminousOS development
      Exec=warp
      Icon=warp
      Type=Application
      Categories=Development;System;TerminalEmulator;
      EOF
    '';
  };
in
{
  # Add to system packages
  environment.systemPackages = [ warp-terminal ];
  
  # Optional: Set as default terminal
  # programs.warp.enable = true;
}