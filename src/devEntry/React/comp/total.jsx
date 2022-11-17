import React, { useState } from "react";
import { Tabs } from "antd";
import SelectKnow from "./1";
import SelectLesson from "./2";
import BindKnow from "./3";
import BindLesson from "./4";

const Total = (props) => {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="选择知识点树" key="1">
          <SelectKnow />
        </Tabs.TabPane>
        <Tabs.TabPane tab="选择讲次树" key="2">
          <SelectLesson />
        </Tabs.TabPane>
        <Tabs.TabPane tab="绑定知识点树" key="3">
          <BindKnow />
        </Tabs.TabPane>
        <Tabs.TabPane tab="绑定讲次树" key="4">
          <BindLesson />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Total;
