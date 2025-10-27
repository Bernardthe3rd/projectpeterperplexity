package models

import "time"

type InvoiceStatus string

const (
	InvoiceDraft     InvoiceStatus = "draft"
	InvoiceSent      InvoiceStatus = "sent"
	InvoicePaid      InvoiceStatus = "paid"
	InvoiceOverdue   InvoiceStatus = "overdue"
	InvoiceCancelled InvoiceStatus = "cancelled"
)

type Invoice struct {
	ID         uint     `json:"id" gorm:"primaryKey"`
	CustomerID uint     `json:"customer_id" gorm:"not null"`
	Customer   Customer `json:"customer" gorm:"foreignKey:CustomerID"`

	InvoiceNumber string `json:"invoice_number" gorm:"unique;not null"`

	// Amounts
	SubTotal  float64 `json:"subtotal" gorm:"not null"`
	VATRate   float64 `json:"vat_rate" gorm:"default:21"` // 21% Nederlandse BTW
	VATAmount float64 `json:"vat_amount"`
	Total     float64 `json:"total" gorm:"not null"`

	// Commission for student
	CommissionAmount float64 `json:"commission_amount"`
	CommissionUserID uint    `json:"commission_user_id"`
	CommissionUser   User    `json:"commission_user" gorm:"foreignKey:CommissionUserID"`

	// Dates
	InvoiceDate time.Time  `json:"invoice_date" gorm:"not null"`
	DueDate     time.Time  `json:"due_date" gorm:"not null"`
	PaidDate    *time.Time `json:"paid_date"`

	Status      InvoiceStatus `json:"status" gorm:"default:'draft'"`
	Description string        `json:"description" gorm:"type:text"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
