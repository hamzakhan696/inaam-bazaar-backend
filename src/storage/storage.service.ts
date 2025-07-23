import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly minioClient: Minio.Client;
  private readonly bucketName = 'inaam-bazar';

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: 'storage-api.creativecodetech.com',
      useSSL: true,
      accessKey: 'CsNYYqQ73U5bo0K7wBLP',
      secretKey: 'IfeFjeIwlxai2MWLI5WgpyNsvy12kO1t9i3MOHP9',
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const timestamp = Date.now();
    const uniqueFileName = `${folder}-${timestamp}-${Math.floor(
      Math.random() * 1e9,
    )}${path.extname(file.originalname)}`;
    
   
    const storagePath = `${uniqueFileName}`;
  
    await this.minioClient.putObject(
      this.bucketName,
      storagePath,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );
  
    return storagePath; 
  }
  
  async deleteFile(filePath: string): Promise<void> {
    const normalizedPath = filePath.replace(/\\/g, '/').replace(/\/{2,}/g, '/'); 
    await this.minioClient.removeObject(this.bucketName, normalizedPath);
  }
  

  async getFileUrl(filePath: string): Promise<string> {
    return this.minioClient.presignedGetObject(this.bucketName, filePath);
  }

  // Get permanent public URL for images (doesn't expire)
  async getPublicUrl(filePath: string): Promise<string> {
    return `https://storage-api.creativecodetech.com/${this.bucketName}/${filePath}`;
  }
}
