const { promises } = require('fs');
const path = require('path');

module.exports = class FunctionLoader {
  constructor(client) {
    this.client = client;
    this.functions = new Map();
  }

  async call() {
    try {
      await this.loadFunctions(path.join(__dirname, '../functions'));

      this.client.functions = this.functions;

      console.log(
        `\x1b[34m[FUNCTIONS]\x1b[0m`,
        `Funções carregadas com sucesso.`
      );
    } catch (error) {
      console.error('Erro ao carregar as funções:', error);
    }
  }

  async loadFunctions(dir) {
    const files = await promises.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) await this.loadFunctions(fullPath);
      else if (file.name.endsWith('.js')) {
        const FunctionClass = require(fullPath);
        const functionInstance = new FunctionClass(this.client);

        const functionName = path.basename(file.name, '.js');
        this.functions.set(functionName, functionInstance);
      }
    }
  }
};
