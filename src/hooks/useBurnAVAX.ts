import { useEthers } from "@usedapp/core";
import { toast } from "react-toastify";
import { getContracts } from "../utils/contracts";
import { useEffect, useState } from "react";
import { getWeb3 } from "../utils/web3";

const useBurnAVAX = () => {
  // storing the contracts
  const [contractsData, setContractsData] = useState<any>();
  const { account } = useEthers();

  useEffect(() => {
    const getContract = async () => {
      const data = await getContracts();
      setContractsData({
        token: data[1],
      });
    };
    getContract();
  }, []);

  // method for approving to burn some amount of the AVAX token mentioned by user

  const approveAVAXBurn = async (amount: string) => {
    const id = toast.success(`Approving in progress for ${amount} ENE tokens`, {
      autoClose: false,
      closeOnClick: true,
      theme: "dark",
    });
    try {
      await contractsData.token.methods
        .approve(
          account,
          getWeb3().utils.toWei(amount, "ether")
        )
        .send({
          from: account,
        });
      console.log(amount);
      toast.dismiss(id);
      toast.success(`Approved ${amount} ENE tokens`, {
        autoClose: 4000,
        closeOnClick: true,
        theme: "dark",
      });
      return await burnAVAX(amount);
    } catch (err) {
      toast.dismiss(id);
      let message = (err as any).message;
      if ((err as any).code === 4001) {
        message = `Error in approving ${amount} ENE tokens. Please try again!`;
      }

      toast.error(message, {
        autoClose: 4000,
        closeOnClick: true,
        theme: "dark",
      });
    }
  };

  // method for burning the amount of the AVAX token approved by user

  const burnAVAX = async (amount: string) => {
    const id = toast.success(`Burning in progress for ${amount} ENE tokens`, {
      autoClose: false,
      closeOnClick: true,
      theme: "dark",
    });
    try {

      const txHash = await contractsData.token.methods
        .burnFrom(
          account,
          getWeb3().utils.toWei(amount, "ether"))
        .send({
          from: account,
        });
      toast.dismiss(id);
      return txHash;

    } catch (err) {
      toast.dismiss(id);
      let message = (err as any).message;
      if ((err as any).code === 4001) {
        message = `Error in burning ${amount} ENE tokens. Please try again!`;
      }

      toast.error(message, {
        autoClose: 4000,
        closeOnClick: true,
        theme: "dark",
      });
    }
  };

  return { approveAVAXBurn, burnAVAX };
};

export default useBurnAVAX;
