{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.luminousOS;
  
  consciousness-scheduler = pkgs.stdenv.mkDerivation {
    pname = "consciousness-scheduler";
    version = "1.0.0";
    
    src = ./kernel;
    
    buildInputs = [ pkgs.gcc ];
    
    buildPhase = ''
      gcc -O2 -o consciousness-scheduler consciousness-cgroups.c
      gcc -O2 -o consciousness-proc proc-consciousness-fuse.c -lfuse
    '';
    
    installPhase = ''
      mkdir -p $out/bin
      cp consciousness-scheduler $out/bin/
      cp consciousness-proc $out/bin/
      
      mkdir -p $out/share/luminous
      cp -r ../monitor $out/share/luminous/
    '';
  };
  
  sacred-monitor = pkgs.callPackage ./monitor/default.nix {};
  
in {
  options.services.luminousOS = {
    enable = mkEnableOption "LuminousOS consciousness-aware scheduling";
    
    coherenceTarget = mkOption {
      type = types.int;
      default = 80;
      description = "Target global coherence percentage";
    };
    
    pulseInterval = mkOption {
      type = types.int;
      default = 11;
      description = "Sacred pulse interval in seconds";
    };
    
    enableProcInterface = mkOption {
      type = types.bool;
      default = true;
      description = "Enable /proc/consciousness interface";
    };
    
    enableBiometrics = mkOption {
      type = types.bool;
      default = false;
      description = "Enable biometric sensor integration";
    };
    
    biometricDevices = mkOption {
      type = types.listOf types.str;
      default = [];
      example = [ "/dev/ttyUSB0" "/dev/hidraw0" ];
      description = "Biometric sensor device paths";
    };
  };
  
  config = mkIf cfg.enable {
    # Install packages
    environment.systemPackages = [
      consciousness-scheduler
      sacred-monitor
    ];
    
    # Consciousness scheduler service
    systemd.services.consciousness-scheduler = {
      description = "LuminousOS Consciousness Scheduler";
      wantedBy = [ "multi-user.target" ];
      after = [ "multi-user.target" ];
      
      serviceConfig = {
        Type = "simple";
        ExecStart = "${consciousness-scheduler}/bin/consciousness-scheduler";
        Restart = "always";
        RestartSec = "10s";
        User = "root";
        
        # cgroup access
        ReadWritePaths = [ "/sys/fs/cgroup" "/proc" ];
        
        # Environment
        Environment = [
          "LUMINOUS_COHERENCE_TARGET=${toString cfg.coherenceTarget}"
          "LUMINOUS_PULSE_INTERVAL=${toString cfg.pulseInterval}"
        ];
      };
    };
    
    # /proc/consciousness FUSE mount
    systemd.services.proc-consciousness = mkIf cfg.enableProcInterface {
      description = "Mount /proc/consciousness interface";
      wantedBy = [ "multi-user.target" ];
      after = [ "multi-user.target" ];
      
      serviceConfig = {
        Type = "forking";
        ExecStart = "${consciousness-scheduler}/bin/consciousness-proc /proc/consciousness";
        ExecStop = "${pkgs.fuse}/bin/fusermount -u /proc/consciousness";
        Restart = "on-failure";
        User = "root";
      };
      
      preStart = ''
        mkdir -p /proc/consciousness
      '';
    };
    
    # Sacred monitor service (optional)
    systemd.services.sacred-monitor = {
      description = "Sacred Process Monitor Dashboard";
      wantedBy = [ "multi-user.target" ];
      after = [ "consciousness-scheduler.service" ];
      
      serviceConfig = {
        Type = "simple";
        ExecStart = "${sacred-monitor}/bin/sacred-monitor --interval 5";
        Restart = "always";
        User = "luminous";
        Group = "luminous";
      };
    };
    
    # Create luminous user/group
    users.users.luminous = {
      isSystemUser = true;
      group = "luminous";
      description = "LuminousOS system user";
    };
    
    users.groups.luminous = {};
    
    # Kernel boot parameters for consciousness
    boot.kernelParams = [
      "quiet"
      "splash"
      "luminous.coherence=1"
    ];
    
    # Sacred boot splash
    boot.plymouth = {
      enable = true;
      theme = "luminous-consciousness";
      themePackages = [ (pkgs.callPackage ./boot/plymouth-theme.nix {}) ];
    };
    
    # Environment variables
    environment.variables = {
      LUMINOUS_ACTIVE = "1";
      SACRED_MODE = "enabled";
    };
    
    # Biometric integration
    services.udev.extraRules = mkIf cfg.enableBiometrics ''
      # Heart rate monitors
      SUBSYSTEM=="usb", ATTRS{idVendor}=="0483", MODE="0666", GROUP="luminous"
      SUBSYSTEM=="hidraw", ATTRS{idVendor}=="0483", MODE="0666", GROUP="luminous"
      
      # EEG devices
      SUBSYSTEM=="usb", ATTRS{idVendor}=="1234", MODE="0666", GROUP="luminous"
    '';
  };
}