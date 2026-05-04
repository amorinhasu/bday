const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

const IDS = {
  PASSWORD_MODAL: 'alanysday:password-modal',
  PASSWORD_INPUT: 'alanysday:password-input',
  START: 'alanysday:start',
  NEXT: 'alanysday:next',
  QUIZ: 'alanysday:quiz',
};

function buildPasswordModal() {
  const input = new TextInputBuilder()
    .setCustomId(IDS.PASSWORD_INPUT)
    .setLabel('Qual é a senha?')
    .setPlaceholder('Dica: lembra de um lugar especial...')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(30);

  return new ModalBuilder()
    .setCustomId(IDS.PASSWORD_MODAL)
    .setTitle('Confirmação especial')
    .addComponents(new ActionRowBuilder().addComponents(input));
}

function buildStartRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(IDS.START).setLabel('Começar Jornada').setStyle(ButtonStyle.Primary),
  );
}

function buildNextPhaseRow(disabled = false) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(IDS.NEXT)
      .setLabel('Próxima fase')
      .setStyle(ButtonStyle.Success)
      .setDisabled(disabled),
  );
}

function buildQuizRow(quiz) {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(IDS.QUIZ)
      .setPlaceholder('Escolha sua resposta')
      .addOptions(quiz.options.map((option) => ({ label: option.label, value: option.id }))),
  );
}

module.exports = { IDS, buildPasswordModal, buildStartRow, buildNextPhaseRow, buildQuizRow };
