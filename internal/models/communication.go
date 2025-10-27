package models

import "time"

type CommunicationType string

const (
	CommEmail   CommunicationType = "email"
	CommPhone   CommunicationType = "phone"
	CommMeeting CommunicationType = "meeting"
	CommOther   CommunicationType = "other"
)

type Communication struct {
	ID         uint     `json:"id" gorm:"primaryKey"`
	CustomerID uint     `json:"customer_id" gorm:"not null"`
	Customer   Customer `json:"customer" gorm:"foreignKey:CustomerID"`

	UserID uint `json:"user_id" gorm:"not null"` // Wie heeft gecommuniceerd
	User   User `json:"user" gorm:"foreignKey:UserID"`

	Type      CommunicationType `json:"type" gorm:"not null"`
	Subject   string            `json:"subject" gorm:"not null"`
	Content   string            `json:"content" gorm:"type:text;not null"`
	Direction string            `json:"direction" gorm:"not null"` // inbound, outbound

	// Email specific
	FromEmail string `json:"from_email"`
	ToEmail   string `json:"to_email"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
