// import React, { useState } from 'react';
// import { Droppable } from 'react-beautiful-dnd';
// import TaskCard from './TaskCard';
// import TaskAssignmentModal from './TaskAssignModal';
// import SubtaskModal from './SubTaskModal';

// // columns
// const columnStyles = {
//   todo: 'bg-blue-300',
//   'in-progress': 'bg-yellow-300',
//   testing: 'bg-orange-300',
//   hold: 'bg-red-300',
//   completed: 'bg-green-300',
// };

// const TaskColumn = ({ status, tasks, onEdit, onDelete, projectId, userRole }) => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [isSubtaskModalVisible, setSubtaskModalVisible] = useState(false); 

//   const handleAssign = (task) => {
//     setSelectedTask(task);
//     setModalVisible(true);
//   };

//   const handleModalClose = () => {
//     setModalVisible(false);
//     setSelectedTask(null);
//   };

//   const handleAssignSubmit = (assignmentData) => {
//     console.log('Assigned users:', assignmentData);
//     handleModalClose();
//   };

//   const handleOpenSubtaskModal = (taskId) => {
//     setSelectedTask(taskId); 
//     setSubtaskModalVisible(true);
//   };

//   return (
//     <Droppable droppableId={status}>
//       {(provided) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.droppableProps}
//           className={`flex flex-col p-4 rounded-lg shadow-lg ${columnStyles[status]} sm:w-64 w-full mb-4`}
//         >
//           <h2 className="font-bold text-lg mb-2 capitalize">{status}</h2>
//           <div className="flex-1 overflow-y-auto">
//             {tasks.map((task, taskIndex) => (
//               <TaskCard
//               key={task.id.toString()}
//               task={task}
//                 index={taskIndex}
//                 onEdit={onEdit}
//                 onDelete={onDelete}
//                 onOpenSubtaskModal={handleOpenSubtaskModal} 
//                 userRole={userRole}
//                 projectId={projectId} 
//               />
//             ))}
//             {provided.placeholder}
//           </div>

//           {/* Task Assignment Modal */}
//           {isModalVisible && selectedTask && (
//             <TaskAssignmentModal
//               modalopen={isModalVisible}
//               onClose={handleModalClose}
//               onSubmit={handleAssignSubmit}
//               taskId={selectedTask.id}
//               projectId={projectId} 
//             />
//           )}

//           {/* Subtask Modal */}
//           <SubtaskModal
//             open={isSubtaskModalVisible}
//             onClose={() => setSubtaskModalVisible(false)}
//             taskId={selectedTask} 
//             projectId={projectId} 
//           />
//         </div>
//       )}
//     </Droppable>
//   );
// };

// export default TaskColumn;
