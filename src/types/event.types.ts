export interface EventType {
    address: string;
    blockHash: string;
    blockNumber: number;
    data: string;
    logIndex: number;
    name: string;
    removed: boolean;
    topic: string;
    topics: string[];
    transactionHash: string;
    transactionIndex: number;
    values: any;
}