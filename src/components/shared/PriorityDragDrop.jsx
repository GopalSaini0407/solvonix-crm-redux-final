// components/PriorityDragDrop.jsx
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const PriorityDragDrop = ({
  data,
  onDragEnd,
  renderItem,
  getItemId,
  grouped = false,
  singleDroppableId = "LIST",
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {grouped ? (
        // 🔹 GROUPED MODE
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(data || {}).map(([group, items]) => (
            <Droppable droppableId={group} key={group}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white shadow-sm rounded-2xl border border-gray-100 p-5 hover:shadow-md transition min-h-[200px]"
                >
                  <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b pb-2">{group}</h3>

                  {items
                    .slice()
                    .sort((a, b) => a.priority - b.priority)
                    .map((item, index) => (
                      <Draggable
                        key={getItemId(item, index)}
                        draggableId={getItemId(item, index)}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {renderItem(item)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      ) : (
        // 🔹 SINGLE LIST MODE
        <Droppable droppableId={singleDroppableId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="bg-white border rounded-xl p-4 space-y-2"
            >
              {data
                .slice()
                .sort((a, b) => a.priority - b.priority)
                .map((item, index) => (
                  <Draggable
                    key={getItemId(item, index)}
                    draggableId={getItemId(item, index)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {renderItem(item)}
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </DragDropContext>
  );
};

export default PriorityDragDrop;
