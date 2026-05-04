const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const requiredEnv = [
  'DISCORD_TOKEN',
  'CLIENT_ID',
  'ALANYS_ID',
  'AMORA_ID',
  'AMORA_ALT_ID',
];

function validateEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Variáveis ausentes no .env: ${missing.join(', ')}`);
  }
}

function getConfig() {
  validateEnv();
  return {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID || null,
    allowedUsers: new Set([
      process.env.ALANYS_ID,
      process.env.AMORA_ID,
      process.env.AMORA_ALT_ID,
    ]),
  };
}

module.exports = { getConfig };
