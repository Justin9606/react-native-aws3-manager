import { S3 } from "aws-sdk";
import CryptoJS from "crypto-js";

interface Options {
  bucket: string;
  region: string;
  accessKey: string;
  secretKey: string;
}

const deleteFile = async (key: string, options: Options) => {
  const s3 = new S3({
    accessKeyId: options.accessKey,
    secretAccessKey: options.secretKey,
    region: options.region,
  });

  // Use crypto-js to hash the file name for additional security
  const hashedFileName = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);

  const params = {
    Bucket: options.bucket,
    Key: hashedFileName,
  };

  try {
    const data = await s3.deleteObject(params).promise();
    return {
      status: 204,
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

export default deleteFile;
