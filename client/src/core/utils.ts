import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const formatAddress = (text: string) => {
  if (text.length === 0) {
    return "";
  }
  let convertedStr = "";
  convertedStr += text.substring(0, 3);
  convertedStr += ".".repeat(3);
  convertedStr += text.substring(text.length - 4, text.length);
  return convertedStr;
};


export const lamportsToSol = (lamports: number) => {
  return lamports / LAMPORTS_PER_SOL
};