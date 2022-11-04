const { SlashCommandBuilder } = require("discord.js");
const functions = require("../functions");
const { MongoClient } = require("mongodb");
const MONGO_URL =
  "mongodb+srv://frometa:s05F9K8n7thIq413@cluster0.ihfpyjr.mongodb.net/discord";
let mongoclient = new MongoClient(MONGO_URL);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wallets")
    .setDescription("Get info about a list or a something!")
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("All wallets info being get")
    ),
  async execute(interaction) {
	console.log("")
  },
};
