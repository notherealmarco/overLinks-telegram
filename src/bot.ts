import {
  Bot,
  Context as DefaultContext,
  InlineKeyboard,
  Keyboard,
  session,
  SessionFlavor,
} from "grammy";
import fetch from "node-fetch";
import {
  createWebhook,
  getWebhookEndpoint,
  getWebhookResults,
} from "./utils.js";

//const formatWebAppData = (ctx: Context) => {
//  const webAppData =
//    "<pre>\n" + JSON.stringify(ctx.webAppData!, null, 2) + "</pre>";
//  // const webAppDataRaw =
//  //   "<pre>\n" + JSON.stringify(ctx.webAppDataRaw!, null, 2) + "</pre>";
//
//  return `ctx.webAppData:${webAppData}`;
//};

// Flavor the context type to include web apps data.
type Context = DefaultContext &
  SessionFlavor<{ webhookToken: string }>;

const bot = new Bot<Context>(process.env.BOT_TOKEN as string);

const APP_URL = process.env.APP_URL as string;
const API_URL = process.env.API_URL as string;

bot.use(session({ initial: () => ({}) }));
//(bot.use(transformWebAppData());

bot.command("start", async (ctx) => {
  //const keyboard = new Keyboard();

  //keyboard.webApp("Mostra link", "https://telegram.marcorealacci.me");
  //keyboard.webApp("Time Picker", new TimePicker().build()).row();
  //keyboard.webApp("Color Picker", new ColorPicker().build()).row();
  //keyboard.webApp("QR Scanner", new QrScanner().build()).row();

  //await ctx.reply("Ciao fra!", {
  //  reply_markup: {
  //    keyboard: keyboard.build(),
  //    resize_keyboard: true,
  //  },
  //});

  if (typeof ctx.session.webhookToken === "undefined") {
    ctx.session.webhookToken = await createWebhook();
  }
  const token = ctx.session.webhookToken;

  const inlineKeyboard = new InlineKeyboard();
  const config = {
    callback: getWebhookEndpoint(token),
  };

  inlineKeyboard.url("Debug »", getWebhookResults(token)).row();
  inlineKeyboard.webApp("Mostra link", APP_URL);
  //inlineKeyboard.webApp("Time Picker", new TimePicker(config).build()).row();
  //inlineKeyboard.webApp("Color Picker", new ColorPicker(config).build()).row();
  //inlineKeyboard.webApp("QR Scanner", new QrScanner(config).build()).row();

  await ctx.reply(`Ecco a te!`, {
    reply_markup: inlineKeyboard,
  });
});

bot.command("add", async (ctx) => {

  let lnk = ctx.message?.text.split(" ")[1];

  if (lnk == undefined) {
    await ctx.reply("Non hai inserito nessun link!");
    return;
  }

  let dsc = ctx.message?.text.substring(lnk.length + 6);

  let res = await fetch(API_URL + "/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "link": lnk,
        "description": dsc
        })
    });

  await ctx.reply(JSON.stringify(res.json()));

});

//bot.filter(ColorPicker.match(), (ctx) => {
//  const result = `Data from Color Picker \n\n${formatWebAppData(ctx)}`;
//
//  return ctx.reply(result, {
//    parse_mode: "HTML",
//  });
//});

bot.start();
