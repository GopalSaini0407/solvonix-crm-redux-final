"use client"

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

/**
 * item shape expectation:
 * {
 *   id: number | string,
 *   title: string,
 *   color?: string
 * }
 */

/* ------------------ Sortable Item ------------------ */
const SortableItem = ({ item,renderItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-3 hover:shadow-md transition">
        <span
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400"
        >
          <GripVertical size={18} />
        </span>

        <div className="flex-1">
          {renderItem ? renderItem(item) : (
            <p className="font-medium text-gray-800">
              {item.title}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------ Main Reusable Component ------------------ */
const ReusableDragDropList = ({
  items = [],
  onChange,
  renderItem,
}) => {
  const handleDragEnd = (event) => {
    const { active, over } = event;
  
    if (!over) return;
    if (active.id === over.id) return;
  
    const oldIndex = safeItems.findIndex(i => i.id === active.id);
    const newIndex = safeItems.findIndex(i => i.id === over.id);
  
    if (oldIndex === -1 || newIndex === -1) return;
  
    const newItems = arrayMove(safeItems, oldIndex, newIndex);
    onChange && onChange(newItems);
  };
  
  const safeItems = Array.isArray(items)
  ? items.filter(item => item && item.id != null)
  : [];
  
  return (
    
    <DndContext
    collisionDetection={closestCenter}
    onDragEnd={handleDragEnd}
  >
    <SortableContext
      items={safeItems.map(item => item.id)}   // ✅ ONLY IDs
      strategy={verticalListSortingStrategy}
    >
      <div className="space-y-3">
        {safeItems.map((item) => (
          <SortableItem
            key={item.id}                      // ✅ ONLY item.id
            item={item}
            renderItem={renderItem}
          />
        ))}
      </div>
    </SortableContext>
  </DndContext>
  )
}

export default ReusableDragDropList
