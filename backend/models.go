package main

import "sync"

type Status string

const (
	StatusAFazer    	Status = "a fazer"
	StatusEmAndamento	Status = "em progresso"
	StatusConcluido     Status = "concluido"
)

// Campos principais da aplicação
type Task struct {
	ID          	int    	  `json:"id"`
	Titulo       	string    `json:"titulo"`
	Descricao 		string    `json:"descricao"`
	Status      	Status    `json:"status"`
}

type autoIncrement struct {
    sync.Mutex
    id int
}
// Função autoincrementavél
func (a *autoIncrement) ID() (id int) {
    a.Lock()
    defer a.Unlock()

    id = a.id
    a.id++
    return
}
