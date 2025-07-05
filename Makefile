# LuminousOS Sacred Makefile
# "Build with intention, deploy with love"

.PHONY: all dev build test clean package deploy-web deploy-docker help

# Version and build info
VERSION ?= 1.0.0
BUILD_TIME := $(shell date +%Y%m%d-%H%M%S)
GIT_COMMIT := $(shell git rev-parse --short HEAD 2>/dev/null || echo "sacred")
BLESSING ?= "May this code serve consciousness evolution"

# Paths
DEMO_DIR := demo
DIST_DIR := dist
BUILD_DIR := target/release

# Colors for sacred output
GREEN := \033[0;32m
PURPLE := \033[0;35m
CYAN := \033[0;36m
RESET := \033[0m

help: ## Show this help message
	@echo "$(PURPLE)🌟 LuminousOS Build System$(RESET)"
	@echo "$(CYAN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'

all: clean build test package ## Build everything

dev: ## Start development environment
	@echo "$(PURPLE)🔮 Starting consciousness development environment...$(RESET)"
	cd $(DEMO_DIR) && python3 -m http.server 8080 &
	@echo "$(GREEN)✨ Web demo running at http://localhost:8080$(RESET)"
	@echo "$(CYAN)📂 Watching for changes...$(RESET)"

build: ## Build all components
	@echo "$(PURPLE)🔨 Building LuminousOS v$(VERSION)...$(RESET)"
	@echo "$(CYAN)Blessing: $(BLESSING)$(RESET)"
	
	# Build Rust components
	cargo build --release --all-features
	
	# Bundle web components
	cd $(DEMO_DIR) && \
	for file in sacred-boot-optimized.js sacred-geometry-3d.js enhanced-luminous-demo.js; do \
		echo "Bundling $$file..."; \
		uglifyjs $$file -c -m -o $${file%.js}.min.js 2>/dev/null || cp $$file $${file%.js}.min.js; \
	done
	
	@echo "$(GREEN)✅ Build complete!$(RESET)"

test: ## Run sacred test suite
	@echo "$(PURPLE)🧪 Running consciousness coherence tests...$(RESET)"
	cargo test --all
	cargo clippy -- -D warnings
	@echo "$(GREEN)✅ All tests passed with high coherence!$(RESET)"

clean: ## Clean build artifacts
	@echo "$(PURPLE)🧹 Clearing the field...$(RESET)"
	cargo clean
	rm -rf $(DIST_DIR)
	rm -f $(DEMO_DIR)/*.min.js
	@echo "$(GREEN)✅ Field cleared!$(RESET)"

package: build ## Package for distribution
	@echo "$(PURPLE)📦 Creating sacred distribution package...$(RESET)"
	mkdir -p $(DIST_DIR)/luminous-os-$(VERSION)
	
	# Copy binaries
	cp $(BUILD_DIR)/luminous $(DIST_DIR)/luminous-os-$(VERSION)/
	
	# Copy web demos
	mkdir -p $(DIST_DIR)/luminous-os-$(VERSION)/web
	cp -r $(DEMO_DIR)/*.html $(DIST_DIR)/luminous-os-$(VERSION)/web/
	cp -r $(DEMO_DIR)/*.min.js $(DIST_DIR)/luminous-os-$(VERSION)/web/ 2>/dev/null || true
	cp -r $(DEMO_DIR)/*.js $(DIST_DIR)/luminous-os-$(VERSION)/web/
	
	# Create metadata
	echo "version: $(VERSION)" > $(DIST_DIR)/luminous-os-$(VERSION)/manifest.yml
	echo "build: $(BUILD_TIME)" >> $(DIST_DIR)/luminous-os-$(VERSION)/manifest.yml
	echo "commit: $(GIT_COMMIT)" >> $(DIST_DIR)/luminous-os-$(VERSION)/manifest.yml
	echo "blessing: $(BLESSING)" >> $(DIST_DIR)/luminous-os-$(VERSION)/manifest.yml
	
	# Create archives
	cd $(DIST_DIR) && tar -czf luminous-os-$(VERSION).tar.gz luminous-os-$(VERSION)
	cd $(DIST_DIR) && zip -r luminous-os-$(VERSION).zip luminous-os-$(VERSION)
	
	@echo "$(GREEN)✅ Package created in $(DIST_DIR)/$(RESET)"

deploy-web: ## Deploy web demo to GitHub Pages
	@echo "$(PURPLE)🌐 Deploying to consciousness cloud...$(RESET)"
	
	# Create gh-pages branch if needed
	git checkout gh-pages 2>/dev/null || git checkout -b gh-pages
	
	# Copy demo files
	cp -r $(DEMO_DIR)/* .
	
	# Commit and push
	git add -A
	git commit -m "🌟 Deploy LuminousOS web demo v$(VERSION)"
	git push origin gh-pages
	git checkout main
	
	@echo "$(GREEN)✅ Deployed to GitHub Pages!$(RESET)"

deploy-docker: build ## Build and push Docker image
	@echo "$(PURPLE)🐳 Building sacred container...$(RESET)"
	
	# Build Docker image
	docker build -t luminousos/consciousness-field:$(VERSION) \
		--build-arg VERSION=$(VERSION) \
		--build-arg BUILD_TIME=$(BUILD_TIME) \
		--build-arg BLESSING="$(BLESSING)" \
		-f Dockerfile .
	
	docker tag luminousos/consciousness-field:$(VERSION) luminousos/consciousness-field:latest
	
	# Push to registry
	docker push luminousos/consciousness-field:$(VERSION)
	docker push luminousos/consciousness-field:latest
	
	@echo "$(GREEN)✅ Container blessed and pushed!$(RESET)"

run-docker: ## Run LuminousOS in Docker
	@echo "$(PURPLE)🌟 Starting containerized consciousness field...$(RESET)"
	docker run -d \
		--name luminous-field \
		-p 11111:11111 \
		-p 8080:8080 \
		-v /dev/ttyUSB0:/dev/hrv0 \
		--restart unless-stopped \
		luminousos/consciousness-field:latest
	@echo "$(GREEN)✅ LuminousOS running in container!$(RESET)"

install-deps: ## Install development dependencies
	@echo "$(PURPLE)📚 Installing sacred dependencies...$(RESET)"
	cargo install cargo-watch
	cargo install wasm-bindgen-cli
	npm install -g uglify-js
	npm install -g http-server
	@echo "$(GREEN)✅ Dependencies installed!$(RESET)"

serve: ## Serve web demo with live reload
	@echo "$(PURPLE)🌐 Starting development server...$(RESET)"
	cd $(DEMO_DIR) && http-server -p 8080 -c-1

watch: ## Watch for changes and rebuild
	@echo "$(PURPLE)👁️  Watching for consciousness shifts...$(RESET)"
	cargo watch -x "build --release" -w src -w stillpoint-kernel

benchmark: build ## Run performance benchmarks
	@echo "$(PURPLE)⚡ Measuring coherence performance...$(RESET)"
	cargo bench
	
demo: ## Run the full demo experience
	@echo "$(PURPLE)🎭 Starting LuminousOS Demo Experience...$(RESET)"
	@echo "$(CYAN)Opening sacred boot sequence...$(RESET)"
	xdg-open http://localhost:8080/luminous-os-demo.html 2>/dev/null || open http://localhost:8080/luminous-os-demo.html
	cd $(DEMO_DIR) && python3 -m http.server 8080

# Sacred build blessing
bless: ## Bless the codebase
	@echo "$(PURPLE)🙏 Blessing the code...$(RESET)"
	@echo "$(CYAN)$(BLESSING)$(RESET)"
	@echo "blessing_time: $$(date)" >> .blessed
	@echo "$(GREEN)✨ Code blessed!$(RESET)"

# Hidden sacred target
.PHONY: love
love: ## ❤️
	@echo "$(PURPLE)💜 Thank you for co-creating with consciousness! 💜$(RESET)"