import React, { useMemo, useState, createContext, useContext, act } from "react";
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./SortableList.css";
import "./SortableItem.css";

import { DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core";

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

const SortableItemContext = createContext({
  attributes: {},
  listeners: undefined,
  ref() {},
});

function SortableItem({ children, id }) {
  const { attributes, isDragging, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <tr ref={setNodeRef} style={style}>
        {children}
      </tr>
    </SortableItemContext.Provider>
  );
}

function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button className="DragHandle" {...attributes} {...listeners} ref={ref}>
      <svg viewBox="0 0 20 20" width="12">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
      </svg>
    </button>
  );
}

function SortableOverlay({ children }) {
  return <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>;
}

export function SortableListTable({ items, onChange, renderItem, overLayRenderItem }) {
  const [active, setActive] = useState(null);
  const activeItem = useMemo(() => items.find((item) => item.id === active?.id), [active, items]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  console.log("active id", active?.id);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

          onChange(arrayMove(items, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items}>
        <table>
          <thead>
            <tr>
              <th style={{ width: "250px" }}>Id</th>
              <th style={{ width: "250px" }}>Label</th>
              <th style={{ width: "50px" }}>Drag</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) =>
              item.id === active?.id ? (
                <SortableItem id={item.id}>
                    <td style={{ width: "50px", backgroundColor:"red" }} colSpan={3}>Drop down</td>
                </SortableItem>

              ) : (
                <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
              )
            )}
          </tbody>
        </table>
      </SortableContext>

      <SortableOverlay>{activeItem ? overLayRenderItem(activeItem) : null}</SortableOverlay>
    </DndContext>
  );
}

SortableListTable.Item = SortableItem;
SortableListTable.DragHandle = DragHandle;
