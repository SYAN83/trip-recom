from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions

import time
import json

import numpy as np


SPEED_LB = 15  # speed 5%

with open('./data/speeds-tod-small.min.json', 'r') as file:
    avg_speeds = json.load(file)


app = FlaskAPI(__name__)


@app.route('/', methods=['GET'])
def hello():
    return {'data': 'Hello World'}


@app.route('/speeds', methods=['POST', 'GET'])
def get_speeds():
    node_pairs = request.data.get('node_pairs', [])
    if node_pairs:
        time_of_day = request.data.get('time_of_day', '')
        speeds = [get_speed(start_node=start_node, end_node=end_node, time_of_day=time_of_day) for start_node, end_node in node_pairs]
        return {'speeds': speeds}
    else:
        return {'speeds': []}


def get_speed(start_node, end_node, time_of_day=None):
    if start_node in avg_speeds:
        avg_speeds_ = avg_speeds[start_node]
        if end_node in avg_speeds_:
            avg_speeds__ = avg_speeds_[end_node]
            if time_of_day in avg_speeds__:
                speed = avg_speeds__[time_of_day]
            else:
                speed = np.mean(list(avg_speeds__.values()))
        else:
            speed = np.mean([np.mean(list(x.values())) for x in avg_speeds_.values()])
        return speed
    else:
        return SPEED_LB  # lower bound speed