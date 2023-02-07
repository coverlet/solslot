export const checkIfWalletConnected = async () => {
  const { solana } = window;
  try {
    // setLoading(true);
    if (solana) {
      if (solana.isPhantom) {
        const response = await solana.connect({
          onlyIfTrusted: true, //second time if anyone connected it won't show anypop on screen
        });
        // setWalletAdresss(response.publicKey.toString());
        console.log("public key", response.publicKey.toString());
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    // setLoading(false);
  }
};

export const connectWallet = async () => {
  const { solana } = window;
  try {
    // setLoading(true);
    if (solana) {
      const response = await solana.connect(); //to disconnect use "solana.disconnect()"
      // setWalletAdresss(response.publicKey.toString());

      // initUserAccount();
    } else {
      alert("Please Install Solana's Phantom Wallet");
    }
  } catch (err) {
    console.log(err);
  } finally {
    // setLoading(false);
  }
};