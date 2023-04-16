import React, { useState, useEffect } from "react";
import { ConnectWallet, useUser } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Image from "next/image";

const Home: NextPage = () => {
  const user = useUser();

  const [generatedDiscount, setGeneratedDiscount] = useState<string>("");

  async function generateDiscount() {
    try {
      const response = await fetch("/api/generate-discount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { discountCode } = await response.json();

      setGeneratedDiscount(discountCode);
    } catch (error) {
      console.error(error);
      setGeneratedDiscount("Not eligible for discount");
    }
  }

  // Whenever the `user` is available, call the generateDiscount function.
  useEffect(() => {
    if (user.user?.address) {
      generateDiscount();
    }
  }, [user.user?.address]);

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: "center" }}>10% off Melo Swag</h1>
      <div className={styles.main}>
        <div style={{ textAlign: "center" }}>
          <Image
            src="https://i.postimg.cc/9MSWVZG9/Melo-Inu-300-500-px-500-200-px-400-200-px-300-150-px-200-150-px-150-50-px-1.png"
            alt=""
            width="100"
            height="100"
          />
          <br />
          <ConnectWallet
            auth={{
              loginOptional: false,
            }}
          />
          {generatedDiscount && (
            <p style={{ textAlign: "center" }}>
              Your discount code is: <strong>{generatedDiscount}</strong>
            </p>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <h3>All holders of our Like Melo NFT receive 10% off all swag for as long as you hold that NFT.</h3>
        </div>
      </div>
    </div>
  );
};

export default Home;
