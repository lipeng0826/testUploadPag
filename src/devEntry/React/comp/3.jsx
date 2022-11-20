import React, { useState } from "react";
import { SelectKnowTree } from "../../../index.jsx";
import { CloseOutlined } from "@ant-design/icons";

let child = null
const TestDemo = (props) => {

  const [allModels, setAllModels ] = useState([])
  const onRef = (value) => {
    child = value
  }

  const onSelect = (selectedKeys, node, { selected }, filterConditions) => {

    const nodeItem = node['data-use'];
    if (!nodeItem) {
      return false;
    }
    if (selected) {
      if (allModels.some(m => m.id === node.id)) {
      } else {
        const model = { id: nodeItem.id, name: nodeItem.name, type: nodeItem.isKnowledge ? 1 : 2 };
          const hasThis = allModels.some(m => m.id === model.id);
          if (!hasThis) {
            setAllModels([...allModels, model])
          }
      }
    } else {
      const allModelsFilter = allModels.filter(m => m.id !== nodeItem.id);
      setAllModels(allModelsFilter)
    }
  };

  // 删除选中的列表
  const removeSelect = (id) => {
    const selected = allModels.find((item) => item.id == id);
    if (selected) {
      setAllModels(JSON.parse(
        JSON.stringify(allModels.filter((item) => item.id != id))
      ))
    }
    child.deleteSelected(selected.id)
  };

  return (
    <div style={{ display: "flex" }}>
      <SelectKnowTree
        style={{ width: 370 }}
        scrollHeight={500}
        showReviewModel={0}
        multiple
        subjectProductId={7}
        selectNode={["knowledge", "model"]}
        onSelect={onSelect}
        defaultSelectedKeys={allModels.map((item) => item.id + "")}
        onRef={onRef}
      />
      <div>
        <h3 className="model-box-title">
          知识元/题模篮(已选择{allModels.length}个)
        </h3>
        <div>
          {allModels.map((item) => (
            <div className="model-item" key={item.id}>
              {item.name}<CloseOutlined onClick={() => removeSelect(item.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestDemo;
