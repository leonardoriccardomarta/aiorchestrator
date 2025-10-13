import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Workflow, WorkflowStep } from '../types';

const WorkflowManager: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !selectedWorkflow) return;

    const steps = Array.from(selectedWorkflow.steps);
    const [reorderedStep] = steps.splice(result.source.index, 1);
    steps.splice(result.destination.index, 0, reorderedStep);

    setSelectedWorkflow({
      ...selectedWorkflow,
      steps,
    });
  };

  const addStep = (type: WorkflowStep['type']) => {
    if (!selectedWorkflow) return;

    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type,
      name: `New ${type}`,
      config: {},
      nextSteps: [],
    };

    setSelectedWorkflow({
      ...selectedWorkflow,
      steps: [...selectedWorkflow.steps, newStep],
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI Workflow Manager</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => {
            const newWorkflow: Workflow = {
              id: `workflow-${Date.now()}`,
              name: 'New Workflow',
              description: '',
              trigger: {
                type: 'manual',
                config: {},
              },
              steps: [],
              status: 'inactive',
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            setWorkflows([...workflows, newWorkflow]);
            setSelectedWorkflow(newWorkflow);
          }}
        >
          Create Workflow
        </button>
      </div>

      {selectedWorkflow && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <input
              type="text"
              value={selectedWorkflow.name}
              onChange={(e) =>
                setSelectedWorkflow({ ...selectedWorkflow, name: e.target.value })
              }
              className="text-xl font-semibold w-full border-b border-gray-200 pb-2 focus:outline-none focus:border-blue-600"
            />
            <textarea
              value={selectedWorkflow.description}
              onChange={(e) =>
                setSelectedWorkflow({
                  ...selectedWorkflow,
                  description: e.target.value,
                })
              }
              className="w-full mt-2 text-gray-600 focus:outline-none"
              placeholder="Describe your workflow..."
            />
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => addStep('action')}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
            >
              + Action
            </button>
            <button
              onClick={() => addStep('condition')}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              + Condition
            </button>
            <button
              onClick={() => addStep('notification')}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200"
            >
              + Notification
            </button>
            <button
              onClick={() => addStep('approval')}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
            >
              + Approval
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="workflow-steps">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {selectedWorkflow.steps.map((step, index) => (
                    <Draggable
                      key={step.id}
                      draggableId={step.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="material-icons mr-2">
                                drag_indicator
                              </span>
                              <span className="font-medium">{step.name}</span>
                            </div>
                            <button
                              onClick={() => {
                                const steps = selectedWorkflow.steps.filter(
                                  (s) => s.id !== step.id
                                );
                                setSelectedWorkflow({
                                  ...selectedWorkflow,
                                  steps,
                                });
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <span className="material-icons">delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
};

export default WorkflowManager; 