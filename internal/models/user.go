package models

import (
	"golang.org/x/crypto/bcrypt"
	"time"
)

type Role string

const (
	RoleAdmin   Role = "admin"
	RoleStudent Role = "student"
)

type User struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	Email     string `json:"email" gorm:"unique;not null"`
	Password  string `json:"-" gorm:"not null"` // - betekent niet in JSON
	FirstName string `json:"first_name" gorm:"not null"`
	LastName  string `json:"last_name" gorm:"not null"`
	Role      Role   `json:"role" gorm:"not null;default:'student'"`
	IsActive  bool   `json:"is_active" gorm:"default:true"`

	// Student specific
	StudentID  string `json:"student_id"` // Studenten nummer
	University string `json:"university"`

	// Timestamps
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Relations
	Customers []Customer `json:"customers,omitempty" gorm:"foreignKey:AcquiredByUserID"`
}

// HashPassword hasht het wachtwoord
func (u *User) HashPassword(password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// CheckPassword controleert het wachtwoord
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}
