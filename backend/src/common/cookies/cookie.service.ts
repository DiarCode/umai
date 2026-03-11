import { FastifyReply } from 'fastify';
import { GUEST_TOKEN_COOKIE, SESSION_MAX_AGE, AUTH_COOKIE , AUTH_COOKIE_MAX_AGE } from '../../modules/menu/sessions/constants/session.constants';

export class CookieService {
  static assignGuestToken(reply: FastifyReply, token: string) {
    reply.setCookie(GUEST_TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
  }
  static assignAuthToken(reply: FastifyReply, token: string) {
    reply.setCookie(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: AUTH_COOKIE_MAX_AGE,
    });
  }
}