# 🛑 Block the Occupation - Assignment 1

## 👥 Group Members

- Sama Wahidee  
- Majd Hamarshi  
- Shahd Khalaf

---

## 📌 Project Description

This project is part of Assignment 1, where we explored and consumed a public RESTful API directly from the frontend using React and Axios. The chosen API is the [Boycott Israeli Businesses API](https://boycottisraeli.biz), which provides information about companies that support or oppose the Israeli occupation. The main goal of the app is to allow users to explore and search for companies based on categories, search terms, and pagination.

Users can:
- View companies that support or oppose the occupation.
- Filter companies by category.
- Search by company name.
- Load more results dynamically.
- Navigate to company websites.
  
All the data is retrieved from the Boycott API and displayed in a clean and user-friendly interface.

---

## 🔗 API Used

**Boycott Israeli Businesses API**

### Example Endpoints:
- `GET https://api.boycottisraeli.biz/v1/companies` – Retrieves list of companies
- `GET https://api.boycottisraeli.biz/v1/categories` – Retrieves list of categories
- `GET https://api.boycottisraeli.biz/v1/search/{term}` – Search companies by name
- `GET https://api.boycottisraeli.biz/v1/categories/{slug}/companies`- Retrieves companies under a category.

### REST Principles Highlighted:
- **Resources:** Companies, Categories (e.g., `/v1/companies`, `/v1/categories`)
- **HTTP Methods:** `GET`
- **Representation:** Responses are in JSON

---

## 💻 Technologies Used

- **Frontend Framework:** React  
- **HTTP Client:** Axios  
- **Styling:** HTML, CSS  
- **API:** [boycottisraeli.biz](https://boycottisraeli.biz)

---

## 🛠️ How to Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/shahdKh2/WebServicesTechnology_BlocktheOccupation
   cd WebServicesTechnology_BlocktheOccupation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```
