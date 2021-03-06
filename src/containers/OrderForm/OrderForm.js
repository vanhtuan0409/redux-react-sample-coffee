import React, { PureComponent } from "react";
import { Actions } from "jumpstate";
import FlipPanel from "@components/FlipPanel";
import Intro from "./steps/Intro";
import CustomerInfo from "./steps/CustomerInfo";
import Location from "./steps/Location";
import SelectItem from "./steps/SelectItem";
import Summary from "./steps/Summary";
import "./style.styl";

const steps = [
  {
    id: 1,
    title: "Giới thiệu",
    component: Intro
  },
  {
    id: 2,
    title: "Nhập thông tin đặt hàng",
    component: CustomerInfo
  },
  {
    id: 3,
    title: "Chọn vị trí giao hàng",
    component: Location
  },
  {
    id: 4,
    title: "Chọn món",
    component: SelectItem,
    validate: data => Object.keys(data.items).length > 0
  },
  {
    id: 5,
    title: "Xem giỏ hàng",
    component: Summary
  }
];

export default class OrderForm extends PureComponent {
  render() {
    const { currentStep, data } = this.props;
    const step = steps[currentStep - 1];
    const { title, component: Component, validate } = step;
    const isError = validate && !validate(data);
    const nextFn =
      currentStep === steps.length
        ? Actions.form.submit
        : Actions.form.goToNextStep;

    return (
      <FlipPanel selectedIndex={currentStep}>
        <Component
          title={title}
          isError={isError}
          data={data}
          previous={Actions.form.goToPreviousStep}
          next={nextFn}
        />
      </FlipPanel>
    );
  }
}
