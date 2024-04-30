import {
  BlobSASPermissions,
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";

export const containerName = "posts";

const accountName = process.env.AZURE_STORAGE_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

if (!accountName || !accountKey) {
  throw new Error("Azure Storage account name and key are required");
}

const shareKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  shareKeyCredential
);

async function generateSASToken() {
  const containersClient = blobServiceClient.getContainerClient(containerName);

  const permissions = new BlobSASPermissions();
  permissions.write = true;
  permissions.read = true;
  permissions.create = true;

  const expireDate = new Date();
  expireDate.setMinutes(expireDate.getMinutes() + 30);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: containersClient.containerName,
      permissions: permissions,
      expiresOn: expireDate,
    },
    shareKeyCredential
  ).toString();

  return sasToken;
}

export default generateSASToken