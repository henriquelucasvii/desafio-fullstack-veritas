import type { DragEvent } from "react"
import { useState } from "react"
import type { Task, TaskStatus } from "../interfaces/TaskInterface"
import TaskCard from "./TaskCard"
import { Plus } from "lucide-react"

export interface ColumnTheme {
  accent: string
}

interface KanbanColumnProps {
  status: TaskStatus
  title: string
  tasks: Task[]
  theme: ColumnTheme
  draggingId: number | null
  onAdd: (status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  onDragStart: (e: DragEvent<HTMLDivElement>, task: Task) => void
  onDragEnd: () => void
  onDropTask: (taskId: number, status: TaskStatus) => void
}

export default function KanbanColumn({
  status,
  title,
  tasks,
  theme,
  draggingId,
  onAdd,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDropTask,
}: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false)

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsOver(true)
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsOver(false)
        const id = Number(e.dataTransfer.getData("text/plain"))
        if (!Number.isNaN(id)) onDropTask(id, status)
      }}
      className={`flex w-full shrink-0 flex-col rounded-xl border bg-white/3 p-4 transition-colors duration-150 sm:min-w-65 sm:flex-1 ${
        isOver ? "border-[#7C93A3]/50 bg-white/5" : "border-white/10"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.accent }} />
          <h2 className="text-[13px] font-semibold tracking-tight text-[#D7E0E6]">{title}</h2>
          <span className="text-[11px] text-[#5B6B76]">{tasks.length}</span>
        </div>
        <button
          type="button"
          onClick={() => onAdd(status)}
          aria-label={`Adicionar tarefa em ${title}`}
          className="rounded-md p-1 text-[#7C93A3] transition-colors hover:bg-white/10 hover:text-[#D7E0E6]"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div
        className="mt-3.5 flex min-h-25 flex-1 flex-col gap-2 overflow-y-auto pr-0.5"
        style={{ maxHeight: "62vh" }}
      >
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-white/10 py-8 text-center text-[12px] text-[#5B6B76]">
            Nenhuma tarefa aqui
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              accent={theme.accent}
              isDragging={draggingId === task.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  )
}