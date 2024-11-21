import { ApplicationIntegrationType, SlashCommandBuilder } from 'discord.js';

new SlashCommandBuilder()
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])