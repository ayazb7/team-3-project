FROM python:3.11-slim-bookworm

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      default-libmysqlclient-dev \
      gcc \
      pkg-config && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* || true

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --prefer-binary -r requirements.txt

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

