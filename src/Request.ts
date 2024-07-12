/**
 * Request
 */

const isBlank = (string: string): boolean =>
  string == null || !/\S/.test(string);

const notBlank = (string: string): boolean => !isBlank(string);

const parseHeaders = (xhr: XMLHttpRequest): Record<string, string> => {
  return (xhr.getAllResponseHeaders() || "")
    .split(/\r?\n/)
    .filter(notBlank)
    .reduce((headers: Record<string, string>, headerString: string) => {
      let header = headerString.split(":")[0];
      headers[header] = xhr.getResponseHeader(header) || "";
      return headers;
    }, {});
};

const buildResponseObject = (
  xhr: XMLHttpRequest
): { status: number; text: string; headers: Record<string, string> } => {
  let headers: Record<string, string> = {};
  try {
    headers = parseHeaders(xhr);
  } catch (e) {}
  return {
    status: xhr.status,
    text: xhr.responseText,
    headers: headers,
  };
};

const buildResponseHandler = (
  xhr: XMLHttpRequest,
  resolve: (value?: unknown) => void,
  reject: (reason?: any) => void
): (() => void) => {
  return () => {
    let fn = xhr.status === 0 ? reject : resolve;
    fn(buildResponseObject(xhr));
  };
};

const decorateProgressFn = (
  fn: (e: ProgressEvent & { percent: number }) => void
) => {
  return (e: ProgressEvent) => {
    (e as ProgressEvent & { percent: number }).percent = e.loaded / e.total;
    return fn(e as ProgressEvent & { percent: number });
  };
};

export class Request {
  static FormData: typeof FormData;
  static XMLHttpRequest: typeof XMLHttpRequest;

  private _xhr: XMLHttpRequest;
  private _formData: FormData;
  private _promise: Promise<any>;

  static create(
    url: string,
    method: string,
    attrs: Record<string, any> = {},
    headers: Record<string, any> = {}
  ) {
    return new this(url, method, attrs, headers);
  }

  constructor(
    url: string,
    method: string,
    attrs: Record<string, any> = {},
    headers: Record<string, any> = {}
  ) {
    this._xhr = new Request.XMLHttpRequest();
    this._formData = new Request.FormData();

    this._xhr.open(method, url);

    this._promise = new Promise((resolve, reject) => {
      this._xhr.onload = buildResponseHandler(this._xhr, resolve, reject);
      this._xhr.onerror = buildResponseHandler(this._xhr, resolve, reject);
    });

    Object.keys(attrs).forEach((k) => this.set(k, attrs[k]));
    Object.keys(headers).forEach((k) => this.header(k, headers[k]));
  }

  header(key: string, value: string) {
    this._xhr.setRequestHeader(key, value);
    return this;
  }

  set(key: string, value: any) {
    this._formData.append(key, value);
    return this;
  }

  send(): Promise<any> {
    this._xhr.send(this._formData);
    return this._promise;
  }

  abort() {
    this._xhr.abort();
    return this;
  }

  progress(fn: (e: ProgressEvent & { percent: number }) => void) {
    if (this._xhr.upload) {
      this._xhr.upload.onprogress = decorateProgressFn(fn);
    }
    return this;
  }

  then(...args: any[]) {
    this._promise = this._promise.then(...args);
    return this;
  }

  catch(...args: any[]) {
    this._promise = this._promise.catch(...args);
    return this;
  }
}

Request.FormData = FormData;
Request.XMLHttpRequest = XMLHttpRequest;
