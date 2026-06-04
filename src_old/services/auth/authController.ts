import { authService } from './authService';

export const authController = {
  async register(req: Request) {
    try {
      const { email, password, name } = await req.json();
      if (!email || !password) {
        return Response.json({ error: 'Email and password are required' }, { status: 400 });
      }
      const result = await authService.register(email, password, name || '');
      return Response.json(result, { status: 201 });
    } catch (error: any) {
      return Response.json({ error: error.message || 'Registration failed' }, { status: 400 });
    }
  },

  async verifyEmail(req: Request) {
    try {
      const { token } = await req.json();
      if (!token) {
        return Response.json({ error: 'Token is required' }, { status: 400 });
      }
      const result = await authService.verifyEmail(token);
      return Response.json(result, { status: 200 });
    } catch (error: any) {
      return Response.json({ error: error.message || 'Verification failed' }, { status: 400 });
    }
  },

  async login(req: Request) {
    try {
      const { email, password } = await req.json();
      if (!email || !password) {
        return Response.json({ error: 'Email and password are required' }, { status: 400 });
      }
      const result = await authService.login(email, password);
      
      // Set HttpOnly refresh token cookie
      const headers = new Headers();
      headers.append(
        'Set-Cookie',
        `refreshToken=${result.refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000; Path=/`
      );

      return Response.json({
        accessToken: result.accessToken,
        user: result.user
      }, {
        status: 200,
        headers
      });
    } catch (error: any) {
      return Response.json({ error: error.message || 'Login failed' }, { status: 401 });
    }
  },

  async refresh(req: Request) {
    try {
      // Extract from cookies if possible
      const cookieHeader = req.headers.get('cookie') || '';
      const match = cookieHeader.match(/refreshToken=([^;]+)/);
      let token = match ? match[1] : null;

      if (!token) {
        // Fallback to body
        const body = await req.json().catch(() => ({}));
        token = body.refreshToken;
      }

      if (!token) {
        return Response.json({ error: 'Refresh token is required' }, { status: 400 });
      }

      const result = await authService.refreshToken(token);
      return Response.json({ accessToken: result.accessToken }, { status: 200 });
    } catch (error: any) {
      return Response.json({ error: error.message || 'Refresh failed' }, { status: 401 });
    }
  },

  async logout(req: Request) {
    try {
      const cookieHeader = req.headers.get('cookie') || '';
      const match = cookieHeader.match(/refreshToken=([^;]+)/);
      const token = match ? match[1] : null;

      if (token) {
        await authService.logout(token);
      }

      const headers = new Headers();
      headers.append(
        'Set-Cookie',
        `refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`
      );

      return Response.json({ success: true }, { status: 200, headers });
    } catch (error: any) {
      return Response.json({ error: error.message || 'Logout failed' }, { status: 500 });
    }
  }
};
