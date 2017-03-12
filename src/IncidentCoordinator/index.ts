import * as BotKit from 'botkit';
import { inspect } from 'util';
import { WebClient } from '@slack/client';

export class IncidentCoordinator {
  readonly incident: string
  readonly point: string
  readonly comms: string

  readonly bot: Object
  readonly api: WebClient

  private slackChannel: Object

  constructor(incident: string, bot: Object, point: string, token: string, comms?: string, ) {
    this.incident = incident;
    this.bot = bot;
    this.point = point;
    this.api = new WebClient(token);
    this.comms = comms;
  }

  start() {
    this.api.channels.create(`incident-${this.incident}`).then((res) => {
      this.slackChannel = res.channel;
      console.log(`Started incident with channel name ${this.incident}`);
    }).catch((error) => {
      console.log(`Unable to create channel ${inspect(error)}`)
    });
  }

  stop() {
    this.api.channels.archive(this.slackChannel.id).then((res) => {
      console.log(`Stopped incident for ${this.incident}`);
    }).catch((error) => {
      console.log(`Unable to stop incident for channel ${this.incident} - ${inspect(error)}`);
    });
  }
}