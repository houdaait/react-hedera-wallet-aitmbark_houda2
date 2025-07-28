import { HederaService } from '@/services/hedera';
import { WalletCredentials } from '@/types/hedera';

// Mock the Hedera SDK
jest.mock('@hashgraph/sdk', () => ({
  Client: {
    forTestnet: jest.fn(() => ({
      setOperator: jest.fn(),
      close: jest.fn(),
    })),
  },
  AccountId: {
    fromString: jest.fn((id) => ({ toString: () => id })),
  },
  PrivateKey: {
    fromString: jest.fn((key) => key),
  },
  AccountInfoQuery: jest.fn(() => ({
    setAccountId: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  })),
  TransferTransaction: jest.fn(() => ({
    addHbarTransfer: jest.fn().mockReturnThis(),
    freezeWith: jest.fn().mockReturnThis(),
    sign: jest.fn(),
  })),
  TokenCreateTransaction: jest.fn(() => ({
    setTokenName: jest.fn().mockReturnThis(),
    setTokenSymbol: jest.fn().mockReturnThis(),
    setTokenType: jest.fn().mockReturnThis(),
    setSupplyType: jest.fn().mockReturnThis(),
    setInitialSupply: jest.fn().mockReturnThis(),
    setTreasuryAccountId: jest.fn().mockReturnThis(),
    setAdminKey: jest.fn().mockReturnThis(),
    setSupplyKey: jest.fn().mockReturnThis(),
    freezeWith: jest.fn().mockReturnThis(),
    sign: jest.fn(),
  })),
  Hbar: {
    fromTinybars: jest.fn((amount) => amount),
  },
  TokenType: {
    FungibleCommon: 'FUNGIBLE_COMMON',
  },
  TokenSupplyType: {
    Infinite: 'INFINITE',
  },
}));

describe('HederaService', () => {
  const mockCredentials: WalletCredentials = {
    accountId: '0.0.123456',
    privateKey: 'mock-private-key',
  };

  let hederaService: HederaService;

  beforeEach(() => {
    hederaService = new HederaService(mockCredentials);
  });

  afterEach(() => {
    hederaService.close();
  });

  test('should initialize with credentials', () => {
    expect(hederaService).toBeDefined();
  });

  test('should have required methods', () => {
    expect(typeof hederaService.getAccountInfo).toBe('function');
    expect(typeof hederaService.sendHbar).toBe('function');
    expect(typeof hederaService.createToken).toBe('function');
    expect(typeof hederaService.associateToken).toBe('function');
    expect(typeof hederaService.sendToken).toBe('function');
    expect(typeof hederaService.createTopic).toBe('function');
    expect(typeof hederaService.sendMessage).toBe('function');
    expect(typeof hederaService.getTopicMessages).toBe('function');
    expect(typeof hederaService.subscribeToTopic).toBe('function');
    expect(typeof hederaService.close).toBe('function');
  });
});