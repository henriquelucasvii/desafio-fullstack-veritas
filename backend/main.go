package main

import (
	"github.com/gin-gonic/gin"
)

func start(server *gin.Engine) {
	loadFile()

	server.GET("/tasks", getTask)
	server.POST("/tasks", createTask)
	server.PUT("/tasks/:id", updateTask)
	server.DELETE("/tasks/:id", deleteTask)

	server.Run(":8000")
}

func main() {
	server := gin.Default()
	
	start(server)
}