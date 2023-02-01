const { Configuration, OpenAIApi } = require("openai");
const { App } = require("@slack/bolt");
require("dotenv").config();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.event("app_mention", async ({ body, context, say }) => {

  let text = body.event.text.split('> ')[1];

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: text,
    temperature: 0.7,
    max_tokens: 100
  });

  app.client.chat.postMessage({
    channel: process.env.CHANNEL_ID,
    blocks: [{
      type: "section",
      text: {
        type: "mrkdwn",
        text : completion.data.choices[0].text,
      },
    }],
  });
});

(async () => {
  await app.start();
  console.log("⚡️ Bolt app started");
})();

