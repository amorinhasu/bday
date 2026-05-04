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
    content: 'sabia que você ia lembrar. 🌊 esse lugar diz muito sobre você — vamos continuar 💖',
    ephemeral: true,
  });

  if (interaction.channel) {
    await interaction.channel.send({
      embeds: [buildHomeEmbed()],
      components: [buildStartRow()],
    });
  }
}

async function handleComponent(interaction, config) {
  if (!canAccess(interaction.user.id, config.allowedUsers)) {
    await interaction.reply({ embeds: [buildPrivateOnlyEmbed()], ephemeral: true });
    return;
  }

  const state = getProgress(interaction.user.id);

  if (!state.passwordValidated) {
    await interaction.reply({ content: 'antes de começar, confirme a senha pelo /check 💫', ephemeral: true });
    return;
  }

  if (interaction.customId === IDS.START) {
    state.phase = 1;
    const phase = phases.find((p) => p.id === 1);
    await interaction.reply({ embeds: [buildPhaseEmbed(phase)], components: [buildNextPhaseRow(false)] });
    return;
  }

  if (interaction.customId === IDS.NEXT) {
    const current = phases.find((p) => p.id === state.phase);
    if (!current) {
      await interaction.reply({ content: 'nenhuma fase ativa. use /check novamente.', ephemeral: true });
      return;
    }

    const nextPhaseId = state.phase + 1;
    const next = phases.find((p) => p.id === nextPhaseId);

    if (!next) {
      await interaction.reply({ content: 'você já concluiu todas as fases 🎉', ephemeral: true });
      return;
    }

    state.phase = nextPhaseId;

    if (next.quiz) {
      await interaction.reply({
        embeds: [buildPhaseEmbed(next)],
        components: [buildQuizRow(next.quiz)],
      });
      return;
    }

    const isLast = next.id >= phases.length;
    const buttonLabel = next.id === phases.length - 1 ? 'celebrar o dia dela' : 'próxima fase';

    await interaction.reply({
      embeds: [buildPhaseEmbed(next)],
      components: [buildNextPhaseRow(isLast, buttonLabel)],
    });
    return;
  }

  if (interaction.customId === IDS.QUIZ) {
    const quizPhase = phases.find((p) => p.id === state.phase);
    if (!quizPhase || !quizPhase.quiz) {
      await interaction.reply({ content: 'quiz indisponível nesta fase.', ephemeral: true });
      return;
    }

    const answer = interaction.values?.[0];
    const correct = answer === quizPhase.quiz.correctOptionId;

    if (!correct) {
      await interaction.reply({ content: 'resposta incorreta. tente novamente 💭', ephemeral: true });
      return;
    }

    state.quizPassed = true;
    await interaction.reply({
      content: '✨ resposta certa! fase desbloqueada.',
      embeds: [buildPhaseEmbed(quizPhase)],
      components: [buildNextPhaseRow(false)],
    });
  }
}

module.exports = {
  data: new SlashCommandBuilder().setName('check').setDescription('abre a confirmação privada do alanysday.'),
  execute,
  handleComponent,
  handlePasswordModal,
};
