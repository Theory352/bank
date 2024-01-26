const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; 
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err}`);
    throw err;
  }
}

async function closeMongoDBConnection() {
  await client.close();
  console.log("Closed MongoDB connection");
}

async function executeQuery(query, values = []) {
  const db = client.db("bankdb"); 
  const collection = db.collection("account");

  try {
    const result = await collection[query](...values);
    return result;
  } catch (err) {
    console.log(`\n ❌ Error in Database Query: ${err}`);
    throw err;
  }
}

const createNewAccount = async ({ acId, acNm, balance }, onCreate = undefined) => {
  try {
    const result = await executeQuery("insertOne", [
      { ac_id: acId, ac_nm: acNm, balance: balance },
    ]);
    console.log(`\n ✅ New Customer Created Successfully`);
    if (onCreate) onCreate(`✅ New Customer Created Successfully`);
  } catch (err) {
    console.log(`\n ❌ Problem In Creating the Customer`);
  }
};

const withdraw = async ({ acId, amount }, onWithdraw = undefined) => {
  try {
    const result = await executeQuery("findOne", [
      { ac_id: acId },
      { projection: { balance: 1 } },
    ]);

    const balance = parseFloat(result.balance);
    const newBalance = balance - parseFloat(amount);

    await executeQuery("updateOne", [
      { ac_id: acId },
      { $set: { balance: newBalance } },
    ]);

    console.log(`\n ✅ Amount ${amount} Withdrawal Successfully`);
    if (onWithdraw) onWithdraw(`✅ Amount ${amount} Withdraw Successfully`);
  } catch (err) {
    console.log(`\n ❌ Problem In Withdrawing`);
  }
};
const deposit = async ({ acId, amount }, onDeposit = undefined) => {
  try {
    const db = client.db("bankdb"); // Replace "bankdb" with your MongoDB database name
    const collection = db.collection("account");

    // Find the account by ID
    const result = await collection.findOne({ _id: ObjectID(acId) });

    // Update the balance
    const balance = parseFloat(result.balance);
    const newBalance = balance + parseFloat(amount);

    await collection.updateOne(
      { _id: ObjectID(acId) },
      { $set: { balance: newBalance } }
    );

    console.log(`\n ✅ Amount ${amount} Deposited Successfully`);
    if (onDeposit) onDeposit(`✅ Amount ${amount} Deposited Successfully`);
  } catch (err) {
    console.log(`\n ❌ Problem In Depositing`);
  }
};

const transfer = async ({ srcId, destId, amount }, onTransfer = undefined) => {
  await withdraw({ acId: srcId, amount });
  await deposit({ acId: destId, amount });

  if (onTransfer) onTransfer(`✅ Amount ${amount} Transferred Successfully`);
};

const balance = async (acId, onBalance = undefined) => {
  console.log(acId);
  try {
    const db = client.db("bankdb"); // Replace "bankdb" with your MongoDB database name
    const collection = db.collection("account");

    // Find the account by ID
    const result = await collection.findOne({ _id: ObjectID(acId) });

    // Get and display the balance
    const balance = parseFloat(result.balance);
    console.log(`\n 💰 Your Account Balance Is : ${balance}`);
    if (onBalance) onBalance(balance);
  } catch (err) {
    console.log(`\n ❌ Problem In Fetching the balance`);
    console.log(err);
  }
};


module.exports = {
  connectToMongoDB,
  closeMongoDBConnection,
  createNewAccount,
  deposit,
  withdraw,
  transfer,
  balance,
};
