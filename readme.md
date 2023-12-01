# Integrating Facial Recognition with IoT for Access Control: Unlocking Doors using Electromagnets and Logging Worker Entries

## Prerequisites
- Node.js
- Python 3.6+

## Hardware

There are two ways to run this project:
1. Using a Raspberry Pi 4 + Webcam
2. Using a computer with a webcam + ESP8266

Choose one of the above and follow the instructions below.

### 1. Raspberry Pi 4
Connect relay to GPIO 7. Connect webcam to Raspberry Pi.

### 2. ESP8266
Connect relay to GPIO 5 (D1). Edit wifi configuration in `/relay/main.ino` and upload to ESP8266. 

## Installation

1. Clone this repository:
```bash
git clone git@github.com:superhooman/robt310.git
cd robt310
```

2. Install the required packages for each subsystem:
- `/cron`: 
    ```bash
    cd cron
    npm ci
    ```
    Also, if you are using ESP8266, then create a `.env` file in the `cron` directory and add the following:
    ```
    RELAY_ADDRESS=<address of the relay> # e.g. http://192.168.0.193/
    ```
- `/deepface`:
    ```bash
    cd deepface
    pip3 install deepface # or pip install deepface
    python3 check.py # to download the required models
    ```
- `/system`:
    ```bash
    cd system
    npm ci
    npx prisma db push
    ```

3. Now, we need to setup processes to run each subsystem. We will use `pm2` to manage these processes. Install `pm2` globally:
```bash
npm install -g pm2
```

4. Start the processes:
- `/cron`:
    ```bash
    cd cron
    pm2 start index.js --name "cron"
    ```
- `/system`:
    ```bash
    cd system
    npm run build
    pm2 start npm --name "system" -- start
    ```

5. You all set! Now you can access the system at `http://localhost:3000` and the cron job will check camera every 10 seconds.

