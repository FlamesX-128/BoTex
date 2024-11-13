const { Client, IntentsBitField } = require("discord.js");

const katex = require('./tools/katex.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.Guilds,
    ]
});

client.on("ready", (client) => {
    console.log(`The application ${client.user.tag} is online.`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    try {
        switch (interaction.commandName) {
            case "evaluate": {
                try {
                    const expression = interaction.options.getString('expression');
                    const image = await katex.render(expression);

                    await interaction.reply({
                        files: [{ attachment: image, name: "latex.png" }]
                    });
                } catch (error) {
                    await interaction.reply(`${error.name}: ${error.message}`);
                }
            }
                break;
        }
    } catch (error) {
        console.log(`${error.name}: ${error.message}`);
    }
});

client.login(process.env.APPLICATION_TOKEN);
