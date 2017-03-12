import * as BotKit from 'botkit'
import { IncidentCoordinator } from './IncidentCoordinator'

const config = {
  json_file_store: './db_hazard_commands',
};

global.incidents = {};

const controller = BotKit.slackbot(config).configureSlackApp({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scopes: [
    'channels:write',
    'commands',
    'bot'
  ],
  debug: true
});

controller.setupWebserver(process.env.PORT, (error, webserver) => {
  controller.createWebhookEndpoints(controller.webserver);

  controller.createOauthEndpoints(controller.webserver, (error, req, res) => {
    if (error) {
      res.status(500).send(`ERROR: ${error}`);
    } else {
      res.send('Success!');
    }
  });
});

controller.on('slash_command', (bot, message) => {
  controller.storage.teams.get(message.team_id, (error, data) => {
    if (error) {
      message.replyPrivate(message, 'Unable to find team information!')
    } else {
      switch (message.command) {
        case '/incident-start': {
          let monitor = new IncidentCoordinator(message.text, bot, 'brian', data.bot.app_token, 'brian')

          global.incidents[message.text] = monitor;

          monitor.start();
          console.log('start-incident!');
        }
          break;
        case '/incident-stop': {
          const monitor = global.incidents[message.text]

          if (typeof monitor === 'object') {
            monitor.stop();
            global.incidents[message.text] = null;
            bot.replyPrivate(message, 'Stopping incident for ${message.text}');
          }
          console.log('stop-incident!');
        }
          break;
      }
    }
  });
});
