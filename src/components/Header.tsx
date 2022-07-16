import React, { useEffect } from "react";
import styles from "../styles/components/Header.module.scss";
import { ENElogo as ENEImg } from "../assets/index";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Button from "./Button";
/**
 *
 * @returns the header container with wallet connect, address display and balances
 */

const Header: React.FC = () => {
  const [accountData, setAccountData] = React.useState<any>(null); // storing account data

  const { account, activateBrowserWallet, chainId } = useEthers();

  // storing the balance shown in the header

  let balance = useTokenBalance(
    chainId === 56 ? '0x3bEcB1170183fdBc8f1603dacD1705c093BC33B7' : '0x214B86ed37d709C9aDA719Ec00ABBe9E0c802D1d',
    account
  );



  useEffect(() => {
    if (chainId === 56) {
      setAccountData(account);
    }
  }, [account, balance, chainId]);

  return (
    <div className={styles.HeaderContainer}>
      <section className={styles.BalanceSection}>
        <img src={ENEImg} alt="logo" />
        {/* <p>
          {balance &&
            `${
              formatEther(balance).split(".")[1]
                ? formatEther(balance).split(".")[0] +
                  "." +
                  formatEther(balance).split(".")[1].slice(0, 3)
                : formatEther(balance).split(".")[0]
            }`}{" "}
            </p> */}


      </section>
      <section className={styles.ButtonContainer}>
        <h1 className={styles.chainID}>{chainId === 56 ? "Binance Smart Chain" : "Avalanche C-Chain"}</h1>
        <Button
          clickHandler={
            !account
              ? () =>
                activateBrowserWallet(() => {
                  toast.dismiss();
                  toast("Please select either Avalanche C-Chain or Binance Smart Chain chain", {
                    autoClose: 1600,
                    closeOnClick: true,
                    theme: "dark",
                  });
                })
              : () => { }
          }
        >
          {accountData
            ? `${accountData?.substring(0, 4)}...${accountData?.substring(
              accountData.length - 4
            )}`
            : "Connect Wallet"}
        </Button>

      </section>




    </div>
  );
};

export default Header;
