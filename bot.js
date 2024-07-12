const tmi = require('tmi.js');
const { getCpuInfo, getMemoryInfo, getDiskInfo, getTempInfo, getDevicesInfo, toggleIrlboxStream, rebootIrlboxServer } = require('./commands');
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Function to read config.json from the current working directory
function readConfig() {
  const configPath = path.join(process.cwd(), 'config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

// Read configuration
const config = readConfig();
const logger = require('./logger');  // Import the logger

// Function to check if a user has the necessary role
function hasRole(user, role, userState) {
  const cleanChannels = config.twitch.channels.map(channel => channel.replace('#', '').toLowerCase());
  const isStreamer = cleanChannels.includes(user.toLowerCase());
  const isMod = userState.mod || userState['user-type'] === 'mod' || (userState.badges && userState.badges.moderator);
  const isVip = userState.badges && userState.badges.vip;

  switch (role) {
    case 'everyone':
      return true;
    case 'vip':
      return isVip || isMod || isStreamer;
    case 'mods':
      return isMod || isStreamer;
    case 'streamer':
      return isStreamer;
    default:
      return false;
  }
}

async function main() {
  try {
    logger.info('Starting Twitch bot...');

    // Define configuration options
    const opts = {
      identity: {
        username: config.twitch.username,
        password: config.twitch.password
      },
      channels: config.twitch.channels
    };

    // Create a client with our options
    const client = new tmi.client(opts);

    // Register event handlers
    client.on('message', async (target, context, msg, self) => {
      if (self) return; // Ignore messages from the bot

      const commandName = msg.trim();
      const user = context.username;
      const commandRole = config.commands[commandName];

      if (!commandRole) return; // Ignore unknown commands

      if (!hasRole(user, commandRole, context)) {
        client.say(target, `@${user}, you do not have permission to use the command ${commandName}.`);
        return;
      }

      logger.info(`Received command: ${commandName} from ${user}`);

      try {
        // Execute the appropriate command
        if (commandName === '!cpu') {
          await getCpuInfo(client, target);
        } else if (commandName === '!memory') {
          await getMemoryInfo(client, target);
        } else if (commandName === '!disk') {
          await getDiskInfo(client, target);
        } else if (commandName === '!temp') {
          await getTempInfo(client, target);
        } else if (commandName === '!devices') {
          await getDevicesInfo(client, target);
        } else if (commandName === '!irlbox start') {
          await toggleIrlboxStream(client, target, false);
        } else if (commandName === '!irlbox stop') {
          await toggleIrlboxStream(client, target, true);
        } else if (commandName === '!reboot') {
          await rebootIrlboxServer(client, target);
        }
      } catch (error) {
        logger.error(`Error executing command ${commandName}: ${error.message}`);
        client.say(target, `Error executing command ${commandName}. Please try again.`);
      }
    });

    client.on('connected', (addr, port) => {
      logger.info(`* Connected to ${addr}:${port}`);
    });

    // Connect to Twitch
    await client.connect();
  } catch (error) {
    logger.error(`Error in main function: ${error.message}`);
    setTimeout(main, 5000); // Restart main() after 5 seconds if an error occurs
  }
}

// Start the bot
main();
