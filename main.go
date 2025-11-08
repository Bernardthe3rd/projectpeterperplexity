package main

import (
	"fmt"
	"projectpeterperplexity/internal/config"
	"projectpeterperplexity/internal/handlers"
	"projectpeterperplexity/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Database setup
	config.ConnectDatabase()
	config.MigrateDatabase()

	// Gin router
	r := gin.Default()

	// CORS setup
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",                            // Local development
			"https://front-end-production-ad0d.up.railway.app", // Railway frontend URL
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// API routes
	api := r.Group("/api")
	{
		// Public routes (geen auth required)
		api.POST("/login", handlers.Login)

		// Public business routes (voor frontend)
		api.GET("/businesses", handlers.GetBusinesses)
		api.GET("/businesses/:id", handlers.GetBusinessByID)

		// Protected routes (auth required)
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			// Profile
			protected.GET("/profile", handlers.GetProfile)

			// Admin only routes
			admin := protected.Group("/admin")
			admin.Use(middleware.AdminOnly())
			{
				admin.POST("/register", handlers.Register)
				admin.POST("/businesses", handlers.CreateBusiness)
				// Hier komen later customer/invoice endpoints
			}

			// Student + Admin routes
			crm := protected.Group("/crm")
			crm.Use(middleware.StudentOrAdmin())
			{
				// Hier komen later communication endpoints
			}
		}
	}

	fmt.Println("🚀 Go API Server starting on http://localhost:8080")
	fmt.Println("🔐 Default Admin: admin@deutschebedrijven.nl / admin123")
	fmt.Println("👨‍🎓 Default Student: student@deutschebedrijven.nl / student123")
	r.Run(":8080")
}
