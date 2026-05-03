# City Laptops - Full Stack E-commerce (Laravel API + React)

This workspace includes a complete professional e-commerce stack for **City Laptops**:

- Backend API: Laravel + Sanctum + MySQL
- Frontend: React (Vite) + Tailwind + Axios + React Router
- Admin dashboard: product CRUD, charts, protected routes
- Public storefront: home, listing, filtering, product details, WhatsApp CTA

## Project Demo

Watch the running project: [Video Demo](https://drive.google.com/file/d/1qyIfSXzKM_RrBgCphYoXrbXtWP7HZ-p-/view?usp=sharing)

## Project Structure

- `backend/` Laravel API app code
- `frontend/` React app code

---

## Backend Setup (Laragon)

1. Install Laragon with:
   - PHP 8.2+
   - MySQL 8+
   - Composer
2. Open Laragon terminal in `backend/`.
3. If you are starting fresh with Laravel base files, run:
   - `composer create-project laravel/laravel .`
4. Install Sanctum:
   - `composer require laravel/sanctum`
5. Copy/merge the provided backend files from this workspace into your Laravel project.
6. Configure env:
   - Copy `.env.example` to `.env`
   - Set DB values
   - Set `FRONTEND_URL=http://localhost:5173`
7. Generate key:
   - `php artisan key:generate`
8. Run migrations and seeders:
   - `php artisan migrate --seed`
9. Storage link for product images:
   - `php artisan storage:link`
10. Start API:
    - `php artisan serve`

Single admin user configured (test credentials):

- Name: `Test Admin`
- Email: `test.admin@example.com`
- Password: `Test@1234`

Only this configured admin email can log in to the admin panel when using the included seeders.

### Mail / SMTP Setup (Forgot Password + Order Notifications)

If you want to enable email sending (forgot-password, order notifications) configure a valid SMTP account in the backend `.env` (example below). Replace the sample `MAIL_USERNAME` and `MAIL_FROM_ADDRESS` with your real mailbox.

1. Configure SMTP credentials in `.env` (example):

   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-smtp-user@example.com
   MAIL_PASSWORD=your-smtp-app-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=your-smtp-user@example.com
   ```

2. If using Gmail: enable 2-Step Verification and generate an App Password, then put that App Password in `MAIL_PASSWORD`.
3. Restart the backend after `.env` changes.

---

## Frontend Setup

1. Open terminal in `frontend/`
2. Install dependencies:
   - `npm install`
3. Create `.env` in `frontend/` with:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

4. Run dev server:
   - `npm run dev`

Frontend runs at `http://localhost:5173`.

---

## Connect React with Laravel API

- Axios base URL is read from `VITE_API_URL`.
- Login returns Sanctum token and stores it in localStorage.
- Axios interceptor sends `Authorization: Bearer <token>` automatically.
- Admin routes require valid token and `is_admin = true`.

---

## API Routes Documentation

All routes are prefixed with `/api/v1`.

### Public

- `GET /products` (optional query: `brand=Dell|HP`)
- `GET /products/{id}`
- `POST /orders`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Authenticated (Sanctum)

- `GET /auth/me`
- `POST /auth/logout`

### Admin-only

- `POST /products` (multipart)
- `POST /products/{id}` (send `_method=PUT` + multipart)
- `DELETE /products/{id}`
- `GET /dashboard/stats`
- `GET /orders`
- `POST /orders/{id}/status`

### Product Payload Example

```json
{
  "name": "Dell XPS 15 Creator Edition",
  "brand": "Dell",
  "model": "XPS 15 9530",
  "price": 429999,
  "specs": {
    "ram": "32GB DDR5",
    "ssd": "1TB NVMe",
    "processor": "Intel Core i9 13th Gen",
    "display": "15.6\" OLED 3.5K"
  },
  "description": "Premium ultrabook for creators"
}
```

Images are uploaded using `images[]` multipart fields.

---

## Features Delivered

### Backend

- Laravel API-only style
- MVC + Eloquent models and relationships
- Sanctum auth (login/logout/me)
- Single-admin enforcement (configured admin email only)
- Forgot password + reset password API for admin
- Admin middleware authorization
- Form Request validation for create/update
- Multiple image upload with storage disk
- Product created event + listener logging
- Customer orders API + admin order status management
- Admin email notification on new order
- Seeders with Dell and HP products

### Frontend

- Premium, responsive UI with custom typography and gradients
- Hero landing page with business info and WhatsApp contact
- Product listing + Dell/HP filters
- Product details with gallery + specs
- Product order modal with customer checkout form
- Admin login + protected routes
- Forgot password and reset password screens
- Dashboard charts (brand + price range)
- Orders page in admin panel
- Product CRUD with table and modal form
- Image preview in admin form

---

## Notes

If forgot-password returns a mail delivery warning, set a valid Gmail App Password in `MAIL_PASSWORD` and retry.
