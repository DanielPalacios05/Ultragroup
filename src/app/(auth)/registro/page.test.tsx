import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from './page';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/actions/auth.actions';
import { useAuthStore } from '@/store/useAuthStore';

// Next.js router mock
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Actions mock
jest.mock('@/actions/auth.actions', () => ({
    registerUser: jest.fn(),
}));

// Zustand store mock
jest.mock('@/store/useAuthStore', () => ({
    useAuthStore: jest.fn(),
}));

describe('SignupPage', () => {
    const mockPush = jest.fn();
    const mockSetAuth = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
            return selector({ login: mockSetAuth });
        });
        jest.clearAllMocks();
    });

    const fillValidForm = () => {
        fireEvent.change(screen.getByLabelText(/Nombre completo/i), { target: { value: 'John Test' } });
        fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: '1990-01-01' } });
        fireEvent.change(screen.getByLabelText(/Género/i), { target: { value: 'Masculino' } });
        fireEvent.change(screen.getByLabelText(/Tipo de documento/i), { target: { value: 'CC' } });
        fireEvent.change(screen.getByLabelText(/Número de documento/i), { target: { value: '12345678' } });
        fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '3001234567' } });
        fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/^Contraseña/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'password123' } });
    };

    it('renders registration form properly', () => {
        render(<SignupPage />);
        expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Registrarse/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty submit', async () => {
        render(<SignupPage />);
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        await waitFor(() => {
            expect(screen.getByText(/El nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument();
        });
    });

    it('shows error if passwords do not match', async () => {
        render(<SignupPage />);
        fillValidForm();
        fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'different123' } });
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        await waitFor(() => {
            expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
        });
    });

    it('calls registerUser action and redirects to viajero dashboard on success', async () => {
        (registerUser as jest.Mock).mockResolvedValue({
            id: '2',
            email: 'test@example.com',
            role: 'VIAJERO'
        });

        render(<SignupPage />);
        fillValidForm();
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith(expect.objectContaining({
                email: 'test@example.com',
                nombre: 'John Test',
            }));
            expect(mockPush).toHaveBeenCalledWith('/viajero/dashboard');
        });
    });

    it('shows server error on submission failure', async () => {
        (registerUser as jest.Mock).mockRejectedValue(new Error('Email ya está registrado'));

        render(<SignupPage />);
        fillValidForm();
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        await waitFor(() => {
            expect(screen.getByText(/Email ya está registrado/i)).toBeInTheDocument();
        });
    });
});
