const axios = require('axios');
const config = require('./config.json');
const logger = require('./logger');  // Import the logger


// # ToDo:  Clean up commands functions, turn each function into it's own module

async function fetchData() {
  try {
    const response = await axios.get(`${config.api.baseUrl}/realtimedata?boardCuid=${config.api.boardCuid}`, {
      headers: {
        'accept': '*/*',
        'Authorization': config.api.authToken
      }
    });

    return response.data;
  } catch (error) {
    logger.error('Error fetching data:', error);
    throw new Error('Failed to fetch data from API.');
  }
}

async function getCpuInfo(client, target) {
  try {
    const data = await fetchData();
    if (data) {
      const cpuInfo = data.systemStats.cpuInfos;
      const message = `CPU Usage: ${cpuInfo.avgCpuUsagePercentage}%`;
      client.say(target, message);
      logger.info(`Output for !cpu: ${message}`);
    } else {
      const errorMsg = 'Error fetching CPU information.';
      client.say(target, errorMsg);
      logger.error(errorMsg);
    }
  } catch (error) {
    logger.error('Error in getCpuInfo:', error);
    client.say(target, 'Error fetching CPU information.');
  }
}

async function getMemoryInfo(client, target) {
  try {
    const data = await fetchData();
    if (data) {
      const memInfo = data.systemStats.memInfos;
      const message = `Memory Usage: ${memInfo.memUsedPercentage}%, Total Memory: ${memInfo.totalMemInGB}GB`;
      client.say(target, message);
      logger.info(`Output for !memory: ${message}`);
    } else {
      const errorMsg = 'Error fetching memory information.';
      client.say(target, errorMsg);
      logger.error(errorMsg);
    }
  } catch (error) {
    logger.error('Error in getMemoryInfo:', error);
    client.say(target, 'Error fetching memory information.');
  }
}

async function getDiskInfo(client, target) {
  try {
    const data = await fetchData();
    if (data) {
      const diskInfo = data.systemStats.diskInfos;
      const message = `Disk Usage: ${diskInfo.diskUsedPercentage}%, Total Disk: ${diskInfo.totalDiskInGB}GB`;
      client.say(target, message);
      logger.info(`Output for !disk: ${message}`);
    } else {
      const errorMsg = 'Error fetching disk information.';
      client.say(target, errorMsg);
      logger.error(errorMsg);
    }
  } catch (error) {
    logger.error('Error in getDiskInfo:', error);
    client.say(target, 'Error fetching disk information.');
  }
}

async function getTempInfo(client, target) {
  try {
    const data = await fetchData();
    if (data) {
      const tempInfo = data.systemStats.tempInfos;
      const message = `Average Temperature: ${tempInfo.avgTemp}°C`;
      client.say(target, message);
      logger.info(`Output for !temp: ${message}`);
    } else {
      const errorMsg = 'Error fetching temperature information.';
      client.say(target, errorMsg);
      logger.error(errorMsg);
    }
  } catch (error) {
    logger.error('Error in getTempInfo:', error);
    client.say(target, 'Error fetching temperature information.');
  }
}

async function getDevicesInfo(client, target) {
  try {
    const data = await fetchData();
    if (data) {
      const devices = data.devices;
      const message = devices.map(device => {
        return `Device: ${device.displayName}, IP: ${device.ipValue}, Connected: ${device.connected}`;
      }).join(' | ');
      client.say(target, message);
      logger.info(`Output for !devices: ${message}`);
    } else {
      const errorMsg = 'Error fetching devices information.';
      client.say(target, errorMsg);
      logger.error(errorMsg);
    }
  } catch (error) {
    logger.error('Error in getDevicesInfo:', error);
    client.say(target, 'Error fetching devices information.');
  }
}

// Function to toggle the IRLBox stream
async function toggleIrlboxStream(client, target, isStreaming) {
  try {
    const response = await axios.post(`${config.api.baseUrl}/togglestream`, null, {
      params: { isStreaming },
      headers: {
        'accept': 'application/json',
        'Authorization': config.api.authToken
      }
    });

    const message = isStreaming ? 'IRLBox stream stopped.' : 'IRLBox stream started.';
    client.say(target, message);
    logger.info(`Output for !irlbox ${isStreaming ? 'stop' : 'start'}: ${message}`);
  } catch (error) {
    logger.error('Error in toggleIrlboxStream:', error);
    client.say(target, 'Error toggling IRLBox stream.');
  }
}

module.exports = {
  getCpuInfo,
  getMemoryInfo,
  getDiskInfo,
  getTempInfo,
  getDevicesInfo,
  toggleIrlboxStream
};
