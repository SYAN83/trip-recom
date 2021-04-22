FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt api.py .flaskenv ./
COPY data/* ./data/

RUN pip3 install -r requirements.txt

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
