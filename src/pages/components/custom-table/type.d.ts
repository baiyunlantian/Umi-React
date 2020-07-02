export interface CustomTableProps {
  url: string;
  params: object;
  loading: boolean;
  tableFields: Array<object>;
  height: string;
  pageSize: number;
  data: Array<object>
}
