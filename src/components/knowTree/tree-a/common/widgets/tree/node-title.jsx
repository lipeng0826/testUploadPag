import React, { useState, useContext } from 'react';
import { Icon, Dropdown, Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import FolderClose from 'tikuKnowledge/common/widgets/svg/folder-close';
import FolderOpen from 'tikuKnowledge/common/widgets/svg/folder-open';
import TopicModelIcon from 'tikuKnowledge/common/widgets/svg/topic-model';
import KnowledgeIcon from 'tikuKnowledge/common/widgets/svg/knowledge-point';
import MoreIcon from 'tikuKnowledge/common/widgets/svg/more-btn';
import TagMarkedIcon from 'tikuKnowledge/common/widgets/svg/tag-marked';
import { categoryMap, knowledgeTypeAttr } from 'tikuKnowledge/common/constant';
import tipDecorator from 'tikuBase/Tree/title/decorator-tip.jsx';
import './node-title.less';

/* eslint react/prop-types: 0 */
export const nodeType = {
  folder: 'folder',
  knowledge: 'knowledge',
  model: 'model',
}

function getIcon(type) {
  switch (type) {
    case nodeType.folder:
      return [FolderClose, FolderOpen];
    case nodeType.knowledge:
      return [KnowledgeIcon, KnowledgeIcon];
    case nodeType.model:
      return [TopicModelIcon, TopicModelIcon];
    default:
      return [FolderClose, FolderClose];
  }
}

export const TreeContext = React.createContext({});

function className(...args) {
  return args.filter(a => a).join(' ');
}

function handleClick(e) {
  e.stopPropagation();
}

function focusEl(el) {
  setTimeout(() => {
    el && el.focus();
  }, 300);
}

function NodeTitle({
  icon = null,
  children,
  operation,
  isEdit = false,
  tip,
  keepHover,
  itemValue,
  item,
  highlight,
}) {
  const { onItemEdit } = useContext(TreeContext);

  function handleKeyUp(e) {
    e.persist();
    switch (e.keyCode) {
      case 13:
        onItemEdit && onItemEdit(item, e.target.value || '', 'enter');
        break;
      case 27:
        onItemEdit && onItemEdit(item, e.target.value, 'esc');
        break;
      default:
        break;
    }
    // onItemEdit && onItemEdit(item, e.target.value);
  }

  function handleBlur(e) {
    e.persist();
    onItemEdit && onItemEdit(item, e.target.value, 'esc');
  }

  function renderTypeInfo() {
    const result = {};
    if (item.isFolder) {
      return null;
    }
    if (item.isTopicModel) {
      const curCategoryData = categoryMap.get(item.category || '') || { name: -1 };
      if (curCategoryData.name !== -1) {
        result.cls = 'icon-type-model';
        result.title = curCategoryData.name.slice(0, 1);
      }
    }
    if (item.isKnowledge) {
      const curKnowledgeTypeData = item.attrName && item.attrName[0] || -1;
      if (curKnowledgeTypeData !== -1) {
        result.cls = 'icon-type-knowledge';
        result.title = curKnowledgeTypeData;
      }
    }
    if (result.cls && result.title) {
      return (
        <div className="icon graph-icon-type" style={{ marginRight: 4 }}>
          <span className={result.cls}>{result.title}</span>
        </div>
      );
    }
    return null;
  }

  function renderTagMarkInfo() {
    if (item.isTopicModel) {
      if (item.tags && item.tags.length) {
        return (
          <div className="icon tag" title="已打标签">
            <Icon component={TagMarkedIcon} />
          </div>
        );
      }
      return (
        <div className="icon tag"><span /></div>
      );
    }
    return null
  }

  return (
    <div
      className={className('tree-node-title', keepHover && 'hover', highlight && 'highlight')}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
      }}
    >
      {isEdit ? (
        <input
          ref={focusEl}
          defaultValue={itemValue || ''}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
        />
      ) : (
        <div
          title={!(item.isKnowledge || item.isTopicModel) ? tip : null}
          className={className('title-text')}
          style={{ overflow: 'hidden', flexGrow: 1, display: 'flex' }}
        >
          {renderTagMarkInfo()}
          {renderTypeInfo()}
          {icon && icon.length && (
            <div className="icon" style={{ marginRight: 4 }}>
              <Icon className="icon-close-status" component={icon[0]} />
              <Icon className="icon-open-status" component={icon[1]} />
            </div>
          )}
          <div
            style={{ flexGrow: 1, paddingLeft: 7, overflow: 'hidden', textOverflow: 'ellipsis' }}
            className={className(highlight && 'highlight')}
          >
            {children}
          </div>
        </div>
      )}
      {operation && (
        <div
          role="button"
          className={className('operation', keepHover && 'hover')}
          onClick={handleClick}
        >
          {operation}
        </div>
      )}
    </div>
  );
}

const NodeName = tipDecorator(({ item }) => {
  return <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
});

function CommonItem(props) {
  const {
    name,
    count,
    loadingCount,
    showCount,
    icon,
    operation,
    keepHover,
    isEdit,
    item,
    highlight,
  } = props;
  return (
    <NodeTitle
      highlight={highlight}
      keepHover={keepHover}
      icon={icon}
      operation={operation}
      itemValue={name}
      isEdit={isEdit}
      item={item}
      // tip={`${name}${(showCount && !loadingCount && ` (${count}题)`) || ''}`}
      tip={name}
    >
      <NodeName item={item} />
    </NodeTitle>
  );
}

function useVisibleChange(initValue) {
  const [visible, setV] = useState(initValue);
  function handleVisibleChange(v) {
    setV(v);
  }
  return [visible, handleVisibleChange];
}

function O(props) {
  const { onVisibleChange, operations, onClick } = props;
  function _handleClick(params) {
    const { key } = params;
    setTimeout(() => {
      onVisibleChange(false);
    }, 500);
    onClick && onClick(key);
  }

  return (
    <Dropdown
      onVisibleChange={onVisibleChange}
      trigger={['click']}
      overlay={<M keys={operations} onClick={_handleClick} />}
    >
      <div className="more-btn">
        <Icon component={MoreIcon} />
      </div>
    </Dropdown>
  );
}

function M(props) {
  const { keys, onClick } = props;
  return (
    <Menu selectedKeys={[]} className="tree-operation-menu" onClick={onClick}>
      {keys.map(k => (
        <Menu.Item key={k.key}>{k.name}</Menu.Item>
      ))}
    </Menu>
  );
}

export function Item(props) {
  const [v, handleVisibleChange] = useVisibleChange(false);
  const { operations, item, type, showCount } = props;
  const { handleOperation } = useContext(TreeContext);
  function onMenuClick(key) {
    handleOperation && handleOperation(item, key);
  }
  return (
    <CommonItem
      {...props}
      keepHover={v}
      operation={
        operations ? (
          <O operations={operations} onVisibleChange={handleVisibleChange} onClick={onMenuClick} />
        ) : null
      }
      icon={getIcon(type)}
      showCount={!!showCount}
      type={type}
    />
  );
}
