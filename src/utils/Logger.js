const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.baseDir = path.resolve(__dirname, '../../logs');
    this.ensureDirectories();
  }

  ensureDirectories() {
    const dirs = ['messages', 'interactions', 'tickets', 'commands'];
    dirs.forEach(dir => {
      const dirPath = path.join(this.baseDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  formatTime(date = new Date()) {
    return date.toLocaleTimeString('pt-BR');
  }

  formatDate(date = new Date()) {
    return date.toLocaleDateString('pt-BR').replace(/\//g, '-');
  }

  async ensureFile(filePath) {
    try {
      await fs.promises.access(filePath);
    } catch {
      await fs.promises.writeFile(filePath, '');
    }
  }

  baseFormat(type, data) {
    const { author, content } = data;
    return [
      `👤 Autor: ${author.username} ( ${author.id} )`,
      `✉️ ${type}: ${content || 'Nenhum conteúdo'}`,
      `📆 Horário: ${this.formatTime()}`,
      '—'.repeat(50)
    ].join('\n');
  }

  async logMessage(message) {
    const logPath = path.join(this.baseDir, 'messages', `${this.formatDate()}.txt`);
    await this.ensureFile(logPath);

    const logContent = this.baseFormat('Mensagem', {
      author: message.author,
      content: message.content
    });

    await fs.promises.appendFile(logPath, `${logContent}\n`);
  }

  async logInteraction(interaction) {
    const logPath = path.join(this.baseDir, 'interactions', `${this.formatDate()}.txt`);
    await this.ensureFile(logPath);

    const logContent = this.baseFormat('Interação', {
      author: interaction.user,
      content: `Tipo: ${interaction.type} | ID: ${interaction.customId || interaction.commandName}`
    });

    await fs.promises.appendFile(logPath, `${logContent}\n`);
  }

  async logTicket(type, data) {
    const logPath = path.join(this.baseDir, 'tickets', `ticket-${data.ticketId}.txt`);
    await this.ensureFile(logPath);

    const now = new Date();
    const logContent = [
      `🎫 Ticket #${data.ticketId}`,
      `👤 Autor: ${data.author.username} ( ${data.author.id} )`,
      `📋 Tipo: ${type}`,
      `📆 Data: ${this.formatDate(now)} às ${this.formatTime(now)}`,
      `📝 Detalhes: ${data.details || 'Nenhum detalhe fornecido'}`,
      '—'.repeat(50)
    ].join('\n');

    await fs.promises.appendFile(logPath, `${logContent}\n`);
  }

  async logCommand(command, context, args) {
    const logPath = path.join(this.baseDir, 'commands', `${this.formatDate()}.txt`);
    await this.ensureFile(logPath);

    const logContent = [
      `⌨️ Comando: ${command.name}`,
      `👤 Autor: ${context.author.username} ( ${context.author.id} )`,
      `💬 Servidor: ${context.guild?.name || 'DM'} ( ${context.guild?.id || 'N/A'} )`,
      `📝 Argumentos: ${args.join(' ') || 'Nenhum'}`,
      `📆 Horário: ${this.formatTime()}`,
      '—'.repeat(50)
    ].join('\n');

    await fs.promises.appendFile(logPath, `${logContent}\n`);
  }
}

module.exports = new Logger();
