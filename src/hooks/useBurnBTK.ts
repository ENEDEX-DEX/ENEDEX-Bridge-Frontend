import { useEthers } from "@usedapp/core";
import { toast } from "react-toastify";
import { getContracts } from "../utils/contracts";
import { useEffect, useState } from "react";
import { getWeb3 } from "../utils/web3";

const useBurnBTK = () => {
  // storing the contracts
  const [contractsData, setContractsData] = useState<any>();
  const { account } = useEthers();

  useEffect(() => {
    const getContract = async () => {
      const data = await getContracts();
      setContractsData({
        token: data[0],
        bridge: data[2]
      });
    };
    getContract();
  }, []);

  // method for approving to burn some amount of the btk token mentioned by user

  const approveBTKBurn = async (amount: string) => {
    const id = toast.success(`Approving in progress for ${amount} tokens`, {
      autoClose: false,
      closeOnClick: true,
      theme: "dark",
    });
    try {
      await contractsData.token.methods
        .approve(
          contractsData.bridge.options.address,
          getWeb3().utils.toWei(amount, "ether")
        )
        .send({
          from: account,
        });
      toast.dismiss(id);
      toast.success(`Approved ${amount} tokens`, {
        autoClose: 4000,
        closeOnClick: true,
        theme: "dark",
      });
      return await burnBTK(amount);
    } catch (err) {
      toast.dismiss(id);
      let message = (err as any).message;
      if ((err as any).code === 4001) {
        message = `Error in approving ${amount} tokens. Please try again!`;
      }

      toast.error(message, {
        autoClose: 4000,
        closeOnClick: true,
        theme: "dark",
      });
    }
  };

  // method for burning the amount of the btk token approved by user

  const burnBTK = async (amount: string) => {
    const id = toast.success(`Locking in progress for ${amount} tokens`, {
      autoClose: false,
      closeOnClick: true,
      theme: "dark",
    });
    try {
      const txHash = await contractsData.bridge.methods
        .burn(
          getWeb3().utils.toWei(amount, "ether"),
          contractsData.token.options.address)

        .send({
          from: account,
        });
        toast.dismiss(id);

      return txHash;


    } catch (err) {
      toast.dismiss(id);
      let message = (err as any).message;
      if ((err as any).code === 4001) {
        message = `Error in Locking ${amount} tokens. Please try again!`;
      }

      toast.error(message, {
        autoClose: 4000,
        closeOnClick: true,
        theme: "dark",
      });
    }
  };

  return { approveBTKBurn, burnBTK };
};

export default useBurnBTK;
