package main

import(
	"encoding/json"
  "fmt"
  "log"
  "net/http"

  "golang-backend/feedbackdb"
)

func main(){
  feedbackdb.InitDB()

  http.HandleFunc("/feedback", handleFeedback)
  http.HandleFunc("/feedback/", handleFeedbackByID)

  fmt.Println("Server running on http://localhost:8080")
  log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleFeedback(w http.ResponseWriter, r *http.Request){
  w.Header().Set("Access-Control-Allow-Origin", "*") // allow all origins; for production, replace * with your frontend URL
  w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
  w.Header().Set("content-type", "application/json")

  if r.Method == http.MethodOptions {
    w.WriteHeader(http.StatusOK)
    return
  }

  switch r.Method {
  case http.MethodGet:
    items, err := feedbackdb.GetAllFeedback()
    if err != nil{
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }
    json.NewEncoder(w).Encode(items)

  case http.MethodPost:
    var payload struct{
      Title string `json:"title"`
      Message string `json:"message"`
    }

    // decode the payload we received
    if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
      http.Error(w, "Invalid JSON", http.StatusBadRequest)
      return
    }

    newItem, err := feedbackdb.AddFeedback(payload.Title, payload.Message)
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    json.NewEncoder(w).Encode(newItem)

  default:
    http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
  }
}

func handleFeedbackByID (w http.ResponseWriter, r *http.Request){
  w.Header().Set("Access-Control-Allow-Origin", "*")
  w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
  w.Header().Set("content-type", "application/json")

  if r.Method == http.MethodOptions {
    w.WriteHeader(http.StatusOK)
    return
  }

  // extract id from the request path
  id := r.URL.Path[len("/feedback/"):]
  if id == ""{
    http.Error(w, "ID Required", http.StatusBadRequest)
    return 
  }

  // check requested method
  switch r.Method{
  case http.MethodPut:
    var payload struct{
      Title string `json:"title"`
      Message string `json:"message"`
    }

    if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
      http.Error(w, "Invalid JSON", http.StatusBadRequest)
      return 
    }

    updated, err := feedbackdb.EditFeedback(id, payload.Title, payload.Message)
    if err != nil{
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    json.NewEncoder(w).Encode(map[string]any{ "updated": updated })

  case http.MethodDelete:
    deleted, err := feedbackdb.DeleteFeedback(id)
    if err != nil{
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    json.NewEncoder(w).Encode(map[string]any{"deleted": deleted})

  default:
    http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
  }
}