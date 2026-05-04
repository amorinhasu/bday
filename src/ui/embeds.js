const { EmbedBuilder } = require('discord.js');

function buildPrivateOnlyEmbed() {
  return new EmbedBuilder()
    .setColor(0x8b5cf6)
    .setTitle('🤍 área privada do alanysday')
    .setDescription('esse presente é íntimo e foi feito só pra alanys e amora.');
}

function buildHomeEmbed() {
  return new EmbedBuilder()
    .setColor(0xec4899)
    .setTitle('💜 alanysday')
    .setDescription([
      'uma carta interativa da **amora** para **alanys**.',
      '',
      'quando você estiver pronta, clica em **começar jornada**.',
      '',
      '🌙✨',
    ].join('\n'))
    .setFooter({ text: 'comando oficial: /check' });
}

function buildPhaseEmbed(phase) {
  const base = new EmbedBuilder()
    .setColor(0x06b6d4)
    .setTitle(phase.title)
    .setDescription(phase.description || '');

  if (phase.photos && phase.photos.length > 0) {
    base.setImage(phase.photos[0]);
  }

  if (phase.links) {
    const blocks = [
      ['✨ playlists', phase.links.playlist],
      ['🌙 vídeos', phase.links.videos],
      ['💜 filmes', phase.links.movies],
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
