import type { TaskStatus } from "../interfaces/TaskInterface"

const BASE_URL = "http://localhost:8000/tasks"

export const getTask = async () => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'GET'
        })

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        
        throw Error(`Erro ao obter tarefas: ${error}`)
    }
}

export const createTask = async (data: { titulo: string, descricao: string, status: TaskStatus }) => {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        })  

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`)
        }

        return await response.json()
    } catch (error) {

        throw new Error(`Erro ao criar tarefa: ${error}`)
    }
}

export const updateTask = async (id: string, data: { titulo: string, descricao: string, status: TaskStatus }) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        })

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        throw new Error(`Erro ao atualizar tarefa: ${error}`)
    }
}

export const deleteTask = async (id: string) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            body: JSON.stringify(id),
            headers: { "Content-Type": "application/json" }
        })

        if (!response.ok) {
            throw Error(`Erro na requisição: ${response.status}`)
        }

        return await response.json()
    } catch (error) {

        throw new Error(`Erro ao deletar tarefa: ${error}`)
    }
}