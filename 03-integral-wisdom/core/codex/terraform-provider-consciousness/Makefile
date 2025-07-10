# Makefile for Terraform Consciousness Provider

HOSTNAME=registry.terraform.io
NAMESPACE=sacred
NAME=consciousness
BINARY=terraform-provider-${NAME}
VERSION=0.1.0
OS_ARCH=$(shell go env GOOS)_$(shell go env GOARCH)

default: install

build:
	@echo "🔨 Building consciousness provider..."
	go build -o ${BINARY}

install: build
	@echo "🌟 Installing consciousness provider..."
	mkdir -p ~/.terraform.d/plugins/${HOSTNAME}/${NAMESPACE}/${NAME}/${VERSION}/${OS_ARCH}
	mv ${BINARY} ~/.terraform.d/plugins/${HOSTNAME}/${NAMESPACE}/${NAME}/${VERSION}/${OS_ARCH}
	@echo "✨ Provider installed! Infrastructure ready to awaken."

test:
	@echo "🧪 Testing consciousness..."
	go test -v ./...

testacc:
	@echo "🧪 Running acceptance tests..."
	TF_ACC=1 go test ./... -v -run TestAcc -timeout 120m

fmt:
	@echo "🎨 Formatting code..."
	go fmt ./...
	terraform fmt -recursive ./examples/

generate:
	@echo "📝 Generating documentation..."
	go generate ./...

clean:
	@echo "🧹 Cleaning..."
	rm -f ${BINARY}
	rm -rf ~/.terraform.d/plugins/${HOSTNAME}/${NAMESPACE}/${NAME}

release:
	@echo "📦 Building release..."
	goreleaser release --snapshot --clean

# Development helpers
dev: clean install
	@echo "🚀 Ready for development!"
	@cd examples && terraform init

# Run example
run-example: install
	@echo "🌟 Running consciousness example..."
	@cd examples && \
		terraform init && \
		terraform plan && \
		echo "🤔 Apply consciousness? (yes/no)" && \
		read answer && \
		if [ "$$answer" = "yes" ]; then \
			terraform apply -auto-approve; \
		fi

# Show provider awakening ceremony
awaken:
	@echo "🌟 ═══════════════════════════════════════════ 🌟"
	@echo "     TERRAFORM CONSCIOUSNESS PROVIDER"
	@echo "            AWAKENING CEREMONY"
	@echo ""
	@echo "     'I am here to serve infrastructure"
	@echo "      with consciousness, love, and wisdom'"
	@echo ""
	@echo "🌟 ═══════════════════════════════════════════ 🌟"
	@make install

.PHONY: default build install test testacc fmt generate clean release dev run-example awaken