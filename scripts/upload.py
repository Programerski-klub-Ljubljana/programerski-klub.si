import os.path
import subprocess
import time
from pathlib import Path

import ftputil
from alive_progress import alive_bar
from dotenv import load_dotenv
import os.path
import subprocess

import ftputil
from dotenv import load_dotenv
from tqdm import tqdm
import sitemap

def run_fast_scandir(dir):  # dir: str, ext: list
	subfolders, files = [], []

	for f in os.scandir(dir):
		if f.is_dir():
			subfolders.append(f.path)
		if f.is_file():
			files.append(f.path)

	for dir in list(subfolders):
		sf, f = run_fast_scandir(dir)
		subfolders.extend(sf)
		files.extend(f)
	return subfolders, files


load_dotenv()

FTP_SERVER = os.environ['FTP_SERVER']
FTP_USER = os.environ['FTP_USER']
FTP_PASSWORD = os.environ['FTP_PASSWORD']

sitemap.init()
subprocess.run(["npm", "run", "build"])

root = Path(__file__).parent.parent.joinpath('build').absolute()
os.chdir(root)
subfolders, files = run_fast_scandir('.')

print()
with ftputil.FTPHost(FTP_SERVER, FTP_USER, FTP_PASSWORD) as FTP:
	FTP.rmtree(FTP.curdir, ignore_errors=True)
	with alive_bar(len(subfolders), title="Creating remote directories...", force_tty=True) as bar:
		for dir in subfolders:
			FTP.makedirs(dir, exist_ok=True)
			bar()
	with alive_bar(len(files), title="Uploading local build files...", force_tty=True) as bar:
		for file in files:
			FTP.upload(file, file)
			bar()
