# Caminhos
SERVER_DIR=server
CLIENT_DIR=client

.PHONY: all transpile transpile-server transpile-client docker-build up clean

# Comando padrão ao rodar apenas `make`
all: up

# Transpila os projetos
transpile: transpile-server transpile-client

transpile-server:
	cd $(SERVER_DIR) && \
	. ~/.nvm/nvm.sh && \
	nvm install && \
	nvm use && \
	npm install && \
	npx prisma generate && \
	npm run build && \
	npm run test

transpile-client:
	cd $(CLIENT_DIR) && \
	. ~/.nvm/nvm.sh && \
	nvm install && \
	nvm use && \
	npm install && \
	npm run build

# Builda as imagens
docker-build: transpile
	docker-compose build

# Sobe tudo (transpile + docker build + up)
up: docker-build
	docker-compose up

# Limpa os dist
clean:
	rm -rf $(SERVER_DIR)/dist
	rm -rf $(CLIENT_DIR)/dist

stop:
	docker-compose down