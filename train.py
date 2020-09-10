import subprocess
import sys
while True:    
    subprocess.run(["node","--max-old-space-size="+("24000" if len(sys.argv) <= 2 else (sys.argv[2] + "000")),sys.argv[1]],shell=True)