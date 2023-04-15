# Solana Slot Machine
![Version](https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000)

**Solana Slot Machine** is a simple slot game built on Solana blockchain using Anchor framework and React. See it in action at [solslot.coverlet.io](https://solslot.coverlet.io/).

![demo](https://github.com/coverlet/solslot/blob/main/demo.gif)



### Game mechanics
The game is deployed for now only on devnet cluster. The user connects his phantom wallet and bets a fixed amount of 0.1SOL by pressing the SPIN button. After the spin in completed, there are 4 possible outcomes:
- he looses the amount bet
- wins back 0.05
- wins 0.1
- wins 0.2

Winnings are accumulated in a pda for each user, from where the he can claim them whenever he wishes.

### How it works
The smart contract was written using Anchor framework and has the following methods:
- **init** - initializes the game's vault pda
- **create_user_vault** - creates the user's vauld pda. This is called only if the account is not already created, as a pre instruction when the user initiates a spin
- **spin** - the game spin method takes the `seed` stored in vault account, generates a new "random" and saves it. Based on this number, it decides the spin's outcome (loose, win small, win, win big). The bet is sent to vault and, if needed, the won amount is send to client's vault pda
- **claim_winnings** - enables user to transfer SOL from his vault to his wallet

The client side is written in React and uses anchor client library.

### Disclaimer
This project was built to learn cool things while developing on Solana ecosystem. Although it can be used as a learning tool for a beginner, it is far from best practices and probably a lot of things could be done in a better way. We have cut many corners:
- not really random (see below)
- no program exception handling
- known bugs and glitches on the frontend app
- no unit tests
- not a very friendly experience on some journeys
- developer grade graphics :)

As next steps, there are many cool new features that could be added: true random, better game mechanics, smoother animations, jackpots, more wallet integrations.

### A note about random
Random on blockchain is not easy. The "random" number behind the slot spin is given by a xorshift generator starting from the previous number as a seed. As such, anybody could decode the result of the next spin. We studied the possibility of including oracles such as Switchboard or Solrand, but decided it is to much for meeting the deadline of this submission.

<!-- ### Author

 **Coverlet**

* GitHub: [@coverlet](https://github.com/coverlet) -->

