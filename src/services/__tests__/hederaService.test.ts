import { hederaService } from '../hederaService';

// Mock the Hedera SDK
jest.mock('@hashgraph/sdk', () => ({
  Client: {
    forTestnet: jest.fn(() => ({
      setOperator: jest.fn(),
    })),
  },
  AccountInfoQuery: jest.fn(),
  TransferTransaction: jest.fn(),
  TokenCreateTransaction: jest.fn(),
  TokenAssociateTransaction: jest.fn(),
  TopicCreateTransaction: jest.fn(),
  TopicMessageSubmitTransaction: jest.fn(),
  TopicMessageQuery: jest.fn(),
  AccountId: {
    fromString: jest.fn(),
  },
  PrivateKey: {
    fromString: jest.fn(),
  },
  Hbar: {
    fromTinybars: jest.fn(),
  },
}));

describe('HederaService', () => {
  beforeEach(() => {
    // Clear any stored credentials
    hederaService.setCredentials(null);
  });

  it('should store and retrieve credentials', () => {
    const credentials = {
      accountId: '0.0.123456',
      privateKey: 'a'.repeat(64),
    };

    hederaService.setCredentials(credentials);
    expect(hederaService.getCredentials()).toEqual(credentials);
  });

  it('should clear credentials when set to null', () => {
    const credentials = {
      accountId: '0.0.123456',
      privateKey: 'a'.repeat(64),
    };

    hederaService.setCredentials(credentials);
    hederaService.setCredentials(null);
    expect(hederaService.getCredentials()).toBeNull();
  });

  it('should throw error when getting account info without credentials', async () => {
    await expect(hederaService.getAccountInfo()).rejects.toThrow('No credentials set');
  });

  it('should throw error when sending HBAR without credentials', async () => {
    await expect(hederaService.sendHbar('0.0.654321', '100')).rejects.toThrow('No credentials set');
  });
});