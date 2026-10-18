# Just Click

This is a simple web-based counter application built with Flask. It includes a button that increments the counter by one each time it is clicked, and displays a visual effect.

[![YouTube](https://img.youtube.com/vi/y8iT7XPuqTg/0.jpg)](https://www.youtube.com/watch?v=y8iT7XPuqTg)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software:

- Docker
- Any web browser

### Installing

A step-by-step series of examples that tell you how to get a development environment running.

1. Clone the repo:
   ```bash
   git clone https://github.com/stwater20/just-click.git
   ```
2. Navigate to the project directory:
   ```bash
   cd just-click
   ```
3. Build the Docker image:
   ```bash
   docker build -t just-click .
   ```
4. Run the container:
   ```bash
   docker run -p 3000:3000 just-click
   ```
   
## Features

- Big clickable button with particles, floating `+1`, sound effects and a colour that shifts as you click
- Combo meter, live clicks-per-second (CPS), best CPS / best combo records
- Achievements and milestone celebrations every 100 clicks
- Progress saved in the browser (`localStorage`); keyboard support (Space / Enter)
- Share button (native share sheet or copy to clipboard)

## SEO

The page ships with a description, Open Graph / Twitter tags, JSON-LD structured data, `/robots.txt` and `/sitemap.xml`.
Set `SITE_URL` to your public address so canonical links and the sitemap use it:

```bash
docker run -p 3000:3000 -e SITE_URL=https://your-domain.example just-click
```

After deploying, submit `https://your-domain.example/sitemap.xml` in Google Search Console.
