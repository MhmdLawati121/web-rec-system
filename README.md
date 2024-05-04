# Web Recruitment System - FYP

## Setup

### Prerequisites

- Install Node.js and npm [Node Official Website](https://nodejs.org/en/download)
- Install and setup PostgreSQL [Postgresql Official Website](https://www.postgresql.org/download/)

### Getting Started

1. **Clone repository**: `git clone https://github.com/MhmdLawati121/Node.git`
2. **Install dependencies**:

```bash
cd Node
npm install
```

You should obtain a node_modules folder now.

3. **Setup environment**: Navigate to project directory and create the dotenv file named ".env" with the following content:

```
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=your_database
DB_PASSWORD=your_password
DB_PORT=5432
```

4. **Create database**: Create a database in postgresql and paste the SQL code in the `/database/tables.sql` file in the psql script then run it.

5. **Start Server**: You can run the server by typing `npm run dev` in the terminal.

### Python API

1. **Install Python Interpreter**: [Python Official Website](https://www.python.org/)
   Make sure to add the interpreter to environment variables during installation, or look up how to do that if you already have Python installed.

2. **Install dependencies**: You can install all Python dependencies using the commands:

```bash
cd Node
pip install -r requirements.txt
```

3. **Run Flask Server**: Run the server by typing:

```bash
python api/app.py
```

## Troubleshooting

If any of the files aren't working properly, make sure that you are in the root of the directory.
