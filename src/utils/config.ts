import { abi as BTKToken } from "../abis/TokenBSC.json";
import { abi as BSCBridge } from "../abis/BridgeBSC.json";
import { abi as AVAXToken } from "../abis/TokenAVAX.json";

export interface ContractsConfig {
  name: string;
  abi: any;
  address: string;
}

export const Contracts: ContractsConfig[] = [
  {
    name: "bENE",
    abi: BTKToken,
    address: '0x3bEcB1170183fdBc8f1603dacD1705c093BC33B7',
  },
  {
    name: "aENE",
    abi: AVAXToken,
    address: '0x214B86ed37d709C9aDA719Ec00ABBe9E0c802D1d',
  },
  {
    name: "BSCBridge",
    abi: BSCBridge,
    address: '0xA9F8f642730973FaF8ae15c9A284418f5A2F073e',  // update the contract to Bridge(including fee).sol
  },
];
