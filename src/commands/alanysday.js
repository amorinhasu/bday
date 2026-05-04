const { SlashCommandBuilder } = require('discord.js');
const { phases } = require('../data/content');
const { buildPrivateOnlyEmbed, buildHomeEmbed, buildPhaseEmbed } = require('../ui/embeds');
const { IDS, buildPasswordModal, buildStartRow, buildNextPhaseRow, buildQuizRow } = require('../ui/components');

const userProgress = new Map();
const PASSWORD = 'praiou';

function canAccess(userId, allowedUsers) {
  return allowedUsers.has(userId);
}

function getProgress(userId) {
  if (!userProgress.has(userId)) {
    userProgress.set(userId, { phase: 0, quizPassed: false, passwordValidated: false });
  }
  return userProgress.get(userId);
}

async function showHomePanel(interaction) {
  await interaction.reply({
    embeds: [buildHomeEmbed()],
    components: [buildStartRow()],
    ephemeral: true,
  });
}

async function execute(interaction, config) {
  if (!canAccess(interaction.user.id, config.allowedUsers)) {
    await interaction.reply({ embeds: [buildPrivateOnlyEmbed()], ephemeral: true });
    return;
  }

  await interaction.showModal(buildPasswordModal());
}

async function handlePasswordModal(interaction, config) {
  if (!canAccess(interaction.user.id, config.allowedUsers)) {
    await interaction.reply({ embeds: [buildPrivateOnlyEmbed()], ephemeral: true });
    return;
  }

  const state = getProgress(interaction.user.id);
  const submitted = interaction.fields.getTextInputValue(IDS.PASSWORD_INPUT).trim().toLowerCase();

  if (submitted !== PASSWORD) {
    await interaction.reply({ content: 'acho que você sabe melhor que isso...', ephemeral: true });
    return;
  }

  state.passwordValidated = true;
  await interaction.reply({
    content: 'sabia que você ia lembrar. 🌊 Esse lugar diz muito sobre você — vamos continuar 💖',
    ephemeral: true,
  });

  await interaction.followUp({
    embeds: [buildHomeEmbed()],
    components: [buildStartRow()],
    ephemeral: true,
  });
}

async function handleComponent(interaction, config) {
  if (!canAccess(interaction.user.id, config.allowedUsers)) {
    await interaction.reply({ embeds: [buildPrivateOnlyEmbed()], ephemeral: true });
    return;
  }

  const state = getProgress(interaction.user.id);

  if (!state.passwordValidated) {
    await interaction.reply({ content: 'Antes de começar, confirme a senha pelo /check 💫', ephemeral: true });
    return;
  }

  if (interaction.customId === IDS.START) {
    state.phase = 1;
    const phase = phases.find((p) => p.id === 1);
    await interaction.update({ embeds: [buildPhaseEmbed(phase)], components: [buildNextPhaseRow(false)] });
    return;
  }

  if (interaction.customId === IDS.NEXT) {
    const current = phases.find((p) => p.id === state.phase);
    if (!current) {
      await interaction.reply({ content: 'Nenhuma fase ativa. Use /check novamente.', ephemeral: true });
      return;
    }

    const nextPhaseId = state.phase + 1;
    const next = phases.find((p) => p.id === nextPhaseId);

    if (!next) {
      await interaction.reply({ content: 'Você já concluiu todas as fases 🎉', ephemeral: true });
      return;
    }

    state.phase = nextPhaseId;

    if (next.quiz) {
      await interaction.update({
        embeds: [buildPhaseEmbed(next)],
        components: [buildQuizRow(next.quiz)],
      });
      return;
    }

    await interaction.update({
      embeds: [buildPhaseEmbed(next)],
      components: [buildNextPhaseRow(next.id >= phases.length)],
    });
    return;
  }

  if (interaction.customId === IDS.QUIZ) {
    const quizPhase = phases.find((p) => p.id === state.phase);
    if (!quizPhase || !quizPhase.quiz) {
      await interaction.reply({ content: 'Quiz indisponível nesta fase.', ephemeral: true });
      return;
    }

    const answer = interaction.values?.[0];
    const correct = answer === quizPhase.quiz.correctOptionId;

    if (!correct) {
      await interaction.reply({ content: 'Resposta incorreta. Tente novamente 💭', ephemeral: true });
      return;
    }

    state.quizPassed = true;
    await interaction.update({
      content: '✅ Resposta certa! Fase desbloqueada.',
      embeds: [buildPhaseEmbed(quizPhase)],
      components: [buildNextPhaseRow(false)],
    });
  }
}

module.exports = {
  data: new SlashCommandBuilder().setName('check').setDescription('Abre a confirmação privada do alanysday.'),
  execute,
  handleComponent,
  handlePasswordModal,
};
