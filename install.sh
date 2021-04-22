#!/bin/bash

python3 -m venv api/env
source api/env/bin/activate
python -m pip install -r api/requirements.txt
