const { REST, Routes } = require('discord.js');
const { getConfig } = require('./config/env');
const alanysdayCommand = require('./commands/alanysday');

async function deploy() {
  const config = getConfig();
  const commands = [alanysdayCommand.data.toJSON()];

  const rest = new REST({ version: '10' }).setToken(config.token);
  const route = config.guildId
    ? Routes.applicationGuildCommands(config.clientId, config.guildId)
    : Routes.applicationCommands(config.clientId);

  await rest.put(route, { body: commands });
  console.log(`✅ Comando /check registrado (${config.guildId ? 'guild' : 'global'}).`);
}

deploy().catch((error) => {
  console.error('Erro ao registrar comandos:', error);
  process.exitCode = 1;
});
