import { getColonyNetworkClient, Network, getLogs, getBlockTime } from '@colony/colony-js';
import { Wallet } from 'ethers';
import { InfuraProvider } from 'ethers/providers';
import { utils } from 'ethers';
import * as blockies from 'blockies-ts';
import { EventType } from '../types/event.types';

const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;

const provider = new InfuraProvider();

const wallet = Wallet.createRandom();
const connectedWallet = wallet.connect(provider);

let colonyClientInstance:any = null;

const tokens = [
  {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI'
  },
  {
      address: '0x0dd7b8f3d1fa88FAbAa8a04A0c7B52FC35D4312c',
      symbol: 'BLNY'
  }
]

export const getColonyClient = async (): Promise<void> => {
  const networkClient = await getColonyNetworkClient(
    Network.Mainnet,
    connectedWallet,
    {
      networkAddress: MAINNET_NETWORK_ADDRESS
    },
  );
  const colonyClient = await networkClient.getColonyClient(MAINNET_BETACOLONY_ADDRESS);
  colonyClientInstance = colonyClient
}

export const getEvents = async (): Promise<EventType[]> => {
  if (colonyClientInstance) {
    const eventFilter = colonyClientInstance.filters.PayoutClaimed();
    const eventLogs = await getLogs(colonyClientInstance, eventFilter);
    const parsedLogs = eventLogs.map(event => {
      const parsedEvent = colonyClientInstance.interface.parseLog(event);
      return {...event, ...parsedEvent}
    });
    parsedLogs.reverse();
    return parsedLogs
  } else {
    await getColonyClient();
    const events:EventType[] = await getEvents();
    return events;
  }
}

export const getUserAddress = async (event:EventType): Promise<string> => {
  if (!colonyClientInstance) {
    await getColonyClient()
  }
  const singleLog = event;

  const humanReadableFundingPotId = new utils.BigNumber(
    singleLog.values.fundingPotId
  ).toString();
  
  const {
    associatedTypeId,
  } = await colonyClientInstance.getFundingPot(humanReadableFundingPotId);
  
  const { recipient: userAddress } = await colonyClientInstance.getPayment(associatedTypeId);

  return userAddress;
}
export const decodeAmount = (rawData: any): string => {
  const humanReadableAmount = new utils.BigNumber(rawData);
  const wei = new utils.BigNumber(10);
  const convertedAmount = humanReadableAmount.div(wei.pow(18));
  return convertedAmount.toString();
}

export const parseFundingPotId = (rawData: any): string => {
  const humanReadableFundingPotId = new utils.BigNumber( rawData ).toString();
  return humanReadableFundingPotId
}


export const getEventTime = async (event: EventType): Promise<number> => {
  return await getBlockTime(provider, event.blockHash);
}


export const getSymbolByAddress = (address: string ): string | undefined => {
    const token = tokens.find(item => {
        return item.address === address;
    })
    return token?.symbol;
}
export const getIcon = (address:string): string => {
    return blockies.create({
        seed: address, 
        size: 12, 
        scale: 3, 
        spotcolor: '#000' 
    }).toDataURL();
}