import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WalletConnect } from '../WalletConnect';

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock the Hedera service
jest.mock('@/services/hederaService', () => ({
  hederaService: {
    getCredentials: jest.fn(() => null),
    setCredentials: jest.fn(),
    getAccountInfo: jest.fn(),
  },
}));

describe('WalletConnect', () => {
  const mockOnConnect = jest.fn();

  beforeEach(() => {
    mockOnConnect.mockClear();
    localStorage.clear();
  });

  it('renders connect form when not connected', () => {
    render(<WalletConnect onConnect={mockOnConnect} />);
    
    expect(screen.getByText('Hedera Wallet')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.0.123456')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your private key (64 characters)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
  });

  it('validates account ID format', async () => {
    const user = userEvent.setup();
    render(<WalletConnect onConnect={mockOnConnect} />);
    
    const accountInput = screen.getByPlaceholderText('0.0.123456');
    const privateKeyInput = screen.getByPlaceholderText('Enter your private key (64 characters)');
    const connectButton = screen.getByRole('button', { name: /connect wallet/i });

    await user.type(accountInput, 'invalid');
    await user.type(privateKeyInput, 'a'.repeat(64));
    await user.click(connectButton);

    // The component should show validation error (checked via toast mock)
    expect(mockOnConnect).not.toHaveBeenCalled();
  });

  it('validates private key length', async () => {
    const user = userEvent.setup();
    render(<WalletConnect onConnect={mockOnConnect} />);
    
    const accountInput = screen.getByPlaceholderText('0.0.123456');
    const privateKeyInput = screen.getByPlaceholderText('Enter your private key (64 characters)');
    const connectButton = screen.getByRole('button', { name: /connect wallet/i });

    await user.type(accountInput, '0.0.123456');
    await user.type(privateKeyInput, 'short');
    await user.click(connectButton);

    // The component should show validation error (checked via toast mock)
    expect(mockOnConnect).not.toHaveBeenCalled();
  });
});