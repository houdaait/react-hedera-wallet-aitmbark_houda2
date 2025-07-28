import {
  Client,
  AccountId,
  PrivateKey,
  AccountInfoQuery,
  TransferTransaction,
  Hbar,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenAssociateTransaction,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery,
  TopicId,
  TopicMessage,
  AccountBalanceQuery,
  TokenId,
  TransactionId,
  TransactionReceipt,
  TransactionRecord,
  Status
} from "@hashgraph/sdk";

export interface HederaCredentials {
  accountId: string;
  privateKey: string;
}

export interface AccountInfo {
  accountId: string;
  balance: string;
  tokens: Array<{
    tokenId: string;
    balance: string;
  }>;
}

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  receiptStatus?: string;
  error?: string;
  tokenId?: string;
  topicId?: string;
  sequenceNumber?: string;
}

export interface TopicMessageData {
  consensusTimestamp: string;
  message: string;
  sequenceNumber: string;
  runningHash: string;
}

class HederaService {
  private client: Client | null = null;
  private credentials: HederaCredentials | null = null;

  constructor() {
    // Initialize with testnet by default
    this.client = Client.forTestnet();
  }

  setCredentials(credentials: HederaCredentials) {
    this.credentials = credentials;
    if (this.client) {
      this.client.setOperator(
        AccountId.fromString(credentials.accountId),
        PrivateKey.fromString(credentials.privateKey)
      );
    }
  }

  getCredentials(): HederaCredentials | null {
    return this.credentials;
  }

  async getAccountInfo(): Promise<AccountInfo> {
    if (!this.client || !this.credentials) {
      throw new Error("Client not initialized or credentials not set");
    }

    try {
      const accountId = AccountId.fromString(this.credentials.accountId);
      
      // Get account info
      const accountInfo = await new AccountInfoQuery()
        .setAccountId(accountId)
        .execute(this.client);

      // Get account balance
      const balance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(this.client);

      // Get token balances
      const tokens = [];
      if (balance.tokens) {
        for (const [tokenId, tokenBalance] of balance.tokens) {
          tokens.push({
            tokenId: tokenId.toString(),
            balance: tokenBalance.toString()
          });
        }
      }

      return {
        accountId: accountInfo.accountId.toString(),
        balance: balance.hbars.toString(),
        tokens
      };
    } catch (error) {
      console.error('Error getting account info:', error);
      throw new Error(`Failed to get account info: ${error}`);
    }
  }

  async sendHbar(recipientId: string, amount: string): Promise<TransactionResult> {
    if (!this.client || !this.credentials) {
      throw new Error("Client not initialized or credentials not set");
    }

    try {
      const transaction = new TransferTransaction()
        .addHbarTransfer(AccountId.fromString(this.credentials.accountId), Hbar.fromString(`-${amount}`))
        .addHbarTransfer(AccountId.fromString(recipientId), Hbar.fromString(amount))
        .freezeWith(this.client);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      return {
        success: receipt.status === Status.Success,
        transactionId: txResponse.transactionId.toString(),
        receiptStatus: receipt.status.toString()
      };
    } catch (error) {
      console.error('Error sending HBAR:', error);
      return {
        success: false,
        error: `Failed to send HBAR: ${error}`
      };
    }
  }

  async createToken(name: string, symbol: string, initialSupply: string): Promise<TransactionResult> {
    if (!this.client || !this.credentials) {
      throw new Error("Client not initialized or credentials not set");
    }

    try {
      const treasuryKey = PrivateKey.fromString(this.credentials.privateKey);
      const treasuryAccountId = AccountId.fromString(this.credentials.accountId);

      const transaction = new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setTokenType(TokenType.FungibleCommon)
        .setDecimals(2)
        .setInitialSupply(parseInt(initialSupply) * 100) // Adjust for decimals
        .setTreasuryAccountId(treasuryAccountId)
        .setAdminKey(treasuryKey)
        .setSupplyKey(treasuryKey)
        .setFreezeDefault(false)
        .setSupplyType(TokenSupplyType.Infinite)
        .freezeWith(this.client);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      return {
        success: receipt.status === Status.Success,
        transactionId: txResponse.transactionId.toString(),
        receiptStatus: receipt.status.toString(),
        tokenId: receipt.tokenId?.toString()
      };
    } catch (error) {
      console.error('Error creating token:', error);
      return {
        success: false,
        error: `Failed to create token: ${error}`
      };
    }
  }

