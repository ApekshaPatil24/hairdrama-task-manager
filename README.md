\# Hairdrama Task Manager



A full-stack task management application built with Next.js,

TypeScript, Flask, Supabase, Google OAuth 2.0 and Gmail.



\## Features



\- Google OAuth login and user registration

\- Create and manage tasks

\- Assign tasks to registered users

\- Track task status and completion

\- Email notifications for task creation and completion

\- Dashboard, filters and other useful task management features



\## Technology Stack



| Layer | Technology |

|---|---|

| Frontend | Next.js, React, TypeScript |

| Authentication | Google OAuth 2.0 through Supabase Auth |

| Backend | Python, Flask REST API |

| Database | Supabase PostgreSQL |

| Email | Gmail |

| Frontend hosting | Vercel |

| Backend hosting | Render |

| Version control | Git and GitHub |



\## Architecture



```mermaid

flowchart TD

&#x20;   A\[Browser] --> B\[Next.js Frontend]

&#x20;   B <--> C\[Supabase Auth]

&#x20;   C <--> D\[Google OAuth 2.0]

&#x20;   B -->|Authenticated API requests| E\[Flask Backend]

&#x20;   E --> F\[Token Validation and Permissions]

&#x20;   F --> G\[Supabase PostgreSQL]

&#x20;   G --> H\[Profiles and Tasks]

&#x20;   E --> I\[Gmail Notification Service]

&#x20;   I --> J\[Task Creator or Assignee]

```



\### Responsibilities



\- \*\*Next.js:\*\* User interface, login experience and task dashboard.

\- \*\*Supabase Auth:\*\* Google sign-in and user sessions.

\- \*\*Flask:\*\* API endpoints, authorization, task operations and notifications.

\- \*\*Supabase PostgreSQL:\*\* User profiles, tasks, assignments and statuses.

\- \*\*Gmail:\*\* Task creation and completion notifications.



\## Project Structure



```text

hairdrama-task-manager/

├── client/                 # Next.js frontend

├── backend/                # Flask backend

│   ├── app.py

│   ├── requirements.txt

│   └── tests/

├── migrations/             # SQL database migrations

├── .env.example

├── .gitignore

└── README.md

```



\## Prerequisites



\- Node.js 20.9 or newer

\- npm

\- Python

\- Git

\- A Supabase project

\- Google OAuth configuration

\- A Gmail sender account



\## Local Development



\### Frontend



```bash

cd client

npm install

npm run dev

```



Open http://localhost:3000.



\### Backend



Open a separate terminal at the project root:



```bash

cd backend

python -m venv .venv

.venv\\Scripts\\activate

python -m pip install -r requirements.txt

python app.py

```



Backend health endpoint: http://127.0.0.1:5000/health



\### Environment Configuration



Use the root `.env.example` as a reference.



\- Copy the frontend variables into `client/.env.local`.

\- Copy the backend variables into `backend/.env`.

\- Configure Google OAuth through Google Cloud Console and Supabase Auth.



Never commit real credentials or secret keys.



\## Database Migrations



SQL migration files will be maintained in the root

`migrations/` directory. Apply them to Supabase in the

documented order as the database schema is implemented.



\## Security



\- Validate access tokens on protected API endpoints.

\- Enforce task permissions on the backend.

\- Keep privileged database keys on the server.

\- Never expose Gmail credentials to browser code.

\- Validate inputs and handle API errors.



\## Deployment



The planned production deployment uses Vercel for the

frontend, Render for the Flask backend, and Supabase for

the database and authentication.



Production OAuth redirects, CORS origins and environment

variables must be configured for the deployed domains.



The production URL will be added after deployment.



\## Development Status



\- \[x] Next.js frontend initialized

\- \[x] Flask backend initialized

\- \[x] Health endpoint verified

\- \[x] Root Git repository initialized

\- \[x] `.gitignore` created

\- \[x] `.env.example` created

\- \[ ] Database schema and migrations

\- \[ ] Google OAuth

\- \[ ] Task management APIs and frontend

\- \[ ] Gmail notifications

\- \[ ] Testing and production deployment

