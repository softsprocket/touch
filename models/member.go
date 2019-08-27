package models

// Member models a registered website user
type Member struct {
	ID        int64
	FirstName string
	LastName  string
	Email     string
	Password  string
}

// ForEachMemberFunction callback in Persistence model
type ForEachMemberFunction func(*Member)

// MemberPersistence interface for persisting sessions
type MemberPersistence interface {
	// Create must return an error if the Member already exists
	Create(*Member) (int64, error)
	// Read must return an error if a Member doesn't exist
	Read(ID int64) (*Member, error)
	// Update must return an error if the Member doesn't exist
	Update(*Member) error

	// Delete acepts the member ID and deletes the record
	Delete(int)
	// Next must call the function parameter
	// once for each entry matching the Member object
	ForEach(*Member, ForEachMemberFunction)
}
