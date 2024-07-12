import { RNS3 } from "../src/RNS3";

jest.mock("aws-sdk", () => {
  const mockS3 = {
    getSignedUrlPromise: jest
      .fn()
      .mockResolvedValue("https://test-bucket.s3.amazonaws.com/test-key"),
  };
  return { S3: jest.fn(() => mockS3) };
});

describe("RNS3.get", () => {
  it("should retrieve a file from S3 and return the correct response", async () => {
    const options = {
      bucket: "test-bucket",
      region: "test-region",
      accessKey: "test-access-key",
      secretKey: "test-secret-key",
    };

    const response = await RNS3.get("test-key", options);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      url: "https://test-bucket.s3.amazonaws.com/test-key",
    });
  });
});
