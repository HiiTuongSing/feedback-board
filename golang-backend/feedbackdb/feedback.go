package feedbackdb

import(
	"database/sql"
  "log"
  "time"

  _ "github.com/jackc/pgx/v5/stdlib"
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
  var err error

  db, err = sql.Open(
    "pgx",
    "postgres://postgres:postgres@localhost:5432/feedback_db?sslmode=disable",
  )

  if err != nil {
    log.Fatal("Failed to connect to database:", err)
  }

  err = db.Ping()
  if err != nil {
    log.Fatal("Database not reachable:", err)
  }

  createTable := `
    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  _, err = db.Exec(createTable)
  if err != nil {
    log.Fatal("Failed to create table:", err)
  }
}

func AddFeedback(title, message string) (*Feedback, error) {
  id := uuid.New().String()

  _, err := db.Exec(
    `INSERT INTO feedback (id, title, message) VALUES ($1, $2, $3)`,
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
    `UPDATE feedback SET title = $1, message = $2 WHERE id = $3`,
		title, message, id,
  )
  if err != nil{
    return false, err
  }

  rowsAffected, _ := res.RowsAffected()
  return rowsAffected > 0, nil
}

func DeleteFeedback(id string) (bool, error) {
  res, err := db.Exec(`DELETE FROM feedback WHERE id = $1`, id)
  if err != nil{
    return false, err
  }

  rowsAffected, _ := res.RowsAffected()
  return rowsAffected > 0, nil
}