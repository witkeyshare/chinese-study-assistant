import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { CharacterService } from '~/services/CharacterService';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const character = url.searchParams.get('character');

  console.log('character', character);
  
  if (!character || character.length !== 1) {
    return json(
      { error: '请提供一个有效的汉字' },
      { status: 400 }
    );
  }

  try {
    const characterService = await CharacterService.initialize();
    const characterInfo = await characterService.getCharacterInfo(character);

    if (!characterInfo) {
      return json(
        { error: '未找到该汉字的信息' },
        { status: 404 }
      );
    }
    
    return json(characterInfo, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('获取汉字信息失败:', error);
    return json(
      { error: '获取汉字信息失败，请稍后重试' },
      { status: 500 }
    );
  }
};