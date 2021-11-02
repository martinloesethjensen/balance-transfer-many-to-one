// Import the API, Keyring and some utility functions
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { Keyring } = require("@polkadot/keyring");
const fs = require("fs");

const options = require("yargs")
  .option("receiver", {
    type: "string",
    description: "Address of receiver.",
    required: true,
  })
  .option("endpoint", {
    alias: "e",
    type: "string",
    description:
      "The wss endpoint. (defaults to westend) [Westend = wss://westend-rpc.polkadot.io] [Kusama = wss://kusama-rpc.polkadot.io]",
    required: true,
  })
  .option("secret-keys", {
    alias: "s",
    type: "string",
    description:
      "A file with secret keys or seed phrases. It is not saved anywhere.",
    required: true,
  })
  .option("amount", {
    type: "num",
    description: "Amount to transfer to receiver. The individual accounts sending should have enough to transfer or else it would fail.",
    required: true,
  }).argv;

async function main() {
  const receiver = options.receiver;
  const keys = fs
    .readFileSync(`${options["secret-keys"]}`, "UTF-8")
    .split(/\r?\n/)
    .filter((entry) => entry.trim() != "");
  const amount = options.amount;

  if (amount < 0) {
    process.exit();
  }

  const provider = new WsProvider(options.endpoint);

  const api = await ApiPromise.create({ provider });

  console.log(
    `Connected to node: ${(await api.rpc.system.chain()).toHuman()} [ss58: ${api.registry.chainSS58
    }]`
  );

  const keyring = new Keyring({
    type: "sr25519",
    ss58Format: api.registry.chainSS58,
  });

  /// KSM Precision [kusama guide](https://guide.kusama.network/docs/kusama-parameters/#precision)
  const ksmPrecision = 1_000_000_000_000;
  const amountPrecision = amount * ksmPrecision;

  for (key of keys) {
    let account = keyring.addFromUri(key);

    console.log("🤖 ACCOUNT_ADDRESS:", account.address);

    const tx = api.tx.balances.transfer(receiver, amountPrecision);
    console.log(`💸 Should send ${amount} to ${receiver}`);

    const hash = await tx.signAndSend(account);
    console.log(`Sent txn with hash: ${hash}`);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
