.PHONY: up build

MAKEFLAGS += --silent
NODE_PACKAGE_MANAGER := npm

up: build
	docker compose up -d

build_svelte:
	$(NODE_PACKAGE_MANAGER) run build

build_docker:
	docker compose build

build: build_svelte build_docker

local_dev:
	$(NODE_PACKAGE_MANAGER) run dev

local_preview: build_svelte
	$(NODE_PACKAGE_MANAGER) run preview --host