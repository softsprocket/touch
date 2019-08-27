package models

// Site models a registered website user
type Site struct {
	Domain   string
	MemberID int64
	Role     string
}

// ForEachSiteFunction callback in Persistence model
type ForEachSiteFunction func(*Site)

// SitePersistence interface for persisting sessions - a Site is keyed on MemberID, Domain
type SitePersistence interface {
	// Create must return an error if the Site already exists
	Create(*Site) (int64, error)
	// Read must return an error if a Site doesn't exist
	Read(int64, string) (*Site, error)
	// Update must return an error if the Site doesn't exist
	Update(*Site) error
	// Delete acepts the member ID and deletes the record
	Delete(int64, string)
	// Next must call the function parameter
	// once for each entry matching the Site object
	ForEach(*Site, ForEachSiteFunction)
}
