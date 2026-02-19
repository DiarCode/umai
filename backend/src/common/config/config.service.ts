import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

export interface DatabaseConfig {
  url: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface ClientConfig {
  url: string;
  cookieDomain: string;
}

export interface SecurityConfig {
  backendCorsOrigins: string[];
  allowedHosts: string[];
}

export interface S3Config {
  accessEndpoint: string;
  responseEndpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  imagePrefix: string;
  usePathStyle: boolean;
}

@Injectable()
export class AppConfigService {
  constructor(private readonly config: NestConfigService) {}

  private getRaw<T = string>(key: string): T | undefined {
    const raw = this.config.get<T | undefined>(key);
    if (typeof raw === 'string') {
      const normalized = raw.trim();
      if (!normalized) return undefined;
      return normalized as unknown as T;
    }
    return raw;
  }

  private get<T = string>(key: string, defaultValue?: T): T {
    const raw = this.getRaw<T>(key);
    if (raw !== undefined) return raw;
    if (defaultValue !== undefined) return defaultValue;
    return this.config.get<T>(key)!;
  }

  // Safely coerce env values to numbers with defaults
  private getNumber(key: string, defaultValue: number): number {
    const raw = this.getRaw<string | number>(key);
    if (raw === undefined || raw === null || raw === '') return defaultValue;
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) ? n : defaultValue;
  }

  private getBoolean(key: string, defaultValue: boolean): boolean {
    const raw = this.getRaw<string | boolean>(key);
    if (typeof raw === 'boolean') return raw;
    if (typeof raw === 'string') {
      const normalized = raw.trim().toLowerCase();
      if (!normalized) return defaultValue;
      return ['1', 'true', 'yes', 'y', 'on'].includes(normalized);
    }
    return defaultValue;
  }

  get database(): DatabaseConfig {
    return {
      url: this.get('DATABASE_URL'),
    };
  }

  // Separate JWT for admin
  get jwt(): JwtConfig {
    return {
      secret: this.get('JWT_SECRET', 'changeme'),
      expiresIn: this.get('JWT_EXPIRATION', '720h'),
    };
  }

  get client(): ClientConfig {
    const url = this.get('CLIENT_URL', 'http://localhost:3000');
    return {
      url,
      cookieDomain: new URL(url).hostname,
    };
  }

  get s3(): S3Config {
    return {
      accessEndpoint: this.get('S3_ACCESS_ENDPOINT', 'http://localhost:9000'),
      responseEndpoint: this.get(
        'S3_RESPONSE_ENDPOINT',
        'http://localhost:9000',
      ),
      region: this.get('S3_REGION', 'ap-northeast-2'),
      accessKeyId: this.get('S3_ACCESS_KEY', 'minio'),
      secretAccessKey: this.get('S3_SECRET_KEY', 'minio123'),
      bucket: this.get('S3_BUCKET', 'jinaq-media'),
      imagePrefix: this.get('S3_IMAGE_PREFIX', 'images'),
      usePathStyle: this.get<boolean>('S3_PATH_STYLE', true),
    };
  }

  get nodeEnv(): string {
    return this.get('NODE_ENVIRONMENT', 'development');
  }
  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get security(): SecurityConfig {
    const whitelist = this.get('SECURITY_ALLOWED_HOSTS', '')
      .split(',')
      .map((ip) => ip.trim())
      .filter(Boolean);

    return {
      backendCorsOrigins: this.get('SECURITY_BACKEND_CORS_ORIGINS', '').split(
        ',',
      ),
      allowedHosts: whitelist,
    };
  }
}
