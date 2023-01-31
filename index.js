const { Configuration, OpenAIApi } = require("openai");
const { WebClient } = require("@slack/web-api");
const { App } = require("@slack/bolt");
const axios = require("axios");
const WebSocket = require("ws");
require("dotenv").config();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


axios
  .post(
    "https://slack.com/api/apps.connections.open",
    {},
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          `Bearer ${process.env.SLACK_APP_TOKEN}`,
      },
    }
  )
  .then(function (response) {
    console.log(response.data.ok);
    if (response.data.ok) {
      let wssUrl = response.data.url;
      let socket = new WebSocket(wssUrl);

      socket.on("message", (msg) => {
        let event = JSON.parse(msg).payload?.event;
        if(msg && event?.type === "app_mention") {
          console.log(event);
        }
      });

    }
  });


// const app = new App({
//   token: process.env.SLACK_BOT_TOKEN, 
//   appToken: process.env.SLACK_APP_TOKEN,
//   socketMode: true,
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
// });


// // subscribe to 'app_mention' event in your App config
// // need app_mentions:read and chat:write scopes
// app.event('message', async ({ event, context, client, say }) => {

//   console.log(event)
// });

// (async () => {
//   await app.start();
//   console.log('⚡️ Bolt app started');
// })();


// async function runCompletion () {
//   const completion = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: "Suggest three names for an animal that is a superhero",
//     temperature: 0.6,
//   });
// console.log(completion.data.choices[0].text);
// }

// runCompletion();
