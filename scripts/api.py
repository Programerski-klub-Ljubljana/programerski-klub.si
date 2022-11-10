import json
import subprocess
from pathlib import Path

import requests

res = requests.get('http://localhost:8000/openapi.json')
openapi_content = res.json()

for path_data in openapi_content["paths"].values():
	for operation in path_data.values():
		tag = operation["tags"][0]
		operation_id = operation["operationId"]
		to_remove = f"{tag}-"
		new_operation_id = operation_id[len(to_remove):]
		operation["operationId"] = new_operation_id

f = Path('openapi.json')
f.write_text(json.dumps(openapi_content))
