module.exports = class Ready {
  constructor(client) {
    this.client = client;
  }

  async ON() {
    await this.Status();

    await this.client.user.setStatus('online');

    setTimeout(async () => {
      console.log(
        `\x1b[34m[SLASH]\x1b[0m`,
        `Slashs successfully loaded and registered.`
      );

      console.log(
        `\x1b[34m[ARCODE]\x1b[0m`,
        `Client turned on and operational.`
      );
    }, 3000);
  }

  async Status() {
    let size = 0;

    const status = ['Fique de olho nos anuncios do servidor! 😉'];

    const setStatus = async () => {
      await this.client.user.setActivity(status[size]);

      size++;

      if (size >= status.length) size = 0;
    };

    await setStatus();

    setInterval(async () => await setStatus(), 45000);
  }
};
