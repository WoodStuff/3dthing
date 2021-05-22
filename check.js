const Discord = require('discord.js');
const client = new Discord.Client();

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
const Main = require('./models/Main')(sequelize, Sequelize.DataTypes);
const Shapes = require('./models/Shapes')(sequelize, Sequelize.DataTypes);
const Checklist = require('./models/Checklist')(sequelize, Sequelize.DataTypes);

const bot = require('./bot.js');

module.exports = {
    async check(message) {
        const main = await Main.findOne({ where: { 'id': message.author.id } });
        const shapes = await Shapes.findOne({ where: { 'id': message.author.id } });
        const checklist = await Checklist.findOne({ where: { 'id': message.author.id } });
        // Level-Up
        if (main.get('level') > 1 && !checklist.get('levelup')) {
            checklist.update({ levelup: true }, { where: { 'id': message.author.id } });
            main.update({ parts: main.get('parts') + 5 }, { where: { 'id': message.author.id } });
            this.achieve('Level-Up', `${bot.emojis.part}5`, message);
        }
    },
    async achieve(check, reward, message) {
        const profile = await Main.findOne({ where: { 'id': message.author.id } });
        if (profile.get('announce')) {
            message.channel.send(`<@${message.author.id}> has completed the ${check} check!\nReward: ${reward}`);
        }
    },
}