# Balance transfer - many to one

Script for transferring KSM from multiple accounts to a receiver account.

Example:

```sh
node run.js -e wss://kusama-rpc.polkadot.io -s <KEYS_FILE> --amount <AMOUNT> --receiver <KSM_ADDR>
```

> The keys file should have each key on a new line.

```txt
Options:
      --help         Show help                                         [boolean]
      --version      Show version number                               [boolean]
      --receiver     Address of receiver.                    [string] [required]
  -e, --endpoint     The wss endpoint. (defaults to westend) [Westend =
                     wss://westend-rpc.polkadot.io] [Kusama =
                     wss://kusama-rpc.polkadot.io]           [string] [required]
  -s, --secret-keys  A file with secret keys or seed phrases. It is not saved
                     anywhere.                               [string] [required]
      --amount       Amount to transfer to receiver. The individual accounts
                     sending should have enough to transfer or else it would
                     fail.                                            [required]
```
