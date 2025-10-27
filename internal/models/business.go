package models

import "time"

type Business struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Category    string    `json:"category" gorm:"not null"` // restaurant, tankstation, supermarkt
	SubCategory string    `json:"sub_category"`             // grieks, italiaans, etc.
	Address     string    `json:"address"`
	City        string    `json:"city"`
	Country     string    `json:"country" gorm:"default:'Germany'"`
	PostalCode  string    `json:"postal_code"`
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
	Phone       string    `json:"phone"`
	Website     string    `json:"website"`
	Email       string    `json:"email"`
	Description string    `json:"description" gorm:"type:text"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	CustomerID  *uint     `json:"customer_id"`
	Customer    Customer  `json:"customer,omitempty" gorm:"foreignKey:CustomerID"`
}
