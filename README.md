# react-native-s3-manager

A React Native library for managing uploads, deletions, and retrievals from AWS S3 with enhanced features.

## Description

`react-native-s3-manager` provides an easy-to-use interface for uploading, deleting, and retrieving files from AWS S3 in React Native applications. This library leverages AWS SDK and offers additional features and security using `crypto-js`.

## Installation

### Using npm

To install the library and its dependencies, run:

```bash
npm install react-native-s3-manager rn-fetch-blob crypto-js aws-sdk
```

## Using yarn

To install the library and its dependencies, run:

```bash
yarn add react-native-s3-manager rn-fetch-blob crypto-js aws-sdk

```

## Usage

# Uploading a File

To upload a file to AWS S3, use the `put` method provided by the library.

```jsx
import { RNS3 } from "react-native-s3-manager";

const file = {
  uri: "path-to-your-file",
  name: "file-name.jpg",
  type: "image/jpeg",
};

const options = {
  bucket: "your-bucket",
  region: "your-region",
  accessKey: "your-access-key",
  secretKey: "your-secret-key",
  successActionStatus: 201,
};

RNS3.put(file, options)
  .then((response) => {
    if (response.status !== 201) {
      throw new Error("Failed to upload image to S3");
    }
    console.log("Successfully uploaded file to S3:", response.body);
  })
  .catch((error) => {
    console.error("Error uploading file to S3:", error);
  });
```

## Deleting a File

To delete a file from AWS S3, use the `delete` method provided by the library.

```jsx
import { RNS3 } from "react-native-s3-manager";

const options = {
  bucket: "your-bucket",
  region: "your-region",
  accessKey: "your-access-key",
  secretKey: "your-secret-key",
};

RNS3.delete("uploads/file-name.jpg", options)
  .then((response) => {
    if (response.status !== 204) {
      throw new Error("Failed to delete file from S3");
    }
    console.log("Successfully deleted file from S3");
  })
  .catch((error) => {
    console.error("Error deleting file from S3:", error);
  });
```

## Retrieving a File

To retrieve a file from AWS S3, use the `get` method provided by the library.

```jsx
import { RNS3 } from "react-native-s3-manager";

const options = {
  bucket: "your-bucket",
  region: "your-region",
  accessKey: "your-access-key",
  secretKey: "your-secret-key",
};

RNS3.get("uploads/file-name.jpg", options)
  .then((response) => {
    if (response.status !== 200) {
      throw new Error("Failed to retrieve file from S3");
    }
    console.log("Successfully retrieved file from S3:", response.body);
  })
  .catch((error) => {
    console.error("Error retrieving file from S3:", error);
  });
```

## API

# RNS3.put(file, options)

Uploads a file to AWS S3.

- `file`: Object containing `uri`, `name`, and `type` of the file.
- `options`: Object containing `bucket`, `region`, `accessKey`, `secretKey`, `keyPrefix`, and `successActionStatus`.

# RNS3.delete(key, options)

Deletes a file from AWS S3.

- `key`: String representing the key of the file to retrieve.
- `options`: Object containing `bucket`, `region`, `accessKey`, and `secretKey`.

# RNS3.get(key, options)

Retrieves a file from AWS S3.

- `key`: String representing the key of the file to retrieve.
- `options`: Object containing `bucket`, `region`, `accessKey`, and `secretKey`.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Justin9606/react-native-s3-manager/blob/master/LICENSE.txt) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs, improvements, or new features.

## Issues

If you encounter any issues, please report them on the [GitHub Issues](https://github.com/Justin9606/react-native-s3-manager/issues) page.

## Repository

Find the source code and contribute on GitHub: [react-native-s3-manager](https://github.com/Justin9606/react-native-s3-manager)

## Author

[Tokhirjon](https://tonybek.com/)

Feel free to reach out for any questions or feedback.