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
   