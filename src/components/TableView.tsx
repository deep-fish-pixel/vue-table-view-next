import type { PropType } from "vue";
import { defineComponent, onBeforeUnmount, onMounted, provide, ref } from "vue";
import { TableViewHeader } from "./header";
import { TableViewBody } from "./body";
import { TableViewFooter } from "./TableViewFooter";
import type { Config, Dictionary, PaginationData } from "@/config";
import { merge } from "lodash-es";
import GlobalConfig from "@/utils/globalConfig";

const TableView = <Row, Search extends Dictionary, Edit extends Dictionary>() =>
  defineComponent({
    name: "TableView",
    props: {
      config: {
        type: Object as PropType<Config<Row, Search>>,
        required: true,
      },
    },
    setup(props, { slots }) {
      const Header = TableViewHeader<Row, Search>();
      const Body = TableViewBody<Row, Search>();
      const Footer = TableViewFooter<Row, Search>();
      const headerRef = ref<typeof Header | null>(null);
      const bodyRef = ref(null);
      const footerRef = ref(null);

      const loading = ref(false);
      const searchValue = ref<Search | {}>({});
      const currentConfig = ref<Config<Row, Search>>(
        merge({}, GlobalConfig.globalConfig, props.config)
      );
      const dataList = ref<Row[]>();
      const paginationInfo = ref<PaginationData>({
        currentPage: 1,
        perPage: currentConfig.value.requestPageConfig?.pageSizes?.[0] || 10,
        currentPageSize: 10,
        total: 0,
        pageAmount: 0,
      });

      provide("loading", loading);
      provide("currentConfig", currentConfig);
      provide("dataList", dataList);
      provide("paginationInfo", paginationInfo);

      async function getList(): Promise<void> {
        if (typeof currentConfig.value.getListFunc !== "function") {
          throw new SyntaxError("The config => getListFunc is not a function");
        } else {
          const search: Search = { ...searchValue.value };

          // @ts-ignore
          search[currentConfig!.value.requestPageConfig!.perPage!] =
            paginationInfo?.value.perPage;
          // @ts-ignore
          search[currentConfig!.value.requestPageConfig!.currentPage!] =
            paginationInfo?.value.currentPage;

          loading.value = true;
          const res = await currentConfig.value.getListFunc(search);
          loading.value = false;

          dataList.value = res[
            currentConfig.value.receivePageConfig!.list
          ] as Row[];

          currentConfig.value.receivePageConfig?.currentPage &&
            (paginationInfo.value.currentPage = res[
              currentConfig.value.receivePageConfig.currentPage
            ] as number);

          currentConfig.value.receivePageConfig?.perPage &&
            (paginationInfo.value.perPage = res[
              currentConfig.value.receivePageConfig.perPage
            ] as number);

          currentConfig.value.receivePageConfig?.currentPageSize &&
            (paginationInfo.value.currentPageSize = res[
              currentConfig.value.receivePageConfig.currentPageSize
            ] as number);

          currentConfig.value.receivePageConfig?.total &&
            (paginationInfo.value.total = res[
              currentConfig.value.receivePageConfig.total
            ] as number);

          currentConfig.value.receivePageConfig?.pages &&
            (paginationInfo.value.pageAmount = res[
              currentConfig.value.receivePageConfig.pages
            ] as number);
        }
      }

      function searchChange(val: Search) {
        searchValue.value = val;
      }

      function onCurrentPageChange(evt: CustomEvent<{ page: number }>): void {
        paginationInfo.value.currentPage = evt.detail.page;
        getList().then(() => {
          // ... do sth
        });
      }

      function onPageSizeChange(evt: CustomEvent<{ size: number }>): void {
        paginationInfo.value.perPage = evt.detail.size;
        getList().then(() => {
          // ... do sth
        });
      }

      function setEventListener(): void {
        window.addEventListener(
          "vue-table-view-current-page-change",
          onCurrentPageChange
        );
        window.addEventListener(
          "vue-table-view-page-size-change",
          onPageSizeChange
        );
        window.addEventListener("vue-table-view-refresh-table", getList);
      }

      function removeEventListener(): void {
        window.removeEventListener(
          "vue-table-view-current-page-change",
          onCurrentPageChange
        );
        window.removeEventListener(
          "vue-table-view-page-size-change",
          onPageSizeChange
        );
        window.removeEventListener("vue-table-view-refresh-table", getList);
      }

      function doCreate(): void {}

      onMounted(async () => {
        if (currentConfig.value.getListAtCreated) {
          await getList();
        }

        setEventListener();
      });

      onBeforeUnmount(() => {
        removeEventListener();
      });

      const headerSlots = {
        buttons: () => slots.buttons?.(),
      };

      return () => (
        <div
          class="table-view"
          style={{ height: currentConfig?.value.height ?? "100%" }}
        >
          <Header
            ref={headerRef}
            onDoSearch={getList}
            onSearchChange={searchChange}
            onDoCreate={doCreate}
            v-slots={headerSlots}
          />
          <Body ref={bodyRef} />
          <Footer ref={footerRef} />
        </div>
      );
    },
    methods: {
      refreshList() {
        window.dispatchEvent(new CustomEvent("vue-table-view-refresh-table"));
      },
      editRow(row: Row) {
        window.dispatchEvent(
          new CustomEvent("vue-table-view-edit-row", {
            detail: {
              row,
            },
          })
        );
      },
    },
  });

export default TableView();
