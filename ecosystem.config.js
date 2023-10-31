module.exports = {
    apps: [
        {
            name: 'server',
            script: 'node',
            args: './js/server/main.js',
            cwd: `${__dirname}`,
        },
        {
            name: 'UI',
            script: 'npm',
            args: 'start',
            cwd: './js/UI',
        },
    ],
};