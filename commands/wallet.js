const { SlashCommandBuilder } = require("discord.js");
const { MongoClient } = require("mongodb");
const MONGO_URL =
  "mongodb+srv://frometa:s05F9K8n7thIq413@cluster0.ihfpyjr.mongodb.net/discord";
let client = new MongoClient(MONGO_URL);
const functions = require("../functions");

async function createLising(client, newListing) {
  await client.connect();
  const result = await client
    .db("discord")
    .collection("wallet")
    .insertOne(newListing);
  console.log(result.insertedId);
}
async function updateListing(client, query, updateDocument) {
  await client.connect();
  const result = await client
    .db("discord")
    .collection("wallet")
    .updateOne(query, updateDocument);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wallet")
    .addStringOption((option) =>
      option.setName("add").setDescription("The input to echo back")
    )
    .addStringOption((option) =>
      option.setName("delete").setDescription("The input to echo back")
    )
    .setDescription("Replies with wallets!"),
  async execute(interaction) {
    if (interaction.options.getString("add")) {
      await interaction.reply(interaction.options.getString("add"));
      const query = { userId: `${interaction.user.id}` };
      const result = await functions.findOneListingByName(client, query);
      const updateDocument = {
        $push: { wallets: `${interaction.options.getString("add")}` },
      };
      if (result.length === 0) {
        await createLising(client, {
          wallets: [interaction.options.getString("add")],
          userId: interaction.user.id,
        });
      } else {
        await updateListing(client, query, updateDocument);
      }
    }
  },
};
