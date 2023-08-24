from flask import Flask, send_from_directory
from flask_cors import CORS
import json
import urllib.request
from PIL import Image
from gesture_recognition import get_results

import time
import board
import busio
# from adafruit_bno08x import BNO_REPORT_ROTATION_VECTOR
# from adafruit_bno08x import BNO_REPORT_GAME_ROTATION_VECTOR
import adafruit_bno08x

from adafruit_bno08x.i2c import BNO08X_I2C

i2c = busio.I2C(board.SCL, board.SDA)
bno = BNO08X_I2C(i2c)

bno.enable_feature(adafruit_bno08x.BNO_REPORT_GAME_ROTATION_VECTOR)
bno.enable_feature(adafruit_bno08x.BNO_REPORT_ROTATION_VECTOR)

#g.imu_x = 0
imu_y = 0
imu_z = 0
imu_w = 0

app = Flask(__name__,
            static_url_path='',
            static_folder='../static')
app.config['x'] = 0
CORS(app)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p> <a href=\"index.html\">Click here for graphics</a> <a href=\"getimu\">Click here for IMU</a>"


@app.route("/static/<path:path>")
def webglfun(path):
    #print(path)
    return send_from_directory('static',path)
    
@app.route("/getQuaternion")
def getQuaternion():
    #print(path)
    quat_i, quat_j, quat_k, quat_real = bno.quaternion
    return "Rotation Vector Quaternion:" + \
        "I: %0.6f  J: %0.6f K: %0.6f  Real: %0.6f" % (quat_i, quat_j, quat_k, quat_real)
    

@app.route("/getimu")
def get_imu():
    # imu_x = app.config['x']

    # app.config['x'] = imu_x +  0.1
    # print(imu_x)
    # fake_str = '{},{},{}'.format(imu_x,imu_y,imu_z)
    # fake_json = json.dumps(fake_str).encode('utf-8')
    # print(fake_json)
    # return json.dumps(fake_str).encode('utf-8')


    return json.dumps(bno.game_quaternion).encode('utf-8')

@app.route("/gesture")
def gesture():
    url = "http://192.168.4.1:80/capture?"
    urllib.request.urlretrieve(url, "cap.jpg")
    img = Image.open("cap.jpg")
    name = get_results('./cap.jpg')
    return json.dumps(name).encode('utf-8')

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000)
