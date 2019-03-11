FROM python:3.7

EXPOSE 5000

COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt

ENTRYPOINT [ "python" ]

CMD [ "entrypoint.py" ]