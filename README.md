# mallow-blog
A next gen blogging application.

## 🚀 Features

- Modern Laravel 10.x architecture
- RESTful API design
- Comprehensive test coverage
- API documentation with Scribe
- Code quality tools integration
- Database migrations and seeders

## 📋 Requirements

- PHP >= 8.1
- Composer
- MySQL/PostgreSQL (Sqlite for local)
- Laravel 10.x

## 🛠️ Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/mallow-blog.git
   cd mallow-blog
   ```

2. Install dependencies
   ```bash
   composer install
   ```

3. Configure environment
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with:
   - Database credentials
   - Application URL
   - Any other environment-specific settings

5. Generate application key
   ```bash
   php artisan key:generate
   ```

6. Run migrations
   ```bash
   php artisan migrate
   ```

7. (Optional) Seed the database
   ```bash
   php artisan db:seed
   ```

## 💻 Development

### Code Style
This project uses Laravel Pint for maintaining code style. To format your code:
```bash
./vendor/bin/pint
```

To check code style without making changes:
```bash
./vendor/bin/pint --test
```

### API Documentation
We use Scribe for API documentation. To generate/update the documentation:
```bash
php artisan scribe:generate
```

Access the documentation at:
- HTML: `/docs/api`
- JSON: `/docs/api.json`

### Database

To refresh your database during development:
```bash
php artisan migrate:fresh
```

To refresh and seed:
```bash
php artisan migrate:fresh --seed
```

## 🧪 Testing

Run the full test suite:
```bash
php artisan test
```

Run specific test file:
```bash
php artisan test --filter=PostTest
```

## 📝 Code Quality Checks

Before submitting a PR, ensure:

1. All tests pass
   ```bash
   php artisan test
   ```
2. Code style is correct
   ```bash
   ./vendor/bin/pint --test
   ```
3. API documentation is up to date
   ```bash
   php artisan scribe:generate
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Laravel Team for the amazing framework
- All contributors who help improve this project

## 📞 Support

If you discover any security-related issues, please email [your-email@example.com] instead of using the issue tracker.

For general issues and feature requests, use the GitHub issue tracker.
