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
    address: '0x4aD3052035147636B37E669F9D5fE4298b03F567',  // update the contract to Bridge(including fee).sol
  },
];
