const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "localhost",
  user: "aein",
  password: "aein",
  database: "bankdb",
  port: 3306,
});

async function executeQuery(query, values = []) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(query, values);
    return result;
  } catch (err) {
    console.log(`\n ❌ Error in Database Query: ${err}`);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

const createNewAccount = async (
  { acId, acNm, balance },
  onCreate = undefined
) => {
  try {
    await executeQuery(
      "INSERT INTO account (ac_id, ac_nm, balance) VALUES (?, ?, ?)",
      [acId, acNm, balance]
    );
    console.log(`\n ✅ New Customer Created Successfully`);
    if (onCreate) onCreate(`✅ New Customer Created Successfully`);
  } catch (err) {
    console.log(`\n ❌ Problem In Creating the Customer`);
  }
};

const withdraw = async ({ acId, amount }, onWithdraw = undefined) => {
  try {
    const result = await executeQuery(
      "SELECT balance FROM account WHERE ac_id = ?",
      [acId]
    );
    const balance = parseFloat(result[0].balance);

    const newBalance = balance - parseFloat(amount);

    await executeQuery("UPDATE account SET balance = ? WHERE ac_id = ?", [
      newBalance,
      acId,
    ]);

    console.log(`\n ✅ Amount ${amount} Withdrawal Successfully`);
    if (onWithdraw) onWithdraw(`✅ Amount ${amount} Withdraw Successfully`);
  } catch (err) {
    console.log(`\n ❌ Problem In Withdrawing`);
  }
};

const deposit = async ({ acId, amount }, onDeposit = undefined) => {
  try {
    const result = await executeQuery(
      "SELECT balance FROM account WHERE ac_id = ?",
      [acId]
    );
    const balance = parseFloat(result[0].balance);
    const newBalance = balance + parseFloat(amount);

    await executeQuery("UPDATE account SET balance = ? WHERE ac_id = ?", [
      newBalance,
      acId,
    ]);

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
    const result = await executeQuery(
      "SELECT balance FROM account WHERE ac_id = ?",
      [acId]
    );
    const balance = parseFloat(result[0].balance);
    console.log(`\n 💰 Your Account Balance Is : ${balance}`);
    if (onBalance) onBalance(balance);
  } catch (err) {
    console.log(`\n ❌ Problem In Fetching the balance`);
    console.log(err);
  }
};

module.exports = {
  createNewAccount,
  deposit,
  withdraw,
  transfer,
  balance,
};
