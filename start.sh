#!/usr/bin/env bash
export FLASK_APP=backend_upload.py
export FLASK_ENV=production
gunicorn backend_upload:app --bind 0.0.0.0:$PORT

