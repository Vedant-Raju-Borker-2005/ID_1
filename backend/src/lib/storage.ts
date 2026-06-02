export async function uploadFile(file: any): Promise<string> {
  // Mock file upload to S3, returns a mock S3 URL
  const fileName = file.originalname || 'uploaded_document.pdf';
  return `https://s3.amazonaws.com/interior-design-platform-storage/${Date.now()}_${fileName}`;
}

export async function deleteFile(url: string): Promise<boolean> {
  // Mock file deletion
  console.log(`Mock deleted file at URL: ${url}`);
  return true;
}
