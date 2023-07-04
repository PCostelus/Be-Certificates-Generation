import { Certificate } from './certificates/certificate.entity';

export const isEmpty = (value: any): boolean => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

export const getIndicator = (todayCertificates: any): number => {
  let maxIndicator = 1;
  if (todayCertificates.length === 0) return 1;
  for (const certificate of todayCertificates) {
    const registrationNumber = certificate.registration_number;
    const indicator = registrationNumber.split('/')[1];
    if (+indicator > maxIndicator) {
      maxIndicator = +indicator;
    }
  }

  return maxIndicator + 1;
};

export const generateRegistrationNumber = (
  indicatorNo: number,
  currentDate: string,
  acronym: string,
): string => {
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  const generator = 100 + currentDay + currentMonth * 33;

  return `${generator}/${indicatorNo}/${acronym}/${currentDate}`;
};

export const getCertificatesStatus = (
  certifications: Certificate[],
): Certificate[] => {
  for (let i = 0; i < certifications.length; i++) {
    if (
      certifications[i].decan_signature === null ||
      certifications[i].head_secretary_signature === null ||
      certifications[i].secretary_signature === null
    ) {
      certifications[i]['status'] = 'pending';
    } else if (
      certifications[i].decan_signature === false ||
      certifications[i].head_secretary_signature === false ||
      certifications[i].secretary_signature === false
    ) {
      certifications[i]['status'] = 'rejected';
    } else certifications[i]['status'] = 'approved';
  }

  return certifications;
};
