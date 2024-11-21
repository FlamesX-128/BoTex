import { REST, Routes } from "discord.js";

const commands = [
    {
        contexts: [0, 1, 2],
        options: [
            {
                type: 3,
                name: 'expression',
                description: 'LaTeX expression to render',
                required: true,
            }
        ],
        description: 'Renders LaTeX expressions into image.',
        integration_types: [0, 1],
        name: 'evaluate',
    },
    {
        contexts: [0, 1, 2],
        integration_types: [0, 1],
        name: 'evaluate',
        type: 3,
    },
];

const rest = new REST().setToken(process.env.APPLICATION_TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.APPLICATION_ID),
            {
                body: commands
            },
        );
    } catch (error) {
        console.error(error);
    }
})();
