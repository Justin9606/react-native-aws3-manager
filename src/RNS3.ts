/**
 * RNS3
 */

import { S3 } from "aws-sdk";
import { Request } from "./Request";
import { S3Policy } from "./S3Policy";

const AWS_DEFAULT_S3_HOST = "s3.amazonaws.com";

const EXPECTED_RESPONSE_KEY_VALUE_RE = {
  key: /<Key>(.*)<\/Key>/,
  etag: /<ETag>(.*)<\/ETag>/,
  bucket: /<Bucket>(.*)<\/Bucket>/,
  location: /<Location>(.*)<\/Location>/,
};

const entries = (o: any) => Object.keys(o).map((k) => [k, o[k]]);

const extractResponseValues = (responseText: string) => {
  return entries(EXPECTED_RESPONSE_KEY_VALUE_RE).reduce(
    (result, [key, regex]) => {
      const match = responseText.match(regex as RegExp);
      return { ...result, [key as string]: match && match[1] };
    },
    {}
  );
};

const setBodyAsParsedXML = (response: any) => {
  return {
    ...response,
    body: {
      postResponse:
        response.text == null ? null : extractResponseValues(response.text),
    },
  };
};

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
  awsUrl?: string;
}

interface S3Response {
  status: number;
  body: any;
  text?: string;
}

export class RNS3 {
  static async put(file: File, options: Options): Promise<S3Response> {
    const key = (options.keyPrefix || "") + file.name;
    const date = new Date();
    const contentType = file.type;

    const url = `https://${options.bucket}.${
      options.awsUrl || AWS_DEFAULT_S3_HOST
    }`;
    const method = "POST";
    const policy = S3Policy.generate({ ...options, key, date, contentType });

    const response = await Request.create(url, method, policy)
      .set("file", file)
      .send();

    return setBodyAsParsedXML(response);
  }

  static async delete(key: string, options: Options): Promise<S3Response> {
    const s3 = new S3({
      accessKeyId: options.accessKey,
      secretAccessKey: options.secretKey,
      region: options.region,
    });

    const params = {
      Bucket: options.bucket,
      Key: key,
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
  }

  static async get(key: string, options: Options): Promise<S3Response> {
    const s3 = new S3({
      accessKeyId: options.accessKey,
      secretAccessKey: options.secretKey,
      region: options.region,
    });

    const params = {
      Bucket: options.bucket,
      Key: key,
    };

    try {
      const url = await s3.getSignedUrlPromise("getObject", params);
      return {
        status: 200,
        body: { url },
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
  }
}
