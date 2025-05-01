import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from "dotenv";

dotenv.config();

// 定义最大重试次数
const MAX_RETRIES = 3;
// 定义重试间的延迟（毫秒）
const RETRY_DELAY_MS = 500;

export async function generateCharacterDataFromAI(character: string): Promise<any> {
    const client = new OpenAI({
        baseURL: process.env.OPENAI_API_BASE,
        apiKey: process.env.OPENAI_API_KEY,
    });
    // 强化 Prompt，更严格要求 JSON 输出格式，并说明不要添加额外内容
    const prompt = `参照 {"character":"我","pinyin": "wǒ","radical": "戈","strokes": 7,"meaning": ["第一人称代词", "表示自己"],"words": ["我们", "我国", "自我", "我的"],"similar": ["找", "戒", "成"]} 这个JSON对象的结构和字段。请为我提供汉字 "${character}" 的类似信息。严格要求：响应必须是一个单一的、有效的 JSON 对象，不包含任何 JSON 对象之外的解释性文字、注释、代码块标记（如 \\\`\\\`\\\`json 或 \\\`\\\`\\\`）或任何其他非 JSON 内容。`;

    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            console.log(`[AI Request Attempt ${retries + 1}/${MAX_RETRIES}] 获取汉字 "${character}" 的数据...`);
            const completion = await client.chat.completions.create({
                model: process.env.MODEL_NAME||'deepseek-v3', // 请确认这是你使用的正确模型
                messages: [{
                    role: 'user',
                    content: prompt // 使用强化后的 Prompt
                }],
                // 如果你的 API 和模型支持强制 JSON 输出，强烈建议启用：
                // response_format: { type: "json_object" },
            });

            const rawContent = completion.choices[0]?.message?.content;

            if (!rawContent) {
                throw new Error("AI 返回内容为空或未定义");
            }

            console.log(`[AI Response Raw] 原始返回内容: ${rawContent}`);

            // 改进清理逻辑：移除可能的代码块标记和前后空格
            // 使用正则表达式匹配可选的 "json" 标识符和前后空格
            const cleanedContent = rawContent
                .replace(/^```(?:json)?\\s*/i, '') // 移除开头 ```json 或 ```
                .replace(/\\s*```$/, '')          // 移除结尾 ```
                .trim();                       // 移除前后空格

            if (!cleanedContent) {
                throw new Error("清理 markdown 标记和空格后，AI 返回内容为空");
            }

            // 尝试解析 JSON
            const result = JSON.parse(cleanedContent);

            // （可选）基本验证：检查返回的对象是否至少包含 'character' 字段
            if (!result || typeof result !== 'object' || !result.character) {
                 console.warn("[JSON Validation] 解析后的 JSON 结构可能不符合预期:", result);
                 // 可以选择在这里抛出错误触发重试，如果结构验证很重要
                 // throw new Error("解析后的 JSON 结构不符合预期");
            }

            console.log(`[JSON Parse Success] 成功解析 JSON:`, result);
            return result; // 解析成功，直接返回结果

        } catch (error: any) {
            retries++;
            console.error(`[Error Attempt ${retries}/${MAX_RETRIES}] 处理汉字 "${character}" 时出错: ${error.message}`);
            console.error("错误详情:", error); // 打印完整错误信息以便调试

            if (retries >= MAX_RETRIES) {
                console.error(`[Fatal Error] 达到最大重试次数 (${MAX_RETRIES})，无法为汉字 "${character}" 获取有效的 JSON 数据。`);
                // 决定是抛出错误还是返回一个表示失败的特定值，例如 null 或抛出错误
                throw new Error(`获取汉字 "${character}" 的有效 JSON 数据失败，已达最大重试次数: ${error.message}`);
            }

            console.log(`等待 ${RETRY_DELAY_MS}ms后重试...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS)); // 等待后重试
        }
    }
    // 此处理论上不应到达，但为防止意外情况，抛出错误
    throw new Error(`获取汉字 "${character}" 数据时意外退出重试循环。`);
}

export async function generateCharacterDataFromAIBatch(): Promise<void> {
    // 读取hanzi.txt文件
    const hanziPath = path.join(__dirname, '../../data/hanzi.txt');
    const characters = fs.readFileSync(hanziPath, 'utf-8').trim();
    const client = new OpenAI({
        baseURL: process.env.OPENAI_API_BASE,
        apiKey: process.env.OPENAI_API_KEY,
    });

    // 更新了批量处理的 Prompt
    const prompt = `参照 { "我": {"pinyin": "wǒ","radical": "戈","strokes": 7,"meaning": ["第一人称代词", "表示自己"],"words": ["我们", "我国", "自我", "我的"],"similar": ["找", "戒", "成"]}} 这个 JSON 对象的结构和字段。请为下面提供的每一个汉字生成一个类似的 JSON 对象，并将所有结果合并为一个单一的、有效的 JSON 对象返回，其中对象的键是每个汉字本身。严格要求：响应必须是这个单一的、有效的 JSON 对象，不包含任何 JSON 对象之外的解释性文字、注释、代码块标记（如 \\\`\\\`\\\`json 或 \\\`\\\`\\\`）或任何其他非 JSON 内容。`;

    for (let i = 0; i < characters.length; i += 10) {
        const batch = characters.slice(i, i + 10);
        if (!batch) continue;

        let retries = 0;
        while(retries < MAX_RETRIES) {
            try {
                console.log(`[AI Batch Request Attempt ${retries + 1}/${MAX_RETRIES}] 处理批次: ${batch}`);
                const completion = await client.chat.completions.create({
                    model: process.env.MODEL_NAME||'deepseek-v3',
                    messages: [{
                        role: 'user',
                        content: `${prompt}汉字如下：${batch}`
                    }],
                    // response_format: { type: "json_object" }, // 同样可以考虑使用
                });

                const rawContent = completion.choices[0]?.message?.content;
                if (!rawContent) {
                   throw new Error("AI 返回内容为空");
                }
                console.log(`[AI Batch Response Raw] 批次 ${batch}:`, rawContent);

                const cleanedContent = rawContent
                    .replace(/^```(?:json)?\\s*/i, '')
                    .replace(/\\s*```$/, '')
                    .trim();

                if (!cleanedContent) {
                   throw new Error("清理后的 AI 返回内容为空");
                }

                const result = JSON.parse(cleanedContent);
                 // （可选）可以添加对批量结果结构的验证
                console.log(`[JSON Batch Parse Success] 成功解析批次 ${batch}:`, result);
                // 这里需要处理或保存这个批次的结果 result
                // 例如：Object.assign(allResults, result);
                break; // 成功解析，跳出当前批次的重试循环

            } catch (error: any) {
                 retries++;
                 console.error(`[Error Batch Attempt ${retries}/${MAX_RETRIES}] 处理批次 "${batch}" 时出错: ${error.message}`);
                 if (retries >= MAX_RETRIES) {
                     console.error(`[Fatal Batch Error] 达到最大重试次数，无法获取批次 "${batch}" 的有效 JSON。跳过此批次...`);
                     // 根据需要决定是跳过这个批次还是抛出错误中断整个过程
                     break; // 跳出重试循环，处理下一个批次
                 }
                 console.log(`等待 ${RETRY_DELAY_MS}ms后重试批次 "${batch}"...`);
                 await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            }
        }
    }
    // 完成所有批次处理后，可能需要返回或保存合并后的结果 allResults
}