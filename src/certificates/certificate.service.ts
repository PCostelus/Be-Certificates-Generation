import {
  ClassSerializerInterceptor,
  HttpStatus,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Return } from 'src/common/entities/return.class';
import { UUIDValidate } from 'src/common/entities/uuidValidate.class';
import { Certificate } from './certificate.entity';
import { CreateCertificateDto } from './classes/createCertificate.dto';
import {
  generateRegistrationNumber,
  getCertificatesStatus,
  getIndicator,
  isEmpty,
} from 'src/utils';
import { Faculty } from 'src/faculties/faculty.entity';
import { User } from 'src/users/user.entity';

import { EnumRole } from '../users/classes/user.enum';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  public async createCertificate(
    certificateData: CreateCertificateDto,
  ): Promise<Certificate | Return> {
    try {
      const currentDate = new Date()
        .toLocaleString()
        .split(',')[0]
        .replace(/\//g, '.');

      const getFaculty = await this.facultyRepository.findOne({
        where: { id: certificateData.faculty_id },
      });
      const todayCertificates = await this.certificateRepository.find({
        where: { registration_date: currentDate },
      });

      const indicatorNo = getIndicator(todayCertificates);
      const registrationNumber = generateRegistrationNumber(
        indicatorNo,
        currentDate,
        getFaculty.faculty_acronym,
      );

      certificateData['registration_number'] = registrationNumber;
      certificateData['registration_date'] = currentDate;
      return this.certificateRepository.save(
        this.certificateRepository.create(certificateData),
      );
    } catch (err) {
      console.log('Error on creating new certificate: ', err);
      return new Return(HttpStatus.BAD_REQUEST, err.message, 'Bad request');
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  public async listCertificates(): Promise<Certificate[] | Return> {
    try {
      const allCertificates = await this.certificateRepository.find({
        relations: ['user'],
      });

      if (allCertificates.length === 0) {
        return new Return(
          HttpStatus.NOT_FOUND,
          'There are no certificates',
          'Not found',
        );
      }

      const certificatesWithStatus = getCertificatesStatus(allCertificates);
      return certificatesWithStatus;
    } catch (err) {
      console.log('Error on listing all the certificates: ', err);
      return new Return(HttpStatus.BAD_REQUEST, err.message, 'Bad request');
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  public async getCertificatesByUser(
    userId: UUIDValidate,
  ): Promise<Certificate[] | Return> {
    try {
      const userCertificates = await this.certificateRepository.find({
        where: { user: userId },
        relations: ['user'],
      });

      if (userCertificates.length === 0) {
        return new Return(
          HttpStatus.NOT_FOUND,
          'There are no certificates for this user',
          'Not found',
        );
      }
      const certificatesWithStatus = getCertificatesStatus(userCertificates);
      return certificatesWithStatus;
    } catch (err) {
      console.log('Error on getting certificates for a user: ', err);
      return new Return(HttpStatus.BAD_REQUEST, err.message, 'Bad request');
    }
  }

  public async deleteCertificate(certificateId: UUIDValidate): Promise<Return> {
    const certificate = await this.certificateRepository.findOne({
      where: { id: certificateId.id },
    });
    if (isEmpty(certificate)) {
      return new Return(
        HttpStatus.NOT_FOUND,
        'User does not exist',
        'Not Found',
      );
    }
    await this.certificateRepository.delete(certificate.id);
    return new Return();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  public async getCertificatesForNotifications(
    userId: string,
  ): Promise<Certificate[] | Return> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['faculty'],
      });

      console.log(user);
      let certificates = await this.certificateRepository.find({
        where: [
          { decan_signature: IsNull() },
          { head_secretary_signature: IsNull() },
          { secretary_signature: IsNull() },
        ],
        relations: ['user', 'user.faculty'],
      });

      if (certificates.length === 0) {
        return new Return(
          HttpStatus.NOT_FOUND,
          'There are no certificates ',
          'Not found',
        );
      }
      if (user.role !== EnumRole.ADMIN) {
        certificates = certificates.filter(
          (certificate) => certificate.user.faculty.id === user.faculty.id,
        );
      }
      return certificates;
    } catch (err) {
      console.log('Error on getting certificates for notifications: ', err);
      return new Return(HttpStatus.BAD_REQUEST, err.message, 'Bad request');
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  public async signCertificate(
    certificateId: UUIDValidate,
    bodyData: any,
  ): Promise<Return> {
    try {
      const certificate = await this.certificateRepository.find({
        where: { id: certificateId.id },
      });

      if (!certificate) {
        return new Return(
          HttpStatus.NOT_FOUND,
          'The certificate does not found',
          'Not found',
        );
      }

      const signer = await this.userRepository.findOne({
        where: { id: bodyData.signer },
      });

      console.log(signer);

      const dataToUpdate = {};
      if (signer.role === EnumRole.DECAN) {
        dataToUpdate['decan_signature'] = bodyData.signing;
      }

      if (signer.role === EnumRole.HEAD_SECRETARY) {
        dataToUpdate['head_secretary_signature'] = bodyData.signing;
      }

      if (signer.role === EnumRole.SECRETARY) {
        dataToUpdate['secretary_signature'] = bodyData.signing;
      }

      console.log(dataToUpdate);
      await this.certificateRepository.update(certificateId.id, dataToUpdate);
      return new Return();
    } catch (err) {
      console.log('Error on signing the certificate: ', err);
      return new Return(HttpStatus.BAD_REQUEST, err.message, 'Bad request');
    }
  }
}
