package config

import (
	"fmt"
	"projectpeterperplexity/internal/models"
)

func MigrateDatabase() {
	// Auto-migrate alle models
	err := DB.AutoMigrate(
		&models.User{},
		&models.Customer{},
		&models.Communication{},
		&models.Invoice{},
		&models.Business{},
	)
	if err != nil {
		panic("Failed to migrate database")
	}

	fmt.Println("✅ Database migration completed!")
	SeedDatabase()
}

func SeedDatabase() {
	// Check if users already exist
	var userCount int64
	DB.Model(&models.User{}).Count(&userCount)

	if userCount == 0 {
		// Create admin user
		admin := models.User{
			Email:     "admin@deutschebedrijven.nl",
			FirstName: "Admin",
			LastName:  "User",
			Role:      models.RoleAdmin,
			IsActive:  true,
		}
		admin.HashPassword("admin123") // Verander dit in productie!
		DB.Create(&admin)

		// Create test student
		student := models.User{
			Email:      "student@deutschebedrijven.nl",
			FirstName:  "Test",
			LastName:   "Student",
			Role:       models.RoleStudent,
			StudentID:  "S123456",
			University: "University of Groningen",
			IsActive:   true,
		}
		student.HashPassword("student123")
		DB.Create(&student)

		fmt.Println("✅ Admin and student users created!")
	}

	// Rest van business seeding...
	var businessCount int64
	DB.Model(&models.Business{}).Count(&businessCount)

	if businessCount > 0 {
		fmt.Println("📦 Database already contains data, skipping seed")
		return
	}

	// Check if data already exists
	var count int64
	DB.Model(&models.Business{}).Count(&count)

	if count > 0 {
		fmt.Println("📦 Database already contains data, skipping seed")
		return
	}

	// Sample German businesses near Dutch border
	businesses := []models.Business{
		{
			Name:        "Restaurant Rheinblick",
			Category:    "restaurant",
			SubCategory: "deutsch",
			Address:     "Rheinuferstr. 15",
			City:        "Düsseldorf",
			Country:     "Germany",
			PostalCode:  "40213",
			Phone:       "+49 211 123456",
			Website:     "www.rheinblick.de",
			Email:       "info@rheinblick.de",
			Description: "Traditional German restaurant with Rhine view",
			Latitude:    51.2277,
			Longitude:   6.7735,
		},
		{
			Name:        "Tankstelle Shell Autobahn",
			Category:    "tankstation",
			Address:     "Autobahn A3 Rastplatz",
			City:        "Köln",
			Country:     "Germany",
			PostalCode:  "50667",
			Phone:       "+49 221 987654",
			Description: "Highway gas station with convenience store",
			Latitude:    50.9375,
			Longitude:   6.9603,
		},
		{
			Name:        "Taverna Santorini",
			Category:    "restaurant",
			SubCategory: "grieks",
			Address:     "Hauptstraße 42",
			City:        "Aachen",
			Country:     "Germany",
			PostalCode:  "52062",
			Phone:       "+49 241 555123",
			Website:     "www.santorini-aachen.de",
			Email:       "info@santorini-aachen.de",
			Description: "Authentic Greek cuisine near Dutch border",
			Latitude:    50.7753,
			Longitude:   6.0839,
		},
		{
			Name:        "REWE Supermarkt",
			Category:    "supermarkt",
			Address:     "Berliner Allee 100",
			City:        "Düsseldorf",
			Country:     "Germany",
			PostalCode:  "40212",
			Phone:       "+49 211 456789",
			Website:     "www.rewe.de",
			Description: "Large supermarket with fresh products",
			Latitude:    51.2254,
			Longitude:   6.7763,
		},
	}

	// Insert seed data
	for _, business := range businesses {
		DB.Create(&business)
	}

	fmt.Printf("✅ Database seeded with %d sample businesses!\n", len(businesses))
}
