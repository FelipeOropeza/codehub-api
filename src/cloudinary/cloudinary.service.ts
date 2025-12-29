import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { Readable } from 'stream'

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
    })
  }

  uploadFromBuffer(
    buffer: Buffer,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error)
          resolve(result as UploadApiResponse)
        },
      )

      Readable.from(buffer).pipe(stream)
    })
  }
}
