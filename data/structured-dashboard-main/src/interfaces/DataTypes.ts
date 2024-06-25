export interface DataSource {
  id: string;
  name: string;
  uuid?: string;
  type: 'csv' | 'SalesForce' | 'spreadsheet';
  decodedContents?: any;
  fileMetadata?: any;
  isPreviewOpen?: boolean;
  uploaderEmail?: string;
}
