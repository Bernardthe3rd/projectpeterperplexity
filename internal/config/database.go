package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	// Load .env optionally (for local dev)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables from system")
	}

	var dsn string

	// Try DATABASE_URL first (Railway provides this)
	databaseURL := os.Getenv("DATABASE_URL")

	if databaseURL != "" {
		// Railway/Production: Use DATABASE_URL
		dsn = databaseURL
		log.Println("Using DATABASE_URL for database connection")
	} else {
		// Local development: Use individual env vars
		dbHost := os.Getenv("DB_HOST")
		dbUser := os.Getenv("DB_USER")
		dbPassword := os.Getenv("DB_PASSWORD")
		dbName := os.Getenv("DB_NAME")
		dbPort := os.Getenv("DB_PORT")

		// Validate individual vars only if DATABASE_URL is not set
		if dbHost == "" || dbUser == "" || dbPassword == "" || dbName == "" {
			log.Fatal("Missing required database environment variables (DATABASE_URL or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME)")
		}

		// Default port
		if dbPort == "" {
			dbPort = "5432"
		}

		// For local development, use sslmode=disable
		dsn = fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
			dbHost, dbUser, dbPassword, dbName, dbPort,
		)

		log.Printf("Using individual env vars for database connection to %s/%s", dbHost, dbName)
	}

	// Connect to database
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	fmt.Println("✅ Database connected successfully!")
}
