import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './useAuth';
import { api } from '@/lib/api';
import { ReactNode } from 'react';

// Mock the api module
vi.mock('@/lib/api', () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    setTokens: vi.fn(),
    clearTokens: vi.fn(),
    hasTokens: vi.fn(() => false),
    setSessionExpiredHandler: vi.fn(),
  };
  return { api: mockApi, API_URL: 'http://localhost:3001' };
});

const mockedApi = vi.mocked(api);

function wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  );
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedApi.hasTokens.mockReturnValue(false);
  });

  it('should throw when used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });

  it('should start with null user and loading true', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.staffId).toBeNull();
    expect(result.current.isAdmin).toBe(false);
  });

  it('should fetch user profile when tokens exist', async () => {
    mockedApi.hasTokens.mockReturnValue(true);
    mockedApi.get.mockResolvedValueOnce({
      id: 'user-1',
      email: 'test@test.com',
      staffId: 1,
      roles: ['admin'],
      isAdmin: true,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual({
      id: 'user-1',
      email: 'test@test.com',
      staffId: 1,
      roles: ['admin'],
      isAdmin: true,
    });
    expect(result.current.staffId).toBe(1);
    expect(result.current.isAdmin).toBe(true);
  });

  it('should clear tokens when profile fetch fails', async () => {
    mockedApi.hasTokens.mockReturnValue(true);
    mockedApi.get.mockRejectedValueOnce(new Error('Unauthorized'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(mockedApi.clearTokens).toHaveBeenCalled();
  });

  describe('signIn', () => {
    it('should set user and tokens on successful login', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        staffId: 1,
        roles: ['user'],
        isAdmin: false,
      };
      mockedApi.post.mockResolvedValueOnce({
        accessToken: 'access-123',
        refreshToken: 'refresh-456',
        user: mockUser,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      let signInResult: { error: Error | null };
      await act(async () => {
        signInResult = await result.current.signIn('test@test.com', 'password');
      });

      expect(signInResult!.error).toBeNull();
      expect(mockedApi.setTokens).toHaveBeenCalledWith('access-123', 'refresh-456');
      expect(result.current.user).toEqual(mockUser);
    });

    it('should return error on failed login', async () => {
      mockedApi.post.mockRejectedValueOnce(new Error('Invalid credentials'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      let signInResult: { error: Error | null };
      await act(async () => {
        signInResult = await result.current.signIn('bad@test.com', 'wrong');
      });

      expect(signInResult!.error).toBeInstanceOf(Error);
      expect(signInResult!.error!.message).toBe('Invalid credentials');
      expect(result.current.user).toBeNull();
    });
  });

  describe('signOut', () => {
    it('should clear user and tokens', async () => {
      mockedApi.hasTokens.mockReturnValue(true);
      mockedApi.get.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@test.com',
        staffId: null,
        roles: ['user'],
        isAdmin: false,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
      expect(mockedApi.clearTokens).toHaveBeenCalled();
    });
  });

  describe('isModerator', () => {
    it('should detect moderator role', async () => {
      mockedApi.hasTokens.mockReturnValue(true);
      mockedApi.get.mockResolvedValueOnce({
        id: 'user-1',
        email: 'mod@test.com',
        staffId: 2,
        roles: ['moderator'],
        isAdmin: false,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isModerator).toBe(true);
    });
  });
});
