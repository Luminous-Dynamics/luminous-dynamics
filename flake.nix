{
  description = "Luminous-Dynamics Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };
        
        # Define Node.js version
        nodejs = pkgs.nodejs_20;
        
        # Common development tools
        commonTools = with pkgs; [
          # Version control
          git
          git-lfs
          gh
          
          # JavaScript/Node
          nodejs
          nodePackages.pnpm
          nodePackages.yarn
          
          # Database tools
          postgresql_15
          redis
          sqlite
          
          # Development utilities
          jq
          ripgrep
          fd
          bat
          eza
          httpie
          
          # Container tools
          docker-compose
          
          # Process management
          hivemind
          overmind
          
          # Nix tools
          nil # Nix LSP
          nixpkgs-fmt
          deadnix
          statix
        ];
        
        # Rust development for luminous-os
        rustTools = pkgs.rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" "rust-analyzer" ];
        };
        
      in
      {
        devShells = {
          default = pkgs.mkShell {
            buildInputs = commonTools ++ [ rustTools ];
            
            shellHook = ''
              echo "🌟 Luminous-Dynamics Development Environment"
              echo "📦 Node.js: ${nodejs.version}"
              echo "🦀 Rust: $(rustc --version)"
              echo "❄️  Nix: $(nix --version)"
              echo ""
              
              # Set up project root
              export LUMINOUS_ROOT="$PWD"
              
              # Add local node_modules/.bin to PATH
              export PATH="$LUMINOUS_ROOT/node_modules/.bin:$PATH"
              
              # PostgreSQL setup
              export PGDATA="$LUMINOUS_ROOT/.postgres"
              export PGHOST="$PGDATA"
              export PGDATABASE="luminous_dev"
              export PGUSER="luminous"
              
              # Create Procfile for process management
              if [ ! -f Procfile ]; then
                cat > Procfile << 'EOF'
              sacred: cd sacred-core && npm start
              weave: cd the-weave && npm start
              postgres: postgres -D $PGDATA
              redis: redis-server --dir $LUMINOUS_ROOT/.redis
              EOF
              fi
              
              # Initialize PostgreSQL if needed
              if [ ! -d "$PGDATA" ]; then
                echo "Initializing PostgreSQL..."
                initdb --auth=trust --username=$PGUSER
                pg_ctl start -l $PGDATA/postgres.log
                createdb $PGDATABASE
                pg_ctl stop
              fi
              
              # Create helper functions
              lum-start() {
                echo "Starting services with overmind..."
                overmind start
              }
              
              lum-status() {
                overmind connect
              }
              
              lum-stop() {
                overmind quit
              }
              
              echo "Commands:"
              echo "  lum-start  - Start all services"
              echo "  lum-status - Connect to overmind"
              echo "  lum-stop   - Stop all services"
              echo ""
              echo "🌊 We flow with Nix!"
            '';
          };
          
          # Specialized shells
          node = pkgs.mkShell {
            buildInputs = with pkgs; [
              nodejs
              nodePackages.pnpm
              nodePackages.npm-check-updates
              nodePackages.eslint
              nodePackages.prettier
            ];
          };
          
          rust = pkgs.mkShell {
            buildInputs = [ rustTools ] ++ (with pkgs; [
              pkg-config
              openssl
              cargo-watch
              cargo-edit
              cargo-audit
            ]);
          };
        };
        
        # NixOS module for system-wide Luminous development
        nixosModules.luminous-dev = { config, lib, pkgs, ... }: {
          options.services.luminous-dev = {
            enable = lib.mkEnableOption "Luminous-Dynamics development environment";
          };
          
          config = lib.mkIf config.services.luminous-dev.enable {
            # System-wide packages
            environment.systemPackages = commonTools;
            
            # Development group
            users.groups.luminous-dev = {};
            
            # PostgreSQL service
            services.postgresql = {
              enable = true;
              package = pkgs.postgresql_15;
              ensureDatabases = [ "luminous_dev" ];
              ensureUsers = [{
                name = "luminous";
                ensurePermissions = {
                  "DATABASE luminous_dev" = "ALL PRIVILEGES";
                };
              }];
            };
            
            # Redis service
            services.redis.servers.luminous = {
              enable = true;
              port = 6379;
            };
          };
        };
        
        # Development scripts as Nix packages
        packages = {
          luminous-dev = pkgs.writeShellScriptBin "luminous-dev" ''
            #!/usr/bin/env bash
            cd ${toString ./.}
            nix develop
          '';
          
          luminous-update = pkgs.writeShellScriptBin "luminous-update" ''
            #!/usr/bin/env bash
            cd ${toString ./.}
            nix flake update
          '';
        };
      });
}