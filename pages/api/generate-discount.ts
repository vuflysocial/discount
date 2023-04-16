import { Edition, EditionDrop, ThirdwebSDK, getContract } from "@thirdweb-dev/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "./auth/[...thirdweb]";
import Shopify, { DataType, RestRequestReturn } from "@shopify/shopify-api";
import { Erc1155 } from "@thirdweb-dev/react";

export default async function generateDiscount(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // Load environment variables
  const {
    SHOPIFY_SITE_URL,
    SHOPIFY_ACCESS_TOKEN,
    NFT_COLLECTION_ADDRESS,
    SHOPIFY_DISCOUNT_ID,
  } = process.env;

  // Grab the current thirdweb auth user (wallet address)
  const thirdwebUser = await getUser(req);
  // If there is no user, return an error
  if (!thirdwebUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Initialize the SDK to check the user's balance
  const sdk = new ThirdwebSDK("binance");

  // Check the user's balance
  const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS!);
  // Here, we're checking token ID 0 specifically, just as an example.
  const data = await contract.erc1155.balanceOf(thirdwebUser.address, 0);
  const balance = data.toNumber();

  // If the user doesn't own any NFTs, return an error
  if (balance === 0) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Create a new client for the specified shop.
  const client = new Shopify.Clients.Rest(
    SHOPIFY_SITE_URL!,
    SHOPIFY_ACCESS_TOKEN!
  );

  // Create a new discount code with the Shopify API
  const response: RestRequestReturn<any> = await client.post({
    type: DataType.JSON,
    path: `/admin/api/2022-10/price_rules/${SHOPIFY_DISCOUNT_ID}/discount_codes.json`,
    data: {
      discount_code: {
        code: thirdwebUser.address,
        usage_count: 1,
      },
    },
  });

  res
    .status(200)
    .json({ discountCode: response.body.discount_code.code as string });
}
