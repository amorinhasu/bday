const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { getConfig } = require('./config/env');

const alanysdayCommand = require('./commands/alanysday');

const config = getConfig();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.commands.set(alanysdayCommand.data.name, alanysdayCommand);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ Bot online como ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction, config);
      return;
    }

    if (interaction.isModalSubmit() && interaction.customId === 'alanysday:password-modal') {
      await alanysdayCommand.handlePasswordModal(interaction, config);
      return;
    }

    if (interaction.isButton() || interaction.isStringSelectMenu()) {
      if (!interaction.customId.startsWith('alanysday:')) return;
      await alanysdayCommand.handleComponent(interaction, config);
    }
  } catch (error) {
    console.error('Erro ao processar interação:', error);

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: '⚠️ Ocorreu um erro inesperado.', ephemeral: true }).catch(() => null);
    } else {
      await interaction.reply({ content: '⚠️ Ocorreu um erro inesperado.', ephemeral: true }).catch(() => null);
    }
  }
});

client.login(config.token).catch((err) => {
  console.error('Falha ao autenticar o bot. Verifique DISCORD_TOKEN no .env.', err.message);
  process.exitCode = 1;
});
