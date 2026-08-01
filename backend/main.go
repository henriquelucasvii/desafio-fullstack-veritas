package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

func main() {

	server := gin.Default()

	server.GET("/tasks", func (ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "Ok",
		})
	})

	server.Run(":8000")

	log.Println("Servidor rodando em http://localhost:8000/tasks")
}