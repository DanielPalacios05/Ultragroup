import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { useRouter } from 'next/navigation';
import { loginUser, setAuthCookie } from '@/actions/auth.actions';
import { useAuthStore } from '@/store/useAuthStore';

// Next.js router mock
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Actions mock
jest.mock('@/actions/auth.actions', () => ({
    loginUser: jest.fn(),
    setAuthCookie: jest.fn(),
}));

// Zustand store mock
jest.mock('@/store/useAuthStore', () => ({
    useAuthStore: jest.fn(),
}));

describe('LoginPage', () => {
    const mockPush = jest.fn();
    const mockSetAuth = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
            return selector({ login: mockSetAuth });
        });
        jest.clearAllMocks();
    });

    it('renders login form properly', () => {
        render(<LoginPage />);
        expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument();
    });

    it('shows error messages on invalid submit', async () => {
        render(<LoginPage />);
        fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

        await waitFor(() => {
            expect(screen.getByText(/Correo electrónico inválido/i)).toBeInTheDocument();
            expect(screen.getByText(/La contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
        });
    });

    it('calls loginUser action and redirects to viajero dashboard on success', async () => {
        (loginUser as jest.Mock).mockResolvedValue({
            user: { id: '1', email: 'test@test.com', role: 'VIAJERO' },
            token: 'fake-token',
        });

        render(<LoginPage />);

        // Fill the form
        fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith({
                email: 'test@test.com',
                password: 'password123',
                role: 'VIAJERO'
            });
            expect(setAuthCookie).toHaveBeenCalledWith('fake-token');
            expect(mockSetAuth).toHaveBeenCalledWith('fake-token', { id: '1', email: 'test@test.com', role: 'VIAJERO' });
            expect(mockPush).toHaveBeenCalledWith('/viajero/dashboard');
        });
    });

    it('shows server error on submission failure', async () => {
        (loginUser as jest.Mock).mockRejectedValue(new Error('Credenciales inválidas'));

        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'wrongpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

        await waitFor(() => {
            expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
        });
    });
});
