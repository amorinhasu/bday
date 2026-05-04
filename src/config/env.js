const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function listMissing(requiredKeys) {
  return requiredKeys.filter((key) => !process.env[key]);
}

function validateEnv(requiredKeys, contextLabel) {
  const missing = listMissing(requiredKeys);
  if (missing.length > 0) {
    throw new Error(`Variáveis ausentes para ${contextLabel}: ${missing.join(', ')}`);
  }
}

function getRuntimeConfig() {
  validateEnv(['DISCORD_TOKEN', 'ALANYS_ID', 'AMORA_ID', 'AMORA_ALT_ID'], 'iniciar o bot');

  return {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID || null,
    guildId: process.env.GUILD_ID || null,
    allowedUsers: new Set([process.env.ALANYS_ID, process.env.AMORA_ID, process.env.AMORA_ALT_ID]),
  };
}

function getDeployConfig() {
  validateEnv(['DISCORD_TOKEN', 'CLIENT_ID'], 'registrar comandos');

  return {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID || null,
  };
}

module.exports = { getRuntimeConfig, getDeployConfig };
