export interface WageViolation {
  id: string;
  companyName: string;         // 사업장명
  location: string;             // 소재지
  representative: string;       // 대표자명
  amount: number;              // 체불액(원)
  createdAt: Date;
  updatedAt: Date;
}
