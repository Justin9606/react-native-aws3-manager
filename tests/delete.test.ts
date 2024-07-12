import { RNS3 } from "../src/RNS3";

jest.mock("aws-sdk", () => {
  const mockS3 = {
    deleteObject: jest.fn().mockReturnThis(),
    promise: jest.fn().mockResolvedValue({}),
  };
  return { S3: jest.fn(() => mockS3) };
});

describe("RNS3.delete", () => {
  it("should delete a file from S3 and return the correct response", async () => {
    const options = {
      bucket: "test-bucket",
      region: "test-region",
      accessKey: "test-access-key",
      secretKey: "test-secret-key",
    };

    const response = await RNS3.delete("test-key", options);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
});
