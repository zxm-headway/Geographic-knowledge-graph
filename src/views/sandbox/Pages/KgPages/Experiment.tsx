import React, { useState } from "react";
import { Input } from "antd";

function Experiment() {
  const data = [
    { id: 1, title: "Apple" },
    { id: 2, title: "Banana" },
    { id: 3, title: "Orange" },
    { id: 4, title: "Mango" },
    { id: 5, title: "Grapes" },
  ];
  
  const [searchTerm, setSearchTerm] = useState(""); // 设置初始搜索关键字为空
  const [searchResults, setSearchResults] = useState<any[]>([]); // 设置初始搜索结果为空数组

  const handleSearch = (value) => {
    setSearchTerm(value); // 更新搜索关键字
    const results = data.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    ); // 模糊匹配搜索关键字，并过滤出匹配项
    setSearchResults(results); // 更新搜索结果
  };

  return (
    <>
    <Input.Search
      placeholder="Search for something"
      onSearch={handleSearch} // 搜索框的onSearch事件触发handleSearch函数
    />
      
 

    {/* 显示搜索结果 */}
    {searchResults.map((result) => (
        <div key={result.id}>{result.title}</div>
      ))}
    </>
  );
}


export default Experiment;