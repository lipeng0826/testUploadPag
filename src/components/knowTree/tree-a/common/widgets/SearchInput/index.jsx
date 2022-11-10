import React from 'react';
import { Input } from 'diy-ui';
import './style.less';

const { Search } = Input;

export default function SearchInput(props) {
  return (
    <Search
      className="gs-search-input"
      {...props}
    />
  );
}
