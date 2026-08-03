import type { DragEvent } from "react"
import type { Task } from "../interfaces/TaskInterface"
import { Trash2 } from "lucide-react"

interface TaskCardProps {
  task: Task
  accent: string
  isDragging: boolean
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  onDragStart: (e: DragEvent<HTMLDivElement>, task: Task) => void
  onDragEnd: () => void
}

export default function TaskCard({
  task,
  accent,
  isDragging,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(task)}
      style={{ borderLeft: `3px solid ${accent}` }}
      className={`group relative flex cursor-grab items-start gap-2 rounded-lg border border-black/5 bg-[#FCFBF8] py-3 pl-3 pr-2 transition-opacity duration-150 active:cursor-grabbing ${
        isDragging ? "opacity-40" : "opacity-100"
      }`}
    >
      <div className="min-w-0 flex-1">

        <h3 className="mt-0.5 truncate text-[13.5px] font-semibold leading-snug text-[#152530]">
          {task.titulo}
        </h3>
        {task.descricao && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6B7A85]">
            {task.descricao}
          </p>
        )}
        
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(task.id)
        }}
        aria-label="Excluir tarefa"
        className="mt-0.5 shrink-0 rounded-md p-1 text-[#C7CFD5] opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}