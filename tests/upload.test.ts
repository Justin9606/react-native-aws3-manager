import { RNS3 } from "../src/RNS3";
import { S3 } from "aws-sdk";

jest.mock("aws-sdk", () => {
  const mockS3 = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn().mockResolvedValue({
      Key: "test-key",
      Bucket: "test-bucket",
      Location: "https://test-bucket.s3.amazonaws.com/test-key",
      ETag: '"test-etag"',
    }),
  };
  return { S3: jest.fn(() => mockS3) };
});

describe("RNS3.put", () => {
  it("should upload a file to S3 and return the correct response", async () => {
    const file = {
      uri: "https://example.com/path-to-your-file.jpg",
      name: "file-name.jpg",
      type: "image/jpeg",
    };

    const options = {
      bucket: "test-bucket",
      region: "test-region",
      accessKey: "test-access-key",
      secretKey: "test-secret-key",
      successActionStatus: 201,
    };

    const response = await RNS3.put(file, options);

    expect(response.status).toBe(201);
    expect(response.body.postResponse).toMatchObject({
      key: "test-key",
      bucket: "test-bucket",
      location: "https://test-bucket.s3.amazonaws.com/test-key",
      etag: '"test-etag"',
    });
  });
});
