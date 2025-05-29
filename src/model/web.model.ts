export class WebResponse<T> {
  succes: boolean;
  message: string;
  data: T;
  statuscode: number;
  page?: number;
  totalPage?: number;
  totalItems?: number;
}
