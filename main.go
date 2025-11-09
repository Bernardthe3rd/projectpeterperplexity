package main

import (
	"fmt"
	"os"
	"projectpeterperplexity/internal/config"
	"projectpeterperplexity/internal/handlers"
	"projectpeterperplexity/internal/middleware"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/ulule/limiter/v3"
	ginlimiter "github.com/ulule/limiter/v3/drivers/middleware/gin"
	"github.com/ulule/limiter/v3/drivers/store/memory"
)

// Rate limiters setup
func setupLoginRateLimiter() gin.HandlerFunc {
	// 5 login attempts per 15 minutes
	rate := limiter.Rate{
		Period: 15 * time.Minute,
		Limit:  5,
	}
	store := memory.NewStore()
	instance := limiter.New(store, rate)
	return ginlimiter.NewMiddleware(instance)
}

func setupGlobalRateLimiter() gin.HandlerFunc {
	// 100 requests per minute globally
	rate := limiter.Rate{
		Period: 1 * time.Minute,
		Limit:  100,
	}
	store := memory.NewStore()
	instance := limiter.New(store, rate)
	return ginlimiter.NewMiddleware(instance)
}

func main() {
	// Database setup
	config.ConnectDatabase()
	config.MigrateDatabase()

	// Gin router
	r := gin.Default()

	// Global rate limiter (applies to all routes)
	r.Use(setupGlobalRateLimiter())

	// CORS setup
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"https://www.burogrenstoerisme.nl", // Custom domain
			"https://burogrenstoerisme.nl",     // Root domain
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Login rate limiter (stricter)
	loginLimiter := setupLoginRateLimiter()

	// API routes
	api := r.Group("/api")
	{
		// Public routes with strict rate limiting
		api.POST("/login", loginLimiter, handlers.Login)

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
				admin.POST("/register", loginLimiter, handlers.Register) // Also rate limit registration
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

	// Get port from environment
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("🚀 Go API Server starting on port", port)
	fmt.Println("🔒 Production mode - Credentials are secured")
	fmt.Println("📊 Rate limiting active:")
	fmt.Println("   - Login: 5 attempts / 15 min")
	fmt.Println("   - Global: 100 requests / min")

	r.Run(":" + port)
}
