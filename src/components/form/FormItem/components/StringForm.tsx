import FormMixin, { FormMixinsProps } from "./FormMixin";
import { ElInput } from "element-plus";
import { defineComponent } from "vue";
import type EditForm from "../../../../config/create";
import type { BaseFormType, Dictionary } from "../../../../config";

export default defineComponent({
  name: "StringForm",
  props: FormMixinsProps,
  setup(props) {
    const {
      init,
      currentValue,
      info: currInfo,
      placeholder,
    } = new FormMixin(props);
    init();

    const info = currInfo as EditForm<Dictionary, BaseFormType.String>;

    return (
      <ElInput
        v-model={currentValue}
        type={info!.type}
        placeholder={placeholder}
        allow-clear={true}
        suffix-icon={info!.extraConfig?.suffixIcon}
        prefix-icon={info!.extraConfig?.prefixIcon}
      />
    );
  },
});
