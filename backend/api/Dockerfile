FROM python:3.11-slim-bookworm

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m -u 1003 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 5003

ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py
ENV FLASK_DEBUG=False
ENV PORT=5003
ENV HOST=0.0.0.0

CMD ["python", "app.py"]

