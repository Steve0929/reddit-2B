# Use the static-ffmpeg image to get ffmpeg and ffprobe binaries
FROM mwader/static-ffmpeg:5.1.2 AS ffmpeg
FROM shivjm/node-chromium:node16-chromium116-debian

#Copy ffmpeg binaries
COPY --from=ffmpeg /ffmpeg /usr/bin/
COPY --from=ffmpeg /ffprobe /usr/bin/

#Install redis
RUN apt-get update && apt install redis -y && redis-cli --version

# Cache npm install in this layer
# Install pm2 globally
RUN npm install pm2 -g

# Copy both server and UI package.json files
COPY js/server/package.json /tmp/package.json
COPY js/UI/package.json /tmp_UI/package.json

# Install dependencies for both server and UI in one step
RUN npm install --prefix /tmp && mkdir -p /app/js/server/ && mv /tmp/node_modules app/js/server/
RUN npm install --prefix /tmp_UI && mkdir -p /app/js/UI/ && mv /tmp_UI/node_modules app/js/UI/

# Install Piper
RUN mkdir /piper && cd /piper && wget https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_amd64.tar.gz && tar -xzvf piper_amd64.tar.gz
RUN cp -a /piper/piper /app

# Set the working directory in the container
WORKDIR /app

# Copy files into the container 
COPY . /app

# Expose ports
EXPOSE 2000 3000

# Build the next.js UI app
# Temporary working directory for building the Next.js application
WORKDIR /app/js/UI
RUN npm run build

# Define the command to run when the container starts (startup command)
WORKDIR /app
CMD redis-server --appendonly yes --daemonize yes && pm2-runtime ./ecosystem.config.js