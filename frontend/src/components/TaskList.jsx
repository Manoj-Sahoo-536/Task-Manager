import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, groupBy, onToggleComplete, onEdit, onDelete, onShare, onViewHistory, onViewDetails, onReorder, isDraggable = false, useMasonry = true }) => {
  const groupTasks = () => {
    if (groupBy === 'priority') {
      return {
        high: tasks.filter(t => t.priority === 'high'),
        medium: tasks.filter(t => t.priority === 'medium'),
        low: tasks.filter(t => t.priority === 'low')
      };
    }
    if (groupBy === 'dueDate') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return {
        overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < today),
        today: tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === today.toDateString()),
        upcoming: tasks.filter(t => t.dueDate && new Date(t.dueDate) > today),
        noDueDate: tasks.filter(t => !t.dueDate)
      };
    }
    return { all: tasks };
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  const grouped = groupTasks();

  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {Object.entries(grouped).map(([group, groupTasks]) => (
          groupTasks && groupTasks.length > 0 && (
            <div key={group}>
              <h2 className="text-lg font-semibold mb-3 capitalize">{group.replace(/([A-Z])/g, ' $1')}</h2>
              <Droppable droppableId={group}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr"
                  >
                    {groupTasks.map((task, index) => (
                      isDraggable ? (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="h-full"
                            >
                              <TaskCard
                                task={task}
                                onToggleComplete={onToggleComplete}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onShare={onShare}
                                onViewHistory={onViewHistory}
                                onViewDetails={onViewDetails}
                              />
                            </div>
                          )}
                        </Draggable>
                      ) : (
                        <div key={task._id} className="h-full">
                          <TaskCard
                            task={task}
                            onToggleComplete={onToggleComplete}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onShare={onShare}
                            onViewHistory={onViewHistory}
                            onViewDetails={onViewDetails}
                          />
                        </div>
                      )
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskList;
