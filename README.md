# PS2 Scrims Script

![Overlay Example](https://i.imgur.com/ZLHFrl1.png)

## Getting Started

### Requirements

Make sure you have the latest [node.js](https://nodejs.org/en/) installed. This application requires at least Node 12.6.0 to run.

### Installation

#### command line
Run `install.bat`.

#### Docker
Create the Docker image

    docker build . -t <username>/lanesmash2023
    
Ensure the image is listed in `docker images`

    
Now you'll see it listed if you run docker ps

## Running A Match

### Starting The Script

**IMPORTANT:** You need to restart the script *BEFORE **EVERY** MATCH*, regardless of how the match ended or if the script terminated with an error. Failing to do so may result in subsequent matches being scored incorrectly and other undesirable effects.

#### command line

Run ``start.bat``. Alternatively, run the following from the command line:
   If the script started up successfully, you should see a message like this in opened terminal window:

   ```sh $
   Starting server...
   Connect to website @ localhost:4000
   ```

#### Docker

Remind yourself of the image name

    > docker images
    REPOSITORY                              TAG                 IMAGE ID       CREATED          SIZE
    varunda/lanesmash2023                   latest              bde154c23926   30 minutes ago   983MB

Run the Docker image

    > docker run -p 4000:4000 --name $NAME -d <username>/lanesmash2023
    cc69af5ca2b01713adfff3064853f4b3ef91f6599e74f499a0e810fdb0fdd567
    
Confirm it's running
 
    > docker ps 
    CONTAINER ID   IMAGE                     COMMAND                  CREATED          STATUS          PORTS                                       NAMES
    5716755e3cbb   varunda/lanesmash2023     "docker-entrypoint.s…"   26 minutes ago   Up 26 minutes   0.0.0.0:4000->4000/tcp, :::4000->4000/tcp   ls23-4000

You can check the logs by using `docker logs {CONTAINER ID/NAME}`

    > docker logs ls23-4000
    Starting server...
    Connect to website @ localhost:4000
    Here are all the different urls:
            http://localhost:4000/          -> For the main overlay
            http://localhost:4000/admin     -> Admin interface for the match
            http://localhost:4000/versus    -> Display score at the half and end

### Setting Up A Match

In the browser of your choice, navigate to <http://localhost:3000/admin>.

_You should see a screen with these forms on the left_ ![admin view](https://i.imgur.com/eXf79Xj.png)

## Other Admin Fields

#### Start Match
Will Start the Timer

Disable the change of teams or lane

#### Pause Match
Will Pause the Timer

Do not allow to change teams or lane

#### Resume Match
Will Resume the Timer

Do not allow to change teams or lane

#### End Round Match
Will End round prematurally.
Will reset timer to default value

Will allow to change lane and teams

#### Reset Match
Will Reset the Match.
Will reset timer to default value, the number off round, the score

Will allow to change lane and teams

#### Second Round and More

For the Second Round Just press Start

## Streaning Overlay Setup - OBS

In your streaming scene, add a new BrowserSource source and set to URL to ``http://localhost:4000/``.

Set the ``Width`` and ``Height`` to the full width of your monitor, and clear out the ``CSS`` box.

Check the ``Refresh browser when scene becomes active`` box at the bottom of the Properties window.

Click ``OK`` to save the source, then make sure it's visible and positioned above your Planetside 2 source.

_The Properties for your BrowserSource should look something like this_   
   ![BrowserSource Properties](https://i.imgur.com/8kFu3pa.png)


## Credits

Created orginaly by Atypick then later modified by Hailot then by me.
Supported by the API
