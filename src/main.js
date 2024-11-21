/**
 * @typedef {import("discord.js").ChatInputCommandInteraction} ChatInputCommandInteraction
 * @typedef {import("discord.js").MessageContextMenuCommandInteraction} MessageContextMenuCommandInteraction
 */

import { Client, IntentsBitField } from "discord.js";
import { render } from "./tools/katex.js";

const client = new Client({
    intents: [
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.Guilds,
    ],
});

client.on("ready", (client) => {
    console.log(`The application ${client.user.tag} is online.`);
});

client.on("interactionCreate", async (interaction) => {
    const start = Date.now();

    try {
        if (interaction.isChatInputCommand()) {
            await handleCommand(interaction);
        } else if (interaction.isMessageContextMenuCommand()) {
            await handleMessageCommand(interaction);
        }
    } catch (error) {
        console.log(`${error.name}: ${error.message}`);
    }

    const end = Date.now();

    console.log(
        `The ${interaction.commandName} command has completed within ${end - start}ms.`
    );
});

/**
 * Handles ChatInputCommand interactions.
 * @param {ChatInputCommandInteraction} interaction 
 */
async function handleCommand(interaction) {
    switch (interaction.commandName) {
        case "evaluate": {
            await processLatex(
                interaction, interaction.options.getString("expression") ?? ''
            );
        }
            break;
    }
}

/**
 * Handles MessageContextMenuCommand interactions.
 * @param {MessageContextMenuCommandInteraction} interaction 
 */
async function handleMessageCommand(interaction) {
    switch (interaction.commandName) {
        case "evaluate": {
            await processLatex(interaction, interaction.targetMessage.content);
        }
            break;
    }
}

/**
 * Processes LaTeX expression, renders it, and sends the result as an image.
 * @param {ChatInputCommandInteraction | MessageContextMenuCommandInteraction} interaction 
 * @param {string} expression 
 */
async function processLatex(interaction, expression) {
    try {
        const blockMatch = expression.match(/```(?:tex)?\n([\s\S]+?)\n```/);
        if (blockMatch) {
            expression = blockMatch[1];
        }

        const image = await render(expression);

        await interaction.reply({
            files: [{ attachment: image, name: "latex.png", }],
        });
    } catch (error) {
        await interaction.reply(`${error.name}: ${error.message}`);
    }
}

client.login(process.env.APPLICATION_TOKEN);
