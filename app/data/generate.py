import json
from pathlib import Path
from openai import OpenAI


def generate_character_data_from_ai():
    # 读取hanzi.txt文件
    hanzi_path = "./hanzi.txt"
    with open(hanzi_path, 'r', encoding='utf-8') as f:
        characters = f.read().strip()

    client = OpenAI(
        base_url="https://www.gptapi.us/v1",
        api_key="sk-rjp8gh1j8lA9CebP1b052a5490164d7d97873457D7D773D1",
        )
    # 为每个汉字生成基本结构
    prompt='参照 { "我": {"pinyin": "wǒ","radical": "戈","strokes": 7,"meaning": ["第一人称代词", "表示自己"],"words": ["我们", "我国", "自我", "我的"],"similar": ["找", "戒", "成"]}}  样例'
    for i in range(0, 10, 10): #len(characters)
        batch = characters[i:i+10]
       
        print("{prompt},处理下面每一个汉字,返回json对象,{batch}".format(prompt=prompt,batch=batch))

        completion = client.chat.completions.create(
        extra_body={},
        model="deepseek-v3",

        messages=[
            {
            "role": "user",
            "content": "{prompt},处理下面每一个汉字,只返回json对象，汉字如下：{batch}".format(prompt=prompt,batch=batch)
            }
        ]
        )
        #print(completion)
        print(completion.choices[0].message.content)



def generate_character_data():
    # 读取hanzi.txt文件
    hanzi_path = "./hanzi.txt"
    with open(hanzi_path, 'r', encoding='utf-8') as f:
        characters = f.read().strip()
    
    print("characters:", len(characters))
    # 为每个汉字生成基本结构
    characters_data = {}
    for char in characters:
        # 使用pypinyin获取拼音
        char_pinyin = pinyin(char, style=Style.NORMAL)[0][0]
        
        characters_data[char] = {
            "pinyin": char_pinyin,  # 自动填充拼音
            "radical": "",  # 需要填充部首
            "strokes": 0,  # 需要填充笔画数
            "meaning": [],  # 需要填充含义
            "words": [],  # 需要填充组词
            "similar": []  # 需要填充形近字
        }
    # 保存到characters.json
    output_path = Path(__file__).parent / "characters.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(characters_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    generate_character_data_from_ai()