require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const ContractABI = require("./RewardsContractABI.json");

const { CONTRACT_ADDRESS, WALLET_PK, RPC_URL, APP_PORT } = process.env;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const senderWallet = new ethers.Wallet(WALLET_PK, provider);

const erc20TokenABI = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

const erc721Contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  ContractABI,
  senderWallet,
);

setInterval(async () => {
  try {
    const tx = await erc721Contract.destroyExpiredTokens();
    await tx.wait(); // Wait for the transaction to be mined
  } catch (e) {
    console.error(error);
  }
}, 3600000);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/get-token-balance", async (req, res) => {
  const { contractAddress, walletAddress } = req.query;

  if (!contractAddress || !walletAddress) {
    return res
      .status(400)
      .json({ error: "Missing contract address or wallet address" });
  }

  try {
    const contract = new ethers.Contract(
      contractAddress,
      erc20TokenABI,
      provider,
    );

    const balance = await contract.balanceOf(walletAddress);

    return res.json({ balance: ethers.formatEther(balance.toString()) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/check-ownership", async (req, res) => {
  try {
    const { walletAddress, tokenId } = req.query;

    const owner = await erc721Contract.ownerOf(tokenId);

    if (owner.toLowerCase() === walletAddress.toLowerCase()) {
      res.json({ owned: true });
    } else {
      res.json({ owned: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/check-rewardable", async (req, res) => {
  const { walletAddress } = req.query;

  if (!walletAddress) {
    return res.status(400).json({ error: "Wallet address is required" });
  }

  try {
    const ownedTokens = await erc721Contract.balanceOf(walletAddress);

    if (ownedTokens > 0) {
      res.json({
        ownsTokens: true,
        tokenCount: Number(ownedTokens),
      });
    } else {
      res.json({
        ownsTokens: false,
        tokenCount: "0",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/mint-token", async (req, res) => {
  const { walletAddress, objectURI, expiration } = req.body;

  if (!walletAddress || !objectURI || !expiration) {
    return res.status(400).json({
      error: "walletAddress, expiration datestring, and objectURI are required",
    });
  }

  const expirationTimestamp = Math.floor(new Date(expiration).getTime() / 1000);

  try {
    const tx = await erc721Contract.mintWithURI(
      walletAddress,
      objectURI,
      expirationTimestamp,
    );

    await tx.wait(); // Wait for the transaction to be mined

    res.json({ success: true, transactionHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});
