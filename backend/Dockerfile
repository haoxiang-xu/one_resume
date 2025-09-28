FROM python:3.11.11

WORKDIR /app

COPY requirements.txt .
COPY .env .env
RUN pip install --upgrade pip
RUN pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements.txt

COPY . .

EXPOSE 8888

CMD ["python", "main.py"]
