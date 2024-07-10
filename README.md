# IRLboxBOT
Simple bot that connects to Twitch chat to interact or output the status of your IRLbox Encoder


## Features

- Logs incoming commands and their outputs
- Handles several commands (`!cpu`, `!memory`, `!disk`, `!temp`, `!devices`, `!irlbox start`, `!irlbox stop`)
- Error handling and automatic restart on failure
- Outputs logs to a file in the `/logs/` directory

## Setup

### Download

You have the option to run this compiled download here (#placeholder), or continue and follow the instructions

### Prerequisites

- Node.js
- npm (Node Package Manager)
- pkg (Node.js compiler)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/IRLtools/IRLboxBOT.git
   cd twitch-bot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create and update `config.json` with your Twitch and API credentials:

   ```json
   {
     "twitch": {
       "username": "YOUR_TWITCH_USERNAME",
       "password": "YOUR_TWITCH_OAUTH_TOKEN",
       "channels": ["YOUR_CHANNEL_NAME"]
     },
     "api": {
       "baseUrl": "https://remote.irlbox.com/api/Server",
       "boardCuid": "YOUR_BOARD_CUID",
       "authToken": "Bearer YOUR_API_AUTH_TOKEN"
     }
   }
   ```

4. Start the bot:

   ```bash
   npm start
   ```

## Usage

### Commands

- `!cpu`: Get CPU usage information
- `!memory`: Get memory usage information
- `!disk`: Get disk usage information
- `!temp`: Get temperature information
- `!devices`: Get devices information
- `!irlbox start`: Start the IRLBox stream
- `!irlbox stop`: Stop the IRLBox stream

## License

This project is licensed under the MIT License.


