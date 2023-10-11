# Use the static-ffmpeg image to get ffmpeg and ffprobe binaries
FROM mwader/static-ffmpeg:5.1.2 AS ffmpeg
FROM shivjm/node-chromium:node16-chromium116-debian

#Copy ffmpeg binaries
COPY --from=ffmpeg /ffmpeg /usr/bin/
COPY --from=ffmpeg /ffprobe /usr/bin/

#Install redis
RUN apt-get update && apt install redis -y && redis-cli --version

# Cache npm install in this layer
COPY js/server/package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app/js/server && cp -a /tmp/node_modules /app/js/server

# Install Piper
RUN mkdir /piper && cd /piper && wget https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_amd64.tar.gz && tar -xzvf piper_amd64.tar.gz
RUN cp -a /piper/piper /app

# Set the working directory in the container
WORKDIR /app

# Copy files into the container 
COPY . /app

# Define the command to run when the container starts (startup command)
#CMD ["redis-server", "&&", "node", "./js/server/main.js"]
EXPOSE 2000
CMD redis-server --appendonly yes --daemonize yes && node ./js/server/main.js