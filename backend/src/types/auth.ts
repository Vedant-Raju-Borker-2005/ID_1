export interface JWTPayload {
  id: string;
  email?: string;
  workspaceId?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  isVerified: boolean;
}

export interface RegisterResult {
  id: string;
  email: string;
  verificationSent: boolean;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}
