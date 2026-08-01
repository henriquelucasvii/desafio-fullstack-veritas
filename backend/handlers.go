package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)	

var tasks = []Task{}
var ai autoIncrement

func getTask(c *gin.Context) {
	c.JSON(http.StatusOK, tasks)
}

func createTarefas(c *gin.Context) {
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

