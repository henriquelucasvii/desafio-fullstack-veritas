import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import type { Task, TaskFormData, TaskStatus } from "../interfaces/TaskInterface"
import { X } from "lucide-react"

interface TaskModalProps {
  isOpen: boolean
  task: Task | null
  defaultStatus: TaskStatus
  onClose: () => void
  onSubmit: (data: TaskFormData) => void
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "a fazer", label: "A Fazer" },
  { value: "em progresso", label: "Em Progresso" },
  { value: "concluido", label: "Concluída" },
]

export default function TaskModal({ isOpen, task, defaultStatus, onClose, onSubmit }: TaskModalProps) {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [status, setStatus] = useState<TaskStatus>(defaultStatus)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setTitulo(task?.titulo ?? "")
    setDescricao(task?.descricao ?? "")
    setStatus(task?.status ?? defaultStatus)
    setTouched(false)
  }, [isOpen, task, defaultStatus])

  if (!isOpen) return null

  const tituloInvalido = touched && titulo.trim().length === 0

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (titulo.trim().length === 0) return
    onSubmit({ titulo: titulo.trim(), descricao: descricao.trim(), status })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-black/5 bg-[#FCFBF8] p-6 shadow-lg"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[#152530]">
            {task ? "Editar tarefa" : "Nova tarefa"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1 text-[#8B98A3] hover:bg-black/5 hover:text-[#152530]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#5B6B76]">Título</label>
            <input
              autoFocus
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Ex: Agendar Reunião"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-[#152530] outline-none transition focus:ring-2 ${
                tituloInvalido
                  ? "border-red-300 focus:ring-red-200"
                  : "border-black/10 focus:border-transparent focus:ring-[#3F86A8]/40"
              }`}
            />
            {tituloInvalido && <p className="mt-1 text-xs text-red-500">O título é obrigatório.</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#5B6B76]">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="Detalhes da tarefa (opcional)"
              className="w-full resize-none rounded-lg border border-black/10 px-3 py-2 text-sm text-[#152530] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#3F86A8]/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#5B6B76]">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#152530] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#3F86A8]/40"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-[#5B6B76] transition hover:bg-black/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#152530] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-125"
            >
              {task ? "Salvar alterações" : "Criar tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}