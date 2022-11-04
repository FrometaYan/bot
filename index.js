const path = require("node:path");
const fs = require("node:fs");
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const MONGO_URL =
  "mongodb+srv://frometa:s05F9K8n7thIq413@cluster0.ihfpyjr.mongodb.net/discord";
let mongoclient = new MongoClient(MONGO_URL);
const functions = require("./functions");
const {
  Client,
  Events,
  Collection,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");
const { token } = require("./config.json");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const query = { userId: `${interaction.user.id}` };
  const command = interaction.client.commands.get(interaction.commandName);
  if (interaction.commandName === "wallets") {
    interaction.reply({ content: "Soon with Embed one!", ephemeral: true });
    const result = await functions.findOneListingByName(mongoclient, query);
    const channels = client.channels.cache.get("1037809231581151337");
    let fields = [];

    if (result.length > 0) {
      const wallets = result[0].wallets;
      wallets.forEach((element) => {
        const oneWallet = new Object();
        oneWallet.name = "Wallet";
        oneWallet.value = element;
        oneWallet.inline = true;
        fields.push(oneWallet);
      });
      let exampleEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Some title")
        .setURL("https://discord.js.org/")
        .setAuthor({
          name: "Some name",
          iconURL: "https://i.imgur.com/AfFp7pu.png",
          url: "https://discord.js.org",
        })
        .setDescription("Some description here")
        .setThumbnail("https://i.imgur.com/AfFp7pu.png")
        .setImage("https://i.imgur.com/AfFp7pu.png")
        .setTimestamp()
        .addFields(fields)
        .setFooter({
          text: "Some footer text here",
          iconURL: "https://i.imgur.com/AfFp7pu.png",
        });
      channels.send({ embeds: [exampleEmbed] });
    } else {
      channels.send("There is no added wallet!");
    }
  } else if (interaction.options.getString("delete")) {
    const query = { userId: `${interaction.user.id}` };
    const updateDocument = {
      $pull: { wallets: `${interaction.options.getString("delete")}` },
    };
    interaction.reply({ content: "Soon will be deleted!", ephemeral: true });
    const channels = client.channels.cache.get("1037809231581151337");
    const result = await functions.findOneListingByName(mongoclient, query);
    let fields = [];
    if (result.length > 0) {
      await functions.deleteListingById(mongoclient, query, updateDocument);
      const resultafterDeleted = await functions.findOneListingByName(
        mongoclient,
        query
      );
      const wallets = resultafterDeleted[0].wallets;
      wallets.forEach((element) => {
        const oneWallet = new Object();
        oneWallet.name = "Wallet";
        oneWallet.value = element;
        oneWallet.inline = true;
        fields.push(oneWallet);
      });
      let DeletedEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Some title")
        .setURL("https://discord.js.org/")
        .setAuthor({
          name: "Deleted Wallets",
          iconURL: "https://i.imgur.com/AfFp7pu.png",
          url: "https://discord.js.org",
        })
        .setDescription("Some description here")
        .setThumbnail("https://i.imgur.com/AfFp7pu.png")
        .setImage("https://i.imgur.com/AfFp7pu.png")
        .setTimestamp()
        .addFields(fields)
        .setFooter({
          text: "Some footer text here",
          iconURL: "https://i.imgur.com/AfFp7pu.png",
        });
      channels.send({ embeds: [DeletedEmbed] });
    } else {
      channels.send("There is no added wallet!");
    }
  }
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});
client.on("ready", async () => {
  console.log("the bot is running!");
});
client.login(token);

const app = express();
app.use(cors());

app.listen(3001, () => {
  console.log("server started at port 3000");
});
