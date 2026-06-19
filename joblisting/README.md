# Job Listing — Backend API

A Spring Boot REST API that powers a full-stack job board application. It persists job posts in MongoDB and exposes case-insensitive full-text search using standard MongoDB regex queries via Spring Data's `MongoTemplate`.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Data Model Documentation](#data-model-documentation)
- [Installation Guide](#installation-guide)
- [Configuration Guide](#configuration-guide)
- [Running Locally](#running-locally)
- [Example Requests & Responses](#example-requests--responses)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

---

## Overview

Job Listing is a lightweight, full-stack job board. The backend is a Spring Boot 3 application that exposes a JSON REST API consumed by a React/Vite single-page application. Job recruiters can post positions with a title, description, required years of experience, and a list of technologies. Candidates can browse all open positions or search across any field using case-insensitive regex matching — no Atlas Search index required.

---

## Features

- **List all job posts** — retrieve every document from the `JobPost` MongoDB collection.
- **Full-text search** — search across job title (`profile`), description (`desc`), and technology tags (`techs`) using case-insensitive regex queries. Any field match returns the post. No Atlas Search index required.
- **Create job posts** — persist new postings from a JSON request body.
- **CORS enabled** — the API permits requests from `http://localhost:3000` (development) so the React frontend can communicate directly.

---

## Tech Stack

### Backend

| Layer | Technology | Version |
|---|---|---|
| Language | Java | 21 |
| Framework | Spring Boot | 3.5.6 |
| Web | Spring Web (Embedded Tomcat) | — |
| Data access | Spring Data MongoDB | — |
| Database | MongoDB (Atlas or self-hosted) | — |
| Search | MongoTemplate regex (`$or` + `$regex`) | — |
| Build tool | Maven (Maven Wrapper) | — |
| Testing | Spring Boot Test / JUnit 5 | — |

### Frontend (companion app — lives in `../frontend/`)

| Layer | Technology | Version |
|---|---|---|
| Language | JavaScript (ESM) | — |
| UI library | React | 18.3.1 |
| Routing | React Router DOM | 6.23.1 |
| HTTP client | Axios | 1.7.2 |
| Build tool | Vite | 5.3.1 |

---

## Architecture

```
+-----------------------------+
|     React SPA (Vite)        |  http://localhost:3000
|  BrowseJobs  |  PostJob     |
|  SearchBar   |  PostCard    |
+-------+---------------------+
        |  HTTP / JSON (Axios)
        v
+-----------------------------+
|  Spring Boot API            |  http://localhost:8080
|                             |
|  PostController             |
|   +-- GET  /allPosts        |
|   +-- GET  /posts/{text}    |
|   +-- POST /post            |
|                             |
|  PostRepository             |  <- MongoRepository (CRUD)
|  SearchRepImplementation    |  <- MongoTemplate regex search
+-------+---------------------+
        |  MongoDB wire protocol
        v
+-----------------------------+
|  MongoDB                    |
|  Database : Project         |
|  Collection: JobPost        |
+-----------------------------+
```

The controller layer is deliberately thin — it delegates all persistence to the repository layer. There is no separate service layer at this scale, keeping the request path direct and easy to follow.

---

## Project Structure

```
joblisting/
+-- src/
|   +-- main/
|   |   +-- java/com/sanacodes/joblisting/
|   |   |   +-- JoblistingApplication.java          # Entry point (@SpringBootApplication)
|   |   |   +-- controller/
|   |   |   |   +-- PostController.java             # REST endpoints
|   |   |   +-- model/
|   |   |   |   +-- Post.java                       # MongoDB document / domain model
|   |   |   +-- repository/
|   |   |       +-- PostRepository.java             # MongoRepository interface (CRUD)
|   |   |       +-- SearchRepository.java           # Custom search interface
|   |   |       +-- SearchRepImplementation.java    # Regex search via MongoTemplate
|   |   +-- resources/
|   |       +-- application.properties              # Runtime configuration
|   +-- test/
|       +-- java/com/sanacodes/joblisting/
|           +-- JoblistingApplicationTests.java      # Spring context smoke test
+-- pom.xml                                         # Maven dependencies & build
+-- mvnw / mvnw.cmd                                 # Maven Wrapper scripts
```

---

## API Documentation

Base URL: `http://localhost:8080`

### `GET /allPosts`

Retrieves every job post stored in the database.

| Attribute | Value |
|---|---|
| Method | `GET` |
| Path | `/allPosts` |
| Auth | None |
| Request body | None |
| Success status | `200 OK` |

**Response** — `application/json` array of Post objects.

---

### `GET /posts/{text}`

Searches job posts using case-insensitive regex matching across the `profile`, `desc`, and `techs` fields. A post is returned if any one of those fields contains the search term.

| Attribute | Value |
|---|---|
| Method | `GET` |
| Path | `/posts/{text}` |
| Auth | None |
| Path parameter | `text` — the search term (URL-encoded by the frontend) |
| Request body | None |
| Success status | `200 OK` |
| Match mode | Case-insensitive, substring match across `profile`, `desc`, `techs` |

---

### `POST /post`

Creates a new job post and persists it to the database.

| Attribute | Value |
|---|---|
| Method | `POST` |
| Path | `/post` |
| Auth | None |
| Content-Type | `application/json` |
| Success status | `200 OK` |
| Response body | The saved Post object |

**Request body fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `profile` | `string` | Yes | Job title or role name |
| `desc` | `string` | Yes | Full job description |
| `exp` | `integer` | Yes | Minimum years of experience required |
| `techs` | `string[]` | No | List of required technology tags |

---

## Data Model Documentation

### MongoDB Collection: `JobPost`

Mapped by the `@Document(collation = "JobPost")` annotation on `Post.java`.

| Field | BSON type | Java type | Description |
|---|---|---|---|
| `_id` | `ObjectId` | `String` (auto-generated) | MongoDB document identifier |
| `profile` | `string` | `String` | Job title / role |
| `desc` | `string` | `String` | Full job description |
| `exp` | `int32` | `int` | Years of experience required |
| `techs` | `array<string>` | `String[]` | Required technology stack tags |

**No relationships** — the data model is a single flat collection with no references to other collections.

**No search index required** — search runs as a standard MongoDB `$regex` query via `MongoTemplate`. No Atlas Search index or any cluster-level configuration is needed.

---

## Installation Guide

### Prerequisites

| Requirement | Minimum version |
|---|---|
| JDK | 21 |
| Maven | 3.9+ (or use the included `mvnw` wrapper) |
| Node.js | 18+ (frontend only) |
| MongoDB | Atlas free tier M0 or any self-hosted instance |

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Job Listing"
```

### 2. Set up MongoDB

**Option A — MongoDB Atlas (cloud, recommended for beginners):**

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a database user with read/write permissions.
3. Add your IP address (or `0.0.0.0/0` for development) to the Network Access allow-list.
4. Copy the connection string (SRV format) for use in step 3.

**Option B — local MongoDB:**

1. Install MongoDB Community Edition and start `mongod`.
2. The connection string for a default local instance is `mongodb://localhost:27017`.

### 3. Configure the backend

Edit `src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<appName>
spring.data.mongodb.database=Project
```

Replace `<user>`, `<password>`, `<cluster>`, and `<appName>` with your Atlas credentials.

### 4. Install frontend dependencies (optional)

```bash
cd frontend
npm install
```

---

## Configuration Guide

All backend runtime configuration lives in a single file.

**File:** `src/main/resources/application.properties`

| Property | Default value | Description |
|---|---|---|
| `spring.data.mongodb.uri` | Atlas SRV URI | Full MongoDB connection string including credentials |
| `spring.data.mongodb.database` | `Project` | The MongoDB database that Spring Data uses |

### CORS

The controller allows cross-origin requests from `http://localhost:3000` via `@CrossOrigin(origins = "http://localhost:3000")` at the class level and `@CrossOrigin` at the method level. To allow additional origins in production, either update the annotation or add a `CorsConfigurationSource` bean.

### Server port

Spring Boot defaults to port `8080`. To change it, add:

```properties
server.port=8081
```

---

## Running Locally

### Backend

```bash
cd joblisting

# Using the Maven Wrapper (no Maven installation required)
./mvnw spring-boot:run          # Linux / macOS
mvnw.cmd spring-boot:run        # Windows

# Or with a system Maven installation
mvn spring-boot:run
```

The API starts on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm run dev
```

The React app starts on `http://localhost:3000` (Vite default port may vary — check terminal output).

Open your browser to `http://localhost:3000` to use the full application.

---

## Example Requests & Responses

### Get all posts

```bash
curl -X GET http://localhost:8080/allPosts
```

```json
[
  {
    "profile": "Backend Developer",
    "desc": "Build and maintain REST APIs using Java and Spring Boot.",
    "exp": 3,
    "techs": ["Java", "Spring Boot", "MongoDB"]
  },
  {
    "profile": "Frontend Engineer",
    "desc": "Develop responsive UIs with React and TypeScript.",
    "exp": 2,
    "techs": ["React", "TypeScript", "CSS"]
  }
]
```

---

### Search posts

```bash
curl -X GET "http://localhost:8080/posts/Spring%20Boot"
```

```json
[
  {
    "profile": "Backend Developer",
    "desc": "Build and maintain REST APIs using Java and Spring Boot.",
    "exp": 3,
    "techs": ["Java", "Spring Boot", "MongoDB"]
  }
]
```

Returns all matching posts. An empty array `[]` is returned when no posts match. The search is case-insensitive and matches substrings, so `"java"` will match `"Java"`, `"JavaScript"`, etc.

---

### Create a post

```bash
curl -X POST http://localhost:8080/post \
  -H "Content-Type: application/json" \
  -d '{
    "profile": "DevOps Engineer",
    "desc": "Manage CI/CD pipelines, Kubernetes clusters, and cloud infrastructure.",
    "exp": 4,
    "techs": ["Kubernetes", "Docker", "AWS", "Terraform"]
  }'
```

```json
{
  "profile": "DevOps Engineer",
  "desc": "Manage CI/CD pipelines, Kubernetes clusters, and cloud infrastructure.",
  "exp": 4,
  "techs": ["Kubernetes", "Docker", "AWS", "Terraform"]
}
```

The response is the saved document. Note that MongoDB's generated `_id` is not currently mapped to the `Post` model, so it does not appear in the response body.

---

## Troubleshooting

### `Failed to connect to MongoDB`

- Verify the connection string in `application.properties` is correct (user, password, cluster host).
- Ensure the current IP address is in the Atlas Network Access allow-list.
- Check that the database user has `readWrite` permissions on the `Project` database.

### Search returns an empty array when results are expected

- Confirm the document was saved correctly by calling `GET /allPosts` first.
- Remember that regex search is a substring match, so searching for `"spring"` will match `"Spring Boot"`. If no results appear, try a shorter term.
- Check the Spring Boot console for any `MongoQueryException` — this would indicate a malformed query rather than a missing index.

### Frontend shows "Could not load job posts"

- Confirm the backend is running on port `8080`.
- Check browser DevTools > Network for the failing request and inspect the error.
- If the error is a CORS preflight failure, the origin the frontend is running on may not be in the `@CrossOrigin` allow-list.

### `contextLoads` test fails

- The test requires a live MongoDB connection because `@SpringBootTest` boots the full application context. Either point `application.properties` at a reachable Atlas cluster or use an embedded Mongo library (`de.flapdoodle.embed.mongo`) for isolated testing.

### Port `8080` already in use

```bash
# Find the process using the port (macOS/Linux)
lsof -i :8080
# Windows
netstat -ano | findstr :8080
```

Then terminate the process or change the port via `server.port` in `application.properties`.

---

## Future Improvements

- **Pagination** — `GET /allPosts` returns the entire collection. Adding page/size query parameters via Spring Data's `Pageable` support would be necessary for larger datasets.
- **Unique document ID in response** — expose MongoDB's `_id` by adding an `@Id`-annotated `String id` field to `Post` so clients can reference specific documents.
- **Update and delete endpoints** — `PUT /post/{id}` and `DELETE /post/{id}` are missing and would complete the CRUD surface.
- **Input validation** — adding `spring-boot-starter-validation` and `@Valid` / `@NotBlank` / `@Min` annotations on `Post` would return structured 400 errors instead of silent bad data.
- **Service layer** — extracting business logic into a `PostService` would decouple the controller from repository details and simplify unit testing.
- **Environment-based CORS** — replace the hardcoded `@CrossOrigin` origin with a configurable property so the same binary can serve a production frontend domain without code changes.
- **Search performance** — the current regex query does a full collection scan. For large datasets, adding a MongoDB text index (`db.JobPost.createIndex({ profile: "text", desc: "text", techs: "text" })`) and switching to a `$text` query would be significantly faster.
- **Docker Compose** — a compose file bundling the backend and a local MongoDB container would enable a fully offline development environment with no Atlas account needed.
- **API versioning** — prefix all routes with `/api/v1/` to allow breaking changes without disrupting existing consumers.