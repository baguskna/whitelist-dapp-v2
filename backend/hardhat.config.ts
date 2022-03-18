import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

dotenv.config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_API_KEY_URL,
      accounts:
        process.env.RINKEBY_PRIVATE_KEY !== undefined
          ? [process.env.RINKEBY_PRIVATE_KEY]
          : [],
    },
  },
};

export default config;
