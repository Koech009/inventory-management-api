# backend/conftest.py
import sys
import os

# Add backend/app to sys.path so pytest can resolve 'models.*' imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "app"))