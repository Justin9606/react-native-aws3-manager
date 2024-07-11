import { S3 } from "aws-sdk";
import RNFetchBlob from "rn-fetch-blob";
import CryptoJS from "crypto-js";

interface File {
  uri: string;
  name: string;
  type: string;
}

interface Options {
  bucket: string;
  region: string;
  accessKey: string;
  secretKey: string;
  keyPrefix?: string;
  successActionStatus?: number;
}

const uploadFile = async (file: File, options: Options) => {
  const s3 = new S3({
    accessKeyId: options.accessKey,
    secretAccessKey: options.secretKey,
    region: options.region,
  });

  // Read file data as base64
  const fileData = await RNFetchBlob.fs.readFile(file.uri, "base64");

  // Convert base64 to binary
  const binaryData = RNFetchBlob.base64.decode(fileData);

  // Create a Buffer from the binary data
  const fileBuffer = Buffer.from(binaryData, "binary");

  // Use crypto-js to hash the file name for additional security
  const hashedFileName = CryptoJS.SHA256(file.name).toString(CryptoJS.enc.Hex);

  const params = {
    Bucket: options.bucket,
    Key: `${options.keyPrefix || ""}${hashedFileName}`,
    Body: fileBuffer,
    ContentType: file.type,
  };

  try {
    const data = await s3.upload(params).promise();
    return {
      status: options.successActionStatus || 201,
      body: data,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: (error as any).statusCode || 500,
        body: { message: error.message },
      };
    }
    return {
      status: 500,
      body: { message: "Unknown error occurred" },
    };
  }
};

export default uploadFile;
