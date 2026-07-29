# Zylo CRM Database Schema

## Version

v1.0

---

# Architecture

The application follows a multi-company architecture.

Every business/company has its own isolated data.

Almost every table contains:

- company_id

---

# Core Tables

## Companies

Stores company information.

Fields

- id
- company_name
- logo
- email
- phone
- website
- address
- country
- timezone
- created_at

---

## Users

System login users.

Fields

- id
- company_id
- role_id
- employee_id
- name
- email
- password
- status
- last_login
- created_at

---

## Roles

Permission management.

Fields

- id
- company_id
- role_name
- description

---

## Employees

Employee information.

Fields

- id
- company_id
- employee_code
- first_name
- last_name
- email
- phone
- designation
- department
- joining_date
- salary
- status

---

## Leads

Lead management.

Fields

- id
- company_id
- assigned_to
- name
- company
- phone
- email
- source
- status
- priority
- notes
- created_at

---

## Clients

Customer records.

Fields

- id
- company_id
- lead_id
- company_name
- contact_person
- phone
- email
- address
- gst_number
- status

---

## Projects

Fields

- id
- company_id
- client_id
- project_name
- status
- start_date
- end_date

---

## Tasks

Fields

- id
- project_id
- assigned_to
- title
- description
- due_date
- status

---

## Quotations

Fields

- id
- company_id
- client_id
- quotation_number
- issue_date
- total
- status

---

## Invoices

Fields

- id
- company_id
- client_id
- invoice_number
- issue_date
- due_date
- total
- status

---

## Expenses

Fields

- id
- company_id
- category
- amount
- payment_method
- expense_date

---

## Attendance

Fields

- id
- company_id
- employee_id
- check_in
- check_out
- working_hours
- status

---

# Next Version

- Payments
- Leave Management
- Assets
- Documents
- Notifications
- Activity Logs
- AI Logs