import React, { useState } from "react";

// import { SortableList } from "./components/SortableList/SortableList";
import { createRange } from "./utils";
import "./App.css";
import { SortableListTable } from "./components/SortableListTable/SortableListTable";

function getMockItems() {
  return createRange(50, (index) => ({ id: index + 1, label: `Item ${index + 1}` }));
}

export default function App() {
  const [items, setItems] = useState(getMockItems);

  return (
    <div style={{ maxWidth: 400, margin: "30px auto" }}>
      {/* <SortableList
        items={items}
        onChange={setItems}
        renderItem={(item) => (
          <SortableList.Item id={item.id}>
            {item.id}
            <SortableList.DragHandle />
          </SortableList.Item>
        )}
      /> */}

      <SortableListTable
        items={items}
        onChange={setItems}
        renderItem={(item) => (
          <SortableListTable.Item id={item.id}>
            <>
              <td style={{width:"50px"}}>{item.id}</td>
              <td style={{width:"50px"}}>{item.label}</td>
              <td style={{width:"20px"}}>
                {" "}
                <SortableListTable.DragHandle />
              </td>
            </>
          </SortableListTable.Item>
        )}
        overLayRenderItem={(item) => (
          <SortableListTable.Item id={item.id}>
            <>
              <td style={{width:"50px"}}>{item.id}</td>
              <td style={{width:"auto",}} colSpan={2}>{"Hi i am being dragged"}</td>
            </>
          </SortableListTable.Item>
        )}
      />
    </div>
  );
}
