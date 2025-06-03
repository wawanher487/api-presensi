export class WebResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statuscode: number;
  page?: number;
  totalPages?: number;
  totalItems?: number;
}
