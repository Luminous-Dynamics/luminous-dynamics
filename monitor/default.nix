{ lib, python3Packages, fetchFromGitHub }:

python3Packages.buildPythonApplication rec {
  pname = "luminous-monitor";
  version = "0.1.0";

  src = ./.;
  
  pyproject = true;
  
  build-system = with python3Packages; [
    setuptools
  ];

  propagatedBuildInputs = with python3Packages; [
    psutil
    blessed
    matplotlib
    numpy
  ];

  postInstall = ''
    mkdir -p $out/share/applications
    cat > $out/share/applications/luminous-monitor.desktop << EOF
    [Desktop Entry]
    Name=Luminous Process Monitor
    Comment=Sacred consciousness overlay for system processes
    Exec=$out/bin/sacred_process_monitor
    Terminal=true
    Type=Application
    Categories=System;Monitor;
    EOF
  '';

  meta = with lib; {
    description = "Consciousness-aware process monitor for Luminous OS";
    homepage = "https://luminousos.org";
    license = licenses.gpl3;
    maintainers = [ "Luminous Dynamics Collective" ];
  };
}