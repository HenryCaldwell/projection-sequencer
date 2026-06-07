.PHONY: backend frontend install-backend install-frontend install

backend:
	cd backend && .venv\Scripts\python -m uvicorn app.main:app --reload

frontend:
	cd frontend && npm run dev

install-backend:
	cd backend && python -m venv .venv && .venv\Scripts\python -m pip install -r requirements.txt

install-frontend:
	cd frontend && npm install

install:
	$(MAKE) install-backend
	$(MAKE) install-frontend
