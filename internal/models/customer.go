package models

import "time"

type CustomerStatus string

const (
	StatusProspect  CustomerStatus = "prospect"
	StatusActive    CustomerStatus = "active"
	StatusInactive  CustomerStatus = "inactive"
	StatusCancelled CustomerStatus = "cancelled"
)

type Customer struct {
	ID uint `json:"id" gorm:"primaryKey"`

	// Company Info
	CompanyName   string `json:"company_name" gorm:"not null"`
	ContactPerson string `json:"contact_person" gorm:"not null"`
	Email         string `json:"email" gorm:"not null"`
	Phone         string `json:"phone"`
	Address       string `json:"address"`
	City          string `json:"city"`
	PostalCode    string `json:"postal_code"`
	Country       string `json:"country" gorm:"default:'Germany'"`

	// Business Info
	BusinessType string `json:"business_type"` // restaurant, tankstation, etc
	Website      string `json:"website"`

	// CRM Info
	Status           CustomerStatus `json:"status" gorm:"default:'prospect'"`
	AcquiredByUserID uint           `json:"acquired_by_user_id"` // Welke student
	AcquiredBy       User           `json:"acquired_by" gorm:"foreignKey:AcquiredByUserID"`
	AcquisitionDate  time.Time      `json:"acquisition_date"`

	// Financial
	MonthlyFee     float64 `json:"monthly_fee" gorm:"default:0"`
	CommissionRate float64 `json:"commission_rate" gorm:"default:10"` // Percentage voor student

	// Notes
	Notes string `json:"notes" gorm:"type:text"`

	// Timestamps
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Relations
	Communications []Communication `json:"communications,omitempty" gorm:"foreignKey:CustomerID"`
	Invoices       []Invoice       `json:"invoices,omitempty" gorm:"foreignKey:CustomerID"`
}
