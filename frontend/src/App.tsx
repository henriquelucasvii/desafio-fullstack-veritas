import type { DragEvent } from "react"
import { useCallback, useEffect, useState } from "react"
import { createTask, deleteTask, getTask, updateTask } from "./libs/api"
import { AlertTriangle, Loader2, Plus } from "lucide-react"
import KanbanColumn, { type ColumnTheme } from "./components/KanbanColumn"
import TaskModal from "./components/TaskModal"
import type { Task, TaskFormData, TaskStatus } from "./interfaces/TaskInterface"

const COLUMNS: { status: TaskStatus; title: string; theme: ColumnTheme }[] = [
  { status: "a fazer", title: "A Fazer", theme: { accent: "#89CDDD" } },
  { status: "em progresso", title: "Em Progresso", theme: { accent: "#DEB65F" } },
  { status: "concluido", title: "Concluídas", theme: { accent: "#42C96A" } },
]

type ToastKind = "success" | "error"
interface ToastItem {
  id: number
  message: string
  kind: ToastKind
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("a fazer")
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const pushToast = useCallback((message: string, kind: ToastKind) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, kind }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200)
  }, [])

  const loadTasks = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await getTask()
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      setLoadError("Não foi possível carregar as tarefas. Verifique se a API está rodando em localhost:8000/tasks.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.setData("text/plain", String(task.id))
    e.dataTransfer.effectAllowed = "move"
    setDraggingId(task.id)
  }

  const handleDragEnd = () => setDraggingId(null)

  const handleDropTask = async (taskId: number, newStatus: TaskStatus) => {
    const current = tasks.find((t) => t.id === taskId)
    if (!current || current.status === newStatus) return

    const previous = tasks
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))

    try {
      await updateTask(String(taskId), {
        titulo: current.titulo,
        descricao: current.descricao,
        status: newStatus,
      })
    } catch (err) {
      setTasks(previous)
      pushToast("Não foi possível mover a tarefa. Tente novamente.", "error")
    }
  }

  const openCreateModal = (status: TaskStatus) => {
    setEditingTask(null)
    setDefaultStatus(status)
    setModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setDefaultStatus(task.status)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    const previous = tasks
    setTasks((prev) => prev.filter((t) => t.id !== id))
    try {
      await deleteTask(String(id))
      pushToast("Tarefa excluída.", "success")
    } catch (err) {
      setTasks(previous)
      pushToast("Não foi possível excluir a tarefa.", "error")
    }
  }

  const handleSubmit = async (data: TaskFormData) => {
    try {
      if (editingTask) {
        await updateTask(String(editingTask.id), data)
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...t, ...data } : t)))
        pushToast("Tarefa atualizada.", "success")
      } else {
        await createTask(data)
        await loadTasks() // recarrega para obter o id gerado pelo backend
        pushToast("Tarefa criada.", "success")
      }
      setModalOpen(false)
    } catch (err) {
      pushToast(editingTask ? "Não foi possível atualizar a tarefa." : "Não foi possível criar a tarefa.", "error")
    }
  }

  const summary = COLUMNS.map(
    (c) => `${tasks.filter((t) => t.status === c.status).length} ${c.title}`
  ).join(" · ")

  return (
    <div className="min-h-screen bg-[#0A1826] px-5 py-8 sm:px-10">
      <header className="mx-auto mb-8 flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Kanban</h1>
          <p className="mt-1 text-xs text-[#7C93A3]">{isLoading ? "carregando..." : summary}</p>
        </div>
        <button
          type="button"
          onClick={() => openCreateModal("a fazer")}
          className="flex items-center gap-1.5 self-start rounded-lg bg-[#FCFBF8] px-4 py-2.5 text-sm font-semibold text-[#0A1826] transition hover:bg-white sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Nova tarefa
        </button>
      </header>

      {loadError && (
        <div className="mx-auto mb-6 flex max-w-6xl items-start gap-2.5 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">{loadError}</div>
          <button
            onClick={loadTasks}
            className="shrink-0 rounded-lg bg-red-500/20 px-2.5 py-1 text-xs font-semibold hover:bg-red-500/30"
          >
            Tentar de novo
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-24 text-[#7C93A3]">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-4 sm:flex-row sm:items-start">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              title={col.title}
              theme={col.theme}
              tasks={tasks.filter((t) => t.status === col.status)}
              draggingId={draggingId}
              onAdd={openCreateModal}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDropTask={handleDropTask}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium shadow-md transition-all ${
              t.kind === "success" ? "bg-[#1F3A2B] text-[#8FE3AE]" : "bg-[#3A1F1F] text-[#E38F8F]"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}