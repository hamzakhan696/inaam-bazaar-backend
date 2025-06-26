import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { NestMinioModule } from 'nestjs-minio';

@Module({
  imports: [
    NestMinioModule.register({
      isGlobal: true,
      endPoint: 'storage-api.creativecodetech.com',
      useSSL: true,
      accessKey: 'CsNYYqQ73U5bo0K7wBLP',
      secretKey: 'IfeFjeIwlxai2MWLI5WgpyNsvy12kO1t9i3MOHP9',
    }),
  ],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
