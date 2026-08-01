package main

import (
	"github.com/gin-gonic/gin"
)

func start(server *gin.Engine) {

	server.GET("/tasks", getTask)
	server.POST("/tasks", createTarefas)

	server.Run(":8000")
}

func main() {
	server := gin.Default()

	start(server)
}