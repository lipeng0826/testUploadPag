import PropTypes from 'prop-types';
import React from 'react'

export function NormalTitle(props) {
  const { style, title, item } = props;
  return (
    <div
      className="question-tree-title-normal"
      style={style || {}}
      title={item.description}
    >
      {title}
    </div>
  );
}

NormalTitle.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.any,
  }),
  style: PropTypes.object,
  title: PropTypes.any,
}
