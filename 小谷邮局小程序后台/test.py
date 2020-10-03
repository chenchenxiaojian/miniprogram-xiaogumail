
import time
def get_nowtime():
    ct = time.time()
    local_time = time.localtime(ct)
    nowtime = time.strftime("%Y-%m-%d %H:%M:%S", local_time)
    return nowtime

print(get_nowtime())