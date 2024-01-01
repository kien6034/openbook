export SHELL:=/bin/bash
.PHONY: install-deps gen-wallet set-cluster-url show-network-config

export RENEC_TESTNET_URL:= https://api-testnet.renec.foundation:8899/
export RENEC_MAINNET_URL:= https://api-mainnet-beta.renec.foundation:8899/
export RENEC_LOCALNET_URL:= http://127.0.0.1:8899
export PATH:=$(HOME)/.local/share/solana/install/active_release/bin:$(PATH)

CLUSTER ?= testnet

export CLUSTER_URL := $(if $(filter testnet,$(CLUSTER)),$(RENEC_TESTNET_URL),\
                 $(if $(filter mainnet,$(CLUSTER)),$(RENEC_MAINNET_URL),\
                 $(if $(filter localnet,$(CLUSTER)),$(RENEC_LOCALNET_URL),\
                 $(error Unknown cluster name: $(CLUSTER)))))

export CLI_VERSION := $(if $(filter testnet,$(CLUSTER)),1.13.6,$(if $(filter mainnet,$(CLUSTER)),1.13.6,$(if $(filter localnet,$(CLUSTER)),1.13.6,$(error Unknown cluster name: $(CLUSTER)))))

show-network-config:
	@echo "interacting with cluster: $(CLUSTER_URL), CLI_VERSION: $(CLI_VERSION)"


localnet:
	@$(MAKE) install-deps CLI_VERSION=1.13.6
	solana-test-validator --reset 

build-dex: 
	@$(MAKE) install-deps CLI_VERSION=1.14.6 ANCHOR_VERSION=0.25.0
	cd dex/
	cargo build-bpf


deploy:
	@$(MAKE) install-deps CLI_VERSION=1.14.6 ANCHOR_VERSION=0.25.0


	solana program deploy dex/target/deploy/serum_dex.so --keypair ~/.config/solana/id.json --url $(CLUSTER_URL)

