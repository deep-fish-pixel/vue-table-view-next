import type { Column } from "./column";
import type { AdvancedSearchType } from "./advancedSearchType";
import type { EditForm } from "./create";
import type { ReceivePageFieldConfig, RequestPageFieldConfig } from "./page";
import type {
  AvailableLanguage,
  CheckboxChangedRecords,
  Dictionary,
} from "./common";
import type { OperationConfig } from "./operation";
import type { EditConfig } from "@/config/edit";

export interface CustomListDataWrapper<Row> {
  [index: string]: Row[] | number;
}

export type ListDataWrapper<Row> = CustomListDataWrapper<Row>;

export type GetListFunc<Search extends Dictionary, Row> = (
  search: Search
) => Promise<ListDataWrapper<Row>>;

export interface InsideGlobalConfig {
  language: AvailableLanguage;
  stripe: boolean;
  border: boolean;
  round: boolean;
  size: "medium" | "small" | "large";
  searchButtonText: string;
  resetSearchButtonText: string;
  expandButtonText: string;
  getListAfterReset: boolean;
  needCustomColumnDisplay: boolean;
  customColumnDisplayStored: boolean;
  loadingDebounceTime: number;
  advancedSearchNeedExpand: boolean;
  advancedSearchFormSize: "default" | "small" | "large";
  advancedSearchLabelWidth: string | number; // 120px
  advancedSearchLabelSuffix: string; // :
  advancedSearchLabelPosition: "left" | "right" | "top"; // left
  advancedSearchDefaultHeight: string;
  advancedSearchButtonsPosition: "first-line" | "last-line"; // first-line
  advancedSearchFormColumnSpan: number; // 4
  advancedSearchFormColumnOffset: number; // 2
  getListAtCreated: boolean;
  emptyText: string;
  requestPageConfig: RequestPageFieldConfig;
  receivePageConfig: ReceivePageFieldConfig;
  operationConfig: OperationConfig<unknown>;
  paginationPosition: "left" | "right" | "center";
  paginationComponentProps?: Record<string, unknown>;
}

export type GlobalConfigType = Partial<InsideGlobalConfig>;

export interface InsideConfig<
  Row,
  Search extends Dictionary,
  Edit extends Dictionary = Dictionary
> {
  /**
   * appearance
   */
  height: string; // default 100%. You can set percentage / has unit number
  stripe: boolean;
  border: boolean;
  round: boolean;
  size: "default" | "small" | "large";
  needPagination: boolean; // true
  searchButtonText: string; // "Search"
  resetSearchButtonText: string; // "Clear"
  expandButtonText: string; // "Expand"
  needCustomColumnDisplay: boolean; // false
  customColumnDisplayStored: boolean; // true
  loadingDebounceTime: number; // 0.5s
  emptyText: string; // "No Data"
  needCheckbox: boolean;
  needRadio: boolean;
  needSeq: boolean;
  paginationPosition: "left" | "right" | "center";
  paginationComponentProps: Record<string, unknown>;

  /**
   * events
   */
  onRadioChange: (row: Row) => void;
  onCheckboxChange: (records: CheckboxChangedRecords<Row>) => void;

  /**
   * get-list
   */
  getListAtCreated: boolean; // true
  readonly getListUrl: string; // retain
  getListFunc: GetListFunc<Search, Row>;
  requestPageConfig: RequestPageFieldConfig;
  receivePageConfig: ReceivePageFieldConfig;
  getListAfterReset: boolean; // true

  /**
   * operations
   */
  useOperations: boolean; // true
  operationConfig: OperationConfig<Row>;

  /**
   * create/edit
   */
  useBuildInCreate: boolean; // true
  buildInCreateButtonText: string; // Create
  buildInEditConfig: EditConfig<Edit>;
  editForm: EditForm<Row>[];

  /**
   * column
   */
  columns: Column<Row>[];

  /**
   * advanced-search
   */
  useAdvancedSearch: boolean; // true. If you need reuse search page in dialog, this option will help you.
  advancedSearchNeedExpand: boolean; // false
  advancedSearchFormSize: "default" | "small" | "large"; // default
  advancedSearchLabelWidth: string | number; // 120px
  advancedSearchLabelSuffix: string; // :
  advancedSearchLabelPosition: "left" | "right" | "top"; // right
  advancedSearchButtonsPosition: "first-line" | "last-line"; // first-line
  advancedSearchFormColumnSpan: number; // 4
  advancedSearchFormColumnOffset: number; // 2
  advancedSearch: AdvancedSearchType<Search, Row>[];
  advancedSearchDefaultHeight: string;
}

export type Config<Row, Search extends Dictionary = Dictionary> = Partial<
  InsideConfig<Row, Search>
>;
