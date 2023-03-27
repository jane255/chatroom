import random
import time


def log(*args):
    print(args, flush=True)


def random_str():
    seed = 'abcdefjsad89234hdsfkljasdkjghigaksldf89weru'
    s = ''
    for i in range(16):
        random_index = random.randint(0, len(seed) - 2)
        s += seed[random_index]
    return s


def get_now_timestamp():
    return int(time.time())
