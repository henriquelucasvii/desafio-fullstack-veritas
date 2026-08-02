package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)	

var tasks = []Task{}
var ai autoIncrement

const file = "tasks.json"

func loadFile() {
	data, err := os.ReadFile(file)
	if err != nil {
		if os.IsNotExist(err) {
			tasks = []Task{}
			return
		}
		log.Fatal(err)
	}

	if len(data) == 0 {
		tasks = []Task{}
		return
	}

	if err := json.Unmarshal(data, &tasks); err != nil {
		log.Fatal(err)
	}

	var maxId int = 0
	for _, task := range tasks {
		if task.ID > maxId {
			maxId = task.ID
		}
	}
	ai.id = maxId + 1

}

func writeFile() {
	data, err := json.MarshalIndent(tasks, "", "  ")
	if err != nil {
		log.Fatal(err)
	}

	if err := os.WriteFile(file, data, 0644); err != nil {
		log.Fatal(err)
	}
}

// Obter tarefas
func getTasks(c *gin.Context) {
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
	writeFile()
	
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
			writeFile()
			c.JSON(http.StatusOK, tasks[i])
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Tarefa não encontrada"})
}

// Deletar tarafas
func deleteTask(c *gin.Context) {

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Inválido!. Insira um ID válido"})
		return
	}

	for i, task := range tasks {
		if task.ID == id {
			tasks = append(tasks[:i], tasks[i+1:]...)
			writeFile()
			c.JSON(http.StatusOK, gin.H{"message": "Tarefa deletada"})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Tarefa não encontrada"})
}

// Cors
func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {

        c.Header("Access-Control-Allow-Origin", "*")
        c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
