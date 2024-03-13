from typing import Union

from fastapi import FastAPI
import json
global data,NUMBER
data = []
NUMBER = 0

global FULLDUMP
FULLDUMP = ""

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/data/{id}/{jsonData}")
async def addToArray(id,jsonData):
    global data
    #print(id,jsonData)
    DataHandle = json.loads(jsonData)
    DataHandle["id"] = id
    print(DataHandle)
    data.append(jsonData)
    return {id:jsonData}

@app.get("/data/{jsonData}")
async def BIGDATA(jsonData):
    global FULLDUMP,NUMBER
    FULLDUMP = jsonData
    file = open("Log" + str(NUMBER) + ".log","w")
    file.write(FULLDUMP)
    file.close()


def orderArray():
    global data
    array=data
    swap = True
    while swap == True:
        swap = False
        for i in range(0,len(array)-1):
            if (json.loads(array[i])['id'] > json.loads(array[i+1])['id']):
                array[i+1],array[i] = array[i],array[i+1]
                swap = True



@app.get("/STORE")
async def StoreData():
    global data,NUMBER
    file = open("Log" + str(NUMBER) + ".log","w")
    orderArray()
    
    for item in data:
        file.write(item + " \n")
    file.close()
    data = []
    NUMBER += 1


