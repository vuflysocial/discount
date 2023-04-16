import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { ThirdwebAuth } from "@thirdweb-dev/auth/next";

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "localhost:3000",
  wallet: new PrivateKeyWallet(process.env.THIRDWEB_AUTH_PRIVATE_KEY || "fccc89195028e4c9bbe11ccabe0f06fa40775a66a2d91c4b17320ec79df5b793"),
});


// Export the handler to setup all your endpoints
export default ThirdwebAuthHandler();
