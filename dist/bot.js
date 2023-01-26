import { Bot, InlineKeyboard, session, } from "grammy";
import fetch from "node-fetch";
import { createWebhook, getWebhookEndpoint, getWebhookResults, } from "./utils.js";
const bot = new Bot(process.env.BOT_TOKEN);
const APP_URL = process.env.APP_URL;
const API_URL = process.env.API_URL;
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
    if (ctx.chat.type !== "private") {
        await ctx.reply("Questo comando è disponibile solo in chat privata per via di una limitazione di Telegram :/");
        return;
    }
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
    var _a, _b;
    let lnk = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text.split(" ")[1];
    if (lnk == undefined) {
        await ctx.reply("Non hai inserito nessun link!");
        return;
    }
    let dsc = (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.text.substring(lnk.length + 6);
    fetch(API_URL + "/links", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "link": lnk,
            "description": dsc
        })
    }).then(res => ctx.reply("Link aggiunto con successo!"))
        .catch(err => ctx.reply("Errore"));
});
//bot.filter(ColorPicker.match(), (ctx) => {
//  const result = `Data from Color Picker \n\n${formatWebAppData(ctx)}`;
//
//  return ctx.reply(result, {
//    parse_mode: "HTML",
//  });
//});
bot.start();
//# sourceMappingURL=bot.js.map