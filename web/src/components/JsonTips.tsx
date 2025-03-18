import { InfoCircleFilledIcon } from "tdesign-icons-react";
import { Popup } from "tdesign-react";

export default () => {
  const exampleData1 = {
    name: "张三",
    age: "$.user.age",
    books: ["book1", "$.user.book2", "$$.teacher.book3", "$$$.context.book4"],
  };

  const codeStyle = { backgroundColor: "#f7f7f7", padding: "10px" };
  const subTitleStyle = { fontWeight: 600, padding: "5px 0" };

  return (
    <Popup
      content={
        <div style={{ width: "400px", padding: "10px" }}>
          <h3 style={subTitleStyle}>JsonPath 示例：</h3>
          <pre style={codeStyle}>
            <pre></pre>
            <pre>$.user.age&emsp;从上一节点输出匹配</pre>
            <pre>$$.user.age&emsp;从执行记录的输入匹配</pre>
            <pre>$$$.user.age&emsp;从上下文变量匹配</pre>
            <pre>$len.user.books&emsp;获取数组长度，返回数值</pre>
            <pre>$exists.user.pet&emsp;判断字段是否存在，返回布尔值</pre>
          </pre>
          <h3 style={subTitleStyle}>JsonFilter 示例：</h3>
          <pre style={codeStyle}>{JSON.stringify(exampleData1, null, 4)}</pre>
        </div>
      }
      destroyOnClose
      showArrow
    >
      <InfoCircleFilledIcon color="#0052d9" style={{ margin: "0 5px" }} />
    </Popup>
  );
};
