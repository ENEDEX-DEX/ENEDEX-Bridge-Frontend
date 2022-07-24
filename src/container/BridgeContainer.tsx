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
let BridgeState_BSC: null;
let AvaxState: number;
let hash: string;


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

  Axios.post("/BridgeState_BSC", {})   // To get the ETH bridge balance first time from node server.js
    .then(res => {
      BridgeState_BSC = res.data.state_bsc;
    })
    .catch(error => {
      console.log(error);
    })

  Axios.post("/AVAXToken_state", {})   // To get the ETH bridge balance first time from node server.js
    .then(res => {
      AvaxState = res.data.state_avax;
    })
    .catch(error => {
      console.log(error);
    })


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
    '0x4ad3052035147636b37e669f9d5fe4298b03f567'
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
      if (BridgeState_BSC != null && AvaxState >= 0) {
        if (Number(bridgebalanceBSC?.toString()) > Number(inputValue) * 1000000000000000000 || bridgebalanceBSC?.toString() === undefined) {
          if (Number(BNBbalance) > 0.01) {
            const txHash = await approveAVAXBurn(inputValue);
            console.log(txHash);
            let burn_transaction = "https://snowtrace.io/tx/"
            burn_transaction = burn_transaction.concat(txHash.transactionHash)
            let burn_tran_head = txHash.transactionHash.substring(0, 4);
            let burn_tran_end = txHash.transactionHash.substring(63, 66);
            toast.success(
              <a target={"_blank"} href={burn_transaction} style={{ "color": "white", "textDecoration": "auto" }}>
                Burned {inputValue} ENE tokens
                https://snowtrace.io/tx/{burn_tran_head}...{burn_tran_end}
              </a>,
              {
                autoClose: 10000,
                closeOnClick: true,
                theme: "dark",
              });
            toast.success("Minting for ENE tokens in progress!", {
              theme: "dark",
              autoClose: 6000,
              closeOnClick: true,
            });
            await Axios.post("/mint-bsc", {
              txHash: txHash.transactionHash,
            })
              .then(res => {
                hash = res.data.hash;
              })
              .catch(error => {
                console.log(error);
              });
            let transaction = "https://bscscan.com/tx/"
            transaction = transaction.concat(hash)
            let tran_head = hash.substring(0, 4);
            let tran_end = hash.substring(63, 66);

            toast.success(
              <a target={"_blank"} href={transaction} style={{ "color": "white", "textDecoration": "auto" }}>
                Minted ENE tokens successfully!
                https://bscscan.com/tx/{tran_head}...{tran_end}
              </a>,
              {
                theme: "dark",
                autoClose: 10000,
                closeOnClick: true,
              }
            );
          } else {
            toast.error('There’s not enough gas fee on Admin wallet.', {
              theme: "dark",
              autoClose: 7000,
              closeOnClick: true,
            }
            );
          }
        } else {
          toast.error('There’s not enough fund in the bridging contract address on Binance Smart Chain networks.', {
            theme: "dark",
            autoClose: 7000,
            closeOnClick: true,
          }
          );
        }
      } else {
        toast.error('There’s some problems on Bridge. Please wait', {
          theme: "dark",
          autoClose: 7000,
          closeOnClick: true,
        }
        );
      }
    } catch (err) {
      toast.error((err as any).message, {
        theme: "dark",
        autoClose: 7000,
        closeOnClick: true,
      });
    }
  };

  const bscBurnEthMint = async () => {
    AVAXbalance = await AVAXweb3.eth.getBalance("0x3f1991E3A7f296030fD22472919B918F869c26DE"); // admin wallet address
    AVAXbalance = AVAXweb3.utils.fromWei(AVAXbalance, 'ether');
    try {
      if (BridgeState_BSC != null && AvaxState >= 0) {
        if (Number(AVAXbalance) > 0.05) {
          const txHash = await approveBTKBurn(inputValue);
          console.log(txHash);
          let burn_transaction = "https://bscscan.com/tx/"
          burn_transaction = burn_transaction.concat(txHash.transactionHash)
          let burn_tran_head = txHash.transactionHash.substring(0, 4);
          let burn_tran_end = txHash.transactionHash.substring(63, 66);
          toast.success(
            <a target={"_blank"} href={burn_transaction} style={{ "color": "white", "textDecoration": "auto" }}>
              Locked {inputValue} ENE tokens
              https://bscscan.com/tx/{burn_tran_head}...{burn_tran_end}
            </a>,
            {
              autoClose: 10000,
              closeOnClick: true,
              theme: "dark",
            });
          toast.success("Release for ENE tokens in progress!", {
            theme: "dark",
            autoClose: 6000,
            closeOnClick: true,
          });
          await Axios.post("/mint-avax", {
            txHash: txHash.transactionHash,
          })
            .then(res => {
              hash = res.data.hash;
            })
            .catch(error => {
              console.log(error);
            });
          let transaction = "https://snowtrace.io/tx/"
          transaction = transaction.concat(hash)
          let tran_head = hash.substring(0, 4);
          let tran_end = hash.substring(63, 66);

          toast.success(
            <a target={"_blank"} href={transaction} style={{ "color": "white", "textDecoration": "auto" }}>
              Released ENE tokens successfully!
              https://snowtrace.io/tx/{tran_head}...{tran_end}
            </a>,
            {
              theme: "dark",
              autoClose: 10000,
              closeOnClick: true,
            }

          );

        } else {
          toast.error('There’s not enough gas fee on Admin wallet.', {
            theme: "dark",
            autoClose: 7000,
            closeOnClick: true,
          }
          );
        }
      } else {
        toast.error('There are some problems on Bridge. Please wait', {
          theme: "dark",
          autoClose: 7000,
          closeOnClick: true,
        }
        );
      }

    } catch (err) {
      toast.error((err as any).message, {
        theme: "dark",
        autoClose: 7000,
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

        <p style={{ marginLeft: "20px", color: "#535353", marginTop: "35px", textAlign: "left" }}>
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
      <p style={{ "color": "white" }}>{chainId === 56 ? "AVAX ENE token address: 0x214B86ed37d709C9aDA719Ec00ABBe9E0c802D1d" : "BSC ENE token address: 0x3bEcB1170183fdBc8f1603dacD1705c093BC33B7"}</p>
    </div>

  );
};

export default BridgeContainer;
