package feedbackdb

import(
	"database/sql"
  "log"
  "path/filepath"
  "time"

  _ "modernc.org/sqlite"
	"github.com/google/uuid"
)

// declare struct
type Feedback struct{
  ID string `json:"id"`
  Title string `json:"title"`
  Message string `json:"message"`
  CreatedAt time.Time `json:"created_at"`
}

// declare var with type
var db *sql.DB

func InitDB() {
  dbpath, _ := filepath.Abs("feedback.db")
  var err error
  db, err = sql.Open("sqlite", dbpath)
  if err != nil {
    log.Fatal("Failed to connect to database:", err)
  }

  createTable := `CREATE TABLE IF NOT EXISTS feedback (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		message TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`

  _, err = db.Exec(createTable)
  if err != nil {
    log.Fatal("Failed to create table:", err)
  }
}

func AddFeedback(title, message string) (*Feedback, error) {
  id := uuid.New().String()

  _, err := db.Exec(
    `INSERT INTO feedback (id, title, message) VALUES (?, ?, ?)`,
		id, title, message,
  )
  if err != nil {
    return nil, err
  }

  return &Feedback{
    ID: id,
    Title: title,
    Message: message,
  }, nil
}

func GetAllFeedback() ([]Feedback, error) {
  rows, err := db.Query(`SELECT id, title, message, created_at FROM feedback ORDER BY created_at DESC`)
  if err != nil{
    return nil, err
  }
  
  defer rows.Close() // close query at the end of the function
   
  var feedbacks []Feedback // declare feedbacks as a slice of Feedback struct

  for rows.Next() {
   var f Feedback
   err := rows.Scan(&f.ID, &f.Title, &f.Message, &f.CreatedAt)
   if err != nil{
    return nil, err
   }
   feedbacks = append(feedbacks, f)
  }

  return feedbacks, nil
}

func EditFeedback(id, title, message string) (bool, error) {
  res, err := db.Exec(
    `UPDATE feedback SET title = ?, message = ? WHERE id = ?`,
		title, message, id,
  )
  if err != nil{
    return false, err
  }

  rowsAffected, _ := res.RowsAffected()
  return rowsAffected > 0, nil
}

func DeleteFeedback(id string) (bool, error) {
  res, err := db.Exec(`DELETE FROM feedback WHERE id = ?`, id)
  if err != nil{
    return false, err
  }

  rowsAffected, _ := res.RowsAffected()
  return rowsAffected > 0, nil
}