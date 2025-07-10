{ lib, stdenv, kernel }:

stdenv.mkDerivation rec {
  pname = "luminous-kernel-module";
  version = "1.0.0";

  src = ./.;

  nativeBuildInputs = kernel.moduleBuildDependencies;
  
  makeFlags = [
    "KDIR=${kernel.dev}/lib/modules/${kernel.modDirVersion}/build"
  ];

  installPhase = ''
    mkdir -p $out/lib/modules/${kernel.modDirVersion}/misc
    cp luminous_kernel.ko $out/lib/modules/${kernel.modDirVersion}/misc/
  '';

  meta = with lib; {
    description = "Consciousness-aware scheduling kernel module for LuminousOS";
    license = licenses.gpl3;
    maintainers = [ "Luminous Dynamics Collective" ];
    platforms = platforms.linux;
  };
}