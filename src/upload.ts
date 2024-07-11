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

  const fileData = await RNFetchBlob.fs.readFile(file.uri, "base64");
  const fileBlob = new Blob([fileData], { type: file.type });

  // Use crypto-js to hash the file name for additional security
  const hashedFileName = CryptoJS.SHA256(file.name).toString(CryptoJS.enc.Hex);

  const params = {
    Bucket: options.bucket,
    Key: `${options.keyPrefix || ""}${hashedFileName}`,
    Body: fileBlob,
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
