const { REST, Routes } = require('discord.js');
const alanysdayCommand = require('./commands/alanysday');

async function registerCommands(config) {
  if (!config?.clientId) {
    console.warn('⚠️ CLIENT_ID não definido. Registro automático de /check ignorado.');
    return;
  }

  const commands = [alanysdayCommand.data.toJSON()];
  const rest = new REST({ version: '10' }).setToken(config.token);

  const route = config.guildId
    ? Routes.applicationGuildCommands(config.clientId, config.guildId)
    : Routes.applicationCommands(config.clientId);

  await rest.put(route, { body: commands });
  console.log(`✅ /check registrado automaticamente (${config.guildId ? 'guild' : 'global'}).`);
}

module.exports = { registerCommands };