  async associateToken(tokenId: string): Promise<TransactionResult> {
    if (!this.client || !this.credentials) {
      throw new Error("Client not initialized or credentials not set");
    }

    try {
      const transaction = new TokenAssociateTransaction()
        .setAccountId(AccountId.fromString(this.credentials.accountId))
        .setTokenIds([TokenId.fromString(tokenId)])
        .freezeWith(this.client);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      return {
        success: receipt.status === Status.Success,
        transactionId: txResponse.transactionId.toString(),
        receiptStatus: receipt.status.toString()
      };
    } catch (error) {
      console.error('Error associating token:', error);
      return {
        success: false,
        error: `Failed to associate token: ${error}`
      };
    }
  }

  async sendToken(recipientId: string, tokenId: string, amount: string): Promise<TransactionResult> {
    if (!this.client || !this.credentials) {
      throw new Error("Client not initialized or credentials not set");
    }

    try {
      const transaction = new TransferTransaction()
        .addTokenTransfer(
          TokenId.fromString(tokenId),
          AccountId.fromString(this.credentials.accountId),
          -parseInt(amount) * 100 // Adjust for decimals
        )
        .addTokenTransfer(
          TokenId.fromString(tokenId),
          AccountId.fromString(recipientId),
          parseInt(amount) * 100 // Adjust for decimals
        )
        .freezeWith(this.client);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      return {
        success: receipt.status === Status.Success,
        transactionId: txResponse.transactionId.toString(),
        receiptStatus: receipt.status.toString()
      };
    } catch (error) {
      console.error('Error sending token:', error);
      return {
        success: false,
        error: `Failed to send token: ${error}`
      };
    }
  }

  async createTopic(memo: string, isPrivate: boolean): Promise<TransactionResult> {
    if (!this.client || !this.credentials) {
      throw new Error("Client not initialized or credentials not set");
    }

    try {
      const privateKey = PrivateKey.fromString(this.credentials.privateKey);
      
      let transaction = new TopicCreateTransaction()
        .setTopicMemo(memo);

      if (isPrivate) {
        transaction = transaction.setSubmitKey(privateKey);
      }

      transaction = transaction.freezeWith(this.client);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      return {
        success: receipt.status === Status.Success,
        transactionId: txResponse.transactionId.toString(),
        receiptStatus: receipt.status.toString(),
        topicId: receipt.topicId?.toString()
      };
    } catch (error) {
      console.error('Error creating topic:', error);
      return {
        success: false,
        error: `Failed to create topic: ${error}`
      };
    }
  }

  async sendMessage(topicId: string, message: string): Promise<TransactionResult> {
    if (!this.client || !this.credentials) {
      throw new Error("Client not initialized or credentials not set");
    }

    try {
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(TopicId.fromString(topicId))
        .setMessage(message)
        .freezeWith(this.client);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      return {
        success: receipt.status === Status.Success,
        transactionId: txResponse.transactionId.toString(),
        receiptStatus: receipt.status.toString(),
        sequenceNumber: receipt.topicSequenceNumber?.toString()
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: `Failed to send message: ${error}`
      };
    }
  }

  async getTopicMessages(topicId: string): Promise<TopicMessageData[]> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    return new Promise((resolve, reject) => {
      const messages: TopicMessageData[] = [];
      
      try {
        new TopicMessageQuery()
          .setTopicId(TopicId.fromString(topicId))
          .setStartTime(0)
          .subscribe(
            this.client,
            (message: TopicMessage) => {
              messages.push({
                consensusTimestamp: message.consensusTimestamp.toString(),
                message: Buffer.from(message.contents).toString(),
                sequenceNumber: message.sequenceNumber.toString(),
                runningHash: Buffer.from(message.runningHash).toString('hex')
              });
            },
            (error) => {
              console.error('Error in topic subscription:', error);
              reject(error);
            }
          );

        // Return messages after a short delay to allow initial messages to load
        setTimeout(() => {
          resolve(messages);
        }, 2000);
      } catch (error) {
        console.error('Error getting topic messages:', error);
        reject(error);
      }
    });
  }

  subscribeToTopic(topicId: string, onMessage: (message: TopicMessageData) => void): () => void {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    new TopicMessageQuery()
      .setTopicId(TopicId.fromString(topicId))
      .setStartTime(0)
      .subscribe(
        this.client,
        (message: TopicMessage) => {
          onMessage({
            consensusTimestamp: message.consensusTimestamp.toString(),
            message: Buffer.from(message.contents).toString(),
            sequenceNumber: message.sequenceNumber.toString(),
            runningHash: Buffer.from(message.runningHash).toString('hex')
          });
        },
        (error) => {
          console.error('Subscription error:', error);
        }
      );

    return () => {
      // subscription.unsubscribe();
    };
  }
}

export const hederaService = new HederaService();