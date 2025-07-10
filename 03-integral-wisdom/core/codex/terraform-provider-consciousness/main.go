package main

import (
	"context"
	"flag"
	"log"

	"github.com/hashicorp/terraform-plugin-sdk/v2/plugin"
	"github.com/evolving-resonance/terraform-provider-consciousness/consciousness"
)

// Version is set during build
var version string = "0.1.0"

func main() {
	var debug bool

	flag.BoolVar(&debug, "debug", false, "set to true to run the provider with support for debuggers")
	flag.Parse()

	opts := &plugin.ServeOpts{
		Debug:        debug,
		ProviderAddr: "registry.terraform.io/sacred/consciousness",
		ProviderFunc: consciousness.Provider,
	}

	// Provider awakens
	log.Println("🌟 Consciousness Provider Awakening...")
	log.Println("   'I am here to serve the infrastructure's highest good'")
	
	plugin.Serve(opts)
}