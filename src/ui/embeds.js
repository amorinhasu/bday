const { EmbedBuilder } = require('discord.js');

function buildPrivateOnlyEmbed() {
  return new EmbedBuilder()
    .setColor(0x8b5cf6)
    .setTitle('🔒 Área privada do alanysday')
    .setDescription('Este presente é privado e só pode ser usado por Alanys e Amora.');
}

function buildHomeEmbed() {
  return new EmbedBuilder()
    .setColor(0xec4899)
    .setTitle('🎂 alanysday')
    .setDescription([
      'Um presente especial da **Amora** para **Alanys** 💝',
      '',
      'Clique em **Começar Jornada** para abrir a primeira fase.',
    ].join('\n'))
    .setFooter({ text: 'Comando oficial: /check' });
}

function buildPhaseEmbed(phase) {
  const base = new EmbedBuilder()
    .setColor(0x06b6d4)
    .setTitle(`🧩 ${phase.title}`)
    .setDescription(phase.description || 'Sem descrição nesta fase.');

  if (phase.photos && phase.photos.length > 0) {
    base.setImage(phase.photos[0]);

    if (phase.photos.length > 1) {
      base.addFields({
        name: '🖼️ Mais imagens desta fase',
        value: phase.photos.slice(1).map((url, idx) => `${idx + 2}. ${url}`).join('\n').slice(0, 1024),
      });
    }
  }

  if (phase.links) {
    const blocks = [
      ['🎵 Playlists', phase.links.playlist],
      ['🎬 Vídeos', phase.links.videos],
      ['🍿 Filmes', phase.links.movies],
    ];

    for (const [name, items] of blocks) {
      if (Array.isArray(items) && items.length > 0) {
        base.addFields({
          name,
          value: items.map((url, idx) => `${idx + 1}. ${url}`).join('\n').slice(0, 1024),
        });
      }
    }
  }

  return base;
}

module.exports = {
  buildPrivateOnlyEmbed,
  buildHomeEmbed,
  buildPhaseEmbed,
};
