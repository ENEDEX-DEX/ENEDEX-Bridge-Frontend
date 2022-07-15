import React, { useEffect } from "react";
import styles from "../styles/container/BridgeContainer.module.scss";
import Dropdown from "../components/Dropdown";
import { binance, ethereum as ethImg, ENEtokenlogo } from "../assets/index";
import Input from "../components/Input";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import useBurnAVAX from "../hooks/useBurnAVAX";
import { useEthers, useTokenBalance } from "@usedapp/core";
import useBurnBTK from "../hooks/useBurnBTK";
import Axios from "../utils/axios";
import { toast } from "react-toastify";
import { formatEther } from "@ethersproject/units";
import Web3 from "web3";
import { BigNumber } from "ethers";
/**
 *
 * @returns the entire bridge container with embedded components and functionalities
 */



let bridgebalanceBSC: BigNumber | undefined;


const BridgeContainer: React.FC = () => {
  const [accountData, setAccountData] = React.useState<any>(null);
  const { account, activateBrowserWallet, chainId } = useEthers();
  // storing the state of the left and right card data
  const [currValue, setCurrValue] = React.useState<{
    left: "Binance Smart Chain" | "Avalanche C-Chain";
    right: "Binance Smart Chain" | "Avalanche C-Chain";
  }>({
    left: "Binance Smart Chain",
    right: "Avalanche C-Chain",
  });


  const { ethereum } = window as any;


  // storing the data of the left and right card dropdowns
  const [dropdownOpen, setDropdownOpen] = React.useState<{
    left: boolean;
    right: boolean;
  }>({
    left: false,
    right: false,
  });



  // using the useBurnAVAX custom hook for transaction
  const { approveAVAXBurn } = useBurnAVAX();
  const { approveBTKBurn } = useBurnBTK();

  // storing the value for the input
  const [inputValue, setInputValue] = React.useState<string>("");

  const [tokenvalue, settokenvalue] = React.useState<string>("");

  // handling the card-swapping interface between the left and right card

  const handleSwapper = (value: "Avalanche C-Chain" | "Binance Smart Chain", side: "left" | "right") => {
    if (side === "left") {
      setCurrValue((prev) => ({
        ...prev,
        left: value,
        right: value === "Binance Smart Chain" ? "Avalanche C-Chain" : "Binance Smart Chain",
      }));
    } else {
      setCurrValue((prev) => ({
        ...prev,
        right: value,
        left: value === "Avalanche C-Chain" ? "Binance Smart Chain" : "Avalanche C-Chain",
      }));
    }
    toggleDropdown();
  };

  let balance = useTokenBalance(
    chainId === 56 ?
      '0x3bEcB1170183fdBc8f1603dacD1705c093BC33B7'
      : '0x214B86ed37d709C9aDA719Ec00ABBe9E0c802D1d',
    account
  );



  let bridgebalance = useTokenBalance(  //BSC Bridge contract amount
    '0x3bEcB1170183fdBc8f1603dacD1705c093BC33B7'
    ,
    '0x4aD3052035147636B37E669F9D5fE4298b03F567'
  );

  if (bridgebalanceBSC == undefined && chainId == 56) {
    bridgebalanceBSC = bridgebalance;
    console.log('bridgebalanceBSC', bridgebalanceBSC);
  }



  useEffect(() => {
    if (chainId === 56) {
      setAccountData(account);
    }
  }, [account, balance, chainId]);




  // handling the dropdown toggle for the left and right card

  const toggleDropdown = (side: "left" | "right" | "" = "") => {
    setDropdownOpen((prev) => ({
      left: side === "left" ? !prev.left : false,
      right: side === "right" ? !prev.right : false,
    }));
  };

  React.useEffect(() => {
    const switchChain = async () => {
      if (currValue.left === "Avalanche C-Chain") {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${Number(43114).toString(16)}` }],
        });
      } else {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${Number(56).toString(16)}` }],
        });
      }
    };
    switchChain();
  }, [currValue, ethereum]);

  // handling the toggle for the currValue state when the arrow is clicked

  const arrowSwapper = () =>
    setCurrValue((prev) => ({
      left: prev.left === "Avalanche C-Chain" ? "Binance Smart Chain" : "Avalanche C-Chain",
      right: prev.right === "Avalanche C-Chain" ? "Binance Smart Chain" : "Avalanche C-Chain",
    }));


  const BSC_PROVIDER_URL = "https://bsc-dataseed.binance.org";
  const AVAX_PROVDER_URL = "https://api.avax.network/ext/bc/C/rpc";
  let BSCweb3 = new Web3(new Web3.providers.HttpProvider(BSC_PROVIDER_URL));
  let AVAXweb3 = new Web3(new Web3.providers.HttpProvider(AVAX_PROVDER_URL));
  let BNBbalance;
  let AVAXbalance;

  const ethBurnBscMint = async () => {


    BNBbalance = await BSCweb3.eth.getBalance("0x3f1991E3A7f296030fD22472919B918F869c26DE"); // admin wallet address
    BNBbalance = BSCweb3.utils.fromWei(BNBbalance, 'ether');

    try {
      if (Number(bridgebalanceBSC?.toString()) > Number(inputValue)*1000000000000000000 || bridgebalanceBSC?.toString() === undefined) {
        if (Number(BNBbalance) > 0.01) {
          const txHash = await approveAVAXBurn(inputValue);
          console.log(txHash);
          toast.success("Minting for tokens in progress!", {
            theme: "dark",
            autoClose: 5000,
            closeOnClick: true,
          });
          await Axios.post("/mint-bsc", {
            txHash: txHash.transactionHash,
          });
          toast.dismiss();
          toast.success(
            "Minted tokens successfully! Please check the token balance on Binance Smart Chain",
            {
              theme: "dark",
              autoClose: 2000,
              closeOnClick: true,
            }
          );
        } else {
          toast.error('There’s not enough gas fee on Admin wallet.', {
            theme: "dark",
            autoClose: 2000,
            closeOnClick: true,
          }
          );
        }
      } else {
        toast.error('There’s not enough fund in the bridging contract address on Binance Smart Chain networks.', {
          theme: "dark",
          autoClose: 2000,
          closeOnClick: true,
        }
        );
      }
    } catch (err) {
      toast.error((err as any).message, {
        theme: "dark",
        autoClose: 2000,
        closeOnClick: true,
      });
    }
  };

  const bscBurnEthMint = async () => {
    AVAXbalance = await AVAXweb3.eth.getBalance("0x3f1991E3A7f296030fD22472919B918F869c26DE"); // admin wallet address
    AVAXbalance = AVAXweb3.utils.fromWei(AVAXbalance, 'ether');
    try {
      if (Number(AVAXbalance) > 0.05) {
        const txHash = await approveBTKBurn(inputValue);
        console.log(txHash);
        toast.success("Minting for tokens in progress!", {
          theme: "dark",
          autoClose: 5000,
          closeOnClick: true,
        });
        await Axios.post("/mint-avax", {
          txHash: txHash.transactionHash,
        });
        toast.dismiss();
        toast.success(
          "Minted tokens successfully! Please check the token balance on Binance Smart Chain",
          {
            theme: "dark",
            autoClose: 2000,
            closeOnClick: true,
          }
        );
      } else {
        toast.error('There’s not enough gas fee on Admin wallet.', {
          theme: "dark",
          autoClose: 2000,
          closeOnClick: true,
        }
        );
      }
    } catch (err) {
      toast.error((err as any).message, {
        theme: "dark",
        autoClose: 2000,
        closeOnClick: true,
      });
    }
  };

  // click handler for initializing the swapping
  const clickHandler = async () => {
    if (chainId === 56) bscBurnEthMint();
    else ethBurnBscMint();
    setInputValue("");
  };

  return (
    <div className={styles.BridgeContainer}>
      <section className={styles.SwapSection}>
        <Dropdown
          img={currValue.left === "Avalanche C-Chain" ? ethImg : binance}
          open={dropdownOpen.left}
          side="left"
          value={currValue.left}
          valueChanger={handleSwapper}
        />
        <FontAwesomeIcon
          className={styles.SwapIcon}
          icon={faArrowDown}
          onClick={arrowSwapper}
          size="2x"
          style={{
            color: "white",
            marginTop: "0rem",
            marginLeft: "-28px",
            marginRight: "-28px",
            zIndex: "100",
            width: "20px",
            margin: "auto"
          }}
        />
        <Dropdown
          img={currValue.right === "Avalanche C-Chain" ? ethImg : binance}
          open={dropdownOpen.right}
          side="right"
          value={currValue.right}
          valueChanger={handleSwapper}
        />


      </section>
      <section className={styles.SwapSection} style={{ "border": "1px solid white", "borderRadius": "20px" }}>
        <div style={{ "display": "flex" }} >
          <img src={ENEtokenlogo} className={styles.img}></img>
          <p className={styles.text}>ENE Token</p>
        </div>
      </section>

      <section className={styles.InputSection}>

        <Input
          placeholder="0"
          label=""
          type="number"
          changeValue={setInputValue}
          value={inputValue}
        />

        <p style={{ marginLeft: "20px", fontSize: "24px", letterSpacing: "1px", fontWeight: "500", color: "white", marginTop: "-90px", marginBottom: "0" }}>
          Input &nbsp;
        </p>

        <p style={{ marginLeft: "20px", color: "#535353", marginTop: "35px", textAlign: "left", marginBottom: "-4px" }}>
          Balance : &nbsp;
          {
            balance &&
            `${formatEther(balance).split(".")[1]
              ? formatEther(balance).split(".")[0] +
              "." +
              formatEther(balance).split(".")[1].slice(0, 3)
              : formatEther(balance).split(".")[0]
            }`}
        </p>

        <Button clickHandler={clickHandler} disabled={!inputValue}>
          SWAP
        </Button>
      </section>
    </div>
  );
};

export default BridgeContainer;
