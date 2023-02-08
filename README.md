# Solana Slot Machine
![Version](https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000)

Solana Slot Machine is a simple slot game build on Solana blockchain using Anchor framework and React. See it in action at [solslot.coverlet.io](https://solslot.coverlet.io/).

![demo](https://lh3.googleusercontent.com/pw/AMWts8DaJqPN2c4YViLZoPW7trXI9CzaKG7uInoukalD26f1XZlwhyXXprkVPeuBQybuh6Plr3xEZUNvuPU0sqgcUo_7X281vev_bC9WieReML2UuVislB7D9FmuWAyOPXP3Sid62WIc8U1Ah47p89vKSgEiXA=w600-h513-no?authuser=0)



### Game mechanics
The game is deployed for now only on devenet cluster. The user connects his phantom wallet and bets a fixed amount of 0.1SOL by pressing the SPIN button. After the spin in completed, there are 4 possible outcomes:
- he looses the amount bet
- wins back 0.05
- wins 0.1
- wins 0.2

Winnings are accumulated in a program owned account and the user from where the user can claim them when he whises.

### How it works
The smart contract was written using Anchor framework and has the following methods:
- **init** - initializes the game's vault pda
- **create_user_vault** - creates the user's vauld pda. This is called only if the account is not already created, as a pre instruction when the user initiates a spin
- **spin** - the game spin method takes the `seed` stored in vault account, generates a new "random" and saves it. Based on this number, it decides the spin's outcome (loose, win small, win, win big). The bet is sent to vault and, if needed, the won amount is send to client's vault pda
- **claim_winnings** - enables user to transfer SOL from his vault to his wallet

<!-- ### Disclaimer
- exceptions
- we learned
- numerous ways to improve 
- best practices
- bugs
- works only on desktop
- known glitches
- tests

### A note about random -->

### Author

 **Coverlet**

* GitHub: [@coverlet](https://github.com/coverlet)

