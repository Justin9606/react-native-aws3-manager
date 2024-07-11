import uploadFile from "./upload";
import deleteFile from "./delete";
import getFile from "./get";

const RNS3 = {
  put: uploadFile,
  delete: deleteFile,
  get: getFile,
};

export { RNS3 };
