from fastapi import FastAPI
import string
import random
import json
import uvicorn
from pydantic import BaseModel
app = FastAPI()
import database
import time

sms = ""   # 验证码


def get_nowtime():
    ct = time.time()
    local_time = time.localtime(ct)
    nowtime = time.strftime("%Y-%m-%d %H:%M:%S", local_time)
    return nowtime

class reg_item(BaseModel):
    userPhone:str
    sms:str

class letter_item(BaseModel):  # post数据内容
    write_phone:str
    accept_phone:str
    title:str
    content:str
    isanonymous:str
    fileList:list     # 图片





# 返回四位随机的验证码
@app.get("/getsms")
def get_identifying_code():
    seeds = string.digits
    random_str = random.choices(seeds, k=4)
    global sms
    sms = "".join(random_str) 
    return {"sms":sms}

# 验证码校验
@app.post("/checksms")
async def checksms(reg_item:reg_item):
    item = reg_item.dict()    # client post data(userPhone sms)
    item_sms = item["sms"]    # client sms
    print(item["userPhone"])
    global sms
    if item_sms == sms:
        print("client sms == server sms")
        return {"msg":"succeed", "userPhone":item["userPhone"]}
    else:
        print("different sms")
        return {"msg":"fail"}

@app.post("/addmail")
async def addmail(letter_item:letter_item):
    item = letter_item.dict()
    mysql = database.db_helper()
    # print("信件的信息如下:",item)
    # print("图片：", item["fileList"][0])
    # print("图片：", type(item["fileList"][0]['url']))
    image_url_list = []
    if "fileList" in item:
        for i in range(len(item["fileList"])):
            image_url_list.append(item["fileList"][i]['url'])
    # print("图片url列表为：", image_url_list)
    sql = "insert into letters(write_phone, accept_phone,letter_title,letter_content,letter_date) values(%s,%s,%s,%s,%s)"
    if len(image_url_list) == 1:
        sql = "insert into letters(write_phone, accept_phone,letter_title,letter_content,letter_date, letter_photo_1) values(%s,%s,%s,%s,%s,%s)"
    elif len(image_url_list) == 2:
        sql = "insert into letters(write_phone, accept_phone,letter_title,letter_content,letter_date, letter_photo_1,letter_photo_2) values(%s,%s,%s,%s,%s,%s,%s)"

    params = [item["write_phone"],item["accept_phone"], item['title'],item['content'], get_nowtime()]
    params.extend(image_url_list)
    if mysql.execute(sql,params):
        print("insert succeed")
        # sql = "select last_insert_id() from letters";
        sql = "select max(letter_id) from letters"
        max_letter_id = mysql.query(sql)[0][0]
        print(mysql.query(sql)[0][0])
        sql = "insert into user_letters(letter_id, accept_phone, write_phone,letter_date,letter_title,letter_content) values(%s,%s,%s,%s,%s,%s)"
        if len(image_url_list) == 1:
            sql = "insert into user_letters(letter_id, accept_phone, write_phone,letter_date,letter_title,letter_content,letter_photo_1,) values(%s,%s,%s,%s,%s,%s,%s)"
        elif len(image_url_list) == 2:
            sql = "insert into user_letters(letter_id, accept_phone, write_phone,letter_date,letter_title,letter_content,letter_photo_1,letter_photo_2) values(%s,%s,%s,%s,%s,%s,%s,%s)"
        params = [max_letter_id, item["accept_phone"], '***********' if item['isanonymous']=="true" else item["write_phone"],get_nowtime(),item['title'],item['content'],]
        params.extend(image_url_list)
        if mysql.execute(sql, params):
            return {"msg":"succeed"}
        else:
            return {"msg":"fail"}
    else:
        return {"msg":"fail"}
    

@app.get("/getLatestLetters/{accept_phone}")
async def get_lastest_letters(accept_phone):
    print(accept_phone)
    sql = "select * from user_letters where accept_phone=%s  order by letter_date desc limit 10";
    params = [accept_phone]
    mysql = database.db_helper()
    query_data = mysql.query(sql,params)
    print("查询的数据为：",query_data)
    response_data = []
    temp = {}
    for i in range(len(query_data)):
        print("i的值为：",i)
        print(query_data[i][0])
        temp["letter_id"] = query_data[i][0]
        
        temp["accept_phone"] = query_data[i][1]
        temp["write_phone"] = query_data[i][2]
        temp["not_read"] = query_data[i][3]
        temp["letter_title"] = query_data[i][4]
        temp["letter_content"] = query_data[i][5]
        temp["letter_date"] = str(query_data[i][6])
        temp["letter_photo_1"] = query_data[i][7]
        temp["letter_photo_2"] = query_data[i][8]

        response_data.append(temp)
        print("temp的值为：",temp)
        temp = {}
    print(response_data)
    return {"msg":"success","response_data":response_data}

@app.get("/deleteLetter/{letter_id}")
async def delete_letter(letter_id):
    print("新件id为:",letter_id)
    mysql = database.db_helper()
    sql = "delete from user_letters where letter_id=%s"
    params = [letter_id]
    if mysql.execute(sql,params):
        
        return {"msg":"success"}
    else:
        return {"msg":"fail"}

@app.get("/setLetterRead/{letter_id}")
async def set_letter_read(letter_id):
    mysql = database.db_helper()
    sql = "update user_letters set not_read=0 where letter_id=%s"
    params = [letter_id]
    if mysql.execute(sql,params):
        print("修改状态成功")
        return {"msg":"success"}
    else:
        return {"msg":"fail"}
    

if __name__ == "__main__":
    uvicorn.run(app=app,host="127.0.0.1", port=8000)