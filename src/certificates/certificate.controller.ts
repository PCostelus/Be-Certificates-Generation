import {
  Get,
  Controller,
  Param,
  Inject,
  Post,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import { Return } from 'src/common/entities/return.class';
import { UUIDValidate } from 'src/common/entities/uuidValidate.class';
import { Certificate } from './certificate.entity';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './classes/createCertificate.dto';

@Controller('api/certificate')
export class CertificateController {
  @Inject(CertificateService)
  private readonly certificateService: CertificateService;

  @Get('/')
  public listCertificates(): Promise<Certificate[] | Return> {
    return this.certificateService.listCertificates();
  }

  @Get('/notifications')
  public getCertificatesForNotifications(
    @Query() query,
  ): Promise<Certificate[] | Return> {
    console.log(query);
    return this.certificateService.getCertificatesForNotifications(
      query.userId,
    );
  }

  @Get('/:id')
  public getUserCertificates(
    @Param() id: UUIDValidate,
  ): Promise<Certificate[] | Return> {
    return this.certificateService.getCertificatesByUser(id);
  }

  @Delete(':id')
  public deleteCertificate(@Param() id: UUIDValidate): Promise<Return> {
    return this.certificateService.deleteCertificate(id);
  }

  @Post()
  public createCertificate(
    @Body() body: CreateCertificateDto,
  ): Promise<Certificate | Return> {
    return this.certificateService.createCertificate(body);
  }

  @Post('sign/:id')
  public signCertificate(
    @Body() body: any,
    @Param() id: UUIDValidate,
  ): Promise<Return> {
    return this.certificateService.signCertificate(id, body);
  }
}
