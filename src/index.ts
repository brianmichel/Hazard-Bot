import * as BotKit from 'botkit'

const config = {
  json_file_store: './db_hazard_commands',
};

const controller = BotKit.slackbot(config).configureSlackApp({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scopes: [
    'commands',
    'bot',
    'channels:write'
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
  switch (message.command) {
    case '/incident-start':
      bot.replyPrivate(message, `Starting incident for ${message.text}`);
      console.log('start-incident!');
      break;
    case '/incident-stop':
      bot.replyPrivate(message, 'Stopping incident for ${message.text}');
      console.log('stop-incident!');
      break;
  }
});
