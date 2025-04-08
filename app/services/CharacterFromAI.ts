import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from "dotenv";

dotenv.config();

export async function generateCharacterDataFromAI(character: string): Promise<any> {
    const client = new OpenAI({
        baseURL: process.env.OPENAI_API_BASE,
        apiKey: process.env.OPENAI_API_KEY,
    });
    const prompt = '参照  {"character":""我"","pinyin": "wǒ","radical": "戈","strokes": 7,"meaning": ["第一人称代词", "表示自己"],"words": ["我们", "我国", "自我", "我的"],"similar": ["找", "戒", "成"]}  样例';
    const completion = await client.chat.completions.create({
        model: 'deepseek-v3',
        messages: [{
            role: 'user',
            content: `${prompt},处理下面每一个汉字,只返回json对象,汉字如下：${character}`
        }]
    });
    console.log(completion.choices[0].message.content?.replace("```json", "").replace("```", ""));
    const result = JSON.parse(completion.choices[0].message.content?.replace("```json", "").replace("```", "")||'{}');
    return result;
}
export async function generateCharacterDataFromAIBatch(): Promise<void> {
    // 读取hanzi.txt文件
    const hanziPath = path.join(__dirname, '../../data/hanzi.txt');
    const characters = fs.readFileSync(hanziPath, 'utf-8').trim();
    const client = new OpenAI({
        baseURL: process.env.OPENAI_API_BASE,
        apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = '参照 { "我": {"pinyin": "wǒ","radical": "戈","strokes": 7,"meaning": ["第一人称代词", "表示自己"],"words": ["我们", "我国", "自我", "我的"],"similar": ["找", "戒", "成"]}}  样例';

    for (let i = 0; i < 10; i += 10) {
        const batch = characters.slice(i, i + 10);
        const completion = await client.chat.completions.create({
            model: 'deepseek-v3',
            messages: [{
                role: 'user',
                content: `${prompt},处理下面每一个汉字,只返回json对象，汉字如下：${batch}`
            }]
        });

        console.log(completion.choices[0].message.content);
    }
}