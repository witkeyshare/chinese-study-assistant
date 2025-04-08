import 'reflect-metadata';
import { Repository } from "typeorm";
import { Character } from './entities/Character';
import { ViewHistory } from './entities/ViewHistory';

import { generateCharacterDataFromAI } from "./CharacterFromAI";
import { AppDataSource} from "./ormconfig";

export class CharacterService {
  private characterRepository: Repository<Character>;
  private historyRepository: Repository<ViewHistory>;
  
  constructor() {
    this.characterRepository = AppDataSource.getRepository(Character);
    this.historyRepository = AppDataSource.getRepository(ViewHistory);
  }
  
  static async initialize() {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('数据库连接已初始化');
      }
      return new CharacterService();
    } catch (error) {
      console.error('初始化CharacterService失败:', error);
      throw new Error('数据库连接初始化失败，请稍后重试');
    }
  }

  private async ensureConnection() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  }

  async getCharacterInfo(character: string) {
    await this.ensureConnection();
    try {
      // 首先尝试从本地数据库获取
      let characterData = await this.characterRepository.findOne({
        where: { character }
      });
      if (!characterData) {
        // 如果本地数据库没有，尝试从 AI 获取
        characterData = await generateCharacterDataFromAI(character);
        // 保存到本地数据库
        await this.characterRepository.save(characterData as Character);
      }
      // 保存到浏览历史
      await this.historyRepository.save({
        character,
        visitedAt: new Date()
      });
      return characterData;
    } catch (error) {
      console.error('获取字符信息失败:', error);
      throw error;
    } finally {
      // 确保所有资源都被正确处理
    }
  }

  // 获取浏览历史最多的60个汉字
  async getTopViewHistory() {
    await this.ensureConnection();
    try {
      const query = `SELECT character,COUNT(*) AS visit_count FROM view_history GROUP BY character ORDER BY visit_count DESC LIMIT 60`;
      const characterRepository = await this.historyRepository.query(query);
      return characterRepository.map((item:any) => item.character);
    } catch (error) {
      console.error('获取浏览历史失败:', error);
      throw error;
    }
  }
}