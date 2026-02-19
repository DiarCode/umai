// src/common/s3/s3.service.ts

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  PutBucketPolicyCommand,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';
import { AppConfigService, S3Config } from '../config/config.service';

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly client: S3Client;
  private readonly cfg: S3Config;
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly config: AppConfigService) {
    this.cfg = this.config.s3;

    const clientConfig: S3ClientConfig = {
      endpoint: this.cfg.accessEndpoint,
      region: this.cfg.region,
      credentials: {
        accessKeyId: this.cfg.accessKeyId,
        secretAccessKey: this.cfg.secretAccessKey,
      },
      forcePathStyle: Boolean(this.cfg.usePathStyle),
    };

    try {
      this.client = new S3Client(clientConfig);
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error('Failed to create S3Client', err.stack);
      } else {
        this.logger.error('Failed to create S3Client');
      }
      throw err;
    }
  }

  /** Called once Nest module is up */
  async onModuleInit() {
    await this.ensureBucketExists(this.cfg.bucket);
    await this.ensureBucketPolicy(this.cfg.bucket);
    await this.ensurePrefixObject(this.cfg.imagePrefix);
  }

  private async ensureBucketExists(bucket: string) {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: bucket }));
      this.logger.log(`Bucket "${bucket}" already exists`);
    } catch {
      this.logger.log(`Bucket "${bucket}" not found, creating…`);
      await this.client.send(new CreateBucketCommand({ Bucket: bucket }));
      this.logger.log(`Bucket "${bucket}" created`);
    }
  }

  private async ensureBucketPolicy(bucket: string) {
    try {
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucket}/*`],
          },
        ],
      };

      await this.client.send(
        new PutBucketPolicyCommand({
          Bucket: bucket,
          Policy: JSON.stringify(policy),
        }),
      );
      this.logger.log(
        `Bucket policy set for "${bucket}" - public read access enabled`,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to set bucket policy for "${bucket}"`,
          error.stack,
        );
      } else {
        this.logger.error(`Failed to set bucket policy for "${bucket}"`);
      }
      // Don't throw - continue even if policy fails
    }
  }

  private async ensurePrefixObject(prefix: string) {
    const key = prefix.endsWith('/') ? prefix : `${prefix}/`;
    try {
      // a tiny zero-byte object, length known
      await new Upload({
        client: this.client,
        params: {
          Bucket: this.cfg.bucket,
          Key: key,
          Body: '',
        },
      }).done();
      this.logger.log(`Ensured prefix object "${key}"`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to ensure prefix "${key}"`, error.stack);
      } else {
        this.logger.error(`Failed to ensure prefix "${key}"`);
      }
    }
  }

  /**
   * Sanitize content type to prevent XSS attacks.
   * HTML, SVG, and XML files are forced to text/plain to prevent execution.
   */
  private sanitizeContentType(contentType: string): string {
    const dangerous = [
      'text/html',
      'application/xhtml+xml',
      'image/svg+xml',
      'text/xml',
      'application/xml',
    ];

    const normalized = contentType.toLowerCase().split(';')[0].trim();

    if (dangerous.includes(normalized)) {
      this.logger.warn(
        `Sanitized dangerous content type "${contentType}" to "text/plain" for security`,
      );
      return 'text/plain';
    }

    return contentType;
  }

  /** Internal uploader using multipart‐capable Upload helper */
  public async uploadObject(
    key: string,
    body: Buffer | Readable,
    contentType: string,
  ): Promise<string> {
    const sanitizedContentType = this.sanitizeContentType(contentType);

    await new Upload({
      client: this.client,
      params: {
        Bucket: this.cfg.bucket,
        Key: key,
        Body: body,
        ContentType: sanitizedContentType,
        ContentDisposition: 'inline',
        ACL: 'public-read',
      },
    }).done();

    this.logger.debug(`Uploaded ${this.cfg.bucket}/${key}`);
    return key;
  }

  async uploadImage(
    filename: string,
    body: Buffer | Readable,
    contentType: string,
  ): Promise<string> {
    const key = `${this.cfg.imagePrefix}/${filename}`;
    return this.uploadObject(key, body, contentType);
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.cfg.bucket,
        Key: key,
      }),
    );
    this.logger.debug(`Deleted ${this.cfg.bucket}/${key}`);
  }
}
