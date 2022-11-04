const findOneListingByName = async (client, query) => {
  const results = await client
    .db("discord")
    .collection("wallet")
    .find(query)
    .toArray();
  return results;
};
const deleteListingById = async (client, query, updateDocument) => {
  const result = await client
    .db("discord")
    .collection("wallet")
    .updateOne(query,updateDocument);
    return result
};
module.exports.findOneListingByName = findOneListingByName;
module.exports.deleteListingById = deleteListingById;

