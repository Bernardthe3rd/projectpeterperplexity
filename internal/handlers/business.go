package handlers

import (
	"net/http"
	"projectpeterperplexity/internal/config"
	"projectpeterperplexity/internal/models"

	"github.com/gin-gonic/gin"
)

// GetBusinesses - Support voor filtering
func GetBusinesses(c *gin.Context) {
	var businesses []models.Business

	// Query parameters
	category := c.Query("category")       // ?category=restaurant
	city := c.Query("city")               // ?city=Düsseldorf
	subcategory := c.Query("subcategory") // ?subcategory=grieks

	query := config.DB.Where("is_active = ?", true)

	// Apply filters
	if category != "" {
		query = query.Where("category = ?", category)
	}

	if city != "" {
		query = query.Where("city ILIKE ?", "%"+city+"%")
	}

	if subcategory != "" {
		query = query.Where("sub_category = ?", subcategory)
	}

	// Execute query
	result := query.Find(&businesses)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"details": result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"count":      len(businesses),
		"businesses": businesses,
		"filters": gin.H{
			"category":    category,
			"city":        city,
			"subcategory": subcategory,
		},
	})
}

// GetBusinessByID - Specifiek bedrijf ophalen
func GetBusinessByID(c *gin.Context) {
	id := c.Param("id")
	var business models.Business

	result := config.DB.First(&business, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Business not found",
			"id":    id,
		})
		return
	}

	c.JSON(http.StatusOK, business)
}

// CreateBusiness - Nieuw bedrijf toevoegen
func CreateBusiness(c *gin.Context) {
	var business models.Business

	if err := c.ShouldBindJSON(&business); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid JSON data",
			"details": err.Error(),
		})
		return
	}

	// Set defaults
	if business.Country == "" {
		business.Country = "Germany"
	}
	business.IsActive = true

	result := config.DB.Create(&business)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create business",
			"details": result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success":  true,
		"business": business,
		"message":  "Business created successfully",
	})
}
