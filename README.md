# ProjectReview --- Student Project Submission & Mentor Review Platform

ProjectReview is a role-based project review platform where students
submit their software projects and mentors review them with actionable
feedback. It separates **authentication** (who you are) from
**authorization** (what you are allowed to do) using JWT-based
authentication and Role-Based Access Control (RBAC).


------------------------------------------------------------------------

## Table of Contents

-   [Overview](#overview)
-   [Core Features](#core-features)
-   [Roles and Permissions](#roles-and-permissions)
-   [Technology Stack](#technology-stack)
-   [Architecture](#architecture)
-   [Authentication and Security](#authentication-and-security)
-   [Project Structure](#project-structure)
-   [Environment Variables](#environment-variables)
-   [API Overview](#api-overview)
-   [Validation and Error Handling](#validation-and-error-handling)
-   [Author](#author)

## Overview

ProjectReview provides a structured workflow for student project
submissions and mentor feedback:

1.  A user creates an account and is assigned the `STUDENT` role by
    default.
2.  A student submits project details, including a repository URL, live
    demo URL, and description.
3.  A mentor reviews a submission and approves or rejects it with a
    feedback comment.
4.  Users can view the submissions and review information they are
    permitted to access.

The application demonstrates practical backend and full-stack concepts
such as JWT authentication, role-based route protection, relational data
modelling, request validation, rate limiting, and secure review
workflows.

## Core Features

-   **Account authentication:** Sign up and log in with email and
    password.
-   **Role-based access control:** Separate `STUDENT` and `MENTOR`
    permissions.
-   **Project submissions:** Submit a project name, repository URL, live
    URL, and description.
-   **Mentor review workflow:** Approve or reject submissions and
    provide a comment.
-   **Protected routes:** Authenticate users before checking their role
    and permissions.
-   **Token refresh:** Use short-lived access tokens and a refresh flow
    to maintain sessions.
-   **Input validation:** Validate incoming data on the server.
-   **Rate limiting:** Reduce abuse of exposed endpoints.
-   **Relational data:** Model users, submissions, and feedback using
    PostgreSQL and Prisma.
-   **Duplicate-submission protection:** Use a canonical repository key
    and database constraints where configured.
-   **Pagination and filtering:** Support efficient retrieval of
    submission data where implemented by the API.

## Roles and Permissions

  Action                             Student                           Mentor
  -------------------------------- --------- --------------------------------
  Register for an account                Yes   No, not through public sign-up
  Create a project submission            Yes                               No
  View permitted submission data         Yes                              Yes
  View all students' work                 No                              Yes
  Approve or reject a submission          No                              Yes
  Add review feedback                     No                              Yes

Public registration assigns `STUDENT` by default. Mentor accounts should
be provisioned through the project's trusted administrative or
server-side setup process; users should not be allowed to grant
themselves the mentor role.

> **Security note:** The backend must enforce these permissions. Hiding
> a button in the frontend is not an authorization mechanism.

## Technology Stack

  -----------------------------------------------------------------------
  Area                                Technology
  ----------------------------------- -----------------------------------
  Language                            TypeScript

  Frontend                            Next.js, React

  Styling and UI                      Tailwind CSS, shadcn/ui

  Backend                             Node.js, Express.js

  Database                            PostgreSQL

  ORM                                 Prisma

  Authentication                      JWT access and refresh tokens

  Validation                          Zod

  Security / reliability              Role-based middleware, rate
                                      limiting, protected routes
  -----------------------------------------------------------------------

The exact package versions and scripts are defined in the `package.json`
files in the frontend and backend directories.

## Architecture

The project uses a frontend/backend architecture:

-   **Frontend (`frontend/`)** --- Next.js application, screens, forms,
    and client-side interactions.
-   **Backend (`backend/`)** --- Express API, authentication and
    authorization middleware, business logic, validation, and database
    access.
-   **Database** --- PostgreSQL managed through Prisma models and
    migrations.

Typical protected-request flow:

``` text
Client request
     |
     v
Authentication middleware
  Verify access token
     |
     v
Authorization middleware
  Check role / permission
     |
     v
Rate limiter and request validation
     |
     v
Controller / service
     |
     v
Prisma ORM -> PostgreSQL
     |
     v
JSON response
```

A failed authentication check should return `401 Unauthorized`; an
authenticated user who lacks permission should receive `403 Forbidden`.

## Authentication and Security

### Authentication vs. authorization

-   **Authentication (AuthN):** Verifies the user's identity.
-   **Authorization (AuthZ):** Checks whether the authenticated user's
    role can perform an action.
-   **RBAC:** Assigns permissions according to roles such as `STUDENT`
    and `MENTOR`.



### Request protection

Protected requests should follow this order:

1.  Authenticate the request.
2.  Authorize the user's role.
3.  Apply rate limiting.
4.  Validate request data.
5.  Run the controller/service logic.

JWT payloads are signed, not encrypted. Do not put passwords, secrets,
or other sensitive data in a JWT payload.

## Project Structure

The known high-level structure is:

``` text
project-review/
├── frontend/
│   ├── app/
│   └── lib/
│       └── validations.ts
│
└── backend/
    ├── src/
    │   └── modules/
    │       └── submissions/
    │           └── submissions.schema.ts
    └── prisma/
        └── schema/
```


## Environment Variables

Use the actual variable names from the backend configuration and
frontend API client. Common categories include:

  -----------------------------------------------------------------------
  Variable category                   Purpose
  ----------------------------------- -----------------------------------
  PostgreSQL connection URL           Connect Prisma to the database

  JWT access-token secret             Sign and verify access tokens

  JWT refresh-token secret            Sign and verify refresh tokens

  Frontend API base URL               Let the frontend call the backend

  Mentor seed / admin configuration   Provision trusted mentor accounts
  (if enabled)                        
  -----------------------------------------------------------------------

Keep real values in local environment files or your deployment
provider's secret manager. Add `.env`, `.env.local`, and other
secret-bearing files to `.gitignore`. Never publish production secrets
in the README.

## API Overview

The following endpoints are referenced by the project's documented flow.
Confirm the complete route prefix and response schemas in the backend
router before using them in a client.

  ------------------------------------------------------------------------------------------------
  Endpoint                                         Purpose                 Access
  ------------------------------------------------ ----------------------- -----------------------
  `POST /auth/refresh`                             Refresh the token pair  Valid refresh session

  `PATCH /api/v1/reviews/submissions/:id/status`   Approve or reject a     Mentor
                                                   submission and record   
                                                   feedback                

  Submission routes                                Create and retrieve     Role-dependent
                                                   project submissions     
  ------------------------------------------------------------------------------------------------

Authentication routes, submission routes, and any deployment-specific
`/api` prefix may be mounted under a common API base path. Check the
Express route registration for the exact full URLs.

### Review workflow

The review endpoint should validate the requested status and feedback,
confirm that the caller is a mentor, and persist the status change and
feedback consistently. Where implemented, a conditional/atomic database
update helps prevent conflicting reviews.

## Validation and Error Handling

The backend should validate untrusted request data before business logic
runs. Typical response meanings are:

  Status                        Meaning
  ----------------------------- ---------------------------------------------
  `200 OK`                      Request succeeded
  `201 Created`                 Resource created
  `400 Bad Request`             Invalid request data
  `401 Unauthorized`            Missing, invalid, or expired authentication
  `403 Forbidden`               Authenticated user lacks permission
  `404 Not Found`               Requested resource does not exist
  `409 Conflict`                Duplicate or conflicting resource
  `429 Too Many Requests`       Rate limit exceeded
  `500 Internal Server Error`   Unexpected server failure

The exact response body and error codes depend on the implementation.


## Author

**MD Mustafizur Rahman**

-   GitHub: [@rahmancoder](https://github.com/rahmancoder)
-   Portfolio:
    [mustafizur-rahman-portfolio.netlify.app](https://mustafizur-rahman-portfolio.netlify.app/)


------------------------------------------------------------------------

If you find an issue or have a suggestion, open a GitHub issue or submit
a pull request.
