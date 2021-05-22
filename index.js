const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
const Canvas = require('canvas');

const cl = require('./check.js');
const bot = require('./bot.js');
const { token } = require('./token.json');
const { prefix } = require('./config.json');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const cooldowns = new Discord.Collection();

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

const Main = require('./models/Main')(sequelize, Sequelize.DataTypes);
const Shapes = require('./models/Shapes')(sequelize, Sequelize.DataTypes);
const Checklist = require('./models/Checklist')(sequelize, Sequelize.DataTypes);

client.once('ready', () => {
	client.user.setActivity('AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaADXBYUGFTJOXNIEUjgnifu8cshvjburbgj', { type: 'PLAYING' });
	console.log('hHhhHHhjbUFXSDHUFJAEYNHt7ufwrbyiewnorxnu!@4y124');
	Main.sync();
	Shapes.sync();
	Checklist.sync();
});

betaTesters =  [/* watglan */'326729433618579456',
				/* quitin */'225621781514420225',
				/* vovka */'337921582418755585',
				/* gunnerteam */'210338284939902986',
				/* obsi */'175823518448091136',
				/* cjhay */'284926422089465856'];

client.on('message', async message => {
	try {
		const register = await Main.create({
			id: message.author.id,
			parts: 5,
			xp: 0,
			maxxp: 50,
			level: 1,
			announce: true,
		});
		const addShapes = await Shapes.create({
			id: message.author.id,
			cube: true,
			sphere: false,
			pyramid: false,
		})
		const check = await Checklist.create({
			id: message.author.id,
			levelup: false,
		})
	} catch (e) {
		if (!e.name === 'SequelizeUniqueConstraintError') { // SequelizeUniqueConstraintError is the error when id already exists sooo
			console.error(e);
			return message.reply('Something went wrong.');
		}
	}
	cl.check(message);

	if (!message.content.startsWith(prefix) /*|| message.author.bot*/) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}
	if (command.protected && !betaTesters.includes(message.author.id)) {
		return message.channel.send('You need to be a beta-tester to run this command!');
	}
	if (command.dangerous && !['326729433618579456', '832602604282314802', '284926422089465856', '753554817074331659'].includes(message.author.id)) {
		return message.channel.send('This command is potentially dangerous, only the owner may use it!');
	}
	if (command.args && !args.length) {
	    return message.channel.send(`You didn't provide any arguments, ${message.author}!\nIntended usage: \`${prefix}${command.name} ${command.usage}\``);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	if (!betaTesters.includes(message.author.id)) {
		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.channel.send(`Please wait \`${(timeLeft).toFixed(1)}\` more seconds before reusing the command.`);
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	try {
		await command.execute(message, args);
		cl.check(message);
	}
    catch (error) {
		console.error(error);
		message.channel.send('get erored lmao'); // eror
	}
});

client.login(token);