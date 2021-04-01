FROM python:3.7-slim
    
RUN apt-get update \
    && apt-get install -y --no-install-recommends

ENV PIP_FORMAT=legacy
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get install -y netcat && apt-get autoremove -y

# Create unprivileged user
RUN adduser --disabled-password --gecos '' myuser

WORKDIR /faust-project/

COPY . /faust-project

RUN pip3 install -e .

ENTRYPOINT ["./wait_for_services.sh"]

CMD ["./run.sh", "${WORKER}", "${WORKER_PORT}", "${CONFIG_CLASS}"]
