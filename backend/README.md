# Overview

This directory contains the server responsuible for serving content to the frontend application

# Run the server

1. (first run only) Install the dev environment
   ```bash
   cd backend
   python -m venv .venv
   . .venv/bin/activate
   pip install -r requirements.txt
   ```
1. Serve with hot reload
   ```bash
   uvicorn main:app --reload
   ```
