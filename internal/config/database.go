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

	// DEBUG: Print all relevant env vars to see what Railway provides
	log.Println("=== DEBUG: Environment Variables ===")
	log.Printf("DATABASE_URL exists: %v", os.Getenv("DATABASE_URL") != "")
	log.Printf("DB_HOST exists: %v", os.Getenv("DB_HOST") != "")
	log.Printf("PGHOST exists: %v", os.Getenv("PGHOST") != "")
	log.Printf("POSTGRES_HOST exists: %v", os.Getenv("POSTGRES_HOST") != "")
	log.Println("====================================")

	var dsn string

	// Try DATABASE_URL first (Railway provides this)
	databaseURL := os.Getenv("DATABASE_URL")

	if databaseURL != "" {
		dsn = databaseURL
		log.Println("✅ Using DATABASE_URL for database connection")
	} else {
		// Try Railway's default PostgreSQL variables
		pgHost := os.Getenv("PGHOST")
		pgUser := os.Getenv("PGUSER")
		pgPassword := os.Getenv("PGPASSWORD")
		pgDatabase := os.Getenv("PGDATABASE")
		pgPort := os.Getenv("PGPORT")

		if pgHost != "" && pgUser != "" && pgPassword != "" && pgDatabase != "" {
			// Use Railway's PG variables
			if pgPort == "" {
				pgPort = "5432"
			}
			dsn = fmt.Sprintf(
				"host=%s user=%s password=%s dbname=%s port=%s sslmode=require",
				pgHost, pgUser, pgPassword, pgDatabase, pgPort,
			)
			log.Println("✅ Using PGHOST/PGUSER variables for database connection")
		} else {
			// Fallback to local dev variables
			dbHost := os.Getenv("DB_HOST")
			dbUser := os.Getenv("DB_USER")
			dbPassword := os.Getenv("DB_PASSWORD")
			dbName := os.Getenv("DB_NAME")
			dbPort := os.Getenv("DB_PORT")

			if dbHost == "" || dbUser == "" || dbPassword == "" || dbName == "" {
				log.Fatal("Missing required database environment variables (DATABASE_URL, PG* variables, or DB_* variables)")
			}

			if dbPort == "" {
				dbPort = "5432"
			}

			dsn = fmt.Sprintf(
				"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
				dbHost, dbUser, dbPassword, dbName, dbPort,
			)
			log.Println("✅ Using DB_HOST/DB_USER variables for database connection")
		}
	}

	// Connect to database
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	fmt.Println("✅ Database connected successfully!")
}
