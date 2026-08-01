package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)	

var tasks = []Task{}
var ai autoIncrement

// Obter tarefas
func getTask(c *gin.Context) {
	c.JSON(http.StatusOK, tasks)
}

// Criar tarefas
func createTask(c *gin.Context) {
	var task Task
	
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"erro": err.Error(),
		})
		return
	}

	task.ID = ai.ID()	// Incrementa o ID
	tasks = append(tasks, task)
	
	c.JSON(http.StatusCreated, task)
}

// Atualizar tarefas
func updateTask(c *gin.Context) {

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Inválido!. Insira um ID válido"})
		return
	}

	var updateData Task
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos."})
		return
	}

	for i, task := range tasks {
		if task.ID == id {
			tasks[i].Titulo = updateData.Titulo
			tasks[i].Descricao = updateData.Descricao
			tasks[i].Status = updateData.Status
			c.JSON(http.StatusOK, tasks[i])
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Tarefa não encontrada"})
}