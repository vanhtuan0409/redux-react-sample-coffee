import { State } from "jumpstate";
import get from "lodash/get";
import setIn from "@utils/setIn";

export default State("form", {
  initial: {
    currentStep: 1,
    data: {
      customer: {
        name: "Lê Anh Quân",
        phone: "09123123123",
        email: "",
        deliver_now: true
      },
      location: {
        address: "Chung cư cao cấp Ecolife Captiol, Tố Hữu, Trung Văn",
        district: "Từ Liêm",
        city: "Hà Nội"
      },
      // Projection on item count
      items: {},

      // Projection on group count
      groupCount: {}
    }
  },

  goToNextStep(state) {
    if (state.currentStep >= 5) return state;
    return Object.assign({}, state, {
      currentStep: state.currentStep + 1
    });
  },

  goToPreviousStep(state) {
    if (state.currentStep <= 1) return state;
    return Object.assign({}, state, {
      currentStep: state.currentStep - 1
    });
  },

  setFormData(state, { name, data }) {
    const fullPath = `data.${name}`;
    return setIn(fullPath, data, state);
  },

  // Special action for handle add item
  // Consider to refactor
  addItem(state, { product, size }) {
    // Calculate product/size count
    const sizeCountPath = `${product.id}.sizes.${size.name}.quantity`;
    const previousSizeCount = get(state.data.items, sizeCountPath, 0);
    let newItemCount = setIn(`${product.id}.info`, product, state.data.items);
    newItemCount = setIn(
      `${product.id}.sizes.${size.name}`,
      {
        ...size,
        quantity: previousSizeCount + 1
      },
      newItemCount
    );

    // Calculate product total count
    const productCountPath = `${product.id}.total`;
    const previousTotal = get(state.data.items, productCountPath, 0);
    newItemCount = setIn(productCountPath, previousTotal + 1, newItemCount);

    // Calculate group total count
    const previousGroupCount = get(state.data.groupCount, product.group, 0);
    const newGroupCount = setIn(
      product.group,
      previousGroupCount + 1,
      state.data.groupCount
    );

    // Craft new state
    let newState = setIn("data.items", newItemCount, state);
    newState = setIn("data.groupCount", newGroupCount, newState);

    return newState;
  },

  submit(state) {
    alert(JSON.stringify(state.data));
    return state;
  }
});
